'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [artwork5ImageIndex, setArtwork5ImageIndex] = useState(0);
  const [artwork2Hovered, setArtwork2Hovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div className="relative">
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
          className="fixed inset-0 z-10 flex items-center justify-center text-white text-center px-4 pointer-events-none"
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
              className="drop-shadow-lg mx-auto"
              style={{
                marginBottom: '1.5rem',
              }}
            />
            
            <p className="mt-4 max-w-xl mx-auto text-base font-light drop-shadow-md"
               style={{
                 marginTop: '4rem',
               }}>
              be<i>auty</i> <span className="tracking-tight">—————</span> curiosity <span className="tracking-tight">—————</span> <i>flaír.</i>
            </p>
          </div>
        </div>
      </section>

      {/* Scrolling Gallery Section */}
      <section className="relative z-20 bg-stone-100 h-[280vh] -mt-18">
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
                  className="text-sm text-gray-600 inline-block cursor-pointer hover:text-gray-800 hover:not-italic hover:tracking-normal transition-all duration-300 italic relative group tracking-tight"
                  style={{
                    textDecoration: 'none'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTimeout(() => {
                      document.getElementById('gallery').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }, 300);
                  }}
                >
                  Explore our works
                  <div className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gray-600 group-hover:w-11/12 group-hover:bg-gray-800 transition-all duration-300"></div>
                </a>
              </div>
              
              {/* Right link - extends to screen edge */}
              <div className="flex-1 flex justify-end pr-6">
                <a 
                  href="#contact" 
                  className="text-sm text-gray-600 inline-block cursor-pointer hover:text-gray-800 hover:not-italic hover:tracking-normal transition-all duration-300 italic relative group tracking-tight"
                  style={{
                    textDecoration: 'none'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTimeout(() => {
                      document.getElementById('contact').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
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
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
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
                  className="w-full h-full object-cover object-left group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black opacity-13 group-hover:opacity-10 transition-opacity duration-300"></div>
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
                    className="w-full h-full object-cover group-hover:object-contain transition-all duration-300 group-hover:brightness-90"
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
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 delay-100"
                />
              </div>
              <div className="pt-4 pb-4 pr-4 text-left">
                <h2 className="text-2xl text-gray-800 mb-1">Watercolour Workshop</h2>
                <p className="text-2xl text-gray-600">Nature—Illustrated</p>
                <p className="text-sm text-gray-400 mt-3">Made by Anne, 2023, Watercolour</p>
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

       {/* About Section */}
          <div id="contact" className="text-center py-8 border-t border-white">
            <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed text-sm mb-6 mt-0">
            A STUDIO BY ANNE is a practice shaped by inquiry and context, and a deep appreciation for beauty and order.
We teach art to the young, and craft paintings that complete the spaces they inhabit.
Rooted in technique and research, our work sits at the intersection of learning and experimentation.
From imparting knowledge to bespoke commissions, we continue to make art that feels personal, intentional, and exquisitely made.
            </p>
            <div className="flex flex-row items-center justify-center space-x-1.5">
              <a href="https://wa.me/6588748388" target="_blank" rel="noopener noreferrer">
                <button className="w-80 px-16 py-3 text-base border border-white text-white bg-transparent hover:bg-stone-100 hover:text-black transition-colors duration-300 mt-2 cursor-pointer">
                  Contact for Classes
                </button>
              </a>
              <a href="https://wa.me/6588748388" target="_blank" rel="noopener noreferrer">
                <button className="w-80 px-16 py-3 text-base border border-black text-white bg-black hover:bg-white/80 hover:text-black hover:border-white/60 transition-colors duration-300 mt-2 cursor-pointer">
                  Bespoke and Preorder
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}