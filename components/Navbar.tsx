// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { Menu, X, MonitorPlay, ChevronRight, Languages, Download } from 'lucide-react';

// const Navbar: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const router = useRouter();

//   // Prevent background scrolling when mobile menu is active
//   useEffect(() => {
//     if (isMenuOpen) {
//       document.body.style.overflow = 'hidden';
//       document.body.style.position = 'fixed';
//       document.body.style.width = '100%';
//     } else {
//       document.body.style.overflow = '';
//       document.body.style.position = '';
//       document.body.style.width = '';
//     }
//   }, [isMenuOpen]);

//   const navLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'Movies', path: '/Movies' },
//     { name: 'TV Shows', path: '/tv' },
//     { name: 'Sports', path: '/Sports' },
//     { name: 'Live TV', path: '/live' },
//   ];

//   const isActive = (path: string) => {
//     if (path === '/' && router.pathname !== '/') return false;
//     return router.pathname.startsWith(path);
//   };

//   return (
//     <>
//       {/* MAIN NAVBAR */}
//       <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/95 backdrop-blur-xl border-b border-white/10 h-16 md:h-20">
//         <div className="container mx-auto px-3 sm:px-4 h-full flex items-center justify-between">
          
//           {/* Logo Section */}
//           <Link 
//             href="/" 
//             className="flex items-center gap-1.5 sm:gap-2 group shrink-0" 
//             onClick={() => setIsMenuOpen(false)}
//           >
//             <div className="bg-miraj-red p-1 sm:p-1.5 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
//               <MonitorPlay className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//             </div>
//            <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-white">
//              UwatchFree Movie  <span className="text-miraj-red ml-2">Official</span>
//            </span>

//           </Link>

//           {/* Desktop Links (Hidden on Mobile) */}
//           <div className="hidden lg:flex items-center gap-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 href={link.path}
//                 className={`px-4 py-2 rounded-full text-[11px] font-black transition-all uppercase tracking-[0.1em] ${
//                   isActive(link.path)
//                     ? 'text-white bg-miraj-red shadow-lg' 
//                     : 'text-gray-400 hover:text-white hover:bg-white/5'
//                 }`}
//               >
//                 {link.name}
//               </Link>
//             ))}
            
//             {/* Download APK Button - Desktop */}
//             <a
//               href="https://median.co/share/jbworwr"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="ml-2 flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-95"
//             >
//               <Download size={14} />
//               Download APK
//             </a>
//           </div>

//           {/* Mobile Controls */}
//           <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            
//             {/* Language Dropdown Container */}
//             <div className="flex items-center bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 gap-1 sm:gap-1.5 md:gap-2" suppressHydrationWarning>
//                 <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
//                     <Languages size={12} className="text-miraj-gold sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
//                 </div>
//                 <div id="google_translate_element" className="flex items-center min-w-[90px] sm:min-w-[110px] md:min-w-[120px] h-6 sm:h-7 overflow-hidden"></div>
//             </div>

//             {/* Download APK Button - Mobile (Visible only on small screens) */}
//             <a
//               href="https://median.co/share/jbworwr"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="lg:hidden flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white active:scale-95 whitespace-nowrap"
//             >
//               <Download size={12} className="sm:w-3.5 sm:h-3.5" />
//               <span className="hidden xs:inline">APK</span>
//             </a>

//             {/* Mobile Hamburger Button */}
//             <button 
//                 className="lg:hidden p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center bg-miraj-red text-white active:scale-90 touch-manipulation min-w-[44px] min-h-[44px]" 
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//                 type="button"
//             >
//               {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* MOBILE BACKDROP */}
//       <div 
//         className={`fixed inset-0 bg-black/95 backdrop-blur-md z-[9998] transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
//         onClick={() => setIsMenuOpen(false)}
//         style={{ top: 0 }}
//       />

//       {/* MOBILE SIDEBAR */}
//       <aside 
//         className={`fixed right-0 top-0 h-full w-[90%] max-w-[360px] bg-black border-l border-white/10 z-[9999] lg:hidden transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
//         style={{ 
//           WebkitOverflowScrolling: 'touch',
//           overscrollBehavior: 'contain'
//         }}
//       >
        
//         {/* Close Button */}
//         <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
//             <button 
//                 onClick={() => setIsMenuOpen(false)}
//                 className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all active:scale-90 touch-manipulation min-w-[44px] min-h-[44px]"
//                 type="button"
//                 aria-label="Close menu"
//             >
//                 <X size={22} className="sm:w-6 sm:h-6" />
//             </button>
//         </div>

//         {/* Menu Content */}
//         <div className="flex flex-col h-full pt-16 sm:pt-20 px-4 sm:px-6 pb-8 sm:pb-12 overflow-y-auto">
          
//           {/* Header */}
//           <div className="mb-6 sm:mb-8 border-b border-white/10 pb-3 sm:pb-4">
//              <div className="flex items-center gap-2">
//                 <MonitorPlay className="text-miraj-red w-5 h-5 sm:w-6 sm:h-6" />
//                 <span className="text-base sm:text-lg font-black tracking-tighter text-white">UWATCHFREE MENU</span>
//              </div>
//           </div>
          
//           {/* Navigation Links */}
//           <div className="flex flex-col gap-2 mb-6 sm:mb-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 href={link.path}
//                 onClick={() => setIsMenuOpen(false)}
//                 className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all active:scale-98 touch-manipulation ${
//                   isActive(link.path) 
//                     ? 'bg-miraj-red text-white shadow-xl shadow-miraj-red/20' 
//                     : 'text-gray-400 bg-white/5 active:bg-white/10'
//                 }`}
//               >
//                 {link.name}
//                 <ChevronRight size={18} className={`sm:w-5 sm:h-5 ${isActive(link.path) ? 'text-white' : 'text-gray-600'}`} />
//               </Link>
//             ))}
//           </div>

