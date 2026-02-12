import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';
import SEO from '../components/SEO';

const Custom404: React.FC = () => {
  return (
    <div className="min-h-screen bg-miraj-black flex flex-col items-center justify-center p-4 text-center">
      <SEO title="Page Not Found - Justwatch Free Official" description="The page you are looking for does not exist." />
      
      <div className="bg-miraj-gray/50 border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-sm max-w-lg w-full">
        <div className="w-20 h-20 bg-miraj-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-miraj-red" size={40} />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl md:text-2xl font-bold text-gray-300 mb-4">Page Not Found</h2>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-miraj-gold hover:bg-white text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Custom404;