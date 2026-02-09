import React from 'react';
import SEO from '../components/SEO';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-miraj-black pt-24 pb-20">
      <SEO title="Terms of Use - Vega Movies Official" description="Terms of Use and DMCA Disclaimer for Vega Movies Official." />
      
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">Terms of Use</h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">1. Agreement to Terms</h2>
                <p>
                    By accessing or using Vega Movies Official, you agree to be bound by these Terms of Use. If you disagree with any part of the terms, then you may not access the service.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">2. Content Disclaimer</h2>
                <div className="bg-red-900/20 border-l-4 border-miraj-red p-6 rounded-r-xl">
                    <p className="font-bold text-white mb-2 uppercase tracking-wide">Important Legal Notice</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        We DO NOT host nor transmit any audiovisual content itself and DO NOT control nor influence such content. 
                        We cannot accept any liability for the content transmitted by others. Any responsibility for this content lies with those who host or transmit it. 
                        We are not affiliated nor claim to be affiliated with any of the owners of streams and/or videos. All content is copyright of their respective owners.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">3. Use of Service</h2>
                <p>
                   You agree to use the Service only for purposes that are permitted by (a) the Terms and (b) any applicable law, regulation, or generally accepted practices or guidelines in the relevant jurisdictions.
                   You agree not to access (or attempt to access) any of the Services by any means other than through the interface that is provided by Vega Movies Official.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">4. Intellectual Property</h2>
                <p>
                    The Service and its original content (excluding Content provided by third parties), features, and functionality are and will remain the exclusive property of Vega Movies Official and its licensors.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">5. Termination</h2>
                <p>
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-miraj-gold mb-3">6. Changes</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
                <p className="mt-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;