// import React, { useState, useEffect } from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import { Menu, X, Search, Bell, User, LogOut, Tv, Clapperboard, MonitorPlay, Trophy, Download } from 'lucide-react';
// import { NavSection } from '../types';

// interface NavbarProps {
//   onAuthToggle: () => void;
//   isAuthenticated: boolean;
// }

// const Navbar: React.FC<NavbarProps> = ({ onAuthToggle, isAuthenticated }) => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const location = useLocation();

//   // Scroll effect for navbar background
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navItems = [
//     { name: NavSection.HOME, path: '/', icon: <Tv size={18} aria-hidden="true" /> },
//     { name: NavSection.MOVIES, path: '/movies', icon: <Clapperboard size={18} aria-hidden="true" /> },
//     { name: NavSection.TV_SHOWS, path: '/tv', icon: <MonitorPlay size={18} aria-hidden="true" /> },
//     { name: NavSection.SPORTS, path: '/sports', icon: <Trophy size={18} aria-hidden="true" /> },
//     { name: NavSection.IPTV, path: '/iptv', icon: <Tv size={18} aria-hidden="true" /> },
//   ];

//   const getLinkClass = (isActive: boolean) => 
//     `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
//       isActive 
//         ? 'text-brand-500 bg-brand-500/10' 
//         : 'text-gray-300 hover:text-white hover:bg-white/5'
//     }`;

//   return (
//     <nav
//       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         isScrolled ? 'bg-dark-bg/95 backdrop-blur-md shadow-lg border-b border-dark-border' : 'bg-gradient-to-b from-black/80 to-transparent'
//       }`}
//       role="navigation"
//       aria-label="Main Navigation"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
          
//           {/* Logo & Desktop Nav */}
//           <div className="flex items-center">
//             <div 
//                 className="flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 rounded" 
//                 onClick={() => window.location.hash = '/'}
//                 tabIndex={0}
//                 onKeyDown={(e) => e.key === 'Enter' && (window.location.hash = '/')}
//                 role="button"
//                 aria-label="Go to UniWatch Home"
//             >
//               <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-indigo-500">
//                 UniWatch™
//               </span>
//             </div>
//             <div className="hidden md:block ml-10">
//               <div className="flex items-baseline space-x-2">
//                 {navItems.map((item) => (
//                   <NavLink
//                     key={item.name}
//                     to={item.path}
//                     className={({ isActive }) => getLinkClass(isActive)}
//                   >
//                     {item.icon}
//                     {item.name}
//                   </NavLink>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Side Icons */}
//           <div className="hidden md:flex items-center gap-4">
//             <div className="relative group">
//               <label htmlFor="desktop-search" className="sr-only">Search</label>
//               <input 
//                 id="desktop-search"
//                 type="text" 
//                 placeholder="Search..." 
//                 className="bg-dark-surface border border-dark-border rounded-full py-1.5 pl-4 pr-10 text-sm text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all w-32 focus:w-64"
//               />
//               <Search className="absolute right-3 top-2 text-gray-400 w-4 h-4" aria-hidden="true" />
//             </div>

//             <a
//               href='https://median.co/share/bnnzemj'
//               target='_blank'
//               rel='noopener noreferrer'
//               className='flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400'
//             >
//               <Download className='w-4 h-4' />
//               Download APK
//             </a>

//             <button 
//                 className="text-gray-400 hover:text-white transition-colors relative focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full p-1"
//                 aria-label="Notifications"
//             >
//               <Bell size={20} />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white">3</span>
//             </button>

//             <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
//               {isAuthenticated ? (
//                 <div className="flex items-center gap-2 group relative cursor-pointer" tabIndex={0} role="button" aria-label="User Menu">
//                   <img 
//                     src="/images/avatars/default.png" 
//                     alt="User Avatar" 
//                     className="w-8 h-8 rounded-full border-2 border-brand-600"
//                   />
//                   <span className="text-sm font-medium text-gray-200">Alex</span>
                  
//                   {/* Dropdown */}
//                   <div className="absolute top-full right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
//                      <div className="py-1">
//                         <div className="px-4 py-2 text-xs text-gray-500">ACCOUNT</div>
//                         <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Profile</a>
//                         <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Settings</a>
//                         <div className="border-t border-dark-border my-1"></div>
//                         <button onClick={onAuthToggle} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
//                            <LogOut size={14} /> Sign Out
//                         </button>
//                      </div>
//                   </div>
//                 </div>
//               ) : (
//                 <button 
//                   onClick={onAuthToggle}
//                   className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-brand-500/20 focus:outline-none focus:ring-2 focus:ring-white"
//                   aria-label="Sign In"
//                 >
//                   Sign In
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="-mr-2 flex md:hidden">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
//               aria-expanded={isMobileMenuOpen}
//               aria-label="Toggle mobile menu"
//             >
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-dark-surface border-b border-dark-border">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {/* Download APK Link for Mobile */}
//             <a
//               href='https://median.co/share/bnnzemj'
//               target='_blank'
//               rel='noopener noreferrer'
//               className='flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
//             >
//               <Download size={20} />
//               Download APK
//             </a>
            
//             {navItems.map((item) => (
//                 <NavLink
//                   key={item.name}
//                   to={item.path}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className={({ isActive }) => 
//                     `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
//                       isActive ? 'text-white bg-brand-600' : 'text-gray-300 hover:text-white hover:bg-gray-700'
//                     }`
//                   }
//                 >
//                   {item.icon}
//                   {item.name}
//                 </NavLink>
//               ))}
//               {!isAuthenticated && (
//                 <button 
//                   onClick={() => { onAuthToggle(); setIsMobileMenuOpen(false); }}
//                   className="w-full text-left px-3 py-2 text-brand-400 font-medium hover:bg-gray-700 rounded-md transition-colors"
//                 >
//                   Sign In
//                 </button>
//               )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;










import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, User, LogOut, Tv, Clapperboard, MonitorPlay, Trophy, Download, Home, Globe, Settings, ChevronDown, ChevronUp, History, Star, Clock } from 'lucide-react';
import { NavSection } from '../types';

