// import React, { useState, useEffect } from 'react';
// import { HashRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Sports from './pages/Sports';
// import IPTV from './pages/IPTV';
// import AIChat from './pages/AIChat';
// import VideoPlayer from './components/VideoPlayer';
// import SEO from './components/SEO';
// import { fetchByGenre, fetchById } from './services/tmdb';
// import { MediaItem } from './types';
// import MediaCard from './components/MediaCard';
// import { ArrowLeft, Home as HomeIcon, Loader2, ChevronDown } from 'lucide-react';
// import SocialShare from './components/SocialShare';

// const WatchPage = () => {
//     const [params] = useSearchParams();
//     const navigate = useNavigate();
//     const id = params.get('id');
//     const type = params.get('type') as 'movie' | 'tv';
//     const [item, setItem] = useState<MediaItem | null>(null);
//     const [loading, setLoading] = useState(true);
    
//     useEffect(() => {
//         if (id && type) {
//             setLoading(true);
//             fetchById(id, type).then(data => {
//                 setItem(data);
//                 setLoading(false);
//             });
//         }
//     }, [id, type]);

//     if (!id || !type) return <Navigate to="/" />;

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-dark-bg flex items-center justify-center">
//                 <Loader2 className="animate-spin text-brand-500" size={48} />
//             </div>
//         );
//     }

//     const pageTitle = item ? `Watch ${item.title} Free Online | UniWatch` : 'Watch Online';
//     const pageDesc = item?.overview ? `${item.overview.substring(0, 160)}...` : `Watch ${item?.title || 'movies and shows'} in HD on UniWatch.`;
//     const pageImage = item?.backdrop_path || item?.poster_path;
//     const pageUrl = `#/watch?id=${id}&type=${type}`;

//     return (
//         <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-12">
//             <SEO 
//                 title={pageTitle}
//                 description={pageDesc}
//                 image={pageImage}
//                 type={type === 'movie' ? 'video.movie' : 'video.tv_show'}
//                 keywords={[item?.title || '', type, 'streaming', 'free movies']}
//                 videoUrl={window.location.href}
//                 videoReleaseDate={item?.release_date}
//             />
            
//             <div className="max-w-7xl mx-auto">
//                 {/* Navigation - Top */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                     <div className="flex flex-wrap gap-3">
//                         <button 
//                             onClick={() => navigate(-1)} 
//                             className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                         >
//                             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                             <span className="font-medium">Go Back</span>
//                         </button>
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                         >
//                             <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                             <span className="font-medium">Home</span>
//                         </button>
//                     </div>
                    
//                     {item && (
//                         <div className="flex items-center gap-4">
//                             <SocialShare
//                                 title={`Watch ${item.title}`}
//                                 description={pageDesc}
//                                 image={pageImage || ''}
//                                 url={pageUrl}
//                                 type={type}
//                             />
//                         </div>
//                     )}
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Video Player */}
//                     <div className="lg:col-span-3">
//                         <VideoPlayer 
//                             tmdbId={id} 
//                             type={type} 
//                             title={item ? item.title : `Loading ${type}...`} 
//                             customStreams={item?.streams}
//                         />
//                     </div>
                    
//                     {/* Content Info */}
//                     {item && (
//                         <div className="lg:col-span-3 bg-dark-surface p-6 rounded-xl border border-dark-border shadow-lg">
//                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
//                                 <div>
//                                     <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{item.title}</h1>
//                                     <div className="flex flex-wrap gap-2">
//                                         {item.vote_average > 0 && (
//                                             <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold">
//                                                 ⭐ {item.vote_average.toFixed(1)} Rating
//                                             </span>
//                                         )}
//                                         <span className="px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-gray-300">
//                                             📅 {item.release_date || item.first_air_date || 'N/A'}
//                                         </span>
//                                         <span className="px-3 py-1.5 bg-brand-900/30 border border-brand-500/30 text-brand-300 rounded-lg text-sm font-bold uppercase">
//                                             {type === 'movie' ? '🎬 Movie' : '📺 TV Series'}
//                                         </span>
//                                         {item.duration && (
//                                             <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
//                                                 ⏱️ {item.duration}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex items-center gap-3">
//                                     <SocialShare
//                                         title={`Watch ${item.title}`}
//                                         description={item.overview || ''}
//                                         image={item.poster_path}
//                                         url={pageUrl}
//                                         type={type}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                                 <div className="lg:col-span-2">
//                                     <h3 className="text-xl font-bold text-white mb-4">Synopsis</h3>
//                                     <p className="text-gray-300 leading-relaxed text-lg">
//                                         {item.overview || "No description available for this title."}
//                                     </p>
                                    
//                                     {item.genres && item.genres.length > 0 && (
//                                         <div className="mt-8">
//                                             <h4 className="text-white font-bold mb-3">Genres</h4>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {item.genres.map((genre, index) => (
//                                                     <span key={index} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-brand-500/20 hover:border-brand-500/30 hover:text-brand-300 transition-colors cursor-pointer">
//                                                         {genre}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
                                
//                                 <div className="bg-dark-bg p-5 rounded-xl border border-dark-border">
//                                     <h4 className="text-white font-bold mb-4">Quick Info</h4>
//                                     <div className="space-y-4">
//                                         <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                             <span className="text-gray-400">Type</span>
//                                             <span className="text-white font-medium">{type === 'movie' ? 'Movie' : 'TV Show'}</span>
//                                         </div>
//                                         {item.duration && (
//                                             <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                                 <span className="text-gray-400">Duration</span>
//                                                 <span className="text-white font-medium">{item.duration}</span>
//                                             </div>
//                                         )}
//                                         {item.release_date && (
//                                             <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                                 <span className="text-gray-400">Release Date</span>
//                                                 <span className="text-white font-medium">{item.release_date}</span>
//                                             </div>
//                                         )}
//                                         {item.vote_average > 0 && (
//                                             <div className="flex justify-between items-center py-3">
//                                                 <span className="text-gray-400">Rating</span>
//                                                 <span className="text-green-400 font-bold">{item.vote_average.toFixed(1)}/10</span>
//                                             </div>
//                                         )}
//                                     </div>
                                    
