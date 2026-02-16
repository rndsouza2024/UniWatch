import React from 'react';
import Link from 'next/link';
import { MonitorPlay, Facebook, Twitter, Instagram, HelpCircle, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 mt-auto relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-miraj-red to-red-800 p-1.5 rounded-lg group-hover:shadow-lg group-hover:shadow-red-900/40 transition-all duration-300">
                <MonitorPlay className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                Vega Movies™<span className="text-miraj-red ml-2"> Official</span>
              </span>
            
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for HD streaming. Watch thousands of movies, TV shows, and live sports events for free. No subscription required.
            </p>
            <div className="flex gap-4 pt-2">
               <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-miraj-red hover:text-white transition-all">
                  <Facebook size={16} />
               </a>
               <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all">
                  <Twitter size={16} />
               </a>
               <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                  <Instagram size={16} />
               </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <MonitorPlay size={16} className="text-miraj-gold" /> Browse
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-miraj-gold hover:pl-2 transition-all block">Home</Link></li>
              <li><Link href="/Movies" className="hover:text-miraj-gold hover:pl-2 transition-all block">Movies</Link></li>
              <li><Link href="/tv" className="hover:text-miraj-gold hover:pl-2 transition-all block">TV Shows</Link></li>
              <li><Link href="/Sports" className="hover:text-miraj-gold hover:pl-2 transition-all block">Live Sports</Link></li>
              <li><Link href="/live" className="hover:text-miraj-gold hover:pl-2 transition-all block">Live TV</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <HelpCircle size={16} className="text-miraj-gold" /> Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/FAQ" className="hover:text-miraj-gold hover:pl-2 transition-all block">FAQ</Link></li>
              <li><Link href="/Contact" className="hover:text-miraj-gold hover:pl-2 transition-all block">Contact Us</Link></li>
              <li><Link href="/About" className="hover:text-miraj-gold hover:pl-2 transition-all block">About Us</Link></li>
              <li><Link href="/Request" className="hover:text-miraj-gold hover:pl-2 transition-all block">Request Content</Link></li>
            </ul>
          </div>

           {/* Legal */}
           <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Shield size={16} className="text-miraj-gold" /> Legal
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/Privacy" className="hover:text-miraj-gold hover:pl-2 transition-all block">Privacy Policy</Link></li>
              <li><Link href="/Terms" className="hover:text-miraj-gold hover:pl-2 transition-all block">Terms of Service</Link></li>
              <li><Link href="/DMCA" className="hover:text-miraj-gold hover:pl-2 transition-all block">DMCA</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left whitespace-nowrap">
            © {new Date().getFullYear()} Vega Movies™ Official. All rights reserved.
          </p>
          <p className="text-[10px] md:text-xs text-gray-600 max-w-4xl text-center md:text-right leading-relaxed font-medium">
             We DO NOT host nor transmit any audiovisual content itself and DO NOT control nor influence such content. 
             We cannot accept any liability for the content transmitted by others. Any responsibility for this content lies with those who host or transmit it. 
             We are not affiliated nor claim to be affiliated with any of the owners of streams and/or videos. All content is copyright of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;