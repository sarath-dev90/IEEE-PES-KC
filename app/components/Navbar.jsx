'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header id="header" className="site-header" role="banner">
            <div id="meta-nav" className="hidden-xs d-none d-sm-block">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-12">
                            <ul id="meta">
                                <li><a href="https://www.ieee.org/" target="_blank" rel="noreferrer">IEEE.org</a></li>
                                <li><a href="http://ieeexplore.ieee.org/" target="_blank" rel="noreferrer">IEEE <em>Xplore</em> Digital Library</a></li>
                                <li><a href="http://standards.ieee.org/" target="_blank" rel="noreferrer">IEEE Standards</a></li>
                                <li><a href="http://spectrum.ieee.org/" target="_blank" rel="noreferrer">IEEE Spectrum</a></li>
                                <li><a href="https://www.ieee.org/sitemap.html" target="_blank" rel="noreferrer">More Sites</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row align-items-center" id="logo-search">
                    <div id="mobile-menu" className={`col-sm-2 col-xs-2 col-2 d-lg-none ${isMenuOpen ? 'active' : ''}`}>
                        <button onClick={() => setIsMenuOpen(true)}>
                            <i className="fa fa-bars" aria-hidden="true"></i> <span>MENU</span>
                        </button>
                    </div>
                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 col-8" id="logo" role="logo">
                        <Link href="/" title="IEEE PES Kerala Chapter" className="d-flex align-items-center">
                            <Image src="/images/ieee-images/IEEE_logo.png" alt="IEEE PES Kerala" priority width={320} height={100} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 col-12 text-end text-right d-none d-lg-flex align-items-center justify-content-end" id="search">
                        <div className="row search-block justify-content-end w-100 mt-3 mt-md-0">
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 col-12 logo-ieee-block">
                                <a href="https://www.ieee.org/" target="_blank" id="logo-ieee" rel="noreferrer"><img src="/pes-theme/images/logo-ieee.png" alt="IEEE" className="lazyload img-fluid" /></a>
                            </div>
                        </div>
                    </div>
                    <div id="mobile-search" className="col-sm-2 col-xs-2 col-2 d-lg-none text-end text-right">
                        <button className="toggle-search"><span>SEARCH</span> <i className="fa fa-search" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>

            <div id="main-nav" className={isMenuOpen ? 'd-block' : 'd-none d-lg-block'} style={isMenuOpen ? { display: 'block !important' } : {}}>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-12" role="navigation">
                            {isMenuOpen && (
                                <button className="close-menu d-block d-lg-none" onClick={() => setIsMenuOpen(false)}>
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </button>
                            )}
                            <ul id="nav" className={`list-unstyled mb-0 ${isMenuOpen ? '' : 'd-flex justify-content-center align-items-center'}`} style={{ flexWrap: 'wrap', gap: isMenuOpen ? '10px' : '5px' }}>
                                <li className="menu-item py-2 px-2"><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/execom" onClick={() => setIsMenuOpen(false)}>Execom</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/initiatives" onClick={() => setIsMenuOpen(false)}>Activities</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/upcoming-events" onClick={() => setIsMenuOpen(false)}>Events</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/membership-benefits" onClick={() => setIsMenuOpen(false)}>Membership</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/resources" onClick={() => setIsMenuOpen(false)}>Resources</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/newsletters" onClick={() => setIsMenuOpen(false)}>Newsletters</Link></li>
                                <li className="menu-item py-2 px-2"><Link href="/pages/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                                <li className="menu-item py-2 px-2"><a href="https://www.ieee.org/membership/join/index.html" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Join IEEE</a></li>
                            </ul>
                            
                            {isMenuOpen && (
                                <>
                                    <a href="https://www.ieee.org/" target="_blank" rel="noreferrer" className="ieee-logo d-block d-lg-none">
                                        <img src="/pes-theme/images/logo-ieee.png" alt="IEEE Logo" className="img-fluid" style={{ maxWidth: '140px' }} />
                                    </a>
                                    <div id="social-links-mobile" className="d-block d-lg-none">
                                        <a href="https://ieee-collabratec.ieee.org/" className="ico-collabratec" target="_blank" rel="noreferrer"></a>
                                        <a href="https://lnkd.in/gkDTj47k" target="_blank" rel="noreferrer"><i className="fa fa-twitter" aria-hidden="true"></i></a>
                                        <a href="https://lnkd.in/gSJJzeUA" target="_blank" rel="noreferrer"><i className="fa fa-facebook" aria-hidden="true"></i></a>
                                        <a href="https://lnkd.in/gncy6jUc" target="_blank" rel="noreferrer"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
                                        <a href="https://lnkd.in/gqyuMs_F" target="_blank" rel="noreferrer"><i className="fa fa-instagram" aria-hidden="true"></i></a>
                                        <a href="https://lnkd.in/gVR7dmtZ" target="_blank" rel="noreferrer"><i className="fa fa-whatsapp" aria-hidden="true"></i></a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