//                                     <div className="mt-6 pt-5 border-t border-dark-border">
//                                         <h4 className="text-white font-bold mb-4">Share This</h4>
//                                         <p className="text-gray-400 text-sm mb-4">
//                                             Share this {type} with friends and family
//                                         </p>
//                                         <SocialShare
//                                             title={`Watch ${item.title}`}
//                                             description={item.overview || ''}
//                                             image={item.poster_path}
//                                             url={pageUrl}
//                                             type={type}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Navigation - Bottom */}
//                 <div className="mt-12 pt-8 border-t border-dark-border">
//                     <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//                         <button 
//                             onClick={() => navigate(-1)} 
//                             className="group flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/5 border border-dark-border w-full sm:w-auto"
//                         >
//                             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                             <span className="font-medium">Go Back</span>
//                         </button>
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="group flex items-center justify-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-colors px-5 py-3 rounded-xl border border-brand-600 w-full sm:w-auto"
//                         >
//                             <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                             <span className="font-medium">Back to Home</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const ListingPage = ({ title, type }: { title: string, type: 'movie' | 'tv' }) => {
//     const [allItems, setAllItems] = useState<MediaItem[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [loadingMore, setLoadingMore] = useState(false);
//     const [displayCount, setDisplayCount] = useState(18);
//     const navigate = useNavigate();

//     useEffect(() => {
//         setLoading(true);
//         fetchByGenre(type).then(data => {
//             setAllItems(data);
//             setLoading(false);
//         });
//     }, [type]);

//     const loadMore = () => {
//         setLoadingMore(true);
//         // Simulate loading delay
//         setTimeout(() => {
//             setDisplayCount(prev => prev + 18);
//             setLoadingMore(false);
//         }, 500);
//     };

//     const displayedItems = allItems.slice(0, displayCount);
//     const hasMoreItems = displayCount < allItems.length;

//     const pageTitle = `${title} - Free Streaming | UniWatch`;
//     const pageDesc = `Browse our collection of ${title.toLowerCase()}. Watch free in HD quality on UniWatch.`;
//     const pageImage = allItems[0]?.poster_path;

//     return (
//         <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-12">
//             <SEO 
//                 title={pageTitle}
//                 description={pageDesc}
//                 image={pageImage}
//                 type="website"
//                 keywords={[title.toLowerCase(), 'streaming', 'free movies', 'tv shows']}
//             />
            
//             <div className="max-w-7xl mx-auto">
//                 {/* Navigation - Top */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div className="flex items-center gap-4">
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="p-3 rounded-xl bg-dark-surface text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-dark-border"
//                         >
//                             <HomeIcon size={24} />
//                         </button>
//                         <div>
//                             <h1 className="text-3xl font-bold text-white">{title}</h1>
//                             <p className="text-gray-400 text-sm mt-1">
//                                 {allItems.length} titles available • HD Streaming
//                             </p>
//                         </div>
//                     </div>
                    
//                     <button 
//                         onClick={() => navigate(-1)} 
//                         className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                     >
//                         <ArrowLeft size={20} />
//                         <span className="font-medium">Go Back</span>
//                     </button>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <Loader2 className="animate-spin text-brand-500" size={40} />
//                     </div>
//                 ) : (
//                     <>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
//                             {displayedItems.map((item) => (
//                                 <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
//                             ))}
//                         </div>
                        
//                         {/* Load More Button */}
//                         {hasMoreItems && (
//                             <div className="flex justify-center mt-10 mb-8">
//                                 <button
//                                     onClick={loadMore}
//                                     disabled={loadingMore}
//                                     className="flex items-center gap-3 px-8 py-4 bg-dark-surface hover:bg-dark-border text-white rounded-xl font-medium transition-all border border-dark-border hover:border-brand-500 disabled:opacity-50 min-w-[180px] justify-center"
//                                 >
//                                     {loadingMore ? (
//                                         <>
//                                             <Loader2 className="animate-spin" size={20} />
//                                             Loading...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Load More
//                                             <ChevronDown size={20} />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         )}
                        
//                         {/* Show loaded count */}
//                         <div className="text-center text-gray-400 text-sm mb-4">
//                             Showing {displayedItems.length} of {allItems.length} titles
//                         </div>
                        
//                         {/* Navigation - Bottom */}
//                         <div className="mt-8 pt-8 border-t border-dark-border">
//                             <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//                                 <button 
//                                     onClick={() => navigate(-1)} 
//                                     className="group flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/5 border border-dark-border w-full sm:w-auto"
//                                 >
//                                     <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                                     <span className="font-medium">Go Back</span>
//                                 </button>
//                                 <button 
//                                     onClick={() => navigate('/')} 
//                                     className="group flex items-center justify-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-colors px-5 py-3 rounded-xl border border-brand-600 w-full sm:w-auto"
//                                 >
//                                     <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                                     <span className="font-medium">Back to Home</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// const App: React.FC = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     <HashRouter>
//       <div className="min-h-screen bg-dark-bg text-white font-sans">
//         <Navbar 
//             isAuthenticated={isAuthenticated} 
//             onAuthToggle={() => setIsAuthenticated(!isAuthenticated)} 
//         />
        
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/movies" element={<ListingPage title="Movies" type="movie" />} />
//           <Route path="/tv" element={<ListingPage title="TV Shows" type="tv" />} />
//           <Route path="/sports" element={<Sports />} />
//           <Route path="/iptv" element={<IPTV />} />
//           <Route path="/watch" element={<WatchPage />} />
//           <Route path="/ai-chat" element={<AIChat />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </HashRouter>
//   );
// };

// export default App;


















































































// import React, { useState, useEffect } from 'react';
// import { HashRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Sports from './pages/Sports';
// import IPTV from './pages/IPTV';
// import AIChat from './pages/AIChat';
// import VideoPlayer from './components/VideoPlayer';
// import SEO from './components/SEO';
// import { fetchByGenre, fetchById } from './services/tmdb';
// import { MediaItem } from './types';
// import MediaCard from './components/MediaCard';
// import { ArrowLeft, Home as HomeIcon, Loader2, ChevronDown } from 'lucide-react';
// import SocialShare from './components/SocialShare';

// const WatchPage = () => {
//     const [params] = useSearchParams();
//     const navigate = useNavigate();
//     const id = params.get('id');
//     const type = params.get('type') as 'movie' | 'tv';
//     const [item, setItem] = useState<MediaItem | null>(null);
//     const [loading, setLoading] = useState(true);
    
//     useEffect(() => {
//         if (id && type) {
//             setLoading(true);
//             fetchById(id, type).then(data => {
//                 setItem(data);
//                 setLoading(false);
//             });
//         }
//     }, [id, type]);

