import React from 'react';
import SEO from '../components/SEO';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-miraj-black pt-24 pb-20">
      <SEO title="Privacy Policy - Vega Movies™ Official" description="Privacy Policy for Vega Movies™ Official." />
      
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">1. Introduction</h2>
                <p>
                    Welcome to Vega Movies™ Official. We respect your privacy and are committed to protecting your personal data. 
                    This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">2. Information We Collect</h2>
                <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                    <li><strong>Usage Data:</strong> Includes information about how you use our website, products, and services.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">3. How We Use Your Information</h2>
                <p>
                    We collect your data to improve our service, analyze usage trends, and enhance the performance of our platform. 
                    We do not sell, trade, or rent your personal identification information to others.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">4. Cookies</h2>
                <p>
                    Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">5. Third-Party Links</h2>
                <p>
                    This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. 
                    We do not control these third-party websites and are not responsible for their privacy statements.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">6. Changes to This Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
                <p className="mt-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;