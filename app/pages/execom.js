'use client';
import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import Link from 'next/link';
import Image from 'next/image';

// 1. Updated Category Order with matching labels and descriptions
const CATEGORY_ORDER = [
    { 
        id: 'professionals', 
        label: 'Professional Execom',
        desc: 'Core leadership guiding the strategic vision of the section.'
    },
    { 
        id: 'yp', 
        label: 'Young Professionals',
        desc: 'Empowering the next generation of power and energy leaders.'
    },
    { 
        id: 'gsac', 
        label: 'Graduate Student Activities Committee',
        desc: 'Fostering research and academic excellence among graduate students.'
    },
    { 
        id: 'slt', 
        label: 'Student Leadership Team',
        desc: 'Driving student engagement and campus initiatives.'
    }
];

export default function ExecomPage() {
    const [currentMembers, setCurrentMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin');
                const result = await response.json();
                if (result.success && result.data && result.data.execom) {
                    const filtered = result.data.execom.filter(m => !m.status || m.status === 'current');
                    setCurrentMembers(filtered);
                }
            } catch (error) {
                console.error("Error fetching execom data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const groupedMembers = currentMembers.reduce((acc, member) => {
        const cat = member.category || 'professionals';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(member);
        return acc;
    }, {});

    const otherCategories = Object.keys(groupedMembers).filter(
        c => !CATEGORY_ORDER.find(o => o.id === c)
    );

    const renderMemberCard = (m, i) => (
        <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="execom-card">
                <div className="execom-image-frame">
                    <div className="execom-avatar-border">
                        <div className="execom-avatar">
                            {m.imageUrl ? (
                               <Image 
                                src={m.imageUrl} 
                                alt={m.name} 
                                fill
                                sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, 25vw"
                                style={{ objectFit: 'cover', objectPosition: 'center top' }} 
                                />
                            ) : (
                                <div className="execom-avatar-placeholder">
                                    <i className="ri-user-3-line"></i>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="execom-role">{m.role}</p>
                <h4 className="execom-name">{m.name}</h4>

                <div className="execom-social">
                    {m.email && (
                        <a href={`mailto:${m.email}`} title="Email">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </a>
                    )}
                    {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
    
    return (
        <PageLayout>
            <section className="section-padding bg-diagonal-pattern">
                <div className="container">
                    
                    {/* 2. Left-Aligned Header Section */}
                    <div className="section-header text-start mb-5 pb-4">
                        <span className="text-uppercase" style={{ color: 'var(--pes-green)', fontWeight: 600, letterSpacing: '1.5px', fontSize: '13px' }}>
                            Leadership 2026
                        </span>
                        <h2 className="section-title mt-2 mb-3" style={{ color: 'var(--header-color)', fontWeight: 800, fontSize: '2.5rem' }}>
                            Executive Committee
                        </h2>
                        <p className="section-desc mb-0" style={{ maxWidth: '800px', fontSize: '1.05rem', color: '#555', lineHeight: '1.7', marginLeft: 0 }}>
                            The IEEE PES Kerala Section is led by a dedicated team of professionals and academicians committed to advancing the power and energy industry through technical excellence and community engagement.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : currentMembers.length > 0 ? (
                        <>
                            {/* 3. Category Headers with Green Accent Line */}
                            {CATEGORY_ORDER.map(({ id, label, desc }) => {
                                if (!groupedMembers[id] || groupedMembers[id].length === 0) return null;
                                return (
                                    <div key={id} className="mb-5 pb-3">
                                            <div className="mb-4 text-start"   style={{ paddingLeft: '0' }}>
                                                <h3 style={{ color: 'var(--header-color)', fontWeight: 700, margin: 0, fontSize: '1.8rem' }}>{label}</h3>
                                                {desc && <p style={{ color: '#666', margin: '6px 0 0 0', fontSize: '0.95rem' }}>{desc}</p>}
                                            </div>
                                        <div className="row g-4 justify-content-center">
                                            {groupedMembers[id].map((m, i) => renderMemberCard(m, i))}
                                        </div>
                                    </div>
                                );
                            })}

                            {otherCategories.map(cat => (
                                <div key={cat} className="mb-5 pb-3">
                                    <div className="mb-4 text-start" style={{ paddingLeft: '16px', borderLeft: '4px solid var(--pes-green)' }}>
                                    <h3 style={{ color: 'var(--header-color)', fontWeight: 700, margin: 0, fontSize: '1.8rem', textTransform: 'capitalize' }}>
                                        {cat}
                                    </h3>
                                </div>
                                    <div className="row g-4 justify-content-center">
                                        {groupedMembers[cat].map((m, i) => renderMemberCard(m, i))}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">Executive committee members will be updated soon.</p>
                        </div>
                    )}

                    <div className="text-center mt-5 pt-4 border-top">
                        <Link href="/pages/past-execom" className="btn btn-outline-success px-4 py-2 rounded-pill fw-bold" style={{ fontSize: '0.9rem' }}>
                            View Past Executive Committees <i className="ri-history-line ms-1"></i>
                        </Link>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}