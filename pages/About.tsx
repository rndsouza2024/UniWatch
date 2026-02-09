import React from 'react';
import SEO from '../components/SEO';
import { MonitorPlay, Zap, Globe, Shield, AlertCircle } from 'lucide-react';

const About: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Vega Movies Official",
    
    "description": "Vega Movies Official is a premier streaming platform for movies, TV shows, and live sports.",
    "url": "https://vegamoviesofficial.vercel.app/about",
    "publisher": {
      "@type": "Organization",
      "name": "Vega Movies Official",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vegamoviesofficial.vercel.app/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-miraj-black pt-24 pb-20">
      <SEO 
        title="About Us - Vega Movies Official" 
        description="Learn more about Vega Movies Official, our mission, and our commitment to free HD streaming." 
        schema={schema}
        path="/about"
      />
      
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">About <span className="text-miraj-red">Vega Movies Official</span></h1>
            <p className="text-gray-400 text-lg">Redefining your streaming experience.</p>
        </div>

        <div className="bg-miraj-gray border border-white/5 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
                At Vega Movies Official, our mission is simple: to provide a seamless, high-quality, and accessible streaming experience for entertainment lovers worldwide. 
                We believe that great stories should be shared without barriers. Whether you're into the latest Hollywood blockbusters, trending TV series, or live sports action, 
                we strive to bring it all to your fingertips in stunning HD quality.
            </p>
            <p className="text-gray-300 leading-relaxed">
                We are passionate about cinema and technology, constantly updating our platform to ensure fast loading times, minimal buffering, and a user-friendly interface that works perfectly across all your devices.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-miraj-gold/30 transition-colors">
                <MonitorPlay className="text-miraj-gold mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Huge Library</h3>
                <p className="text-gray-400 text-sm">Access thousands of Movies, TV Shows, and Live Channels updated daily.</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-miraj-gold/30 transition-colors">
                <Zap className="text-miraj-gold mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Fast Streaming</h3>
                <p className="text-gray-400 text-sm">Optimized servers ensure smooth playback with minimal buffering.</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-miraj-gold/30 transition-colors">
                <Globe className="text-miraj-gold mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Global Content</h3>
                <p className="text-gray-400 text-sm">Content from around the world, available with multiple subtitle options.</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-miraj-gold/30 transition-colors">
                <Shield className="text-miraj-gold mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Safe & Secure</h3>
                <p className="text-gray-400 text-sm">We prioritize user privacy and security. No registration required.</p>
            </div>
        </div>

        {/* Legal Disclaimer Section */}
        <div className="border-t border-white/10 pt-12">
            <div className="flex items-start gap-4 p-6 bg-red-900/10 border border-miraj-red/20 rounded-xl">
                 <AlertCircle className="text-miraj-red flex-shrink-0 mt-1" size={24} />
                 <div>
                     <h3 className="text-lg font-bold text-white mb-2">Legal Disclaimer</h3>
                     <p className="text-sm text-gray-400 leading-relaxed">
                        We DO NOT host nor transmit any audiovisual content itself and DO NOT control nor influence such content. 
                        We cannot accept any liability for the content transmitted by others. Any responsibility for this content lies with those who host or transmit it. 
                        We are not affiliated nor claim to be affiliated with any of the owners of streams and/or videos. All content is copyright of their respective owners.
                     </p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;