//     if (!id || !type) return <Navigate to="/" />;

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-dark-bg flex items-center justify-center">
//                 <Loader2 className="animate-spin text-brand-500" size={48} />
//             </div>
//         );
//     }

//     const pageTitle = item ? `Watch ${item.title} Free Online | UniWatch` : 'Watch Online';
//     const pageDesc = item?.overview ? `${item.overview.substring(0, 160)}...` : `Watch ${item?.title || 'movies and shows'} in HD on UniWatch.`;
//     const pageImage = item?.backdrop_path || item?.poster_path;
//     const pageUrl = `#/watch?id=${id}&type=${type}`;
    
//     // Check if the item is sports content
//     const isSportsContent = type !== 'movie' && (
//         item?.title?.toLowerCase().includes('sport') || 
//         item?.title?.toLowerCase().includes('game') ||
//         (item?.genres && item.genres.some(g => g.toLowerCase().includes('sport')))
//     );

//     return (
//         <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-12">
//             <SEO 
//                 title={pageTitle}
//                 description={pageDesc}
//                 image={pageImage}
//                 type={type === 'movie' ? 'video.movie' : 'video.tv_show'}
//                 keywords={[item?.title || '', type, 'streaming', 'free movies']}
//                 videoUrl={window.location.href}
//                 videoReleaseDate={item?.release_date}
//             />
            
//             <div className="max-w-7xl mx-auto">
//                 {/* Navigation - Top */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                     <div className="flex flex-wrap gap-3">
//                         <button 
//                             onClick={() => navigate(-1)} 
//                             className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                         >
//                             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                             <span className="font-medium">Go Back</span>
//                         </button>
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                         >
//                             <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                             <span className="font-medium">Home</span>
//                         </button>
//                     </div>
                    
//                     {item && (
//                         <div className="flex items-center gap-4">
//                             <SocialShare
//                                 title={`Watch ${item.title}`}
//                                 description={pageDesc}
//                                 image={pageImage || ''}
//                                 url={pageUrl}
//                                 type={type}
//                             />
//                         </div>
//                     )}
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Video Player */}
//                     <div className="lg:col-span-3">
//                         <VideoPlayer 
//                             tmdbId={id} 
//                             type={type} 
//                             title={item ? item.title : `Loading ${type}...`} 
//                             customStreams={item?.streams}
//                         />
//                     </div>
                    
//                     {/* Content Info */}
//                     {item && (
//                         <div className="lg:col-span-3 bg-dark-surface p-6 rounded-xl border border-dark-border shadow-lg">
//                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
//                                 <div>
//                                     <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{item.title}</h1>
//                                     <div className="flex flex-wrap gap-2">
//                                         {item.vote_average > 0 && (
//                                             <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold">
//                                                 ⭐ {item.vote_average.toFixed(1)} Rating
//                                             </span>
//                                         )}
//                                         <span className="px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-gray-300">
//                                             📅 {item.release_date || item.first_air_date || 'N/A'}
//                                         </span>
//                                         <span className="px-3 py-1.5 bg-brand-900/30 border border-brand-500/30 text-brand-300 rounded-lg text-sm font-bold uppercase">
//                                             {type === 'movie' ? '🎬 Movie' : '📺 TV Series'}
//                                         </span>
//                                         {item.duration && (
//                                             <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
//                                                 ⏱️ {item.duration}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex items-center gap-3">
//                                     <SocialShare
//                                         title={`Watch ${item.title}`}
//                                         description={item.overview || ''}
//                                         image={item.poster_path}
//                                         url={pageUrl}
//                                         type={type}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                                 <div className="lg:col-span-2">
//                                     <h3 className="text-xl font-bold text-white mb-4">
//                                         {isSportsContent ? 'Match Details' : 'Synopsis'}
//                                     </h3>
//                                     <p className="text-gray-300 leading-relaxed text-lg">
//                                         {item.overview || `No ${isSportsContent ? 'match details' : 'description'} available for this ${isSportsContent ? 'game' : 'title'}.`}
//                                     </p>
                                    
//                                     {item.genres && item.genres.length > 0 && (
//                                         <div className="mt-8">
//                                             <h4 className="text-white font-bold mb-3">
//                                                 {isSportsContent ? 'Game Categories' : 'Genres'}
//                                             </h4>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {item.genres.map((genre, index) => (
//                                                     <span key={index} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-brand-500/20 hover:border-brand-500/30 hover:text-brand-300 transition-colors cursor-pointer">
//                                                         {genre}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
                                
//                                 <div className="bg-dark-bg p-5 rounded-xl border border-dark-border">
//                                     <h4 className="text-white font-bold mb-4">Quick Info</h4>
//                                     <div className="space-y-4">
//                                         <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                             <span className="text-gray-400">Type</span>
//                                             <span className="text-white font-medium">
//                                                 {type === 'movie' ? 'Movie' : 
//                                                  isSportsContent ? 
//                                                  'Live Game' : 'TV Show'}
//                                             </span>
//                                         </div>
//                                         {item.duration && (
//                                             <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                                 <span className="text-gray-400">Duration</span>
//                                                 <span className="text-white font-medium">{item.duration}</span>
//                                             </div>
//                                         )}
//                                         {item.release_date && (
//                                             <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                                 <span className="text-gray-400">Release Date</span>
//                                                 <span className="text-white font-medium">{item.release_date}</span>
//                                             </div>
//                                         )}
//                                         {item.vote_average > 0 && (
//                                             <div className="flex justify-between items-center py-3">
//                                                 <span className="text-gray-400">Rating</span>
//                                                 <span className="text-green-400 font-bold">{item.vote_average.toFixed(1)}/10</span>
//                                             </div>
//                                         )}
//                                     </div>
                                    
//                                     <div className="mt-6 pt-5 border-t border-dark-border">
//                                         <h4 className="text-white font-bold mb-4">Share This</h4>
//                                         <p className="text-gray-400 text-sm mb-4">
//                                             Share this {isSportsContent ? 'game' : type} with friends and family
//                                         </p>
//                                         <SocialShare
//                                             title={`Watch ${item.title}`}
//                                             description={item.overview || ''}
//                                             image={item.poster_path}
//                                             url={pageUrl}
//                                             type={type}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Navigation - Bottom */}
//                 <div className="mt-12 pt-8 border-t border-dark-border">
//                     <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//                         <button 
//                             onClick={() => navigate(-1)} 
//                             className="group flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/5 border border-dark-border w-full sm:w-auto"
//                         >
//                             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                             <span className="font-medium">Go Back</span>
//                         </button>
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="group flex items-center justify-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-colors px-5 py-3 rounded-xl border border-brand-600 w-full sm:w-auto"
//                         >
//                             <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                             <span className="font-medium">Back to Home</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const ListingPage = ({ title, type }: { title: string, type: 'movie' | 'tv' }) => {
//     const [allItems, setAllItems] = useState<MediaItem[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [loadingMore, setLoadingMore] = useState(false);
//     const [displayCount, setDisplayCount] = useState(18);
//     const navigate = useNavigate();

