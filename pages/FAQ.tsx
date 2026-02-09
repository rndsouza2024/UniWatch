import React, { useState } from 'react';
import SEO from '../components/SEO';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl bg-miraj-gray overflow-hidden">
      <button 
        className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-white text-lg">{question}</span>
        {isOpen ? <ChevronUp className="text-miraj-gold" /> : <ChevronDown className="text-gray-400" />}
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 md:p-6 pt-0 text-gray-300 leading-relaxed border-t border-white/5">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Is Vega Movies Official free to use?",
      answer: "Yes, Vega Movies Official is completely free to use. You can watch movies, TV shows, and live channels without paying any subscription fees."
    },
    {
      question: "Do I need to register to watch content?",
      answer: "No, you do not need to create an account or register to watch any content on our platform. Just browse and click play."
    },
    {
      question: "Why is the video buffering?",
      answer: "Buffering can be caused by a slow internet connection or high server load. Try pausing the video for a moment to let it buffer, or switch to a different server using the server selector below the player."
    },
    {
      question: "How do I download movies?",
      answer: "Currently, we do not support direct downloading of content. Our platform is designed for streaming purposes only."
    },
    {
      question: "Is it legal to watch movies here?",
      answer: "Vega Movies Official operates as a search engine for streaming links. We DO NOT host nor transmit any audiovisual content itself and DO NOT control nor influence such content. We cannot accept any liability for the content transmitted by others."
    },
    {
      question: "How can I request a specific movie or show?",
      answer: "You can use the 'Contact Us' page to send us a request. Please include the full title and release year of the content you are looking for."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-miraj-black pt-24 pb-20">
      <SEO 
        title="Frequently Asked Questions - Vega Movies Official" 
        description="Find answers to common questions about Vega Movies Official, streaming, and our service." 
        schema={schema}
        path="/faq"
      />
      
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked <span className="text-miraj-gold">Questions</span></h1>
            <p className="text-gray-400">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;