'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data from API
    useEffect(() => {
        fetch('/api/admin')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    setEvents(data.data.events || []);
                    setAnnouncements(data.data.announcements || []);
                    setGallery(data.data.gallery || []);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching home data:", err);
                setEvents([]);
                setAnnouncements([]);
                setGallery([]);
                setIsLoading(false);
            });
    }, []);

    // Initialize scripts after data loads
    useEffect(() => {
        if (isLoading) return;

        const initScripts = () => {
            // Initialize AOS
            AOS.init({
                duration: 600,
                easing: 'ease-out',
                once: true,
                offset: 50
            });

            // Upcoming Events Swiper
            const upcomingSlides = document.querySelectorAll('.upcoming-events-swiper .swiper-slide');
            if (upcomingSlides.length > 0) {
                new Swiper('.upcoming-events-swiper', {
                    modules: [Pagination, Autoplay, EffectFade],
                    slidesPerView: 1,
                    autoplay: { delay: 3500, disableOnInteraction: false },
                    pagination: { el: '.upcoming-swiper-pagination', clickable: true },
                    loop: upcomingSlides.length > 1,
                    effect: 'fade',
                    fadeEffect: { crossFade: true }
                });
            }

            // Recent Events Swiper
            const recentSlides = document.querySelectorAll('.recent-events-swiper .swiper-slide');
            if (recentSlides.length > 0) {
                new Swiper('.recent-events-swiper', {
                    modules: [Pagination, Autoplay],
                    slidesPerView: 1,
                    spaceBetween: 20,
                    breakpoints: {
                        768: { slidesPerView: 2, spaceBetween: 24 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                        1200: { slidesPerView: 4, spaceBetween: 24 }
                    },
                    autoplay: { delay: 4000, disableOnInteraction: false },
                    pagination: { el: '.recent-events-pagination', clickable: true },
                    loop: recentSlides.length > 3,
                });
            }

            // Gallery Marquee Scroll Effect
            const handleMarqueeScroll = () => {
                const marquee = document.querySelector('.marquee-wrapper');
                if (marquee) {
                    const scrollPos = window.scrollY;
                    marquee.style.transform = `translateX(${-scrollPos * 0.5}px)`;
                }
            };
            window.addEventListener('scroll', handleMarqueeScroll, { passive: true });

            // Gallery Preview Logic
            let galleryTimer;
            const modal = document.getElementById('galleryPreview');
            const img = document.getElementById('previewImg');
            const timerBar = document.getElementById('previewTimer');

            const openGalleryPreview = (imgSrc) => {
                if (!img || !modal || !timerBar) return;
                img.src = imgSrc;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';

                timerBar.style.transition = 'none';
                timerBar.style.width = '100%';

                setTimeout(() => {
                    timerBar.style.transition = 'width 10s linear';
                    timerBar.style.width = '0%';
                }, 50);

                clearTimeout(galleryTimer);
                galleryTimer = setTimeout(closeGalleryPreview, 10000);
            };

            const closeGalleryPreview = () => {
                if (!modal) return;
                modal.classList.remove('active');
                document.body.style.overflow = '';
                clearTimeout(galleryTimer);
            };

            if (modal) modal.onclick = closeGalleryPreview;

            document.querySelectorAll('.gallery-card').forEach(card => {
                card.addEventListener('click', () => {
                    const imgElement = card.querySelector('img');
                    if (imgElement) openGalleryPreview(imgElement.src);
                });
            });

            const closeBtn = document.querySelector('.gallery-preview-close');
            if (closeBtn) closeBtn.addEventListener('click', closeGalleryPreview);

            return () => {
                window.removeEventListener('scroll', handleMarqueeScroll);
            };
        };

        const timer = setTimeout(initScripts, 300);
        return () => clearTimeout(timer);
    }, [isLoading, events, gallery, announcements]);

    // Helper function to categorize events
    const getCategorizedEvents = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = [];
        const recent = [];

        events.forEach(event => {
            const evDate = new Date(event.date);
            evDate.setHours(0, 0, 0, 0);

            if (evDate > today) {
                upcoming.push(event);
            } else {
                recent.push(event);
            }
        });

        return { upcoming, recent };
    };

    const { upcoming, recent } = getCategorizedEvents();

    // Fallback Data
    const fallbackAnnouncements = [
        { date: "March 15, 2026", title: "Call for Papers: Power Systems Conference 2026", description: "Submit your research papers for the upcoming international conference on power systems." },
        { date: "March 10, 2026", title: "New Student Chapter Launched at CET", description: "Welcoming the newest addition to our growing student chapter network." },
        { date: "March 1, 2026", title: "Membership Drive 2026 Begins", description: "Join IEEE PES Kerala Chapter and get exclusive benefits." }
    ];

    const displayAnnouncements = announcements.length > 0 ? announcements : fallbackAnnouncements;

    const galleryImages = [
        { img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "IEEE PES Conference 2025" },
        { img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Workshop on Smart Grids" },
        { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Technical Seminar Series" },
        { img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Student Chapter Meeting" },
        { img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Industry Expert Talk" },
        { img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Networking Event" },
    ];

    const displayGallery = gallery.length > 0 ? gallery.map(g => ({ img: g.imageUrl || g.url, title: g.title || g.name })) : galleryImages;

    return (
        <>
            <style jsx global>{`
                :root {
                    --pes-green: #00ab84;
                    --pes-dark: #1a1a1a;
                    --pes-light: #f8f9fa;
                }

                /* Peak Professional Light Hero */
                .hero-section {
                    position: relative;
                    overflow: hidden; 
                    width: 100%;
                    background-color: #ffffff;
                    background-image: radial-gradient(circle at 10% 20%, rgba(0, 171, 132, 0.04), transparent 40%),
                                      radial-gradient(circle at 90% 80%, rgba(0, 98, 155, 0.03), transparent 40%);
                }
                
                /* Subtle engineering grid background */
                .hero-grid {
                    position: absolute;
                    inset: 0;
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
                    z-index: 0;
                }

                .hero-image-container {
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
                }

                @media (max-width: 768px) {
                    .hero-section {
                        min-height: auto !important;
                        padding-top: 5rem !important; 
                        padding-bottom: 5rem !important;
                    }
                    
                    .hero-section h1 { font-size: 2.5rem !important; }
                    .hero-section .lead { font-size: 1.05rem !important; }
                    .hero-section .btn { width: 100%; display: block; text-align: center; }
                    
                    .stats-container {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 1.5rem !important;
                    }
                    .stats-divider { display: none; }
                }

                .hero-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 171, 132, 0.3) !important;
                }
                
                .hero-btn-outline {
                    border: 2px solid rgba(0, 0, 0, 0.1) !important;
                    color: #1a202c !important;
                    background: rgba(255, 255, 255, 0.8) !important;
                    backdrop-filter: blur(10px);
                }

                .hero-btn-outline:hover {
                    transform: translateY(-2px);
                    border-color: rgba(0, 0, 0, 0.2) !important;
                    background: #f8fafc !important;
                }

                /* Marquee & Gallery */
                .marquee-container {
                    animation: scroll-left 50s linear infinite;
                    display: flex;
                    width: max-content;
                }
                .marquee-container:hover { animation-play-state: paused; }
                
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .gallery-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
                .gallery-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
                }
                .gallery-img { transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
                .gallery-card:hover .gallery-img { transform: scale(1.1); }

                /* Event Cards */
                .event-card-hover {
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    border: 1px solid rgba(0,0,0,0.05) !important;
                }
                .event-card-hover:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
                }
                .event-card-img { transition: transform 0.5s ease; }
                .event-card-hover:hover .event-card-img { transform: scale(1.05); }

                /* Preview Modal */
                .gallery-preview-modal {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.95); display: none; align-items: center;
                    justify-content: center; z-index: 9999; backdrop-filter: blur(10px);
                }
                .gallery-preview-modal.active { display: flex; }
                .gallery-preview-content { position: relative; max-width: 90%; max-height: 90%; }
                .gallery-preview-content img { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 8px; }
                .gallery-preview-close {
                    position: absolute; top: -40px; right: 0; color: white;
                    font-size: 2rem; cursor: pointer; transition: transform 0.3s ease;
                }
                .gallery-preview-close:hover { transform: scale(1.2); }
                .preview-timer-container {
                    position: absolute; bottom: -30px; left: 0; width: 100%;
                    height: 4px; background: rgba(255, 255, 255, 0.2); border-radius: 2px; overflow: hidden;
                }
                .preview-timer-bar { height: 100%; background: var(--pes-green); width: 100%; }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .floating-badge { animation: float 4s ease-in-out infinite; }
            `}</style>

            <div className="box-layout">
                <Navbar />

                {/* Peak Professional Light Hero Section */}
                <div id="hero" className="hero-section d-flex align-items-center" style={{ minHeight: '85vh' }}>
                    <div className="hero-grid"></div>

                    <div className="container position-relative py-5" style={{ zIndex: 2 }}>
                        <div className="row align-items-center g-5 pt-lg-5">
                            <div className="col-lg-7" data-aos="fade-right" data-aos-duration="1000">
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.08)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                    <span className="badge rounded-pill px-3 py-2 text-uppercase fw-bold text-white" style={{ backgroundColor: 'var(--pes-green) !important', letterSpacing: '0.5px', fontSize: '0.7rem' }}>Award Winning Chapter</span>
                                    <span className="text-secondary fw-semibold d-none d-sm-inline" style={{ fontSize: '0.9rem' }}>Founded 1999</span>
                                </div>

                                <h1 className="fw-bolder display-3 mb-4" style={{ letterSpacing: '-1px', lineHeight: '1.2', color: '#0f172a' }}>
                                    Powering Kerala's <br className="d-none d-md-block" />
                                    <span className="pb-1 d-inline-block position-relative" style={{ background: 'linear-gradient(90deg, #00ab84, #0077b5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Energy Future
                                    </span>
                                </h1>

                                <p className="lead mb-4 text-secondary" style={{ fontSize: '1.15rem', lineHeight: '1.6', maxWidth: '580px' }}>
                                    Join India's premier IEEE PES chapter with <strong style={{ color: '#0f172a' }}>1,200+ members</strong>, <strong style={{ color: '#0f172a' }}>50+ student branches</strong>, and a legacy of excellence in electric power and energy innovation.
                                </p>

                                <div className="d-flex flex-wrap gap-3 mb-5">
                                    <Link href="/membership" className="btn btn-lg rounded-pill text-white px-5 py-3 fw-bold hero-btn shadow" style={{ backgroundColor: 'var(--pes-green)' }}>
                                        Become a Member
                                        <i className="ri-arrow-right-line ms-2"></i>
                                    </Link>
                                    <Link href="/events" className="btn btn-lg rounded-pill px-5 py-3 fw-bold hero-btn-outline">
                                        Explore Events
                                    </Link>
                                </div>

                                <div className="d-flex flex-wrap gap-4 align-items-center border-top pt-4 stats-container" style={{ borderColor: 'rgba(0,0,0,0.08) !important' }}>
                                    <div>
                                        <h3 className="fw-bold fs-2 mb-0" style={{ color: '#0f172a' }}>1,200+</h3>
                                        <p className="small mb-0 text-uppercase fw-semibold text-muted" style={{ letterSpacing: '0.5px' }}>Members</p>
                                    </div>
                                    <div className="stats-divider" style={{ width: '1px', height: '40px', backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
                                    <div>
                                        <h3 className="fw-bold fs-2 mb-0" style={{ color: '#0f172a' }}>50+</h3>
                                        <p className="small mb-0 text-uppercase fw-semibold text-muted" style={{ letterSpacing: '0.5px' }}>Student Branches</p>
                                    </div>
                                    <div className="stats-divider" style={{ width: '1px', height: '40px', backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
                                    <div>
                                        <h3 className="fw-bold fs-2 mb-0" style={{ color: '#0f172a' }}>#1</h3>
                                        <p className="small mb-0 text-uppercase fw-semibold text-muted" style={{ letterSpacing: '0.5px' }}>Global Ranking</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-5 d-none d-lg-block" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="200">
                                <div className="position-relative mt-4">
                                    {/* Offset Decorative Border */}
                                    <div className="position-absolute rounded-4" style={{ top: '25px', left: '-25px', right: '25px', bottom: '-25px', border: '1px solid rgba(0,171,132,0.3)', zIndex: 0 }}></div>

                                    <div className="rounded-4 overflow-hidden position-relative hero-image-container bg-white" style={{ zIndex: 1 }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                            alt="IEEE PES Kerala Chapter Engineering"
                                            className="w-100 object-fit-cover"
                                            style={{ height: '520px' }}
                                        />
                                        
                                        {/* Image Gradient Light Overlay for depth */}
                                        <div className="position-absolute inset-0 w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)', top: 0, left: 0 }}></div>

                                        <div className="position-absolute bottom-0 start-0 m-4 p-3 rounded-3 shadow-lg floating-badge d-flex align-items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.05)', maxWidth: '280px' }}>
                                            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '55px', height: '55px' }}>
                                                <i className="ri-trophy-line fs-2" style={{ color: 'var(--pes-green)' }}></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-bold fs-6" style={{ letterSpacing: '0.3px', color: '#0f172a' }}>Outstanding Chapter</h6>
                                                <p className="mb-0 small text-muted">IEEE PES Award</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Message Section */}
                <div className="container py-5 mt-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="py-2" data-aos="fade-up">
                                <p style={{ textAlign: "justify", fontSize: "1.1rem", lineHeight: "1.8", color: '#444' }}>
                                    The <strong>IEEE PES Kerala Chapter</strong> was founded in 1999 with just 12 members and has since grown into one of the most recognized chapters in the world. It won the Outstanding Chapter Award in 2012 and the PES Membership Growth Award in 2013, and claimed first place in the IEEE PES Chapters Website Contest the same year. Membership surpassed 1,200 by 2017, elevating it to large chapter status. Its mission is to be the leading provider of scientific and engineering knowledge on electric power and energy for the betterment of society. With 50+ Student Branch Chapters and numerous technical events, it remains a highly active and award-winning chapter under the IEEE Kerala Section.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission Section */}
                <div className="container pb-5">
                    <div className="row g-4 pt-3">
                        <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
                            <div className="p-4 p-md-5 rounded-4 border bg-white shadow-sm h-100 position-relative mt-4" style={{ transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="position-absolute top-0 start-0 translate-middle ms-5 bg-white p-2 rounded-circle shadow-sm" style={{ marginTop: '-4px' }}>
                                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="ri-eye-line fs-3" style={{ color: 'var(--pes-green)' }}></i>
                                    </div>
                                </div>
                                <h3 className="fw-bold mt-3 mb-3" style={{ color: '#0f172a' }}>Our Vision</h3>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.7' }}>
                                    To be the leading provider of scientific and engineering information on electric power and energy for the betterment of society, and the preferred professional development source for our members.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
                            <div className="p-4 p-md-5 rounded-4 border bg-white shadow-sm h-100 position-relative mt-4" style={{ transition: 'transform 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="position-absolute top-0 start-0 translate-middle ms-5 bg-white p-2 rounded-circle shadow-sm" style={{ marginTop: '-4px' }}>
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="ri-rocket-2-line fs-3 text-primary"></i>
                                    </div>
                                </div>
                                <h3 className="fw-bold mt-3 mb-3" style={{ color: '#0f172a' }}>Our Mission</h3>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.7' }}>
                                    To foster technological innovation and excellence for the benefit of humanity by providing high-quality publications, engaging conferences, and valuable educational programs in power and energy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Announcements & Upcoming Events Section */}
                <div className="container my-5">
                    <div className="row align-items-stretch g-4">
                        {/* Announcements */}
                        <div className="col-lg-6" data-aos="fade-up">
                            <div className="p-4 p-md-5 rounded border bg-white shadow-sm h-100" style={{ borderTop: "4px solid var(--pes-green)" }}>
                                <h4 className="mb-4 fw-bold d-flex align-items-center gap-2">
                                    <i className="ri-megaphone-line text-success"></i>
                                    Announcements
                                </h4>
                                <ul className="list-unstyled">
                                    {displayAnnouncements.slice(0, 3).map((ann, idx) => (
                                        <li className={`mb-4 pb-3 ${idx < 2 ? 'border-bottom' : ''}`} key={idx}>
                                            <small className="text-secondary fw-bold text-uppercase d-block mb-2">
                                                {isNaN(Date.parse(ann.date)) ? ann.date : new Date(ann.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </small>
                                            <h5 className="fw-bold mt-1 mb-2">
                                                <Link href={ann.link || "#"} className="text-dark text-decoration-none hover-green">
                                                    {ann.title}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small mb-2">{ann.description || ann.details}</p>
                                            <Link href={ann.link || "#"} className="text-success small fw-bold text-decoration-none">
                                                Read More →
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Upcoming Events Carousel */}
                        <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                            <div className="rounded overflow-hidden shadow-lg position-relative h-100" style={{ backgroundColor: 'var(--pes-green)', minHeight: '450px' }}>
                                <div className="position-absolute top-0 end-0 bg-dark text-white px-3 py-2 m-3 rounded shadow" style={{ fontSize: '0.85rem', zIndex: 10 }}>
                                    <i className="ri-calendar-event-line me-2"></i>Upcoming Events
                                </div>

                                <div className="swiper upcoming-events-swiper h-100 w-100">
                                    <div className="swiper-wrapper h-100">
                                        {upcoming.length > 0 ? (
                                            upcoming.map((evt, idx) => (
                                                <div className="swiper-slide h-100" key={idx}>
                                                    <div className="h-100 d-flex flex-column bg-white">
                                                        <div style={{ height: '260px', overflow: 'hidden' }}>
                                                            <img
                                                                src={evt.imageUrl || "/images/ieee-images/Events/pesgre_event.png"}
                                                                alt={evt.title}
                                                                className="w-100 h-100 object-fit-cover"
                                                            />
                                                        </div>
                                                        <div className="p-4 d-flex flex-column justify-content-center flex-grow-1">
                                                            <div className="mb-2">
                                                                <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--pes-green)', fontSize: '0.75rem' }}>
                                                                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <h3 className="h5 fw-bold mb-2 text-dark">{evt.title}</h3>
                                                            <p className="text-muted mb-3" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {evt.description || evt.details || "Join us for this exciting event."}
                                                            </p>
                                                            <Link
                                                                href={evt.link || evt.url || "#"}
                                                                className="fw-bold text-decoration-none mt-auto d-inline-block"
                                                                style={{ color: 'var(--pes-green)' }}
                                                            >
                                                                Learn More →
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="swiper-slide h-100">
                                                <div className="h-100 d-flex flex-column bg-white">
                                                    <div style={{ height: '260px', overflow: 'hidden' }}>
                                                        <img
                                                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                                            alt="Upcoming Event"
                                                            className="w-100 h-100 object-fit-cover"
                                                        />
                                                    </div>
                                                    <div className="p-4 d-flex flex-column justify-content-center flex-grow-1">
                                                        <div className="mb-2">
                                                            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'var(--pes-green)', fontSize: '0.75rem' }}>Coming Soon</span>
                                                        </div>
                                                        <h3 className="h5 fw-bold mb-2 text-dark">Smart Grid Symposium 2026</h3>
                                                        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                                            Join industry experts for an in-depth exploration of cutting-edge smart grid technologies.
                                                        </p>
                                                        <Link href="/events" className="fw-bold text-decoration-none mt-auto d-inline-block" style={{ color: 'var(--pes-green)' }}>
                                                            Learn More →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="upcoming-swiper-pagination swiper-pagination position-absolute w-100" style={{ bottom: '15px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Events Section */}
                <div className="container my-5 py-5 bg-light rounded-4">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h2 className="fw-bold fs-1 text-dark mb-3">
                            Recent <span style={{ color: 'var(--pes-green)' }}>Events</span>
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                            Explore our latest workshops, seminars, and networking events
                        </p>
                    </div>

                    <div className="swiper recent-events-swiper pb-5 position-relative px-2">
                        <div className="swiper-wrapper">
                            {(recent.length > 0 ? recent : [
                                { title: "Workshop on Renewable Energy Systems", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", date: "2026-03-18", desc: "Comprehensive training on solar and wind energy integration." },
                                { title: "Power Electronics Seminar", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", date: "2026-03-15", desc: "Advanced topics in power conversion and control systems." },
                                { title: "Student Chapter Technical Meet", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", date: "2026-03-12", desc: "Networking event for student members across Kerala." },
                                { title: "Industry Expert Talk Series", img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", date: "2026-03-08", desc: "Insights from leading professionals in the power sector." }
                            ]).map((event, idx) => (
                                <div className="swiper-slide h-auto" key={idx}>
                                    <Link href={event.link || event.url || "#"} className="card h-100 border-0 text-decoration-none event-card-hover" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        <div style={{ height: '200px', overflow: 'hidden' }}>
                                            <img src={event.img || event.imageUrl || "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={event.title} className="w-100 h-100 object-fit-cover event-card-img" />
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column bg-white">
                                            <div className="mb-3">
                                                <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h4 className="card-title fw-bold fs-6 text-dark mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3rem' }}>
                                                {event.title}
                                            </h4>
                                            <p className="card-text text-muted mb-4 flex-grow-1" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {event.desc || event.description || "Highlights from this impactful IEEE PES event."}
                                            </p>
                                            <span className="fw-bold mt-auto d-inline-block small" style={{ color: 'var(--pes-green)' }}>
                                                View Details →
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className="recent-events-pagination swiper-pagination position-absolute w-100" style={{ bottom: '0px' }}></div>
                    </div>
                </div>

                {/* Gallery Section */}
                <section className="gallery-section position-relative py-5 mt-4" style={{ background: 'linear-gradient(to bottom, #f8fafb, #ffffff)' }}>
                    <div className="container mb-5">
                        <div className="text-center" data-aos="fade-up">
                            <h2 className="fw-bold fs-1 text-dark mb-3">
                                Event <span style={{ color: 'var(--pes-green)' }}>Gallery</span>
                            </h2>
                            <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                                Glimpses from our conferences, workshops, and community gatherings
                            </p>
                        </div>
                    </div>

                    <div className="position-relative">
                        <div className="position-absolute top-0 start-0" style={{ width: '80px', height: '100%', background: 'linear-gradient(to right, #f8fafb, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>
                        <div className="position-absolute top-0 end-0" style={{ width: '80px', height: '100%', background: 'linear-gradient(to left, #ffffff, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>

                        <div className="overflow-hidden py-3">
                            <div className="marquee-container" style={{ gap: '24px', paddingRight: '24px' }}>
                                {[...displayGallery, ...displayGallery].map((item, idx) => (
                                    <div key={idx} className="gallery-card flex-shrink-0 rounded-4 overflow-hidden shadow-sm border" style={{ width: '320px', backgroundColor: 'white' }}>
                                        <div style={{ height: '220px', overflow: 'hidden' }}>
                                            <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover gallery-img" />
                                        </div>
                                        <div className="p-3 bg-white">
                                            <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>{item.title}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '14px', opacity: 0.6 }}>
                            Click on any image to preview • Auto-scrolling
                        </p>
                    </div>
                </section>

                {/* Office Bearers Section */}
                <div className="container my-5 py-5">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h3 className="fw-bold d-inline-block px-4 py-3 rounded bg-light" style={{ border: '3px solid var(--pes-green)', color: 'var(--pes-green)', fontSize: '1.2rem', textTransform: 'uppercase' }}>
                            IEEE PES Kerala Chapter Office Bearers
                        </h3>
                    </div>

                    <div className="row mt-5 justify-content-center">
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="0">
                            <div className="card h-100 border-0 shadow-sm" style={{ borderTop: "6px solid var(--pes-green)" }}>
                                <div className="card-body p-4 pt-5 text-center">
                                    <div className="mb-4">
                                        <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                            <i className="ri-user-star-line fs-1" style={{ color: 'var(--pes-green)' }}></i>
                                        </div>
                                    </div>
                                    <h4 className="fw-bold mb-1">Dr. Rajesh Kumar</h4>
                                    <p className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--pes-green)', letterSpacing: '1px' }}>Chair</p>
                                    <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                        Professor, Dept. of Electrical Engineering<br />
                                        NIT Calicut<br />
                                        Senior Member IEEE, PES
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="100">
                            <div className="card h-100 border-0 shadow-sm" style={{ borderTop: "6px solid var(--pes-green)" }}>
                                <div className="card-body p-4 pt-5 text-center">
                                    <div className="mb-4">
                                        <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                            <i className="ri-user-settings-line fs-1" style={{ color: 'var(--pes-green)' }}></i>
                                        </div>
                                    </div>
                                    <h4 className="fw-bold mb-1">Dr. Priya Menon</h4>
                                    <p className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--pes-green)', letterSpacing: '1px' }}>Vice-Chair</p>
                                    <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                        Associate Professor<br />
                                        College of Engineering Trivandrum<br />
                                        Member IEEE, PES
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                            <div className="card h-100 border-0 shadow-sm" style={{ borderTop: "6px solid var(--pes-green)" }}>
                                <div className="card-body p-4 pt-5 text-center">
                                    <div className="mb-4">
                                        <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                            <i className="ri-shield-star-line fs-1" style={{ color: 'var(--pes-green)' }}></i>
                                        </div>
                                    </div>
                                    <h4 className="fw-bold mb-1">Dr. Anil Nair</h4>
                                    <p className="fw-bold mb-3 small text-uppercase" style={{ color: 'var(--pes-green)', letterSpacing: '1px' }}>Secretary</p>
                                    <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                        Assistant Professor<br />
                                        TKM College of Engineering<br />
                                        Member IEEE, PES
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Join IEEE PES CTA Section */}
                <div className="container py-4 my-3 position-relative" data-aos="fade-up">
                    <div className="rounded-4 overflow-hidden shadow-lg position-relative p-5 text-center" style={{ background: 'linear-gradient(135deg, #020b14 0%, #001f3f 100%)' }}>
                        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 171, 132, 0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 98, 155, 0.15), transparent 50%)',
                            zIndex: 0
                        }}></div>
                        
                        <div className="position-relative" style={{ zIndex: 1 }}>
                            <h2 className="display-5 fw-bold text-white mb-3">Elevate Your Engineering Career</h2>
                            <p className="lead text-white-50 mx-auto mb-4" style={{ maxWidth: '700px' }}>
                                Join the IEEE Power & Energy Society today to unlock exclusive resources, networking opportunities, and professional development in the energy sector.
                            </p>
                            <div className="d-flex flex-wrap gap-3 justify-content-center">
                                <a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noreferrer" className="btn btn-lg rounded-pill fw-bold text-white px-5 py-3 shadow hero-btn" style={{ backgroundColor: 'var(--pes-green)' }}>
                                    Join IEEE PES Now
                                </a>
                                <Link href="/pages/membership-benefits" className="btn btn-lg rounded-pill fw-bold px-4 py-3 text-white hero-btn-outline border-white border-opacity-25" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white !important' }}>
                                    Discover Benefits
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About IEEE and PES Section (Exact Requested Markup) */}
                <div className="vc_row wpb_row vc_row-fluid mt-4 mb-5 pb-5">
                    <div className="wpb_column vc_column_container vc_col-sm-12">
                        <div className="vc_column-inner text-center">
                            <div className="wpb_wrapper container">
                                <h3 className="fw-bold" style={{ marginBottom: "20px", display: "inline-block", padding: "12px 35px", border: "3px solid var(--pes-green)", color: "var(--pes-green)", fontSize: "1.4rem", textTransform: "uppercase" }}>
                                    About IEEE and PES
                                </h3>
                                <div className="row text-start mt-5">
                                    <div className="col-md-6 mb-4">
                                        <div className="p-4 p-md-5 bg-white shadow-sm border rounded h-100 border-start border-4 border-success">
                                            <h4 className="mb-4 text-dark fw-bold">What is IEEE?</h4>
                                            <p className="mb-5 text-muted lh-lg">
                                                IEEE is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity.
                                            </p>
                                            <a className="btn btn-outline-success fw-bold px-4 py-2" href="https://www.ieee.org/membership/join/index.html?WT.mc_id=hc_join" title="Join IEEE" target="_blank" rel="noreferrer" style={{ borderRadius: "0px", borderWidth: "2px" }}>
                                                Join IEEE
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="p-4 p-md-5 bg-white shadow-sm border rounded h-100 border-start border-4 border-success">
                                            <h4 className="mb-4 text-dark fw-bold">What is the IEEE Power &amp; Energy Society?</h4>
                                            <p className="mb-5 text-muted lh-lg">
                                                The mission of IEEE Power &amp; Energy Society is to be the leading provider of scientific and engineering information on electric power and energy for the betterment of society, and preferred professional development source of its members.
                                            </p>
                                            <a className="btn btn-outline-success fw-bold px-4 py-2" href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMPE031&amp;refProd=MEMPE031" title="Join IEEE PES" target="_blank" rel="noreferrer" style={{ borderRadius: "0px", borderWidth: "2px" }}>
                                                Join IEEE PES
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

                {/* Gallery Preview Modal */}
                <div className="gallery-preview-modal" id="galleryPreview">
                    <div className="gallery-preview-content">
                        <div className="gallery-preview-close" role="button" aria-label="Close preview">
                            <i className="ri-close-line"></i>
                        </div>
                        <img src="" id="previewImg" alt="Preview" />
                        <div className="preview-timer-container">
                            <div className="preview-timer-bar" id="previewTimer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}