//     useEffect(() => {
//         setLoading(true);
//         fetchByGenre(type).then(data => {
//             setAllItems(data);
//             setLoading(false);
//         });
//     }, [type]);

//     const loadMore = () => {
//         setLoadingMore(true);
//         // Simulate loading delay
//         setTimeout(() => {
//             setDisplayCount(prev => prev + 18);
//             setLoadingMore(false);
//         }, 500);
//     };

//     const displayedItems = allItems.slice(0, displayCount);
//     const hasMoreItems = displayCount < allItems.length;

//     const pageTitle = `${title} - Free Streaming | UniWatch`;
//     const pageDesc = `Browse our collection of ${title.toLowerCase()}. Watch free in HD quality on UniWatch.`;
//     const pageImage = allItems[0]?.poster_path;

//     return (
//         <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-12">
//             <SEO 
//                 title={pageTitle}
//                 description={pageDesc}
//                 image={pageImage}
//                 type="website"
//                 keywords={[title.toLowerCase(), 'streaming', 'free movies', 'tv shows']}
//             />
            
//             <div className="max-w-7xl mx-auto">
//                 {/* Navigation - Top */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div className="flex items-center gap-4">
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="p-3 rounded-xl bg-dark-surface text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-dark-border"
//                         >
//                             <HomeIcon size={24} />
//                         </button>
//                         <div>
//                             <h1 className="text-3xl font-bold text-white">{title}</h1>
//                             <p className="text-gray-400 text-sm mt-1">
//                                 {allItems.length} titles available • HD Streaming
//                             </p>
//                         </div>
//                     </div>
                    
//                     <button 
//                         onClick={() => navigate(-1)} 
//                         className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                     >
//                         <ArrowLeft size={20} />
//                         <span className="font-medium">Go Back</span>
//                     </button>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <Loader2 className="animate-spin text-brand-500" size={40} />
//                     </div>
//                 ) : (
//                     <>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
//                             {displayedItems.map((item) => (
//                                 <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
//                             ))}
//                         </div>
                        
//                         {/* Load More Button */}
//                         {hasMoreItems && (
//                             <div className="flex justify-center mt-10 mb-8">
//                                 <button
//                                     onClick={loadMore}
//                                     disabled={loadingMore}
//                                     className="flex items-center gap-3 px-8 py-4 bg-dark-surface hover:bg-dark-border text-white rounded-xl font-medium transition-all border border-dark-border hover:border-brand-500 disabled:opacity-50 min-w-[180px] justify-center"
//                                 >
//                                     {loadingMore ? (
//                                         <>
//                                             <Loader2 className="animate-spin" size={20} />
//                                             Loading...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Load More
//                                             <ChevronDown size={20} />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         )}
                        
//                         {/* Show loaded count */}
//                         <div className="text-center text-gray-400 text-sm mb-4">
//                             Showing {displayedItems.length} of {allItems.length} titles
//                         </div>
                        
//                         {/* Navigation - Bottom */}
//                         <div className="mt-8 pt-8 border-t border-dark-border">
//                             <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//                                 <button 
//                                     onClick={() => navigate(-1)} 
//                                     className="group flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/5 border border-dark-border w-full sm:w-auto"
//                                 >
//                                     <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                                     <span className="font-medium">Go Back</span>
//                                 </button>
//                                 <button 
//                                     onClick={() => navigate('/')} 
//                                     className="group flex items-center justify-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-colors px-5 py-3 rounded-xl border border-brand-600 w-full sm:w-auto"
//                                 >
//                                     <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                                     <span className="font-medium">Back to Home</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// const App: React.FC = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     <HashRouter>
//       <div className="min-h-screen bg-dark-bg text-white font-sans">
//         <Navbar 
//             isAuthenticated={isAuthenticated} 
//             onAuthToggle={() => setIsAuthenticated(!isAuthenticated)} 
//         />
        
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/movies" element={<ListingPage title="Movies" type="movie" />} />
//           <Route path="/tv" element={<ListingPage title="TV Shows" type="tv" />} />
//           <Route path="/sports" element={<Sports />} />
//           <Route path="/iptv" element={<IPTV />} />
//           <Route path="/watch" element={<WatchPage />} />
//           <Route path="/ai-chat" element={<AIChat />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </HashRouter>
//   );
// };

// export default App;


















































































// import React, { useState, useEffect } from 'react';
// import { HashRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Sports from './pages/Sports';
// import IPTV from './pages/IPTV';
// import AIChat from './pages/AIChat';
// import VideoPlayer from './components/VideoPlayer';
// import SEO from './components/SEO';
// import { fetchByGenre, fetchById } from './services/tmdb';
// import { MediaItem } from './types';
// import MediaCard from './components/MediaCard';
// import { ArrowLeft, Home as HomeIcon, Loader2, ChevronDown } from 'lucide-react';
// import SocialShare from './components/SocialShare';

// const WatchPage = () => {
//     const [params] = useSearchParams();
//     const navigate = useNavigate();
//     const id = params.get('id');
//     const type = params.get('type') as 'movie' | 'tv';
//     const [item, setItem] = useState<MediaItem | null>(null);
//     const [loading, setLoading] = useState(true);
    
//     useEffect(() => {
//         if (id && type) {
//             setLoading(true);
//             fetchById(id, type).then(data => {
//                 setItem(data);
//                 setLoading(false);
//             });
//         }
//     }, [id, type]);

//     if (!id || !type) return <Navigate to="/" />;

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-dark-bg flex items-center justify-center">
//                 <Loader2 className="animate-spin text-brand-500" size={48} />
//             </div>
//         );
//     }

//     const pageTitle = item ? `Watch ${item.title} Free Online | UniWatch` : 'Watch Online';
//     const pageDesc = item?.overview ? `${item.overview.substring(0, 160)}...` : `Watch ${item?.title || 'movies and shows'} in HD on UniWatch.`;
//     const pageImage = item?.backdrop_path || item?.poster_path;
//     const pageUrl = `#/watch?id=${id}&type=${type}`;
    
