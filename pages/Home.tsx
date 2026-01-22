// import React, { useEffect, useState } from 'react';
// import Hero from '../components/Hero';
// import MediaCard from '../components/MediaCard';
// import SEO from '../components/SEO';
// import { ChevronRight, RefreshCw, TrendingUp, Film, Tv, Zap, Wifi, Loader2 } from 'lucide-react';
// import { fetchTrending, fetchMovies, fetchTVShows, fetchSports, fetchTVLive } from '../services/tmdb';
// import { MediaItem } from '../types';

// const Home: React.FC = () => {
//   const [trending, setTrending] = useState<MediaItem[]>([]);
//   const [movies, setMovies] = useState<MediaItem[]>([]);
//   const [tvShows, setTVShows] = useState<MediaItem[]>([]);
//   const [sports, setSports] = useState<MediaItem[]>([]);
//   const [tvLive, setTVLive] = useState<MediaItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const [trendingData, moviesData, tvData, sportsData, tvLiveData] = await Promise.all([
//         fetchTrending('all'),
//         fetchMovies(),
//         fetchTVShows(),
//         fetchSports(),
//         fetchTVLive()
//       ]);
      
//       setTrending(trendingData.slice(0, 18));
//       setMovies(moviesData.slice(0, 18));
//       setTVShows(tvData.slice(0, 18));
//       setSports(sportsData.slice(0, 18));
//       setTVLive(tvLiveData.slice(0, 18));
      
//       if (trendingData.length === 0 && moviesData.length === 0 && tvData.length === 0) {
//         setError('No content available. Trying mock data...');
//       }
//     } catch (error) {
//       console.error('Failed to load data:', error);
//       setError('Error loading content. Please check your internet connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const heroItem = trending[0] || movies[0] || tvShows[0] || sports[0] || tvLive[0];

//   const Section = ({ 
//     title, 
//     items, 
//     viewAllPath,
//     icon: Icon
//   }: { 
//     title: string; 
//     items: MediaItem[]; 
//     viewAllPath?: string;
//     icon?: React.ComponentType<{size?: number}>;
//   }) => {
//     if (items.length === 0) return null;
    
