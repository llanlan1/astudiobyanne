'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

// Scroll configuration constants
const SCROLL_CONFIG = {
  SPEED: {
    GALLERY: 800, // pixels per second
    CONTACT: 600  // pixels per second (slower for contact)
  },
  OFFSET: {
    GALLERY: 58,
    CONTACT: 0
  },
  PARALLAX: {
    HERO: 0.03,
    ARROW: 0.003
  },
  ARROW_FADE_THRESHOLD: 480
};

// Arrow component
const DownArrowIcon = () => (
  <svg
    width="20"
    height="40"
    viewBox="0 0 20 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    opacity="90"
  >
    <line
      x1="10"
      y1="2"
      x2="10"
      y2="40"
      stroke="#f5f5f4"
      strokeWidth="1"
      opacity="90"
    />
    <polyline
      points="6,36 10,40 14,36"
      stroke="#f5f5f4"
      strokeWidth="1"
      fill="none"
      opacity="90"
    />
  </svg>
);

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [artwork5ImageIndex, setArtwork5ImageIndex] = useState(0);
  const [artwork2Hovered, setArtwork2Hovered] = useState(false);
  const [hideHeroOnMobile, setHideHeroOnMobile] = useState(false);
  const [contactSectionTop, setContactSectionTop] = useState(0);

  // Refs for direct DOM access
  const galleryLinkRef = useRef(null);
  const contactLinkRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const measureContactTop = () => {
      const el = document.getElementById('contact');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        setContactSectionTop(top);
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      if (!isDesktop) {
        // Hide hero when the viewport bottom reaches the About section (with small offset)
        const viewportBottom = window.scrollY + window.innerHeight;
        const threshold = contactSectionTop > 0 ? contactSectionTop - 24 : document.documentElement.scrollHeight - 12;
        setHideHeroOnMobile(viewportBottom >= threshold);
      } else if (hideHeroOnMobile) {
        setHideHeroOnMobile(false);
      }
    };

    // Initial measure and listeners
    measureContactTop();
    window.addEventListener('resize', measureContactTop);
    window.addEventListener('orientationchange', measureContactTop);
    window.addEventListener('scroll', handleScroll);

    // Re-measure after images load (gallery images may shift layout)
    const images = Array.from(document.images || []);
    let pending = images.length;
    images.forEach(img => {
      if (img.complete) {
        pending -= 1;
      } else {
        img.addEventListener('load', measureContactTop, { once: true });
      }
    });
    if (pending === 0) measureContactTop();

    return () => {
      window.removeEventListener('resize', measureContactTop);
      window.removeEventListener('orientationchange', measureContactTop);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [contactSectionTop, hideHeroOnMobile]);

  // Direct DOM event listeners for immediate response
  useEffect(() => {
    const galleryLink = galleryLinkRef.current;
    const contactLink = contactLinkRef.current;
    const arrow = arrowRef.current;

    const handleGalleryClick = (e) => {
      e.preventDefault();
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const offset = isMobile ? 40 : SCROLL_CONFIG.OFFSET.GALLERY;
      smoothScrollTo('gallery', offset);
    };

    const handleContactClick = (e) => {
      e.preventDefault();
      smoothScrollTo('contact', SCROLL_CONFIG.OFFSET.CONTACT);
    };

    const handleArrowClick = (e) => {
      e.preventDefault();
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const offset = isMobile ? 40 : SCROLL_CONFIG.OFFSET.GALLERY;
      smoothScrollTo('gallery', offset);
    };

    if (galleryLink) {
      galleryLink.addEventListener('click', handleGalleryClick);
    }
    if (contactLink) {
      contactLink.addEventListener('click', handleContactClick);
    }
    if (arrow) {
      arrow.addEventListener('click', handleArrowClick);
    }

    return () => {
      if (galleryLink) {
        galleryLink.removeEventListener('click', handleGalleryClick);
      }
      if (contactLink) {
        contactLink.removeEventListener('click', handleContactClick);
      }
      if (arrow) {
        arrow.removeEventListener('click', handleArrowClick);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setArtwork5ImageIndex(prev => prev === 0 ? 1 : 0);
    }, 2000); // Switch every 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // CSS to control scroll speed for desktop and mobile
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }

      /* Desktop - Fast start, slow end */
      @media (min-width: 768px) {
        html {
          scroll-behavior: smooth !important;
          animation-timing-function: cubic-bezier(0.5, 0.0, 0.0, 1.0) !important;
          transition-timing-function: cubic-bezier(0.5, 0.0, 0.0, 1.0) !important;
        }

        *, *::before, *::after {
          scroll-behavior: smooth !important;
          animation-timing-function: cubic-bezier(0.5, 0.0, 0.0, 1.0) !important;
          transition-timing-function: cubic-bezier(0.5, 0.0, 0.0, 1.0) !important;
        }
      }

      /* Mobile - Much slower throughout */
      @media (max-width: 767px) {
        html {
          scroll-behavior: smooth !important;
          animation-timing-function: cubic-bezier(0.05, 0.0, 0.0, 1.0) !important;
          transition-timing-function: cubic-bezier(0.05, 0.0, 0.0, 1.0) !important;
        }

        *, *::before, *::after {
          scroll-behavior: smooth !important;
          animation-timing-function: cubic-bezier(0.05, 0.0, 0.0, 1.0) !important;
          transition-timing-function: cubic-bezier(0.05, 0.0, 0.0, 1.0) !important;
        }
      }

      body {
        scroll-behavior: smooth !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const artwork5Images = [
    '/artwork5.jpg',
    '/artwork5b.jpg'
  ];

  const artwork2Images = [
    '/artwork2.jpg',
    '/artwork2b.jpg'
  ];

  // Simple native smooth scroll
  const smoothScrollTo = (targetId, offset = 0) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };


  // Style calculations
  const heroTransform = `translateY(-${scrollY * SCROLL_CONFIG.PARALLAX.HERO}px)`;
  const arrowTransform = `translateY(-${scrollY * SCROLL_CONFIG.PARALLAX.ARROW}px)`;
  const arrowOpacity = scrollY > SCROLL_CONFIG.ARROW_FADE_THRESHOLD ? 0 : 1;
  const heroVisibility = hideHeroOnMobile ? 'opacity-0 md:opacity-100' : 'opacity-100';

  return (
    <div className="relative overflow-x-hidden">
      {/* Fixed Video Background Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Background Video - Fixed */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Scroll Down Arrow - Top Right */}
        <div
          className={`fixed top-6.5 right-2 md:top-6 md:right-6 z-20 transition-opacity duration-500 ${heroVisibility}`}
          style={{
            opacity: arrowOpacity,
          }}
        >
          <div
            ref={arrowRef}
            className="cursor-pointer hover:opacity-70 transition-opacity duration-300 pointer-events-auto"
          >
            <DownArrowIcon />
          </div>
        </div>

        {/* Hero Content - Enhanced Parallax */}
        <div
          className={`fixed inset-0 z-10 flex items-center justify-center text-white text-center px-4 pointer-events-none transition-opacity duration-300 ${heroVisibility}`}
          style={{
            transform: heroTransform,
          }}
        >
          <div>
            <Image
              src="/logo.png"
              alt="A STUDIO BY ANNE logo"
              width={400}
              height={200}
              priority
              className="drop-shadow-lg/10 mx-auto opacity-85 md:opacity-95"
              style={{
                marginBottom: '1.5rem',
              }}
            />
            
            <p className="mt-[3rem] mb-2 max-w-xl mx-auto text-[11px] md:text-xs font-light drop-shadow-md">
              be<i>auty</i> <span className="tracking-[-0.15em]">———————————</span> curiosity <span className="tracking-[-0.15em]">———————————</span> <i>flaír.</i>
            </p>
          </div>
        </div>
      </section>

      {/* Scrolling Gallery Section */}
      <section className="relative z-20 bg-stone-100 h-auto min-h-[120vh] md:h-[280vh] mt-[100vh] md:-mt-18 w-screen overflow-x-hidden">
        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Section Header */}
          <div className="mb-32 -mt-4 relative w-full">
            <div className="flex justify-between items-center w-full px-6">
              {/* Empty div for left spacing */}
              <div className="flex-1 -ml-5"></div>
              
              {/* Center link - constrained to max-width */}
              <div className="flex-1 flex justify-center">
                <a
                  ref={galleryLinkRef}
                  href="#gallery"
                  className="text-xs md:text-sm text-gray-600 inline-block cursor-pointer hover:text-gray-800 hover:not-italic hover:tracking-[0.01em] transition-all duration-300 italic relative group tracking-tight whitespace-nowrap"
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  Explore our works
                  <div className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gray-600 group-hover:w-11/12 group-hover:bg-gray-800 transition-all duration-300 group-hover:tracking-widest"></div>
                </a>
              </div>
              
              {/* Right link - extends to screen edge */}
              <div className="flex-1 flex justify-end mr-[-24px]">
                <a
                  ref={contactLinkRef}
                  href="#contact"
                  className="text-xs md:text-sm text-gray-600 inline-block cursor-pointer hover:text-gray-800 hover:not-italic hover:tracking-[0.01em] transition-all duration-300 italic relative group tracking-tight whitespace-nowrap"
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  Contact
                  <div className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gray-600 group-hover:w-11/12 group-hover:bg-gray-800 transition-all duration-300"></div>
                </a>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div id="gallery" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-108 gap-y-24 mb-8" style={{ scrollMarginTop: '80px' }}>
            {/* Artwork 1 - Darker overlay on hover */}
            <div className="group relative overflow-hidden">
              <div className="aspect-square bg-gray-200 overflow-hidden relative">
                <Image
                  src="/artwork1.jpg"
                  alt="Watercolour Landscape by Jordan"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-500 delay-300"></div>
              </div>
              <div className="pt-4 pb-4 pr-4 text-left">
                <h2 className="text-2xl text-gray-800 mb-1">Expressive Watercolour</h2>
                <p className="text-2xl text-gray-600">Landscape—A &lsquo;Portrait&rsquo; of Winter</p>
                <p className="text-sm text-gray-400 mt-3">Made by Jordan, 6+, Watercolour</p>
              </div>
            </div>

            {/* Artwork 2 - Switch image on hover */}
            <div className="group relative overflow-hidden">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <Image
                  src={artwork2Images[artwork2Hovered ? 1 : 0]}
                  alt="Flowers - A Study of Latour by Anne"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-120 transition-all duration-300"
                  style={{
                    objectPosition: artwork2Hovered ? 'center top' : 'center center'
                  }}
                  onMouseEnter={() => setArtwork2Hovered(true)}
                  onMouseLeave={() => setArtwork2Hovered(false)}
                />
              </div>
              <div className="pt-4 pb-4 pr-4 text-left">
                <h2 className="text-2xl text-gray-800 mb-1">Floral Impressionism</h2>
                <p className="text-2xl text-gray-600">A Study of Latour&#39;s Painting</p>
                <p className="text-sm text-gray-400 mt-3">Made by Anne, 2023, Acrylic</p>
              </div>
            </div>

            {/* Artwork 3 - Show more of left side */}
            <div className="group relative overflow-hidden">
              <div className="aspect-square bg-gray-200 overflow-hidden relative">
                <Image
                  src="/artwork3.jpg"
                  alt="Still Life - Orchids by Christina"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover object-left group-hover:scale-105 transition-all duration-500 delay-300"
                />
                <div className="absolute inset-0 bg-black opacity-13 group-hover:opacity-10 transition-opacity duration-300 delay-400"></div>
              </div>
              <div className="pt-4 pb-4 pr-4 text-left">
                <h2 className="text-2xl text-gray-800 mb-1">Still Life Arrangement</h2>
                <p className="text-2xl text-gray-600">Faux Orchids in Ribbed Vase</p>
                <p className="text-sm text-gray-400 mt-3">Made by Christina, 16, Acrylic</p>
              </div>
            </div>

            {/* Artwork 4 - Show actual aspect ratio on hover */}
            <div className="group relative overflow-hidden">
              <div className="aspect-square bg-stone-100 overflow-hidden flex items-center justify-center relative">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/artwork4.jpg"
                    alt="Yellow Cattelya by Arthur and Victoria"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:object-contain transition-all duration-300 delay-200 group-hover:brightness-90"
                  />
                </div>
              </div>
              <div className="pt-4 pb-4 pr-4 text-left">
                <h2 className="text-2xl text-gray-800 mb-1">Keepsake</h2>
                <p className="text-2xl text-gray-600">Yellow Cattleya</p>
                <p className="text-sm text-gray-400 mt-3">Made by Arthur and Victoria, 5+, Acrylic</p>
              </div>
            </div>

            {/* Artwork 5 - No size change on hover */}
            <div className="group relative overflow-hidden">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <Image
                  src={artwork5Images[artwork5ImageIndex]}
                  alt="Recreating Realistic Textures by Anne"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
              <div className="pt-4 pb-4 pr-4 text-left">
                <h2 className="text-2xl text-gray-800 mb-1">Of Marbles and Precious Stones</h2>
                <p className="text-2xl text-gray-600">Rereating Realistic Textures</p>
                <p className="text-sm text-gray-400 mt-3">Made by Anne, 2024, Watercolour Mixed Media</p>
              </div>
            </div>

            {/* Artwork 6 - Slower transition with more expansion */}
            <div className="group relative overflow-hidden">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <Image
                  src="/artwork6.jpg"
                  alt="Nature — Illustrated by Anne"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 group-hover:delay-400"
                />
              </div>
              <div className="pt-4 pb-4 pr-4 text-left">
                <h2 className="text-2xl text-gray-800 mb-1">Watercolour Workshop</h2>
                <p className="text-2xl text-gray-600">Nature—Illustrated</p>
                <p className="text-sm text-gray-400 mt-3">Made by Anne, 2023, Watercolour</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-20 bg-transparent w-screen overflow-x-hidden pb-9 md:pb-0 pt-px">
        <div className="max-w-6xl mx-auto px-6">
          <div id="contact" className="text-center pt-8">
            <p className="text-lg text-[#f5f5f4] max-w-3xl mx-auto leading-relaxed text-sm mb-6 pt-3">
            A STUDIO BY ANNE is a practice shaped by inquiry and context, and a deep appreciation for beauty and order.
We teach art to the young, and craft paintings that complete the spaces they inhabit.
Rooted in technique and research, our work sits at the intersection of learning and experimentation.
From imparting knowledge to bespoke commissions, we continue to make art that feels personal, intentional, and exquisitely made.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center md:space-x-1.5 space-y-2 md:space-y-0 px-6 pb-4">
              <a href="https://wa.me/6588748388" target="_blank" rel="noopener noreferrer">
                <button className="w-full md:w-80 px-16 py-3 text-base border border-[#f5f5f4] text-white bg-transparent hover:bg-stone-100 hover:text-black transition-colors duration-300 mt-2 cursor-pointer">
                  &nbsp;Contact for Classes&nbsp;
                </button>
              </a>
              <a href="https://wa.me/6588748388" target="_blank" rel="noopener noreferrer">
                <button className="w-full md:w-80 px-16 py-3 text-base border border-black text-[#f5f5f4] bg-black hover:bg-white/80 hover:text-black hover:border-white/60 transition-colors duration-300 mt-2 cursor-pointer">
                  Bespoke &nbsp;<i>/</i>&nbsp; Preorder
                </button>
              </a>
            </div>
            <div className="mt-7 mb-3">
              <p className="text-[9px] text-[#f5f5f4] text-center tracking-widest font-thin italic">
                <span className="text-[7px] -mb-2">©</span> {new Date().getFullYear()} <span className="text-[7.5px]">A STUDIO BY ANNE</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}