interface NavbarProps {
  onAuthToggle: () => void;
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthToggle, isAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Check device type and handle responsive behavior
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      if (width > 1024) {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // Scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
          event.target instanceof Element && !event.target.closest('button[aria-label="Toggle mobile menu"]')) {
        setIsMobileMenuOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node) &&
          event.target instanceof Element && !event.target.closest('button[aria-label="Mobile search toggle"]')) {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
        setIsUserDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const navItems = [
    { name: NavSection.HOME, path: '/', icon: <Home size={isMobile ? 20 : 18} aria-hidden="true" /> },
    { name: NavSection.MOVIES, path: '/movies', icon: <Clapperboard size={isMobile ? 20 : 18} aria-hidden="true" /> },
    { name: NavSection.TV_SHOWS, path: '/tv', icon: <MonitorPlay size={isMobile ? 20 : 18} aria-hidden="true" /> },
    { name: NavSection.SPORTS, path: '/sports', icon: <Trophy size={isMobile ? 20 : 18} aria-hidden="true" /> },
    { name: NavSection.IPTV, path: '/iptv', icon: <Globe size={isMobile ? 20 : 18} aria-hidden="true" /> },
  ];

  const getLinkClass = (isActive: boolean) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-bg ${
      isActive 
        ? 'text-brand-500 bg-brand-500/10' 
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleMobileSearchToggle = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (!isMobileSearchOpen) {
      setTimeout(() => {
        document.getElementById('mobile-search-input')?.focus();
      }, 100);
    }
  };

  const handleUserMenuToggle = () => {
    if (isMobile) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
      setIsMobileMenuOpen(false);
    } else {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    }
  };

  const notificationItems = [
    { id: 1, text: 'New episode of "The Last of Us" available', time: '10 min ago', read: false },
    { id: 2, text: 'Live match starting soon: Lakers vs Warriors', time: '1 hour ago', read: false },
    { id: 3, text: 'Your watchlist updated successfully', time: '2 hours ago', read: true },
    { id: 4, text: 'New movies added to your favorite genre', time: '1 day ago', read: true },
  ];

  return (
    <>
      {/* Mobile search overlay */}
      {isMobile && isMobileSearchOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 md:hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-bold">Search</h2>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                id="mobile-search-input"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows, sports..."
                className="w-full bg-dark-surface border border-dark-border rounded-full py-3 pl-4 pr-12 text-base text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-2"
                aria-label="Submit search"
              >
                <Search size={20} />
              </button>
            </form>
            <div className="text-sm text-gray-400 mb-2">Recent searches:</div>
            <div className="space-y-2">
              {['Avengers Endgame', 'Football live', 'Breaking Bad', 'Cricket World Cup'].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(item);
                    handleSearch(new Event('submit') as any);
                  }}
                  className="w-full text-left p-3 bg-dark-surface rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-500" />
                    {item}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-dark-bg/95 backdrop-blur-md shadow-lg border-b border-dark-border' 
            : 'bg-gradient-to-b from-black/90 to-transparent'
        } ${isMobile ? 'safe-top' : ''}`}
        style={isMobile ? { paddingTop: 'env(safe-area-inset-top)' } : {}}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo & Desktop Nav */}
            <div className="flex items-center flex-1">
              {/* Mobile menu button - visible on mobile and tablet */}
              <div className="flex md:hidden items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>

              {/* Logo */}
              <div 
                className="flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 rounded ml-2 md:ml-0" 
                onClick={() => navigate('/')}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
                role="button"
                aria-label="Go to UniWatch Home"
              >
                <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-indigo-500">
                  UniWatch™
                </span>
              </div>

              {/* Desktop Navigation - hidden on mobile */}
              <div className="hidden md:flex ml-6 lg:ml-10">
                <div className="flex items-baseline space-x-1 lg:space-x-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) => getLinkClass(isActive)}
                    >
                      {item.icon}
                      <span className="hidden lg:inline">{item.name}</span>
                      <span className="lg:hidden">{item.name.split(' ')[0]}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Icons - Desktop */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {/* Desktop Search - Collapsible on tablet */}
              {isTablet ? (
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-label="Toggle search"
                >
                  <Search size={20} />
                </button>
              ) : (
                <div className="relative group">
                  <form onSubmit={handleSearch}>
                    <label htmlFor="desktop-search" className="sr-only">Search</label>
                    <input 
                      id="desktop-search"
                      ref={searchInputRef}
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..." 
                      className="bg-dark-surface border border-dark-border rounded-full py-2 pl-4 pr-10 text-sm text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all w-40 lg:w-48 xl:w-56"
                      autoComplete="off"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                      <Search size={16} aria-hidden="true" />
                    </button>
                  </form>
                </div>
              )}

              {/* Download APK Button */}
              <a
                href='https://median.co/share/bnnzemj'
                target='_blank'
                rel='noopener noreferrer'
                className='hidden lg:flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 lg:px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-400 shadow-lg hover:shadow-green-500/20'
              >
                <Download className='w-4 h-4' />
                <span className="hidden xl:inline">Download APK</span>
                <span className="xl:hidden">APK</span>
              </a>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white">
                    {notificationItems.filter(n => !n.read).length}
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-surface border border-dark-border rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">Notifications</h3>
                        <button 
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notificationItems.map((item) => (
                          <div 
                            key={item.id} 
                            className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-white/5 ${item.read ? 'bg-dark-bg' : 'bg-brand-500/10'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${item.read ? 'bg-gray-500' : 'bg-brand-500'}`} />
                              <div className="flex-1">
                                <p className="text-sm text-gray-200">{item.text}</p>
                                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-3 text-center text-sm text-brand-400 hover:text-brand-300">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-700" ref={userDropdownRef}>
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={handleUserMenuToggle}
                      className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
                      aria-label="User Menu"
                    >
                      <img 
                        src="/images/avatars/default.png" 
                        alt="User Avatar" 
                        className="w-8 h-8 rounded-full border-2 border-brand-600"
                      />
                      <span className="hidden lg:inline text-sm font-medium text-gray-200">Alex</span>
                      {isUserDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {/* Dropdown */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-dark-surface border border-dark-border rounded-lg shadow-xl z-50">
                        <div className="p-3 border-b border-dark-border">
                          <div className="flex items-center gap-3">
                            <img 
                              src="/images/avatars/default.png" 
                              alt="User Avatar" 
                              className="w-10 h-10 rounded-full border-2 border-brand-600"
                            />
                            <div>
                              <p className="text-white font-medium">Alex Johnson</p>
                              <p className="text-xs text-gray-400">Premium Member</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          <a href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                            <User size={16} /> Profile
                          </a>
                          <a href="/watchlist" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                            <Star size={16} /> Watchlist
                          </a>
                          <a href="/history" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                            <History size={16} /> History
                          </a>
                          <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                            <Settings size={16} /> Settings
                          </a>
                          <div className="border-t border-dark-border my-2"></div>
                          <button 
                            onClick={onAuthToggle} 
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                          >
                            <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={onAuthToggle}
                    className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-brand-500/20 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Sign In"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile right side icons */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile search toggle */}
              <button
                onClick={handleMobileSearchToggle}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Mobile search toggle"
              >
                <Search size={20} />
              </button>

              {/* Mobile Download APK - Icon only */}
              <a
                href='https://median.co/share/bnnzemj'
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400'
                aria-label="Download APK"
              >
                <Download size={20} />
              </a>
            </div>
          </div>

          {/* Tablet Search Bar (when expanded) */}
          {isTablet && isSearchOpen && (
            <div className="hidden md:flex pb-3 px-2">
              <form onSubmit={handleSearch} className="relative w-full">
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV shows, sports..." 
                  className="w-full bg-dark-surface border border-dark-border rounded-full py-2 pl-4 pr-10 text-sm text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  autoComplete="off"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden bg-dark-surface border-b border-dark-border absolute top-full left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{ maxHeight: `calc(100vh - ${isMobile ? '4rem + env(safe-area-inset-top)' : '4rem'})` }}
          >
            {/* User info if authenticated */}
            {isAuthenticated && (
              <div className="p-4 border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/avatars/default.png" 
                    alt="User Avatar" 
                    className="w-12 h-12 rounded-full border-2 border-brand-600"
                  />
                  <div>
                    <p className="text-white font-medium">Alex Johnson</p>
                    <p className="text-xs text-gray-400">Premium Member</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-2">
              {/* Navigation Items */}
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium my-1 ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}

              {/* Additional mobile menu items */}
              {isAuthenticated ? (
                <>
                  <div className="border-t border-dark-border my-3 pt-3">
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">Account</div>
                    <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 my-1">
                      <User size={20} /> Profile
                    </a>
                    <a href="/watchlist" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 my-1">
                      <Star size={20} /> Watchlist
                    </a>
                    <a href="/history" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 my-1">
                      <History size={20} /> History
                    </a>
                    <a href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 my-1">
                      <Settings size={20} /> Settings
                    </a>
                  </div>
                  <button 
                    onClick={() => { onAuthToggle(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 my-1 text-left"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { onAuthToggle(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full mt-4 px-4 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-lg font-medium"
                >
                  <User size={20} /> Sign In
                </button>
              )}

              {/* Download APK Button for mobile menu */}
              <a
                href='https://median.co/share/bnnzemj'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-3 w-full mt-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium'
              >
                <Download size={20} /> Download APK
              </a>

              {/* App version and info */}
              <div className="mt-6 px-4 text-center">
                <div className="text-xs text-gray-500">UniWatch v2.0.1</div>
                <div className="text-xs text-gray-600 mt-1">© 2024 All rights reserved</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Safe area spacer for mobile */}
      {isMobile && <div className="h-14 safe-top" />}

      {/* Tablet search overlay */}
      {isTablet && isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;