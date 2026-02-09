import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Send, MessageCircle, CheckCircle, Search } from 'lucide-react';

const Request: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    type: 'movie',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Logic to send to API would go here
    setTimeout(() => {
        setSubmitted(false);
        setFormData({ title: '', year: '', type: 'movie', notes: '' });
        alert("Request received! Check back in 24 hours.");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-miraj-black pt-24 pb-20">
      <SEO title="Request Content - Vega Movies Official" description="Request movies and TV shows to be added to Vega Movies Official." />
      
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Request <span className="text-miraj-gold">Content</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Can't find what you're looking for? Let us know and we'll upload it as fast as possible.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            
            <div className="bg-gradient-to-br from-[#0088cc]/20 to-black border border-[#0088cc]/30 rounded-3xl p-8 relative overflow-hidden group hover:border-[#0088cc]/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0088cc]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-[#0088cc] rounded-full flex items-center justify-center shadow-lg shadow-[#0088cc]/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Send className="text-white ml-1" size={40} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3">Fastest Method</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        Join our official Telegram channel for instant requests, updates on new uploads, and direct chat with admins.
                    </p>
                    
                    <a 
                        href="https://t.me/movieandtvshowondemand" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl"
                    >
                        <MessageCircle size={24} />
                        Join Telegram Channel
                    </a>
                </div>
            </div>

            <div className="bg-miraj-gray/50 border border-white/5 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Search className="text-miraj-gold" /> Web Request Form
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Content Title</label>
                        <input 
                            type="text" 
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-miraj-gold focus:outline-none transition-colors"
                            placeholder="e.g. Avengers: Endgame"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Release Year</label>
                            <input 
                                type="number" 
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: e.target.value})}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-miraj-gold focus:outline-none transition-colors"
                                placeholder="e.g. 2019"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-miraj-gold focus:outline-none transition-colors appearance-none"
                            >
                                <option value="movie">Movie</option>
                                <option value="tv">TV Show</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Additional Notes (Optional)</label>
                        <textarea 
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            rows={3}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-miraj-gold focus:outline-none transition-colors resize-none"
                            placeholder="IMDB Link, Specific Season, etc."
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={submitted}
                        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${submitted ? 'bg-green-600 text-white cursor-default' : 'bg-white/10 hover:bg-miraj-red text-white hover:scale-[1.02]'}`}
                    >
                        {submitted ? (
                            <> <CheckCircle size={20} /> Request Sent </>
                        ) : (
                            <> <Send size={20} /> Submit Request </>
                        )}
                    </button>
                </form>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Request;