//     return (
//       <div className="mb-12 px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             {Icon && <Icon className="text-brand-400" size={24} />}
//             <h2 className="text-2xl font-bold text-white">{title}</h2>
//           </div>
//           {viewAllPath && (
//             <button 
//               onClick={() => window.location.hash = viewAllPath}
//               className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
//             >
//               View All <ChevronRight size={16} />
//             </button>
//           )}
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           {items.map((item) => (
//             <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
//           ))}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-dark-bg pt-20 flex flex-col items-center justify-center p-4">
//         <Loader2 className="animate-spin text-brand-500 mb-4" size={48} />
//         <p className="text-gray-400 text-lg">Loading UniWatch...</p>
//         <p className="text-gray-500 text-sm mt-2">Fetching the latest content</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-dark-bg pt-20">
//       <SEO 
//         title="UniWatch - Watch Movies, TV, Sports & IPTV Free"
//         description="UniWatch is your ultimate destination for free streaming. Watch the latest movies, trending TV shows, live sports events, and thousands of IPTV channels."
//         keywords={['free movies', 'streaming', 'watch sports', 'iptv', 'tv shows', 'live tv']}
//       />
      
//       {error && (
//         <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg mx-4 mt-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span>⚠️</span>
//             <span>{error}</span>
//           </div>
//           <button 
//             onClick={loadData}
//             className="flex items-center gap-1 text-sm bg-yellow-700/30 hover:bg-yellow-700/50 px-3 py-1 rounded"
//           >
//             <RefreshCw size={14} /> Retry
//           </button>
//         </div>
//       )}
      
//       {/* Hero Section */}
//       <div className="relative overflow-hidden bg-gradient-to-br from-dark-bg via-brand-950 to-dark-bg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
//               Stream Everything in <span className="text-brand-400">One Place</span>
//             </h1>
//             <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
//               Unlimited access to movies, TV shows, live sports, and IPTV channels. 
//               No subscriptions, no credit card required.
//             </p>
//             <div className="flex flex-wrap gap-4 justify-center">
//               <button 
//                 onClick={() => window.location.hash = '#/movies'}
//                 className="group flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
//               >
//                 <Film size={18} />
//                 <span>Browse Movies</span>
//               </button>
//               <button 
//                 onClick={() => window.location.hash = '#/tv'}
//                 className="group flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
//               >
//                 <Tv size={18} />
//                 <span>TV Shows</span>
//               </button>
//               <button 
//                 onClick={() => window.location.hash = '#/sports'}
//                 className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
//               >
//                 <Zap size={18} />
//                 <span>Live Sports</span>
//               </button>
//               <button 
//                 onClick={() => window.location.hash = '#/iptv'}
//                 className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
//               >
//                 <Wifi size={19} />
//                 <span>Live TV</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="max-w-7xl mx-auto">
//         {trending.length > 0 && (
//           <Section 
//             title="Trending Now" 
//             items={trending} 
//             viewAllPath="#/trending"
//             icon={TrendingUp}
//           />
//         )}
        
//         {movies.length > 0 && (
//           <Section 
//             title="Popular Movies" 
//             items={movies} 
//             viewAllPath="#/movies"
//             icon={Film}
//           />
//         )}
        
//         {tvShows.length > 0 && (
//           <Section 
//             title="TV Shows" 
//             items={tvShows} 
//             viewAllPath="#/tv"
//             icon={Tv}
//           />
//         )}
        
//         {sports.length > 0 && (
//           <Section 
//             title="Live Sports" 
//             items={sports} 
//             viewAllPath="#/sports"
//             icon={Zap}
//           />
//         )}
        
//         {tvLive.length > 0 && (
//           <Section 
//             title="Live TV Channels" 
//             items={tvLive} 
//             viewAllPath="#/live"
//             icon={Wifi}
//           />
//         )}
        
//         {trending.length > 0 && (
//           <div className="bg-dark-surface rounded-2xl p-8 border border-dark-border mx-4 sm:mx-6 lg:mx-8 mb-12">
//             <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose UniWatch?</h2>
//             <div className="grid md:grid-cols-3 gap-8">
//               <div className="text-center">
//                 <div className="bg-brand-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <Film className="text-brand-400" size={24} />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">Free Streaming</h3>
//                 <p className="text-gray-400">Watch thousands of movies and TV shows completely free, no subscriptions required.</p>
//               </div>
//               <div className="text-center">
//                 <div className="bg-brand-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <Zap className="text-brand-400" size={24} />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">Live Sports</h3>
//                 <p className="text-gray-400">Never miss a match with live streaming of major sports events from around the world.</p>
//               </div>
//               <div className="text-center">
//                 <div className="bg-brand-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <Wifi className="text-brand-400" size={24} />
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">Live TV Channels</h3>
//                 <p className="text-gray-400">Access hundreds of live TV channels from various categories including news, sports, and entertainment.</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;





import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MediaCard from '../components/MediaCard';
import SEO from '../components/SEO';
import { ChevronRight, RefreshCw, TrendingUp, Film, Tv, Zap, Wifi, Loader2 } from 'lucide-react';
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
      const [trendingData, moviesData, tvData, sportsData, tvLiveData] = await Promise.all([
        fetchTrending('all'),
        fetchMovies(),
        fetchTVShows(),
        fetchSports(),
        fetchTVLive()
      ]);
      
      setTrending(trendingData.slice(0, 18));
      setMovies(moviesData.slice(0, 18));
      setTVShows(tvData.slice(0, 18));
      setSports(sportsData.slice(0, 18));
      setTVLive(tvLiveData.slice(0, 18));
      
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

  const heroItem = trending[0] || movies[0] || tvShows[0] || sports[0] || tvLive[0];

  const Section = ({ 
    title, 
    items, 
    viewAllPath,
    icon: Icon
  }: { 
    title: string; 
    items: MediaItem[]; 
    viewAllPath?: string;
    icon?: React.ComponentType<{size?: number}>;
  }) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="text-brand-400" size={24} />}
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          {viewAllPath && (
            <button 
              onClick={() => window.location.hash = viewAllPath}
              className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg pt-20 flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-brand-500 mb-4" size={48} />
        <p className="text-gray-400 text-lg">Loading UniWatch...</p>
        <p className="text-gray-500 text-sm mt-2">Fetching the latest content</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-20">
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
                onClick={() => window.location.hash = '#/movies'}
                className="group flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                <Film size={18} />
                <span>Browse Movies</span>
              </button>
              <button 
                onClick={() => window.location.hash = '#/tv'}
                className="group flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                <Tv size={18} />
                <span>TV Shows</span>
              </button>
              <button 
                onClick={() => window.location.hash = '#/sports'}
                className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                <Zap size={18} />
                <span>Live Sports</span>
              </button>
              <button 
                onClick={() => window.location.hash = '#/iptv'}
                className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                <Wifi size={19} />
                <span>Live TV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {trending.length > 0 && (
          <Section 
            title="Trending Now" 
            items={trending} 
            viewAllPath="#/trending"
            icon={TrendingUp}
          />
        )}
        
        {movies.length > 0 && (
          <Section 
            title="Popular Movies" 
            items={movies} 
            viewAllPath="#/movies"
            icon={Film}
          />
        )}
        
        {tvShows.length > 0 && (
          <Section 
            title="TV Shows" 
            items={tvShows} 
            viewAllPath="#/tv"
            icon={Tv}
          />
        )}
        
        {sports.length > 0 && (
          <div className="mb-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Zap className="text-brand-400" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Today's {(() => {
                      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const now = new Date();
                      const gmtDate = new Date(now.toUTCString() + ' GMT');
                      const dayName = days[gmtDate.getUTCDay()];
                      const date = gmtDate.getUTCDate();
                      const month = months[gmtDate.getUTCMonth()];
                      const year = gmtDate.getUTCFullYear();
                      const getOrdinal = (n: number) => {
                        if (n > 3 && n < 21) return 'th';
                        switch (n % 10) {
                          case 1: return "st";
                          case 2: return "nd";
                          case 3: return "rd";
                          default: return "th";
                        }
                      };
                      const hours = gmtDate.getUTCHours().toString().padStart(2, '0');
                      const minutes = gmtDate.getUTCMinutes().toString().padStart(2, '0');
                      return `${dayName} ${date}${getOrdinal(date)} ${month} ${year} - Schedule Time UK ${hours}:${minutes} GMT Live Sports Games`;
                    })()}
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => window.location.hash = '#/sports'}
                className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-brand-500" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sports.map((item) => (
                  <MediaCard key={`sports-${item.id}`} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {tvLive.length > 0 && (
          <Section 
            title="Live TV Channels" 
            items={tvLive} 
            viewAllPath="#/live"
            icon={Wifi}
          />
        )}
        
        {trending.length > 0 && (
          <div className="bg-dark-surface rounded-2xl p-8 border border-dark-border mx-4 sm:mx-6 lg:mx-8 mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose UniWatch?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-brand-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Film className="text-brand-400" size={24} />
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
                  <Wifi className="text-brand-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Live TV Channels</h3>
                <p className="text-gray-400">Access hundreds of live TV channels from various categories including news, sports, and entertainment.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;