//     // Check if the item is sports content
//     const isSportsContent = type !== 'movie' && (
//         item?.title?.toLowerCase().includes('sport') || 
//         item?.title?.toLowerCase().includes('game') ||
//         (item?.genres && item.genres.some(g => g.toLowerCase().includes('sport')))
//     );

//     return (
//         <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-12">
//             <SEO 
//                 title={pageTitle}
//                 description={pageDesc}
//                 image={pageImage}
//                 type={type === 'movie' ? 'video.movie' : 'video.tv_show'}
//                 keywords={[item?.title || '', type, 'streaming', 'free movies']}
//                 videoUrl={window.location.href}
//                 videoReleaseDate={item?.release_date}
//             />
            
//             <div className="max-w-7xl mx-auto">
//                 {/* Navigation - Top */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                     <div className="flex flex-wrap gap-3">
//                         <button 
//                             onClick={() => navigate(-1)} 
//                             className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                         >
//                             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                             <span className="font-medium">Go Back</span>
//                         </button>
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                         >
//                             <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                             <span className="font-medium">Home</span>
//                         </button>
//                     </div>
                    
//                     {item && (
//                         <div className="flex items-center gap-4">
//                             <SocialShare
//                                 title={`Watch ${item.title}`}
//                                 description={pageDesc}
//                                 image={pageImage || ''}
//                                 url={pageUrl}
//                                 type={type}
//                             />
//                         </div>
//                     )}
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Video Player */}
//                     <div className="lg:col-span-3">
//                         <VideoPlayer 
//                             tmdbId={id} 
//                             type={type} 
//                             title={item ? item.title : `Loading ${type}...`} 
//                             customStreams={item?.streams}
//                         />
//                     </div>
                    
//                     {/* Content Info */}
//                     {item && (
//                         <div className="lg:col-span-3 bg-dark-surface p-6 rounded-xl border border-dark-border shadow-lg">
//                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
//                                 <div>
//                                     <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{item.title}</h1>
//                                     <div className="flex flex-wrap gap-2">
//                                         {item.vote_average > 0 && (
//                                             <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold">
//                                                 ⭐ {item.vote_average.toFixed(1)} Rating
//                                             </span>
//                                         )}
//                                         <span className="px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-gray-300">
//                                             📅 {item.release_date || item.first_air_date || 'N/A'}
//                                         </span>
//                                         <span className="px-3 py-1.5 bg-brand-900/30 border border-brand-500/30 text-brand-300 rounded-lg text-sm font-bold uppercase">
//                                             {isSportsContent ? '🏈 Live Game' : (type === 'movie' ? '🎬 Movie' : '📺 TV Series')}
//                                         </span>
//                                         {isSportsContent ? (
//                                             <span className="px-3 py-1.5 bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg text-sm font-bold">
//                                                 🔴 Live
//                                             </span>
//                                         ) : item.duration && (
//                                             <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
//                                                 ⏱️ {item.duration}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex items-center gap-3">
//                                     <SocialShare
//                                         title={`Watch ${item.title}`}
//                                         description={item.overview || ''}
//                                         image={item.poster_path}
//                                         url={pageUrl}
//                                         type={type}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                                 <div className="lg:col-span-2">
//                                     <h3 className="text-xl font-bold text-white mb-4">
//                                         {isSportsContent ? 'Match Details' : 'Synopsis'}
//                                     </h3>
//                                     <p className="text-gray-300 leading-relaxed text-lg">
//                                         {item.overview || `No ${isSportsContent ? 'match details' : 'description'} available for this ${isSportsContent ? 'game' : 'title'}.`}
//                                     </p>
                                    
//                                     {item.genres && item.genres.length > 0 && (
//                                         <div className="mt-8">
//                                             <h4 className="text-white font-bold mb-3">
//                                                 {isSportsContent ? 'Game Categories' : 'Genres'}
//                                             </h4>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {item.genres.map((genre, index) => (
//                                                     <span key={index} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-brand-500/20 hover:border-brand-500/30 hover:text-brand-300 transition-colors cursor-pointer">
//                                                         {genre}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
                                
//                                 <div className="bg-dark-bg p-5 rounded-xl border border-dark-border">
//                                     <h4 className="text-white font-bold mb-4">Quick Info</h4>
//                                     <div className="space-y-4">
//                                         <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                             <span className="text-gray-400">Type</span>
//                                             <span className="text-white font-medium">
//                                                 {type === 'movie' ? 'Movie' : 
//                                                  isSportsContent ? 
//                                                  'Live Game' : 'TV Show'}
//                                             </span>
//                                         </div>
//                                         {item.duration && (
//                                             <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                                 <span className="text-gray-400">Duration</span>
//                                                 <span className="text-white font-medium">{item.duration}</span>
//                                             </div>
//                                         )}
//                                         {item.release_date && (
//                                             <div className="flex justify-between items-center py-3 border-b border-gray-800">
//                                                 <span className="text-gray-400">Release Date</span>
//                                                 <span className="text-white font-medium">{item.release_date}</span>
//                                             </div>
//                                         )}
//                                         {item.vote_average > 0 && (
//                                             <div className="flex justify-between items-center py-3">
//                                                 <span className="text-gray-400">Rating</span>
//                                                 <span className="text-green-400 font-bold">{item.vote_average.toFixed(1)}/10</span>
//                                             </div>
//                                         )}
//                                     </div>
                                    
//                                     <div className="mt-6 pt-5 border-t border-dark-border">
//                                         <h4 className="text-white font-bold mb-4">Share This</h4>
//                                         <p className="text-gray-400 text-sm mb-4">
//                                             Share this {isSportsContent ? 'game' : type} with friends and family
//                                         </p>
//                                         <SocialShare
//                                             title={`Watch ${item.title}`}
//                                             description={item.overview || ''}
//                                             image={item.poster_path}
//                                             url={pageUrl}
//                                             type={type}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Navigation - Bottom */}
//                 <div className="mt-12 pt-8 border-t border-dark-border">
//                     <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//                         <button 
//                             onClick={() => navigate(-1)} 
//                             className="group flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/5 border border-dark-border w-full sm:w-auto"
//                         >
//                             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                             <span className="font-medium">Go Back</span>
//                         </button>
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="group flex items-center justify-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-colors px-5 py-3 rounded-xl border border-brand-600 w-full sm:w-auto"
//                         >
//                             <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                             <span className="font-medium">Back to Home</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const ListingPage = ({ title, type }: { title: string, type: 'movie' | 'tv' }) => {
//     const [allItems, setAllItems] = useState<MediaItem[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [loadingMore, setLoadingMore] = useState(false);
//     const [displayCount, setDisplayCount] = useState(18);
//     const navigate = useNavigate();

