import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import MediaCard from '../components/MediaCard';
import { fetchTrending } from '../services/tmdb';
import { MediaItem } from '../types';
import { Play, TrendingUp, Film, Tv, Zap, Wifi, Loader2 } from 'lucide-react';
import { SITE_NAME, SITE_DESCRIPTION } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tvShows, setTvShows] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTrending('all'),
      fetchTrending('movie'),
      fetchTrending('tv')
    ]).then(([trendingData, moviesData, tvData]) => {
      setTrending(trendingData.slice(0, 12));
      setMovies(moviesData.slice(0, 12));
      setTvShows(tvData.slice(0, 12));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEO 
        title="UniWatch™ - Ultimate Media Experience"
        description={SITE_DESCRIPTION}
        type="website"
        keywords={['streaming', 'free streaming,', 'free movies', 'live sports', 'tv shows', 'live sports', 'iptv', 'hd movies']}
      />
      
      <div className="min-h-screen bg-dark-bg pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-dark-bg via-brand-950 to-dark-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Stream Everything in <span className="text-brand-400">One Place</span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Unlimited access to movies, TV shows, live sports, and IPTV channels. 
                No subscriptions, no credit card required.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => navigate('/movies')}
                  className="group flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  <Film size={18} />
                  <span>Browse Movies</span>
                </button>
                <button 
                  onClick={() => navigate('/tv')}
                  className="group flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  <Tv size={18} />
                  <span>TV Shows</span>
                </button>
                <button 
                  onClick={() => navigate('/sports')}
                  className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  <Zap size={18} />
                  <span>Live Sports</span>
                </button>
                  <button 
                  onClick={() => navigate('/iptv')}
                className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  <Wifi size={19} />
                  <span>Live IPTv</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Trending Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-brand-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              </div>
              <button 
                onClick={() => navigate('/movies')}
                className="text-brand-400 hover:text-brand-300 font-medium"
              >
                View All →
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-brand-500" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {trending.map((item) => (
                  <MediaCard key={`trending-${item.id}`} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Movies Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Film className="text-brand-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Popular Movies</h2>
              </div>
              <button 
                onClick={() => navigate('/movies')}
                className="text-brand-400 hover:text-brand-300 font-medium"
              >
                View All →
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-brand-500" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.map((item) => (
                  <MediaCard key={`movie-${item.id}`} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* TV Shows Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Tv className="text-brand-400" size={24} />
                <h2 className="text-2xl font-bold text-white">TV Shows</h2>
              </div>
              <button 
                onClick={() => navigate('/tv')}
                className="text-brand-400 hover:text-brand-300 font-medium"
              >
                View All →
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-brand-500" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tvShows.map((item) => (
                  <MediaCard key={`tv-${item.id}`} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-dark-surface rounded-2xl p-8 border border-dark-border">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose {SITE_NAME}?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-brand-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Play className="text-brand-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Free Streaming</h3>
                <p className="text-gray-400">Watch thousands of movies and TV shows completely free, no subscriptions required.</p>
              </div>
              <div className="text-center">
                <div className="bg-brand-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-brand-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Live Sports</h3>
                <p className="text-gray-400">Never miss a match with live streaming of major sports events from around the world.</p>
              </div>
              <div className="text-center">
                <div className="bg-brand-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Tv className="text-brand-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">IPTV Channels</h3>
                <p className="text-gray-400">Access hundreds of live TV channels from various categories including news, sports, and entertainment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;