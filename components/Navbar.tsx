import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell, User, LogOut, Tv, Clapperboard, MonitorPlay, Trophy, Download } from 'lucide-react';
import { NavSection } from '../types';

interface NavbarProps {
  onAuthToggle: () => void;
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthToggle, isAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: NavSection.HOME, path: '/', icon: <Tv size={18} aria-hidden="true" /> },
    { name: NavSection.MOVIES, path: '/movies', icon: <Clapperboard size={18} aria-hidden="true" /> },
    { name: NavSection.TV_SHOWS, path: '/tv', icon: <MonitorPlay size={18} aria-hidden="true" /> },
    { name: NavSection.SPORTS, path: '/sports', icon: <Trophy size={18} aria-hidden="true" /> },
    { name: NavSection.IPTV, path: '/iptv', icon: <Tv size={18} aria-hidden="true" /> },
  ];

  const getLinkClass = (isActive: boolean) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
      isActive 
        ? 'text-brand-500 bg-brand-500/10' 
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-bg/95 backdrop-blur-md shadow-lg border-b border-dark-border' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <div 
                className="flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 rounded" 
                onClick={() => window.location.hash = '/'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (window.location.hash = '/')}
                role="button"
                aria-label="Go to UniWatch Home"
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-indigo-500">
                UniWatch™
              </span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => getLinkClass(isActive)}
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <label htmlFor="desktop-search" className="sr-only">Search</label>
              <input 
                id="desktop-search"
                type="text" 
                placeholder="Search..." 
                className="bg-dark-surface border border-dark-border rounded-full py-1.5 pl-4 pr-10 text-sm text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all w-32 focus:w-64"
              />
              <Search className="absolute right-3 top-2 text-gray-400 w-4 h-4" aria-hidden="true" />
            </div>

            <a
              href='https://median.co/share/bnnzemj'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400'
            >
              <Download className='w-4 h-4' />
              Download APK
            </a>

            <button 
                className="text-gray-400 hover:text-white transition-colors relative focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full p-1"
                aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white">3</span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 group relative cursor-pointer" tabIndex={0} role="button" aria-label="User Menu">
                  <img 
                    src="/images/avatars/default.png" 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full border-2 border-brand-600"
                  />
                  <span className="text-sm font-medium text-gray-200">Alex</span>
                  
                  {/* Dropdown */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                     <div className="py-1">
                        <div className="px-4 py-2 text-xs text-gray-500">ACCOUNT</div>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Settings</a>
                        <div className="border-t border-dark-border my-1"></div>
                        <button onClick={onAuthToggle} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
                           <LogOut size={14} /> Sign Out
                        </button>
                     </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={onAuthToggle}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-brand-500/20 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Sign In"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-surface border-b border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Download APK Link for Mobile */}
            <a
              href='https://median.co/share/bnnzemj'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
            >
              <Download size={20} />
              Download APK
            </a>
            
            {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                      isActive ? 'text-white bg-brand-600' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <button 
                  onClick={() => { onAuthToggle(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-brand-400 font-medium hover:bg-gray-700 rounded-md transition-colors"
                >
                  Sign In
                </button>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;