//     useEffect(() => {
//         setLoading(true);
//         fetchByGenre(type).then(data => {
//             setAllItems(data);
//             setLoading(false);
//         });
//     }, [type]);

//     const loadMore = () => {
//         setLoadingMore(true);
//         // Simulate loading delay
//         setTimeout(() => {
//             setDisplayCount(prev => prev + 18);
//             setLoadingMore(false);
//         }, 500);
//     };

//     const displayedItems = allItems.slice(0, displayCount);
//     const hasMoreItems = displayCount < allItems.length;

//     const pageTitle = `${title} - Free Streaming | UniWatch`;
//     const pageDesc = `Browse our collection of ${title.toLowerCase()}. Watch free in HD quality on UniWatch.`;
//     const pageImage = allItems[0]?.poster_path;

//     return (
//         <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-12">
//             <SEO 
//                 title={pageTitle}
//                 description={pageDesc}
//                 image={pageImage}
//                 type="website"
//                 keywords={[title.toLowerCase(), 'streaming', 'free movies', 'tv shows']}
//             />
            
//             <div className="max-w-7xl mx-auto">
//                 {/* Navigation - Top */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div className="flex items-center gap-4">
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="p-3 rounded-xl bg-dark-surface text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-dark-border"
//                         >
//                             <HomeIcon size={24} />
//                         </button>
//                         <div>
//                             <h1 className="text-3xl font-bold text-white">{title}</h1>
//                             <p className="text-gray-400 text-sm mt-1">
//                                 {allItems.length} titles available • HD Streaming
//                             </p>
//                         </div>
//                     </div>
                    
//                     <button 
//                         onClick={() => navigate(-1)} 
//                         className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
//                     >
//                         <ArrowLeft size={20} />
//                         <span className="font-medium">Go Back</span>
//                     </button>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <Loader2 className="animate-spin text-brand-500" size={40} />
//                     </div>
//                 ) : (
//                     <>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
//                             {displayedItems.map((item) => (
//                                 <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
//                             ))}
//                         </div>
                        
//                         {/* Load More Button */}
//                         {hasMoreItems && (
//                             <div className="flex justify-center mt-10 mb-8">
//                                 <button
//                                     onClick={loadMore}
//                                     disabled={loadingMore}
//                                     className="flex items-center gap-3 px-8 py-4 bg-dark-surface hover:bg-dark-border text-white rounded-xl font-medium transition-all border border-dark-border hover:border-brand-500 disabled:opacity-50 min-w-[180px] justify-center"
//                                 >
//                                     {loadingMore ? (
//                                         <>
//                                             <Loader2 className="animate-spin" size={20} />
//                                             Loading...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Load More
//                                             <ChevronDown size={20} />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         )}
                        
//                         {/* Show loaded count */}
//                         <div className="text-center text-gray-400 text-sm mb-4">
//                             Showing {displayedItems.length} of {allItems.length} titles
//                         </div>
                        
//                         {/* Navigation - Bottom */}
//                         <div className="mt-8 pt-8 border-t border-dark-border">
//                             <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//                                 <button 
//                                     onClick={() => navigate(-1)} 
//                                     className="group flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/5 border border-dark-border w-full sm:w-auto"
//                                 >
//                                     <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//                                     <span className="font-medium">Go Back</span>
//                                 </button>
//                                 <button 
//                                     onClick={() => navigate('/')} 
//                                     className="group flex items-center justify-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-colors px-5 py-3 rounded-xl border border-brand-600 w-full sm:w-auto"
//                                 >
//                                     <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
//                                     <span className="font-medium">Back to Home</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// const App: React.FC = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     <HashRouter>
//       <div className="min-h-screen bg-dark-bg text-white font-sans">
//         <Navbar 
//             isAuthenticated={isAuthenticated} 
//             onAuthToggle={() => setIsAuthenticated(!isAuthenticated)} 
//         />
        
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/movies" element={<ListingPage title="Movies" type="movie" />} />
//           <Route path="/tv" element={<ListingPage title="TV Shows" type="tv" />} />
//           <Route path="/sports" element={<Sports />} />
//           <Route path="/iptv" element={<IPTV />} />
//           <Route path="/watch" element={<WatchPage />} />
//           <Route path="/ai-chat" element={<AIChat />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </HashRouter>
//   );
// };

// export default App;






















import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Sports from './pages/Sports';
import IPTV from './pages/IPTV';
import AIChat from './pages/AIChat';
import VideoPlayer from './components/VideoPlayer';
import SEO from './components/SEO';
import { fetchByGenre, fetchById, UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE } from './services/tmdb';
import { MediaItem } from './types';
import MediaCard from './components/MediaCard';
import { ArrowLeft, Home as HomeIcon, Loader2, ChevronDown } from 'lucide-react';
import SocialShare from './components/SocialShare';

