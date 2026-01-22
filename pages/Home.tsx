import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MediaCard from '../components/MediaCard';
import SEO from '../components/SEO';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { fetchTrending, fetchMovies, fetchTVShows, fetchSports, fetchTVLive } from '../services/tmdb';
import { MediaItem } from '../types';

const Home: React.FC = () => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tvShows, setTVShows] = useState<MediaItem[]>([]);
  const [sports, setSports] = useState<MediaItem[]>([]);
  const [tvLive, setTVLive] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data...');
      
      const [trendingData, moviesData, tvData, sportsData, tvLiveData] = await Promise.all([
        fetchTrending(),
        fetchMovies(),
        fetchTVShows(),
        fetchSports(),
        fetchTVLive()
      ]);
      
      console.log('Data fetched:', { 
        trending: trendingData.length, 
        movies: moviesData.length, 
        tvShows: tvData.length,
        sports: sportsData.length,
        tvLive: tvLiveData.length
      });
      
      setTrending(trendingData);
      setMovies(moviesData);
      setTVShows(tvData);
      setSports(sportsData);
      setTVLive(tvLiveData);
      
      if (trendingData.length === 0 && moviesData.length === 0 && tvData.length === 0) {
        setError('No content available. Trying mock data...');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Error loading content. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500 mb-4"></div>
        <p className="text-gray-400 text-lg">Loading UniWatch...</p>
        <p className="text-gray-500 text-sm mt-2">Fetching the latest content</p>
      </div>
    );
  }

  const heroItem = trending[0] || movies[0] || tvShows[0] || sports[0] || tvLive[0];

  const Section = ({ 
    title, 
    items, 
    viewAllPath 
  }: { 
    title: string; 
    items: MediaItem[]; 
    viewAllPath?: string 
  }) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-brand-500 rounded-full"></span>
            {title}
          </h2>
          {viewAllPath && (
            <button 
              onClick={() => window.location.hash = viewAllPath}
              className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors hover:bg-brand-500/10 px-3 py-1 rounded-lg"
            >
              VIEW ALL <ChevronRight size={16} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {items.slice(0, 12).map((item) => (
            <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <SEO 
        title="UniWatch - Watch Movies, TV, Sports & IPTV Free"
        description="UniWatch is your ultimate destination for free streaming. Watch the latest movies, trending TV shows, live sports events, and thousands of IPTV channels."
        keywords={['free movies', 'streaming', 'watch sports', 'iptv', 'tv shows', 'live tv']}
      />
      
      {error && (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg mx-4 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button 
            onClick={loadData}
            className="flex items-center gap-1 text-sm bg-yellow-700/30 hover:bg-yellow-700/50 px-3 py-1 rounded"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}
      
      {heroItem ? (
        <>
          <Hero item={heroItem} />
          
          <div className="mt-8 space-y-12 pb-20">
            {trending.length > 0 && (
              <Section 
                title="🔥 Trending Now" 
                items={trending} 
                viewAllPath="#/trending"
              />
            )}
            
            {movies.length > 0 && (
              <Section 
                title="🎬 Popular Movies" 
                items={movies} 
                viewAllPath="#/movies"
              />
            )}
            
            {tvShows.length > 0 && (
              <Section 
                title="📺 Popular TV Shows" 
                items={tvShows} 
                viewAllPath="#/tv"
              />
            )}
            
            {sports.length > 0 && (
              <Section 
                title="⚽ Live Sports" 
                items={sports} 
                viewAllPath="#/sports"
              />
            )}
            
            {tvLive.length > 0 && (
              <Section 
                title="📡 Live TV Channels" 
                items={tvLive} 
                viewAllPath="#/live"
              />
            )}
            
            {trending.length > 0 && (
              <Section 
                title="⭐ Top Rated" 
                items={[...trending].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))} 
              />
            )}
          </div>
        </>
      ) : (
        // Fallback when no hero item
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to <span className="text-brand-500">UniWatch</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Your ultimate streaming destination is almost ready...
            </p>
            <button 
              onClick={loadData}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={20} /> Load Content
            </button>
            
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[2/3] bg-gray-800/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;