import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData = {
      events: [],
      announcements: [],
      gallery: [],
      execom: [],
      chapters: [],
      awards: [],
      recognitions: [],
      newsletters: [],
      magazines: []
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('Created data file');
  }
}

// GET: Fetch all content
export async function GET() {
  try {
    console.log('API GET called');
    await ensureDataFile();
    
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(data);
    
    return NextResponse.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

// POST: Create new item and upload image via Cloudflare Worker
export async function POST(req) {
  try {
    console.log('API POST called');
    await ensureDataFile();
    
    const formData = await req.formData();
    const type = formData.get('type'); // e.g., 'execom', 'events'
    
    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }
    
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(data);
    
    // Create new item
    const newItem = {
      id: Date.now().toString(),
    };
    
    // 1. Add all standard text fields from the form
    for (const [key, value] of formData.entries()) {
      if (key !== 'type' && key !== 'editId' && key !== 'image') {
        newItem[key] = value;
      }
    }
    
    // 2. Handle Image Upload via Cloudflare Worker
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      
      // Package the data exactly how the Worker expects it
      const workerFormData = new FormData();
      workerFormData.append('file', imageFile);
      workerFormData.append('folder', type); 
      workerFormData.append('fileName', imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-'));

      // Send the package to the Cloudflare Worker
      const workerResponse = await fetch('https://ieee-pes-upload-worker.ieeepeskc.workers.dev', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token-123'
        },
        body: workerFormData
      });

      const workerResult = await workerResponse.json();

      if (!workerResult.success) {
        throw new Error(`Worker failed to upload: ${workerResult.error || 'Unknown error'}`);
      }

      // Save the returned public URL to the local database
      newItem.imageUrl = workerResult.url;
      console.log('Successfully routed through Worker to:', workerResult.path);
    }
    
    // 3. Save everything to the local JSON database
    if (!db[type]) db[type] = [];
    db[type].unshift(newItem);
    
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('Item added to', type);
    
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove item
// DELETE: Remove item from database AND delete its image from Cloudflare R2
export async function DELETE(req) {
  try {
    console.log('API DELETE called');
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // e.g., 'execom'
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID required' }, { status: 400 });
    }
    
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(data);
    
    if (!db[type]) {
      return NextResponse.json({ error: `Type ${type} not found` }, { status: 404 });
    }

    // Find the item to get its image URL before we wipe it out
    const itemToDelete = db[type].find(item => item.id === id);
    
    // 1. If the item has a Cloudflare image URL, tell the Worker to delete it
    if (itemToDelete && itemToDelete.imageUrl && itemToDelete.imageUrl.includes('.r2.dev')) {
      try {
        // Extract the filename path (e.g., 'execom/12345-image.png') from the full URL
        const urlParts = itemToDelete.imageUrl.split('.r2.dev/');
        const filePath = urlParts[1];

        if (filePath) {
          console.log('Requesting cloud deletion for:', filePath);
          
          // Call the Worker using the DELETE method
          await fetch(`https://ieee-pes-upload-worker.ieeepeskc.workers.dev?file=${filePath}`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer test-token-123'
            }
          });
        }
      } catch (cloudError) {
        // We log the cloud error but don't stop the database deletion if it fails
        console.error('Failed to delete image from Cloudflare:', cloudError);
      }
    }
    
    // 2. Filter the item out of the local JSON database
    db[type] = db[type].filter(item => item.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('Item deleted from local database:', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Edit existing item
export async function PUT(req) {
  try {
    console.log('API PUT called');
    await ensureDataFile();
    
    const formData = await req.formData();
    const type = formData.get('type');
    const editId = formData.get('editId');
    
    if (!type || !editId) {
      return NextResponse.json({ error: 'Type and editId are required for updates' }, { status: 400 });
    }
    
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(data);
    
    if (!db[type]) {
      return NextResponse.json({ error: `Type ${type} not found` }, { status: 404 });
    }
    
    // Find the exact item we want to edit
    const itemIndex = db[type].findIndex(item => item.id === editId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    // Grab the old data so we don't accidentally delete anything we aren't changing
    const updatedItem = { ...db[type][itemIndex] };
    
    // 1. Update standard text fields from the form
    for (const [key, value] of formData.entries()) {
      if (key !== 'type' && key !== 'editId' && key !== 'image') {
        updatedItem[key] = value;
      }
    }
    
    // 2. Handle Image Upload (ONLY if they actually uploaded a new image)
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0 && typeof imageFile !== 'string') {
      
      const workerFormData = new FormData();
      workerFormData.append('file', imageFile);
      workerFormData.append('folder', type); 
      workerFormData.append('fileName', imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-'));

      const workerResponse = await fetch('https://ieee-pes-upload-worker.ieeepeskc.workers.dev', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token-123'
        },
        body: workerFormData
      });

      const workerResult = await workerResponse.json();

      if (!workerResult.success) {
        throw new Error(`Worker failed to upload: ${workerResult.error || 'Unknown error'}`);
      }

      // Overwrite the old image URL with the newly generated Cloudflare URL
      updatedItem.imageUrl = workerResult.url;
      console.log('Successfully updated image via Worker to:', workerResult.path);
    }
    
    // 3. Save everything back to the local JSON database
    db[type][itemIndex] = updatedItem;
    
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('Item updated in', type);
    
    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}