const WatchPage = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const id = params.get('id');
    const type = params.get('type') as 'movie' | 'tv' | 'sports' | 'tv_live';
    const season = params.get('season') ? parseInt(params.get('season')!) : 1;
    const episode = params.get('episode') ? parseInt(params.get('episode')!) : 1;
    const [item, setItem] = useState<MediaItem | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (id && type) {
            setLoading(true);
            
            // Get item from correct source based on type
            let foundItem: MediaItem | null = null;
            
            if (type === 'movie') {
                foundItem = UNIQUE_MOVIES.find(m => m.id === id) as MediaItem || null;
            } else if (type === 'tv') {
                foundItem = UNIQUE_TV_SHOWS.find(tv => tv.id === id) as MediaItem || null;
            } else if (type === 'sports') {
                foundItem = UNIQUE_SPORTS.find(s => s.id === id) as MediaItem || null;
            } else if (type === 'tv_live') {
                foundItem = UNIQUE_TV_LIVE.find(tv => tv.id === id) as MediaItem || null;
            }
            
            if (foundItem) {
                setItem(foundItem);
                setLoading(false);
            } else {
                // Fallback to API for movies/tv
                if (type === 'movie' || type === 'tv') {
                    fetchById(id, type).then(data => {
                        setItem(data);
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            }
        }
    }, [id, type, season, episode]);

    if (!id || !type) return <Navigate to="/" />;

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-500" size={48} />
            </div>
        );
    }

    // Get absolute image URL - handles both absolute and relative paths
    const getAbsoluteImageUrl = (path: string | undefined | null) => {
        if (!path || path === 'null' || path === 'undefined') {
            return 'https://uniwatchfree.vercel.app/og-image.jpg';
        }
        
        // If already full URL, return it
        if (path.startsWith('http')) return path;
        
        // If it starts with '/images/', it's a relative path from public folder
        if (path.startsWith('/images/')) {
            return window.location.origin + path;
        }
        
        // If it's a TMDB path without base URL, add it
        if (path.startsWith('/')) {
            return `https://image.tmdb.org/t/p/w500${path}`;
        }
        
        // If it's just a filename, assume it's from TMDB
        return `https://image.tmdb.org/t/p/w500/${path}`;
    };

    // Get the best available image with proper fallback
    const getBestImage = () => {
        if (!item) {
            return 'https://uniwatchfree.vercel.app/og-image.jpg';
        }
        
        // Check what image types are available
        const hasBackdrop = item.backdrop_path && item.backdrop_path !== 'null' && item.backdrop_path !== '';
        const hasPoster = item.poster_path && item.poster_path !== 'null' && item.poster_path !== '';
        
        // Priority: backdrop → poster → fallback based on type
        if (hasBackdrop) {
            return getAbsoluteImageUrl(item.backdrop_path);
        }
        if (hasPoster) {
            return getAbsoluteImageUrl(item.poster_path);
        }
        
        // Type-specific fallback images - ACTUAL IMAGES, NO PLACEHOLDERS
        if (type === 'movie') {
            return 'https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=500&h=750&fit=crop&q=80';
        } else if (type === 'tv') {
            return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&h=750&fit=crop&q=80';
        } else if (type === 'sports') {
            return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=750&fit=crop&q=80';
        } else if (type === 'tv_live') {
            return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=750&fit=crop&q=80';
        }
        
        return 'https://uniwatchfree.vercel.app/og-image.jpg';
    };

    // Get proper display title
    const getDisplayTitle = () => {
        if (!item) return 'Watch Content';
        
        if (type === 'movie') {
            return `${item.title}`;
        } else if (type === 'tv') {
            return `${item.title} - Season ${season}, Episode ${episode}`;
        } else if (type === 'sports') {
            return `Live: ${item.title}`;
        } else if (type === 'tv_live') {
            return `Live TV: ${item.title}`;
        }
        
        return item.title;
    };

    // Proper share title
    const shareTitle = item 
        ? `Watch "${item.title}" Free Online | UniWatch` 
        : 'Watch Free Online | UniWatch';
    
    // Proper description with actual content
    const shareDescription = item?.overview 
        ? `${item.overview.substring(0, 150)}...`
        : type === 'movie' 
            ? `Watch "${item?.title || 'this movie'}" in HD quality for free on UniWatch. No registration required.`
            : type === 'tv'
                ? `Watch "${item?.title || 'this TV show'}" Season ${season}, Episode ${episode} in HD quality for free on UniWatch.`
                : type === 'sports'
                    ? `Watch live sports: ${item?.title || 'Live Game'} on UniWatch. Free HD streaming.`
                    : `Watch ${item?.title || 'Live TV'} on UniWatch. Free streaming.`;
    
    // Absolute image URL
    const shareImage = getBestImage();
    
    // Proper URL for HashRouter
    const shareUrl = `watch?id=${id}&type=${type}` + 
        (type === 'tv' ? `&season=${season}&episode=${episode}` : '');
    
    // Get full absolute URL for sharing
    const getFullShareUrl = () => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/#${shareUrl}`;
    };

    const pageTitle = `${getDisplayTitle()} | UniWatch`;
    const pageDesc = shareDescription;
    const pageImage = shareImage;
    
    // Check if the item is sports content
    const isSportsContent = type === 'sports' || (
        type !== 'movie' && (
            item?.title?.toLowerCase().includes('sport') || 
            item?.title?.toLowerCase().includes('game') ||
            (item?.genres && item.genres.some(g => g.toLowerCase().includes('sport')))
        )
    );

    return (
        <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-12">
            <SEO 
                title={pageTitle}
                description={pageDesc}
                image={pageImage}
                type={type === 'movie' ? 'video.movie' : 'video.tv_show'}
                keywords={[item?.title || '', type, 'streaming', 'free']}
                videoUrl={getFullShareUrl()}
                videoReleaseDate={item?.release_date}
            />
            
            <div className="max-w-7xl mx-auto">
                {/* Navigation - Top */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                            <span className="font-medium">Go Back</span>
                        </button>
                        <button 
                            onClick={() => navigate('/')} 
                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
                        >
                            <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
                            <span className="font-medium">Home</span>
                        </button>
                    </div>
                    
                    {item && (
                        <div className="flex items-center gap-4">
                            <SocialShare
                                title={shareTitle}
                                description={shareDescription}
                                image={shareImage}
                                url={shareUrl}
                                type={type}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Player */}
                    <div className="lg:col-span-3">
                        <VideoPlayer 
                            tmdbId={id} 
                            type={type} 
                            season={season}
                            episode={episode}
                            title={getDisplayTitle()} 
                            customStreams={item?.streams}
                        />
                    </div>
                    
                    {/* Content Info */}
                    {item && (
                        <div className="lg:col-span-3 bg-dark-surface p-6 rounded-xl border border-dark-border shadow-lg">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{getDisplayTitle()}</h1>
                                    <div className="flex flex-wrap gap-2">
                                        {item.vote_average && item.vote_average > 0 && (
                                            <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold">
                                                ⭐ {item.vote_average.toFixed(1)} Rating
                                            </span>
                                        )}
                                        <span className="px-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-gray-300">
                                            📅 {item.release_date || item.first_air_date || 'N/A'}
                                        </span>
                                        <span className="px-3 py-1.5 bg-brand-900/30 border border-brand-500/30 text-brand-300 rounded-lg text-sm font-bold uppercase">
                                            {isSportsContent ? '🏈 Live Game' : 
                                             type === 'movie' ? '🎬 Movie' : 
                                             type === 'tv' ? '📺 TV Series' :
                                             type === 'tv_live' ? '📡 Live TV' : 'Content'}
                                        </span>
                                        {isSportsContent ? (
                                            <span className="px-3 py-1.5 bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg text-sm font-bold">
                                                🔴 Live
                                            </span>
                                        ) : item.duration && (
                                            <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
                                                ⏱️ {item.duration}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <SocialShare
                                        title={shareTitle}
                                        description={shareDescription}
                                        image={shareImage}
                                        url={shareUrl}
                                        type={type}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        {isSportsContent ? 'Game Details' : 'Synopsis'}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed text-lg">
                                        {item.overview || `No details available for this ${isSportsContent ? 'game' : 'content'}.`}
                                    </p>
                                    
                                    {item.genres && item.genres.length > 0 && (
                                        <div className="mt-8">
                                            <h4 className="text-white font-bold mb-3">
                                                {isSportsContent ? 'Categories' : 'Genres'}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {item.genres.map((genre, index) => (
                                                    <span key={index} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-brand-500/20 hover:border-brand-500/30 hover:text-brand-300 transition-colors cursor-pointer">
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bg-dark-bg p-5 rounded-xl border border-dark-border">
                                    <h4 className="text-white font-bold mb-4">Quick Info</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-800">
                                            <span className="text-gray-400">Type</span>
                                            <span className="text-white font-medium">
                                                {type === 'movie' ? 'Movie' : 
                                                 type === 'tv' ? 'TV Show' :
                                                 type === 'sports' ? 'Live Sports' :
                                                 'Live TV'}
                                            </span>
                                        </div>
                                        {item.duration && (
                                            <div className="flex justify-between items-center py-3 border-b border-gray-800">
                                                <span className="text-gray-400">Duration</span>
                                                <span className="text-white font-medium">{item.duration}</span>
                                            </div>
                                        )}
                                        {(item.release_date || item.first_air_date) && (
                                            <div className="flex justify-between items-center py-3 border-b border-gray-800">
                                                <span className="text-gray-400">{type === 'movie' ? 'Release Date' : 'First Air Date'}</span>
                                                <span className="text-white font-medium">{item.release_date || item.first_air_date}</span>
                                            </div>
                                        )}
                                        {item.vote_average && item.vote_average > 0 && (
                                            <div className="flex justify-between items-center py-3">
                                                <span className="text-gray-400">Rating</span>
                                                <span className="text-green-400 font-bold">{item.vote_average.toFixed(1)}/10</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-6 pt-5 border-t border-dark-border">
                                        <h4 className="text-white font-bold mb-4">Share This</h4>
                                        <p className="text-gray-400 text-sm mb-4">
                                            Share this {isSportsContent ? 'game' : type} with friends and family
                                        </p>
                                        <SocialShare
                                            title={shareTitle}
                                            description={shareDescription}
                                            image={shareImage}
                                            url={shareUrl}
                                            type={type}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation - Bottom */}
                <div className="mt-12 pt-8 border-t border-dark-border">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="group flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/5 border border-dark-border w-full sm:w-auto"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                            <span className="font-medium">Go Back</span>
                        </button>
                        <button 
                            onClick={() => navigate('/')} 
                            className="group flex items-center justify-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-colors px-5 py-3 rounded-xl border border-brand-600 w-full sm:w-auto"
                        >
                            <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
                            <span className="font-medium">Back to Home</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ListingPage = ({ title, type }: { title: string, type: 'movie' | 'tv' }) => {
    const [allItems, setAllItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [displayCount, setDisplayCount] = useState(18);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetchByGenre(type).then(data => {
            setAllItems(data);
            setLoading(false);
        });
    }, [type]);

    const loadMore = () => {
        setLoadingMore(true);
        // Simulate loading delay
        setTimeout(() => {
            setDisplayCount(prev => prev + 18);
            setLoadingMore(false);
        }, 500);
    };

    const displayedItems = allItems.slice(0, displayCount);
    const hasMoreItems = displayCount < allItems.length;

    const pageTitle = `${title} - Free Streaming | UniWatch`;
    const pageDesc = `Browse our collection of ${title.toLowerCase()}. Watch free in HD quality on UniWatch.`;
    const pageImage = allItems[0]?.poster_path;

    return (
        <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-12">
            <SEO 
                title={pageTitle}
                description={pageDesc}
                image={pageImage}
                type="website"
                keywords={[title.toLowerCase(), 'streaming', 'free movies', 'tv shows']}
            />
            
            <div className="max-w-7xl mx-auto">
                {/* Navigation - Top */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/')} 
                            className="p-3 rounded-xl bg-dark-surface text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-dark-border"
                        >
                            <HomeIcon size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{title}</h1>
                            <p className="text-gray-400 text-sm mt-1">
                                {allItems.length} titles available • HD Streaming
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => navigate(-1)} 
                        className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 border border-dark-border"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Go Back</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-brand-500" size={40} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
                            {displayedItems.map((item) => (
                                <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
                            ))}
                        </div>
                        
                        {/* Load More Button */}
                        {hasMoreItems && (
                            <div className="flex justify-center mt-10 mb-8">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-3 px-8 py-4 bg-dark-surface hover:bg-dark-border text-white rounded-xl font-medium transition-all border border-dark-border hover:border-brand-500 disabled:opacity-50 min-w-[180px] justify-center"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            Load More
                                            <ChevronDown size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        
                        {/* Show loaded count */}
                        <div className="text-center text-gray-400 text-sm mb-4">
                            Showing {displayedItems.length} of {allItems.length} titles
                        </div>
                        
                        {/* Navigation - Bottom */}
                        <div className="mt-8 pt-8 border-t border-dark-border">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <button 
                                    onClick={() => navigate(-1)} 
                                    className="group flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors px-5 py-3 rounded-xl hover:bg-white/5 border border-dark-border w-full sm:w-auto"
                                >
                                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                                    <span className="font-medium">Go Back</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/')} 
                                    className="group flex items-center justify-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-colors px-5 py-3 rounded-xl border border-brand-600 w-full sm:w-auto"
                                >
                                    <HomeIcon size={20} className="group-hover:scale-110 transition-transform" /> 
                                    <span className="font-medium">Back to Home</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen bg-dark-bg text-white font-sans">
        <Navbar 
            isAuthenticated={isAuthenticated} 
            onAuthToggle={() => setIsAuthenticated(!isAuthenticated)} 
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<ListingPage title="Movies" type="movie" />} />
          <Route path="/tv" element={<ListingPage title="TV Shows" type="tv" />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/iptv" element={<IPTV />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;