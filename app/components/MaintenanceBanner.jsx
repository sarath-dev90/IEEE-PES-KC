'use client';
import { useState, useEffect } from 'react';

export default function MaintenanceBanner() {
  const [viewState, setViewState] = useState('initial');

  useEffect(() => {
    // Determine if we should show the full banner or the collapsed button
    const hasSeen = sessionStorage.getItem('maintenanceBannerSeen');
    if (!hasSeen) {
      setViewState('open');
      
      // Auto-collapse after 30 seconds
      const timer = setTimeout(() => {
        setViewState((prev) => {
          if (prev === 'open') {
            sessionStorage.setItem('maintenanceBannerSeen', 'true');
            return 'collapsed';
          }
          return prev;
        });
      }, 30000);
      
      return () => clearTimeout(timer);
    } else {
      setViewState('collapsed');
    }
  }, []);

  const closeBanner = () => {
    setViewState('collapsed');
    sessionStorage.setItem('maintenanceBannerSeen', 'true');
  };

  const openBanner = () => {
    setViewState('open');
  };

  if (viewState === 'initial') return null;

  return (
    <>
      {/* CSS for blinking animation */}
      <style>{`
        @keyframes blink-caution {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .blinking-caution-btn {
          animation: blink-caution 1.5s infinite ease-in-out;
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.6);
        }
      `}</style>

      {/* Floating collapsed caution button */}
      {viewState === 'collapsed' && (
        <button 
          onClick={openBanner}
          className="btn btn-warning rounded-circle position-fixed blinking-caution-btn"
          style={{
            zIndex: 9999,
            left: '20px',
            bottom: '20px',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff'
          }}
          title="Important Notice"
          aria-label="Important Notice"
        >
          <i className="bi bi-exclamation-triangle-fill fs-3 text-dark"></i>
        </button>
      )}

      {/* Main Banner Modal */}
      {viewState === 'open' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-warning text-dark border-bottom-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Official Website Under Maintenance
                </h5>
                <button type="button" className="btn-close" onClick={closeBanner} aria-label="Close"></button>
              </div>
              <div className="modal-body text-dark px-4 py-4">
                <p className="fs-6"><strong>Dear IEEE PES Member,</strong></p>
                <p>
                  Sorry for the inconvenience in accessing the data. This site is under migration of framework due to security breach and data loss from Feb 04th 2026.
                </p>
                <p className="mb-0 text-muted">
                  <em>The revamped website is still being updated.</em>
                </p>
              </div>
              <div className="modal-footer bg-light border-top-0 border-bottom rounded-bottom">
                <button type="button" className="btn btn-primary px-4" onClick={closeBanner}>Acknowledge</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