//           {/* Download APK Link */}
//           <div className="mt-auto">
//             <a
//               href="https://median.co/share/jbworwr"
//               target="_blank"
//               rel="noopener noreferrer"
//               onClick={() => setIsMenuOpen(false)}
//               className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 text-green-400 active:bg-green-500/10 active:scale-98 touch-manipulation"
//             >
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
//                   <Download size={18} className="text-white sm:w-5 sm:h-5" />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm sm:text-base">Download APK</span>
//                   <span className="text-xs text-green-300/70 font-normal">Latest Version</span>
//                 </div>
//               </div>
//               <ChevronRight size={18} className="text-green-400/60 sm:w-5 sm:h-5" />
//             </a>
//           </div>

//           {/* Footer */}
//           <div className="mt-6 sm:mt-8 text-center">
//              <div className="h-px bg-white/5 w-1/2 mx-auto mb-3 sm:mb-4"></div>
//              <p className="text-[9px] sm:text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] sm:tracking-[0.6em]">UwatchFree Official</p>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, MonitorPlay, ChevronRight, Languages, Download } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Prevent background scrolling when mobile menu is active
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/Movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'Sports', path: '/Sports' },
    { name: 'Live TV', path: '/live' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && router.pathname !== '/') return false;
    return router.pathname.startsWith(path);
  };

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/95 backdrop-blur-xl border-b border-white/10 h-16 md:h-20">
        <div className="container mx-auto px-3 sm:px-4 h-full flex items-center justify-between">
          
          {/* Logo Section - now with truncation on small screens */}
          <Link 
            href="/" 
            className="flex items-center gap-1.5 sm:gap-2 group shrink-0 min-w-0 flex-1 md:flex-none" 
            onClick={() => setIsMenuOpen(false)}
          >
         <div className=" shrink-0 group-hover:scale-105 transition-transform">
  <img
    src="/android-chrome-512x512.png"
    alt="Logo"
        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
  />
</div>

<div className="flex items-center">
  <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-white truncate">
    Vega Movies™
  </span>
  <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter text-miraj-red ml-2">
    Official
  </span>
</div>


              {/* <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-white truncate">
              UwatchFree Movie <span className="text-miraj-red ml-2 hidden xs:inline">Official</span>
            </span> */}
          </Link>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-full text-[11px] font-black transition-all uppercase tracking-[0.1em] ${
                  isActive(link.path)
                    ? 'text-white bg-miraj-red shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Download APK Button - Desktop */}
            <a
              href="https://median.co/share/jbworwr"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-95"
            >
              <Download size={14} />
              Download APK
            </a>
          </div>

          {/* Mobile Controls - refined for very small screens */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            
            {/* Language Dropdown Container - smaller min-width on extreme mobile */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 gap-1 sm:gap-1.5 md:gap-2" suppressHydrationWarning>
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <Languages size={12} className="text-miraj-gold sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                </div>
                <div id="google_translate_element" className="flex items-center min-w-[60px] xs:min-w-[80px] sm:min-w-[110px] md:min-w-[120px] h-6 sm:h-7 overflow-hidden"></div>
            </div>

            {/* Download APK Button - Mobile (text hidden on smallest screens) */}
            <a
              href="https://median.co/share/jbworwr"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white active:scale-95 whitespace-nowrap"
            >
              <Download size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">APK</span>
            </a>

            {/* Mobile Hamburger Button - always visible and tappable */}
            <button 
                className="lg:hidden p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center bg-miraj-red text-white active:scale-90 touch-manipulation min-w-[44px] min-h-[44px] shrink-0" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                type="button"
            >
              {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE BACKDROP */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-[9998] transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        style={{ top: 0 }}
      />

      {/* MOBILE SIDEBAR */}
      <aside 
        className={`fixed right-0 top-0 h-full w-[90%] max-w-[360px] bg-black border-l border-white/10 z-[9999] lg:hidden transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        
        {/* Close Button */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all active:scale-90 touch-manipulation min-w-[44px] min-h-[44px]"
                type="button"
                aria-label="Close menu"
            >
                <X size={22} className="sm:w-6 sm:h-6" />
            </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-full pt-16 sm:pt-20 px-4 sm:px-6 pb-8 sm:pb-12 overflow-y-auto">
          
          {/* Header */}
          <div className="mb-6 sm:mb-8 border-b border-white/10 pb-3 sm:pb-4">
             <div className="flex items-center gap-2">
                <MonitorPlay className="text-miraj-red w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg font-black tracking-tighter text-white">PUTLOCKER™ </span>
             </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col gap-2 mb-6 sm:mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all active:scale-98 touch-manipulation ${
                  isActive(link.path) 
                    ? 'bg-miraj-red text-white shadow-xl shadow-miraj-red/20' 
                    : 'text-gray-400 bg-white/5 active:bg-white/10'
                }`}
              >
                {link.name}
                <ChevronRight size={18} className={`sm:w-5 sm:h-5 ${isActive(link.path) ? 'text-white' : 'text-gray-600'}`} />
              </Link>
            ))}
          </div>

          {/* Download APK Link */}
          <div className="mt-auto">
            <a
              href="https://median.co/share/jbworwr"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 text-green-400 active:bg-green-500/10 active:scale-98 touch-manipulation"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Download size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base">Download APK</span>
                  <span className="text-xs text-green-300/70 font-normal">Latest Version</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-green-400/60 sm:w-5 sm:h-5" />
            </a>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
             <div className="h-px bg-white/5 w-1/2 mx-auto mb-3 sm:mb-4"></div>
             <p className="text-[9px] sm:text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] sm:tracking-[0.6em]">PUTLOCKER™ Official</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;