'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [artwork5ImageIndex, setArtwork5ImageIndex] = useState(0);
  const [artwork2Hovered, setArtwork2Hovered] = useState(false);
  const [hideHeroOnMobile, setHideHeroOnMobile] = useState(false);
  const [contactSectionTop, setContactSectionTop] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setArtwork5ImageIndex(prev => prev === 0 ? 1 : 0);
    }, 2000); // Switch every 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply smooth scrolling to the html element with slower timing
    document.documentElement.style.scrollBehavior = 'smooth';
    document.documentElement.style.scrollTimeline = 'auto';
    
    // Add custom CSS for slower scrolling
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-timeline: auto;
      }
      * {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Clean up
      document.documentElement.style.scrollBehavior = 'auto';
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

  // Custom smooth scroll function with easing
  const smoothScrollTo = (targetId, duration = 1500, offset = 0) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Easing function for smooth deceleration
    const easeOutCubic = (t) => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const easedProgress = easeOutCubic(progress);
      const currentPosition = startPosition + (distance * easedProgress);

      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

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
        
        {/* Hero Content - Enhanced Parallax */}
        <div 
          className={`fixed inset-0 z-10 flex items-center justify-center text-white text-center px-4 pointer-events-none transition-opacity duration-300 ${hideHeroOnMobile ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}
          style={{
            transform: `translateY(-${scrollY * 0.03}px)`, // 3% parallax effect
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
              <div className="flex-1"></div>
              
              {/* Center link - constrained to max-width */}
              <div className="flex-1 flex justify-center">
                <a 
                  href="#gallery" 
                  className="text-xs md:text-sm text-gray-600 inline-block cursor-pointer hover:text-gray-800 hover:not-italic hover:tracking-[0.01em] transition-all duration-300 italic relative group tracking-tight whitespace-nowrap"
                  style={{
                    textDecoration: 'none'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTimeout(() => {
                      smoothScrollTo('gallery', 1200, 60);
                    }, 300);
                  }}
                >
                  Explore our works
                  <div className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gray-600 group-hover:w-11/12 group-hover:bg-gray-800 transition-all duration-300 group-hover:tracking-widest"></div>
                </a>
              </div>
              
              {/* Right link - extends to screen edge */}
              <div className="flex-1 flex justify-end mr-[-24px]">
                <a 
                  href="#contact" 
                  className="text-xs md:text-sm text-gray-600 inline-block cursor-pointer hover:text-gray-800 hover:not-italic hover:tracking-[0.01em] transition-all duration-300 italic relative group tracking-tight whitespace-nowrap"
                  style={{
                    textDecoration: 'none'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTimeout(() => {
                      smoothScrollTo('contact', 2000);
                    }, 300);
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

      {/* About Section (separate, transparent to reveal video) */}
      <section className="relative z-20 bg-transparent w-screen overflow-x-hidden pb-9 md:pb-7 pt-px">
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
          </div>
        </div>
      </section>
    </div>
  );
}