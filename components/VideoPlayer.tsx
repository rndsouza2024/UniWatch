// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { Server, ShieldCheck, AlertCircle, Settings, Zap, Eye, Palette } from 'lucide-react';
// import { StreamSource } from '../types';
// import { UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE } from '../services/tmdb';
// import Hls from 'hls.js';

// interface VideoPlayerProps {
//   tmdbId?: string | number;
//   type?: 'movie' | 'tv' | 'sports' | 'tv_live';
//   season?: number;
//   episode?: number;
//   customStreams?: StreamSource[];
//   title?: string;
// }

// const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
//   tmdbId, 
//   type = 'movie', 
//   season = 1, 
//   episode = 1, 
//   customStreams, 
//   title 
// }) => {
//   const [activeServer, setActiveServer] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [videoEnhancement, setVideoEnhancement] = useState(true);
//   const [videoFilter, setVideoFilter] = useState('standard');
//   const [playerError, setPlayerError] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
  
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => {
//       window.removeEventListener('resize', checkMobile);
//     };
//   }, []);

//   const filterPresets = {
//     standard: 'brightness(1.05) contrast(1.1) saturate(1.08)',
//     vivid: 'brightness(1.12) contrast(1.35) saturate(1.45)',
//     cinema: 'brightness(0.98) contrast(1.25) saturate(0.95) hue-rotate(-2deg)',
//     gaming: 'brightness(1.08) contrast(1.28) saturate(1.25) hue-rotate(1.5deg)',
//     sports: 'brightness(1.1) contrast(1.3) saturate(1.3)',
//     natural: 'brightness(1.02) contrast(1.05) saturate(1.0)',
//     off: 'none'
//   };

//   const isM3U8Url = (url: string) => {
//     return url.includes('.m3u8') || url.includes('/hls/') || url.includes('m3u8');
//   };

//   const isDirectVideoUrl = (url: string) => {
//     const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
//     return videoExtensions.some(ext => url.includes(ext)) || url.includes('videoplayback');
//   };

//   const getVideoFilterStyle = () => {
//     if (!videoEnhancement) return { filter: 'none' };
    
//     let preset = filterPresets.vivid;
    
//     if (title?.toLowerCase().includes('movie') || type === 'movie') {
//       preset = filterPresets.cinema;
//     } else if (title?.toLowerCase().includes('sport') || type === 'sports') {
//       preset = filterPresets.sports;
//     } else if (title?.toLowerCase().includes('tv') || type === 'tv') {
//       preset = filterPresets.standard;
//     } else if (type === 'tv_live') {
//       preset = filterPresets.vivid;
//     }
    
//     if (videoFilter !== 'standard' && filterPresets[videoFilter as keyof typeof filterPresets]) {
//       preset = filterPresets[videoFilter as keyof typeof filterPresets];
//     }
    
//     return { 
//       filter: preset,
//       WebkitFilter: preset,
//       MozFilter: preset,
//       msFilter: preset,
//       transform: 'translate3d(0,0,0)',
//       backfaceVisibility: 'hidden',
//       WebkitBackfaceVisibility: 'hidden',
//       width: '100%',
//       height: '100%',
//       objectFit: 'contain'
//     };
//   };

//   const streams = useMemo(() => {
//     if (customStreams && customStreams.length > 0) {
//       return customStreams;
//     }
    
//     if (!tmdbId) return [];
    
//     if (type === 'movie') {
//       const movie = UNIQUE_MOVIES.find(m => m.id === tmdbId.toString());
//       if (!movie || !movie.streams) return [];
      
//       return Object.entries(movie.streams).map(([serverName, url], index) => ({
//         id: `movie-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: index === 0 ? 'FHD' : 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
//       }));
//     } else if (type === 'tv') {
//       const tvShow = UNIQUE_TV_SHOWS.find(tv => tv.id === tmdbId.toString());
//       if (!tvShow || !tvShow.streams) return [];
      
//       return Object.entries(tvShow.streams).map(([serverName, url], index) => {
//         let processedUrl = url as string;
//         processedUrl = processedUrl
//           .replace('s=1', `s=${season}`)
//           .replace('e=1', `e=${episode}`)
//           .replace('/1/1/', `/${season}/${episode}/`);
        
//         return {
//           id: `tv-${tmdbId}-s${index + 1}`,
//           name: serverName,
//           url: processedUrl,
//           quality: 'HD',
//           type: isM3U8Url(processedUrl) ? 'hls' : isDirectVideoUrl(processedUrl) ? 'direct' : 'iframe'
//         };
//       });
//     } else if (type === 'sports') {
//       const sport = UNIQUE_SPORTS.find(s => s.id === tmdbId.toString());
//       if (!sport || !sport.streams) return [];
      
//       return Object.entries(sport.streams).map(([serverName, url], index) => ({
//         id: `sports-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: index === 0 ? 'FHD' : 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
//       }));
//     } else if (type === 'tv_live') {
//       const tvLive = UNIQUE_TV_LIVE.find(tv => tv.id === tmdbId.toString());
//       if (!tvLive || !tvLive.streams) return [];
      
//       return Object.entries(tvLive.streams).map(([serverName, url], index) => ({
//         id: `tv_live-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
//       }));
//     }
    
//     return [];
//   }, [customStreams, tmdbId, type, season, episode]);

//   useEffect(() => {
//     setIsLoading(true);
//     setPlayerError(false);
//     setActiveServer(0);
    
//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }
    
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.removeAttribute('src');
//       videoRef.current.load();
//     }
//   }, [tmdbId, type, season, episode]);

//   const loadHLSStream = (url: string) => {
//     if (!videoRef.current) return;

//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }

//     if (Hls.isSupported()) {
//       const hls = new Hls({
//         enableWorker: true,
//         lowLatencyMode: true,
//         backBufferLength: 90,
//         maxBufferLength: 30,
//         maxMaxBufferLength: 600,
//         maxBufferSize: 60 * 1000 * 1000,
//         maxBufferHole: 0.5,
//         manifestLoadingTimeOut: 10000,
//         manifestLoadingMaxRetry: 3,
//         manifestLoadingRetryDelay: 500,
//         levelLoadingTimeOut: 10000,
//         levelLoadingMaxRetry: 3,
//         levelLoadingRetryDelay: 500,
//         fragLoadingTimeOut: 20000,
//         fragLoadingMaxRetry: 6,
//         fragLoadingRetryDelay: 500,
//         startFragPrefetch: true,
//         autoStartLoad: true,
//       });

//       hlsRef.current = hls;
      
//       hls.loadSource(url);
//       hls.attachMedia(videoRef.current);
      
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         setIsLoading(false);
//         setPlayerError(false);
//         videoRef.current?.play().catch(() => {
//           if (videoRef.current) {
//             videoRef.current.controls = true;
//           }
//         });
//       });

//       hls.on(Hls.Events.ERROR, (event, data) => {
//         if (data.fatal) {
//           switch (data.type) {
//             case Hls.ErrorTypes.NETWORK_ERROR:
//               hls.startLoad();
//               break;
//             case Hls.ErrorTypes.MEDIA_ERROR:
//               hls.recoverMediaError();
//               break;
//             default:
//               setPlayerError(true);
//               setIsLoading(false);
//               break;
//           }
//         }
//       });
//     } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//       videoRef.current.src = url;
//       videoRef.current.addEventListener('loadedmetadata', () => {
//         setIsLoading(false);
//         setPlayerError(false);
//         videoRef.current?.play().catch(() => {
//           if (videoRef.current) {
//             videoRef.current.controls = true;
//           }
//         });
//       });
      
//       videoRef.current.addEventListener('error', () => {
//         setPlayerError(true);
//         setIsLoading(false);
//       });
//     } else {
//       setPlayerError(true);
//       setIsLoading(false);
//     }
//   };

//   const loadDirectVideo = (url: string) => {
//     if (!videoRef.current) return;
    
//     videoRef.current.src = url;
//     videoRef.current.load();
    
//     videoRef.current.addEventListener('loadeddata', () => {
//       setIsLoading(false);
//       setPlayerError(false);
//       videoRef.current?.play().catch(() => {
//         if (videoRef.current) {
//           videoRef.current.controls = true;
//         }
//       });
//     });
    
//     videoRef.current.addEventListener('error', () => {
//       setPlayerError(true);
//       setIsLoading(false);
//     });
//   };

//   useEffect(() => {
//     if (streams.length === 0 || !streams[activeServer]) return;

//     setIsLoading(true);
//     setPlayerError(false);
    
//     const currentStream = streams[activeServer];
    
//     if (isM3U8Url(currentStream.url)) {
//       loadHLSStream(currentStream.url);
//     } else if (isDirectVideoUrl(currentStream.url)) {
//       loadDirectVideo(currentStream.url);
//     } else {
//       setIsLoading(false);
//     }
//   }, [activeServer, streams]);

//   const handleFullscreen = () => {
//     if (!containerRef.current) return;
    
//     if (!document.fullscreenElement) {
//       if (containerRef.current.requestFullscreen) {
//         containerRef.current.requestFullscreen();
//       } else if ((containerRef.current as any).webkitRequestFullscreen) {
//         (containerRef.current as any).webkitRequestFullscreen();
//       } else if ((containerRef.current as any).msRequestFullscreen) {
//         (containerRef.current as any).msRequestFullscreen();
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       } else if ((document as any).webkitExitFullscreen) {
//         (document as any).webkitExitFullscreen();
//       } else if ((document as any).msExitFullscreen) {
//         (document as any).msExitFullscreen();
//       }
//     }
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement || 
//                      !!(document as any).webkitFullscreenElement || 
//                      !!(document as any).msFullscreenElement);
//     };
    
//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
//     document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//       document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
//       document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
//     };
//   }, []);

//   const renderVideoPlayer = () => {
//     if (streams.length === 0 || !streams[activeServer]) return null;
    
//     const currentStream = streams[activeServer];
    
//     if (isM3U8Url(currentStream.url) || isDirectVideoUrl(currentStream.url)) {
//       return (
//         <video
//           ref={videoRef}
//           className="w-full h-full"
//           style={getVideoFilterStyle()}
//           controls
//           playsInline
//           autoPlay
//           muted={false}
//           preload="auto"
//           crossOrigin="anonymous"
//           onCanPlay={() => {
//             setIsLoading(false);
//             setPlayerError(false);
//           }}
//           onError={() => {
//             setPlayerError(true);
//             setIsLoading(false);
//           }}
//         />
//       );
//     } else {
//       return (
//         <iframe
//           src={currentStream.url}
//           className="w-full h-full border-0"
//           style={getVideoFilterStyle()}
//           allowFullScreen
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//           onLoad={() => setIsLoading(false)}
//           onError={() => {
//             setPlayerError(true);
//             setIsLoading(false);
//           }}
//           title={`${title || 'Video'} Player`}
//           referrerPolicy="strict-origin-when-cross-origin"
//         />
//       );
//     }
//   };

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       .video-player-iframe, video {
//         transition: filter 0.5s ease-out, -webkit-filter 0.5s ease-out !important;
//         will-change: filter, transform;
//       }
      
//       @supports (backdrop-filter: blur(1px)) {
//         .video-enhancement-overlay {
//           backdrop-filter: brightness(1.02) contrast(1.05) saturate(1.02);
//           mix-blend-mode: overlay;
//           opacity: 0.02;
//           pointer-events: none;
//         }
//       }
      
//       .filter-preset-active {
//         background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
//         color: white !important;
//         border-color: #60a5fa !important;
//         box-shadow: 0 0 15px rgba(59, 130, 246, 0.3) !important;
//       }
      
//       /* Fullscreen styles for all devices */
//       :fullscreen .video-player-container,
//       :-webkit-full-screen .video-player-container,
//       :-moz-full-screen .video-player-container,
//       :-ms-fullscreen .video-player-container {
//         background: #000 !important;
//         display: flex !important;
//         align-items: center !important;
//         justify-content: center !important;
//         width: 100vw !important;
//         height: 100vh !important;
//         max-width: 100vw !important;
//         max-height: 100vh !important;
//         position: fixed !important;
//         top: 0 !important;
//         left: 0 !important;
//         right: 0 !important;
//         bottom: 0 !important;
//         z-index: 999999 !important;
//         border-radius: 0 !important;
//         border: none !important;
//         margin: 0 !important;
//         padding: 0 !important;
//         overflow: hidden !important;
//       }
      
//       :fullscreen .video-player-container > div,
//       :-webkit-full-screen .video-player-container > div,
//       :-moz-full-screen .video-player-container > div,
//       :-ms-fullscreen .video-player-container > div {
//         width: 100% !important;
//         height: 100% !important;
//         max-width: 100% !important;
//         max-height: 100% !important;
//         display: flex !important;
//         flex-direction: column !important;
//       }
      
//       :fullscreen .video-player-container .relative,
//       :-webkit-full-screen .video-player-container .relative,
//       :-moz-full-screen .video-player-container .relative,
//       :-ms-fullscreen .video-player-container .relative {
//         width: 100% !important;
//         height: 100% !important;
//         flex: 1 !important;
//         min-height: 0 !important;
//         aspect-ratio: unset !important;
//       }
      
//       :fullscreen video,
//       :fullscreen iframe,
//       :-webkit-full-screen video,
//       :-webkit-full-screen iframe,
//       :-moz-full-screen video,
//       :-moz-full-screen iframe,
//       :-ms-fullscreen video,
//       :-ms-fullscreen iframe {
//         width: 100% !important;
//         height: 100% !important;
//         max-width: 100% !important;
//         max-height: 100% !important;
//         object-fit: contain !important;
//         position: relative !important;
//       }
      
//       /* Mobile-specific fullscreen optimizations */
//       @media (max-width: 768px) {
//         .video-player-container {
//           border-radius: 0 !important;
//         }
        
//         :fullscreen .video-player-container,
//         :-webkit-full-screen .video-player-container {
//           width: 100% !important;
//           height: 100% !important;
//         }
        
//         :fullscreen video,
//         :fullscreen iframe,
//         :-webkit-full-screen video,
//         :-webkit-full-screen iframe {
//           object-fit: contain !important;
//         }
        
//         /* Force landscape orientation handling */
//         @media (orientation: landscape) {
//           :fullscreen .video-player-container .relative,
//           :-webkit-full-screen .video-player-container .relative {
//             padding-bottom: 0 !important;
//             padding-top: 0 !important;
//           }
//         }
//       }
      
//       /* iOS Safari specific fixes */
//       @supports (-webkit-touch-callout: none) {
//         :fullscreen .video-player-container,
//         :-webkit-full-screen .video-player-container {
//           -webkit-overflow-scrolling: touch !important;
//           overflow: hidden !important;
//         }
        
//         :fullscreen video,
//         :-webkit-full-screen video {
//           -webkit-transform: translateZ(0) !important;
//           transform: translateZ(0) !important;
//         }
//       }
//     `;
//     document.head.appendChild(style);
    
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   if (streams.length === 0) {
//     return (
//       <div className="w-full aspect-video bg-black rounded-xl border border-dark-border flex items-center justify-center text-gray-400">
//         No streams available for this content.
//       </div>
//     );
//   }

//   return (
//     <div ref={containerRef} className="video-player-container w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-dark-border">
//       <div className="bg-dark-surface px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-dark-border gap-3">
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//           <span className="text-white font-medium text-sm truncate max-w-[200px] sm:max-w-none">
//             {title || 'Unknown Title'}
//           </span>
//         </div>
        
//         <div className="flex flex-wrap gap-3 items-center">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-1.5">
//               <Palette size={14} className="text-brand-400" />
//               <span className="text-xs text-gray-300 hidden sm:inline">Enhance:</span>
//             </div>
//             <div className="flex items-center">
//               <button
//                 onClick={() => setVideoEnhancement(!videoEnhancement)}
//                 className={`px-3 py-1 text-xs font-medium rounded-l-lg border ${
//                   videoEnhancement 
//                     ? 'bg-brand-600 text-white border-brand-500' 
//                     : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
//                 }`}
//                 title="Toggle video enhancement"
//               >
//                 {videoEnhancement ? 'ON' : 'OFF'}
//               </button>
              
//               {videoEnhancement && (
//                 <div className="relative group">
//                   <button
//                     className="px-3 py-1 text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 border-l-0 rounded-r-lg hover:bg-gray-700 flex items-center gap-1"
//                     title="Video enhancement presets"
//                   >
//                     <Settings size={12} />
//                   </button>
                  
//                   <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
//                     <div className="p-2">
//                       <div className="text-xs text-gray-400 px-2 py-1 mb-1">Filter Presets:</div>
//                       {Object.keys(filterPresets).map((preset) => (
//                         <button
//                           key={preset}
//                           onClick={() => setVideoFilter(preset)}
//                           className={`w-full text-left px-3 py-2 rounded text-xs font-medium mb-1 transition-all ${
//                             videoFilter === preset 
//                               ? 'filter-preset-active' 
//                               : 'text-gray-300 hover:bg-gray-800'
//                           }`}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span className="capitalize">{preset}</span>
//                             {videoFilter === preset && (
//                               <Zap size={10} className="text-yellow-400" />
//                             )}
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div className="flex gap-2">
//             <span className="text-xs bg-brand-900 text-brand-200 px-2 py-0.5 rounded hidden sm:flex items-center gap-1">
//               <ShieldCheck size={10} /> Secure
//             </span>
//             <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded flex items-center gap-1">
//               <Zap size={10} /> {streams[activeServer]?.quality || 'HD'}
//             </span>
//             {videoEnhancement && (
//               <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded hidden sm:flex items-center gap-1">
//                 <Eye size={10} /> Enhanced
//               </span>
//             )}
//             <button
//               onClick={handleFullscreen}
//               className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded hover:bg-gray-700 flex items-center gap-1"
//               title="Toggle fullscreen"
//             >
//               {isFullscreen ? 'Exit' : 'Full'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="relative w-full aspect-video bg-black group overflow-hidden">
//         {isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
//             <div className="relative">
//               <div className="w-12 h-12 border-4 border-brand-600/30 border-t-transparent rounded-full animate-spin"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
//               </div>
//               {videoEnhancement && (
//                 <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-full blur-xl"></div>
//               )}
//             </div>
//             <div className="absolute bottom-10 text-center">
//               <div className="text-sm text-gray-400 mb-2">Loading stream...</div>
//               {videoEnhancement && (
//                 <div className="text-xs text-brand-400">Applying video enhancement</div>
//               )}
//             </div>
//           </div>
//         )}
        
//         {playerError && !isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
//             <div className="text-center p-6">
//               <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
//               <div className="text-white font-medium mb-2">Failed to load stream</div>
//               <div className="text-gray-400 text-sm mb-4">
//                 The stream could not be loaded. Please try another server.
//               </div>
//               <button
//                 onClick={() => {
//                   setPlayerError(false);
//                   setIsLoading(true);
//                 }}
//                 className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         )}
        
//         {videoEnhancement && !isLoading && !playerError && (
//           <div className="absolute inset-0 z-10 video-enhancement-overlay"></div>
//         )}
        
//         {renderVideoPlayer()}
//       </div>

//       {streams.length > 1 && (
//         <div className="bg-[#0f172a] p-4 border-t border-dark-border">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Server size={16} className="text-gray-400" />
//               <span className="text-gray-400 text-sm font-bold">SWITCH SERVER:</span>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {streams.map((server, idx) => (
//                 <button
//                   key={server.id || idx}
//                   onClick={() => setActiveServer(idx)}
//                   className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden group ${
//                     activeServer === idx
//                       ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/20'
//                       : 'bg-dark-surface text-gray-400 hover:bg-white/10 hover:text-white border border-dark-border'
//                   } ${isMobile ? 'flex-1 min-w-[100px]' : ''}`}
//                   aria-label={`Switch to ${server.name}`}
//                 >
//                   <span className="relative z-10 truncate">{server.name}</span>
//                   {activeServer === idx && videoEnhancement && (
//                     <span className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20"></span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-start gap-2 text-yellow-500/80 text-xs">
//               <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
//               <p>If the current server is buffering or not working, please switch to another server. Ad-blockers may interfere with playback.</p>
//             </div>
            
//             {videoEnhancement && (
//               <div className="flex items-start gap-2 text-brand-400/80 text-xs">
//                 <Zap size={12} className="mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="font-medium">Video Enhancement Active:</p>
//                   <p className="text-gray-500 mt-0.5">Applying {videoFilter} filter for improved brightness, contrast, and color saturation.</p>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {videoEnhancement && (
//             <div className="mt-4 pt-4 border-t border-gray-800">
//               <div className="flex flex-col gap-3 mb-4">
//                 <div className="flex items-center gap-2">
//                   <Palette size={14} className="text-brand-400" />
//                   <span className="text-sm text-gray-300">Active Filter Preset:</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {Object.keys(filterPresets)
//                     .filter(preset => preset !== 'off')
//                     .map(preset => (
//                       <button
//                         key={preset}
//                         onClick={() => setVideoFilter(preset)}
//                         className={`px-3 py-1.5 text-xs rounded-full border transition-all flex-shrink-0 ${
//                           videoFilter === preset
//                             ? 'bg-gradient-to-r from-brand-500/20 to-purple-500/20 text-brand-300 border-brand-500/30'
//                             : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800'
//                         }`}
//                       >
//                         {preset.charAt(0).toUpperCase() + preset.slice(1)}
//                       </button>
//                     ))
//                   }
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//                 <div className="bg-gray-900/50 p-2 rounded">
//                   <div className="text-gray-500">Brightness</div>
//                   <div className="text-brand-300 font-medium">
//                     {videoFilter === 'vivid' ? '+8%' : 
//                      videoFilter === 'cinema' ? '+3%' : 
//                      videoFilter === 'gaming' ? '+7%' : '+5%'}
//                   </div>
//                 </div>
//                 <div className="bg-gray-900/50 p-2 rounded">
//                   <div className="text-gray-500">Contrast</div>
//                   <div className="text-brand-300 font-medium">
//                     {videoFilter === 'vivid' ? '+18%' : 
//                      videoFilter === 'cinema' ? '+12%' : 
//                      videoFilter === 'sports' ? '+20%' : '+10%'}
//                   </div>
//                 </div>
//                 <div className="bg-gray-900/50 p-2 rounded">
//                   <div className="text-gray-500">Saturation</div>
//                   <div className="text-brand-300 font-medium">
//                     {videoFilter === 'vivid' ? '+15%' : 
//                      videoFilter === 'cinema' ? '+5%' : 
//                      videoFilter === 'gaming' ? '+12%' : '+8%'}
//                   </div>
//                 </div>
//                 <div className="bg-gray-900/50 p-2 rounded">
//                   <div className="text-gray-500">Color Temp</div>
//                   <div className="text-brand-300 font-medium">
//                     {videoFilter === 'vivid' ? '+0.5°' : 
//                      videoFilter === 'cinema' ? '-0.2°' : 
//                      videoFilter === 'gaming' ? '+0.3°' : 'Neutral'}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
      
//       {streams.length === 1 && videoEnhancement && (
//         <div className="bg-[#0f172a] p-3 border-t border-dark-border">
//           <div className="flex items-center justify-center gap-2 text-xs">
//             <Zap size={12} className="text-brand-400 animate-pulse" />
//             <span className="text-brand-300">Video enhancement active: {videoFilter} preset applied</span>
//             <Zap size={12} className="text-brand-400 animate-pulse delay-300" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoPlayer;




























// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { Server, ShieldCheck, AlertCircle, Settings, Zap, Eye, Palette, Maximize2, Minimize2, RotateCw } from 'lucide-react';
// import { StreamSource } from '../types';
// import { UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE } from '../services/tmdb';
// import Hls from 'hls.js';

// interface VideoPlayerProps {
//   tmdbId?: string | number;
//   type?: 'movie' | 'tv' | 'sports' | 'tv_live';
//   season?: number;
//   episode?: number;
//   customStreams?: StreamSource[];
//   title?: string;
// }

// const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
//   tmdbId, 
//   type = 'movie', 
//   season = 1, 
//   episode = 1, 
//   customStreams, 
//   title 
// }) => {
//   const [activeServer, setActiveServer] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [videoEnhancement, setVideoEnhancement] = useState(true);
//   const [videoFilter, setVideoFilter] = useState('standard');
//   const [playerError, setPlayerError] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isLandscapeLocked, setIsLandscapeLocked] = useState(false);
//   const [orientationError, setOrientationError] = useState<string | null>(null);
  
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const originalOrientationRef = useRef<string>('portrait');
//   const isIOS = useRef(false);
//   const isAndroid = useRef(false);

//   useEffect(() => {
//     const checkDevice = () => {
//       const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
//       const width = window.innerWidth;
      
//       setIsMobile(width <= 768);
      
//       // Check for iOS
//       isIOS.current = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      
//       // Check for Android
//       isAndroid.current = /Android/.test(userAgent);
      
//       // Store original orientation
//       originalOrientationRef.current = window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape';
//     };
    
//     checkDevice();
//     window.addEventListener('resize', checkDevice);
    
//     return () => {
//       window.removeEventListener('resize', checkDevice);
//     };
//   }, []);

//   const filterPresets = {
//     standard: 'brightness(1.05) contrast(1.1) saturate(1.08)',
//     vivid: 'brightness(1.12) contrast(1.35) saturate(1.45)',
//     cinema: 'brightness(0.98) contrast(1.25) saturate(0.95) hue-rotate(-2deg)',
//     gaming: 'brightness(1.08) contrast(1.28) saturate(1.25) hue-rotate(1.5deg)',
//     sports: 'brightness(1.1) contrast(1.3) saturate(1.3)',
//     natural: 'brightness(1.02) contrast(1.05) saturate(1.0)',
//     off: 'none'
//   };

//   const isM3U8Url = (url: string) => {
//     return url.includes('.m3u8') || url.includes('/hls/') || url.includes('m3u8');
//   };

//   const isDirectVideoUrl = (url: string) => {
//     const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
//     return videoExtensions.some(ext => url.includes(ext)) || url.includes('videoplayback');
//   };

//   const getVideoFilterStyle = () => {
//     if (!videoEnhancement) return { filter: 'none' };
    
//     let preset = filterPresets.vivid;
    
//     if (title?.toLowerCase().includes('movie') || type === 'movie') {
//       preset = filterPresets.cinema;
//     } else if (title?.toLowerCase().includes('sport') || type === 'sports') {
//       preset = filterPresets.sports;
//     } else if (title?.toLowerCase().includes('tv') || type === 'tv') {
//       preset = filterPresets.standard;
//     } else if (type === 'tv_live') {
//       preset = filterPresets.vivid;
//     }
    
//     if (videoFilter !== 'standard' && filterPresets[videoFilter as keyof typeof filterPresets]) {
//       preset = filterPresets[videoFilter as keyof typeof filterPresets];
//     }
    
//     return { 
//       filter: preset,
//       WebkitFilter: preset,
//       MozFilter: preset,
//       msFilter: preset,
//       transform: 'translate3d(0,0,0)',
//       backfaceVisibility: 'hidden',
//       WebkitBackfaceVisibility: 'hidden',
//       width: '100%',
//       height: '100%',
//       objectFit: 'contain'
//     };
//   };

//   const streams = useMemo(() => {
//     if (customStreams && customStreams.length > 0) {
//       return customStreams;
//     }
    
//     if (!tmdbId) return [];
    
//     if (type === 'movie') {
//       const movie = UNIQUE_MOVIES.find(m => m.id === tmdbId.toString());
//       if (!movie || !movie.streams) return [];
      
//       return Object.entries(movie.streams).map(([serverName, url], index) => ({
//         id: `movie-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: index === 0 ? 'FHD' : 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
//       }));
//     } else if (type === 'tv') {
//       const tvShow = UNIQUE_TV_SHOWS.find(tv => tv.id === tmdbId.toString());
//       if (!tvShow || !tvShow.streams) return [];
      
//       return Object.entries(tvShow.streams).map(([serverName, url], index) => {
//         let processedUrl = url as string;
//         processedUrl = processedUrl
//           .replace('s=1', `s=${season}`)
//           .replace('e=1', `e=${episode}`)
//           .replace('/1/1/', `/${season}/${episode}/`);
        
//         return {
//           id: `tv-${tmdbId}-s${index + 1}`,
//           name: serverName,
//           url: processedUrl,
//           quality: 'HD',
//           type: isM3U8Url(processedUrl) ? 'hls' : isDirectVideoUrl(processedUrl) ? 'direct' : 'iframe'
//         };
//       });
//     } else if (type === 'sports') {
//       const sport = UNIQUE_SPORTS.find(s => s.id === tmdbId.toString());
//       if (!sport || !sport.streams) return [];
      
//       return Object.entries(sport.streams).map(([serverName, url], index) => ({
//         id: `sports-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: index === 0 ? 'FHD' : 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
//       }));
//     } else if (type === 'tv_live') {
//       const tvLive = UNIQUE_TV_LIVE.find(tv => tv.id === tmdbId.toString());
//       if (!tvLive || !tvLive.streams) return [];
      
//       return Object.entries(tvLive.streams).map(([serverName, url], index) => ({
//         id: `tv_live-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
//       }));
//     }
    
//     return [];
//   }, [customStreams, tmdbId, type, season, episode]);

//   useEffect(() => {
//     setIsLoading(true);
//     setPlayerError(false);
//     setActiveServer(0);
    
//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }
    
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.removeAttribute('src');
//       videoRef.current.load();
//     }
//   }, [tmdbId, type, season, episode]);

//   const loadHLSStream = (url: string) => {
//     if (!videoRef.current) return;

//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }

//     if (Hls.isSupported()) {
//       const hls = new Hls({
//         enableWorker: true,
//         lowLatencyMode: true,
//         backBufferLength: 90,
//         maxBufferLength: 30,
//         maxMaxBufferLength: 600,
//         maxBufferSize: 60 * 1000 * 1000,
//         maxBufferHole: 0.5,
//         manifestLoadingTimeOut: 10000,
//         manifestLoadingMaxRetry: 3,
//         manifestLoadingRetryDelay: 500,
//         levelLoadingTimeOut: 10000,
//         levelLoadingMaxRetry: 3,
//         levelLoadingRetryDelay: 500,
//         fragLoadingTimeOut: 20000,
//         fragLoadingMaxRetry: 6,
//         fragLoadingRetryDelay: 500,
//         startFragPrefetch: true,
//         autoStartLoad: true,
//       });

//       hlsRef.current = hls;
      
//       hls.loadSource(url);
//       hls.attachMedia(videoRef.current);
      
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         setIsLoading(false);
//         setPlayerError(false);
//         videoRef.current?.play().catch(() => {
//           if (videoRef.current) {
//             videoRef.current.controls = true;
//           }
//         });
//       });

//       hls.on(Hls.Events.ERROR, (event, data) => {
//         if (data.fatal) {
//           switch (data.type) {
//             case Hls.ErrorTypes.NETWORK_ERROR:
//               hls.startLoad();
//               break;
//             case Hls.ErrorTypes.MEDIA_ERROR:
//               hls.recoverMediaError();
//               break;
//             default:
//               setPlayerError(true);
//               setIsLoading(false);
//               break;
//           }
//         }
//       });
//     } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//       videoRef.current.src = url;
//       videoRef.current.addEventListener('loadedmetadata', () => {
//         setIsLoading(false);
//         setPlayerError(false);
//         videoRef.current?.play().catch(() => {
//           if (videoRef.current) {
//             videoRef.current.controls = true;
//           }
//         });
//       });
      
//       videoRef.current.addEventListener('error', () => {
//         setPlayerError(true);
//         setIsLoading(false);
//       });
//     } else {
//       setPlayerError(true);
//       setIsLoading(false);
//     }
//   };

//   const loadDirectVideo = (url: string) => {
//     if (!videoRef.current) return;
    
//     videoRef.current.src = url;
//     videoRef.current.load();
    
//     videoRef.current.addEventListener('loadeddata', () => {
//       setIsLoading(false);
//       setPlayerError(false);
//       videoRef.current?.play().catch(() => {
//         if (videoRef.current) {
//           videoRef.current.controls = true;
//         }
//       });
//     });
    
//     videoRef.current.addEventListener('error', () => {
//       setPlayerError(true);
//       setIsLoading(false);
//     });
//   };

//   useEffect(() => {
//     if (streams.length === 0 || !streams[activeServer]) return;

//     setIsLoading(true);
//     setPlayerError(false);
    
//     const currentStream = streams[activeServer];
    
//     if (isM3U8Url(currentStream.url)) {
//       loadHLSStream(currentStream.url);
//     } else if (isDirectVideoUrl(currentStream.url)) {
//       loadDirectVideo(currentStream.url);
//     } else {
//       setIsLoading(false);
//     }
//   }, [activeServer, streams]);

//   const lockOrientation = async () => {
//     if (!isMobile) return true;
    
//     try {
//       // Try to use Screen Orientation API first
//       if (screen.orientation && screen.orientation.lock) {
//         await screen.orientation.lock('landscape');
//         setIsLandscapeLocked(true);
//         setOrientationError(null);
//         return true;
//       }
      
//       // Fallback for browsers without Screen Orientation API
//       // We'll use CSS to simulate landscape
//       if (isIOS.current) {
//         // iOS requires a special approach
//         document.body.classList.add('ios-landscape-forced');
//         setIsLandscapeLocked(true);
//         setOrientationError(null);
//         return true;
//       }
      
//       // For other mobile browsers, try to rotate using CSS transforms
//       if (containerRef.current) {
//         containerRef.current.classList.add('force-landscape');
//         setIsLandscapeLocked(true);
//         setOrientationError(null);
//         return true;
//       }
      
//       setOrientationError('Orientation lock not supported on this device');
//       return false;
//     } catch (error) {
//       console.error('Failed to lock orientation:', error);
//       setOrientationError('Failed to lock orientation. Please rotate your device manually.');
//       return false;
//     }
//   };

//   const unlockOrientation = async () => {
//     if (!isMobile) return;
    
//     try {
//       // Try to unlock using Screen Orientation API
//       if (screen.orientation && screen.orientation.unlock) {
//         await screen.orientation.unlock();
//       } else if (screen.orientation && screen.orientation.lock) {
//         // Some browsers only support lock, so lock to original orientation
//         await screen.orientation.lock(originalOrientationRef.current as any);
//       }
      
//       // Remove CSS classes
//       document.body.classList.remove('ios-landscape-forced');
//       if (containerRef.current) {
//         containerRef.current.classList.remove('force-landscape');
//       }
      
//       setIsLandscapeLocked(false);
//       setOrientationError(null);
//     } catch (error) {
//       console.error('Failed to unlock orientation:', error);
//       // Still remove CSS classes even if API fails
//       document.body.classList.remove('ios-landscape-forced');
//       if (containerRef.current) {
//         containerRef.current.classList.remove('force-landscape');
//       }
//       setIsLandscapeLocked(false);
//     }
//   };

//   const handleFullscreen = async () => {
//     if (!containerRef.current) return;
    
//     if (!document.fullscreenElement) {
//       // Entering fullscreen
//       try {
//         // Request fullscreen first
//         if (containerRef.current.requestFullscreen) {
//           await containerRef.current.requestFullscreen();
//         } else if ((containerRef.current as any).webkitRequestFullscreen) {
//           await (containerRef.current as any).webkitRequestFullscreen();
//         } else if ((containerRef.current as any).msRequestFullscreen) {
//           await (containerRef.current as any).msRequestFullscreen();
//         }
        
//         setIsFullscreen(true);
        
//         // On mobile devices, lock to landscape after entering fullscreen
//         if (isMobile) {
//           // Small delay to ensure fullscreen transition is complete
//           setTimeout(async () => {
//             await lockOrientation();
            
//             // If orientation lock fails, show a message
//             if (orientationError && isFullscreen) {
//               // Don't exit fullscreen, just show a warning
//               console.warn(orientationError);
//             }
//           }, 300);
//         }
//       } catch (error) {
//         console.error('Failed to enter fullscreen:', error);
//       }
//     } else {
//       // Exiting fullscreen
//       try {
//         // First unlock orientation on mobile
//         if (isMobile && isLandscapeLocked) {
//           await unlockOrientation();
//         }
        
//         // Then exit fullscreen
//         if (document.exitFullscreen) {
//           await document.exitFullscreen();
//         } else if ((document as any).webkitExitFullscreen) {
//           await (document as any).webkitExitFullscreen();
//         } else if ((document as any).msExitFullscreen) {
//           await (document as any).msExitFullscreen();
//         }
        
//         setIsFullscreen(false);
//         setIsLandscapeLocked(false);
//       } catch (error) {
//         console.error('Failed to exit fullscreen:', error);
//       }
//     }
//   };

//   const handleOrientationChange = () => {
//     if (isFullscreen && isMobile && !isLandscapeLocked) {
//       // Try to lock orientation again if it was lost
//       setTimeout(() => {
//         if (isFullscreen && isMobile && !isLandscapeLocked) {
//           lockOrientation();
//         }
//       }, 100);
//     }
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       const fullscreenElement = document.fullscreenElement || 
//                                (document as any).webkitFullscreenElement || 
//                                (document as any).msFullscreenElement;
      
//       setIsFullscreen(!!fullscreenElement);
      
//       // If we exited fullscreen but still have landscape lock, unlock it
//       if (!fullscreenElement && isLandscapeLocked) {
//         unlockOrientation();
//       }
//     };
    
//     // Add orientation change listener for mobile
//     if (isMobile) {
//       window.addEventListener('orientationchange', handleOrientationChange);
//     }
    
//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
//     document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
//     return () => {
//       window.removeEventListener('orientationchange', handleOrientationChange);
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//       document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
//       document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
//       // Cleanup: unlock orientation if component unmounts while in landscape lock
//       if (isLandscapeLocked) {
//         unlockOrientation();
//       }
//     };
//   }, [isMobile, isFullscreen, isLandscapeLocked]);

//   const renderVideoPlayer = () => {
//     if (streams.length === 0 || !streams[activeServer]) return null;
    
//     const currentStream = streams[activeServer];
    
//     if (isM3U8Url(currentStream.url) || isDirectVideoUrl(currentStream.url)) {
//       return (
//         <video
//           ref={videoRef}
//           className="w-full h-full"
//           style={getVideoFilterStyle()}
//           controls
//           playsInline
//           autoPlay
//           muted={false}
//           preload="auto"
//           crossOrigin="anonymous"
//           onCanPlay={() => {
//             setIsLoading(false);
//             setPlayerError(false);
//           }}
//           onError={() => {
//             setPlayerError(true);
//             setIsLoading(false);
//           }}
//         />
//       );
//     } else {
//       return (
//         <iframe
//           src={currentStream.url}
//           className="w-full h-full border-0"
//           style={getVideoFilterStyle()}
//           allowFullScreen
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//           onLoad={() => setIsLoading(false)}
//           onError={() => {
//             setPlayerError(true);
//             setIsLoading(false);
//           }}
//           title={`${title || 'Video'} Player`}
//           referrerPolicy="strict-origin-when-cross-origin"
//         />
//       );
//     }
//   };

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       .video-player-iframe, video {
//         transition: filter 0.5s ease-out, -webkit-filter 0.5s ease-out !important;
//         will-change: filter, transform;
//       }
      
//       @supports (backdrop-filter: blur(1px)) {
//         .video-enhancement-overlay {
//           backdrop-filter: brightness(1.02) contrast(1.05) saturate(1.02);
//           mix-blend-mode: overlay;
//           opacity: 0.02;
//           pointer-events: none;
//         }
//       }
      
//       .filter-preset-active {
//         background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
//         color: white !important;
//         border-color: #60a5fa !important;
//         box-shadow: 0 0 15px rgba(59, 130, 246, 0.3) !important;
//       }
      
//       /* Fullscreen styles for all devices */
//       :fullscreen .video-player-container,
//       :-webkit-full-screen .video-player-container,
//       :-moz-full-screen .video-player-container,
//       :-ms-fullscreen .video-player-container {
//         background: #000 !important;
//         display: flex !important;
//         align-items: center !important;
//         justify-content: center !important;
//         width: 100vw !important;
//         height: 100vh !important;
//         max-width: 100vw !important;
//         max-height: 100vh !important;
//         position: fixed !important;
//         top: 0 !important;
//         left: 0 !important;
//         right: 0 !important;
//         bottom: 0 !important;
//         z-index: 999999 !important;
//         border-radius: 0 !important;
//         border: none !important;
//         margin: 0 !important;
//         padding: 0 !important;
//         overflow: hidden !important;
//       }
      
//       :fullscreen .video-player-container > div,
//       :-webkit-full-screen .video-player-container > div,
//       :-moz-full-screen .video-player-container > div,
//       :-ms-fullscreen .video-player-container > div {
//         width: 100% !important;
//         height: 100% !important;
//         max-width: 100% !important;
//         max-height: 100% !important;
//         display: flex !important;
//         flex-direction: column !important;
//       }
      
//       :fullscreen .video-player-container .relative,
//       :-webkit-full-screen .video-player-container .relative,
//       :-moz-full-screen .video-player-container .relative,
//       :-ms-fullscreen .video-player-container .relative {
//         width: 100% !important;
//         height: 100% !important;
//         flex: 1 !important;
//         min-height: 0 !important;
//         aspect-ratio: unset !important;
//       }
      
//       :fullscreen video,
//       :fullscreen iframe,
//       :-webkit-full-screen video,
//       :-webkit-full-screen iframe,
//       :-moz-full-screen video,
//       :-moz-full-screen iframe,
//       :-ms-fullscreen video,
//       :-ms-fullscreen iframe {
//         width: 100% !important;
//         height: 100% !important;
//         max-width: 100% !important;
//         max-height: 100% !important;
//         object-fit: contain !important;
//         position: relative !important;
//       }
      
//       /* Mobile-specific fullscreen optimizations */
//       @media (max-width: 768px) {
//         .video-player-container {
//           border-radius: 0 !important;
//         }
        
//         :fullscreen .video-player-container,
//         :-webkit-full-screen .video-player-container {
//           width: 100% !important;
//           height: 100% !important;
//         }
        
//         :fullscreen video,
//         :fullscreen iframe,
//         :-webkit-full-screen video,
//         :-webkit-full-screen iframe {
//           object-fit: contain !important;
//         }
        
//         /* Force landscape mode using CSS transform when API is not available */
//         .force-landscape {
//           transform: rotate(90deg) !important;
//           transform-origin: center center !important;
//           width: 100vh !important;
//           height: 100vw !important;
//           position: fixed !important;
//           top: 50% !important;
//           left: 50% !important;
//           margin-top: -50vw !important;
//           margin-left: -50vh !important;
//         }
        
//         /* iOS specific landscape forcing */
//         body.ios-landscape-forced {
//           overflow: hidden !important;
//         }
        
//         body.ios-landscape-forced .video-player-container {
//           transform: rotate(90deg) !important;
//           transform-origin: center center !important;
//           width: 100vh !important;
//           height: 100vw !important;
//           position: fixed !important;
//           top: 50% !important;
//           left: 50% !important;
//           margin-top: -50vw !important;
//           margin-left: -50vh !important;
//           z-index: 1000000 !important;
//         }
        
//         /* Force landscape orientation handling */
//         @media (orientation: landscape) {
//           :fullscreen .video-player-container .relative,
//           :-webkit-full-screen .video-player-container .relative {
//             padding-bottom: 0 !important;
//             padding-top: 0 !important;
//           }
//         }
        
//         /* Portrait orientation - hide some elements to save space */
//         @media (orientation: portrait) and (max-width: 768px) {
//           .video-player-container .bg-dark-surface .hidden-portrait {
//             display: none !important;
//           }
//         }
//       }
      
//       /* iOS Safari specific fixes */
//       @supports (-webkit-touch-callout: none) {
//         :fullscreen .video-player-container,
//         :-webkit-full-screen .video-player-container {
//           -webkit-overflow-scrolling: touch !important;
//           overflow: hidden !important;
//         }
        
//         :fullscreen video,
//         :-webkit-full-screen video {
//           -webkit-transform: translateZ(0) !important;
//           transform: translateZ(0) !important;
//         }
        
//         /* Prevent bounce effect on iOS */
//         body.ios-landscape-forced {
//           position: fixed !important;
//           width: 100% !important;
//           height: 100% !important;
//           overflow: hidden !important;
//         }
//       }
      
//       /* Android Chrome specific fixes */
//       @media screen and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
//         .video-player-container video {
//           -webkit-backface-visibility: hidden;
//           backface-visibility: hidden;
//         }
//       }
      
//       /* Orientation lock notification */
//       .orientation-notification {
//         position: fixed;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         background: rgba(0, 0, 0, 0.9);
//         color: white;
//         padding: 20px;
//         border-radius: 10px;
//         z-index: 1000001;
//         text-align: center;
//         max-width: 300px;
//         animation: fadeIn 0.3s ease;
//       }
      
//       @keyframes fadeIn {
//         from { opacity: 0; }
//         to { opacity: 1; }
//       }
      
//       .rotate-icon {
//         animation: rotateAnimation 2s linear infinite;
//         display: inline-block;
//         margin-bottom: 10px;
//       }
      
//       @keyframes rotateAnimation {
//         from { transform: rotate(0deg); }
//         to { transform: rotate(90deg); }
//       }
//     `;
//     document.head.appendChild(style);
    
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   if (streams.length === 0) {
//     return (
//       <div className="w-full aspect-video bg-black rounded-xl border border-dark-border flex items-center justify-center text-gray-400">
//         No streams available for this content.
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Orientation notification for mobile */}
//       {isFullscreen && isMobile && orientationError && (
//         <div className="orientation-notification">
//           <RotateCw size={48} className="rotate-icon text-brand-400 mx-auto" />
//           <h3 className="text-lg font-bold mb-2">Rotate Your Device</h3>
//           <p className="text-sm text-gray-300 mb-4">
//             Please rotate your device to landscape mode for the best viewing experience.
//           </p>
//           <button
//             onClick={() => setOrientationError(null)}
//             className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}
      
//       <div ref={containerRef} className="video-player-container w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-dark-border">
//         <div className="bg-dark-surface px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-dark-border gap-3">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//             <span className="text-white font-medium text-sm truncate max-w-[200px] sm:max-w-none">
//               {title || 'Unknown Title'}
//               {isLandscapeLocked && isMobile && (
//                 <span className="ml-2 text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded hidden sm:inline">
//                   Landscape
//                 </span>
//               )}
//             </span>
//           </div>
          
//           <div className="flex flex-wrap gap-3 items-center">
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1.5">
//                 <Palette size={14} className="text-brand-400" />
//                 <span className="text-xs text-gray-300 hidden sm:inline">Enhance:</span>
//               </div>
//               <div className="flex items-center">
//                 <button
//                   onClick={() => setVideoEnhancement(!videoEnhancement)}
//                   className={`px-3 py-1 text-xs font-medium rounded-l-lg border ${
//                     videoEnhancement 
//                       ? 'bg-brand-600 text-white border-brand-500' 
//                       : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
//                   }`}
//                   title="Toggle video enhancement"
//                 >
//                   {videoEnhancement ? 'ON' : 'OFF'}
//                 </button>
                
//                 {videoEnhancement && (
//                   <div className="relative group">
//                     <button
//                       className="px-3 py-1 text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 border-l-0 rounded-r-lg hover:bg-gray-700 flex items-center gap-1"
//                       title="Video enhancement presets"
//                     >
//                       <Settings size={12} />
//                     </button>
                    
//                     <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
//                       <div className="p-2">
//                         <div className="text-xs text-gray-400 px-2 py-1 mb-1">Filter Presets:</div>
//                         {Object.keys(filterPresets).map((preset) => (
//                           <button
//                             key={preset}
//                             onClick={() => setVideoFilter(preset)}
//                             className={`w-full text-left px-3 py-2 rounded text-xs font-medium mb-1 transition-all ${
//                               videoFilter === preset 
//                                 ? 'filter-preset-active' 
//                                 : 'text-gray-300 hover:bg-gray-800'
//                             }`}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="capitalize">{preset}</span>
//                               {videoFilter === preset && (
//                                 <Zap size={10} className="text-yellow-400" />
//                               )}
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex gap-2">
//               <span className="text-xs bg-brand-900 text-brand-200 px-2 py-0.5 rounded hidden sm:flex items-center gap-1">
//                 <ShieldCheck size={10} /> Secure
//               </span>
//               <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded flex items-center gap-1">
//                 <Zap size={10} /> {streams[activeServer]?.quality || 'HD'}
//               </span>
//               {videoEnhancement && (
//                 <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded hidden sm:flex items-center gap-1">
//                   <Eye size={10} /> Enhanced
//                 </span>
//               )}
//               <button
//                 onClick={handleFullscreen}
//                 className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded hover:bg-gray-700 flex items-center gap-1"
//                 title="Toggle fullscreen"
//               >
//                 {isFullscreen ? (
//                   <>
//                     <Minimize2 size={12} />
//                     <span className="hidden sm:inline">Exit</span>
//                   </>
//                 ) : (
//                   <>
//                     <Maximize2 size={12} />
//                     <span className="hidden sm:inline">Full</span>
//                   </>
//                 )}
//               </button>
//               {isMobile && isFullscreen && !isLandscapeLocked && (
//                 <button
//                   onClick={lockOrientation}
//                   className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded hover:bg-yellow-800/30 flex items-center gap-1"
//                   title="Lock to landscape mode"
//                 >
//                   <RotateCw size={12} />
//                   <span className="hidden sm:inline">Landscape</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="relative w-full aspect-video bg-black group overflow-hidden">
//           {isLoading && (
//             <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
//               <div className="relative">
//                 <div className="w-12 h-12 border-4 border-brand-600/30 border-t-transparent rounded-full animate-spin"></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
//                 </div>
//                 {videoEnhancement && (
//                   <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-full blur-xl"></div>
//                 )}
//               </div>
//               <div className="absolute bottom-10 text-center">
//                 <div className="text-sm text-gray-400 mb-2">Loading stream...</div>
//                 {videoEnhancement && (
//                   <div className="text-xs text-brand-400">Applying video enhancement</div>
//                 )}
//               </div>
//             </div>
//           )}
          
//           {playerError && !isLoading && (
//             <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
//               <div className="text-center p-6">
//                 <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
//                 <div className="text-white font-medium mb-2">Failed to load stream</div>
//                 <div className="text-gray-400 text-sm mb-4">
//                   The stream could not be loaded. Please try another server.
//                 </div>
//                 <button
//                   onClick={() => {
//                     setPlayerError(false);
//                     setIsLoading(true);
//                   }}
//                   className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
//                 >
//                   Retry
//                 </button>
//               </div>
//             </div>
//           )}
          
//           {videoEnhancement && !isLoading && !playerError && (
//             <div className="absolute inset-0 z-10 video-enhancement-overlay"></div>
//           )}
          
//           {renderVideoPlayer()}
//         </div>

//         {streams.length > 1 && (
//           <div className="bg-[#0f172a] p-4 border-t border-dark-border">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Server size={16} className="text-gray-400" />
//                 <span className="text-gray-400 text-sm font-bold">SWITCH SERVER:</span>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {streams.map((server, idx) => (
//                   <button
//                     key={server.id || idx}
//                     onClick={() => setActiveServer(idx)}
//                     className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden group ${
//                       activeServer === idx
//                         ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/20'
//                         : 'bg-dark-surface text-gray-400 hover:bg-white/10 hover:text-white border border-dark-border'
//                     } ${isMobile ? 'flex-1 min-w-[100px]' : ''}`}
//                     aria-label={`Switch to ${server.name}`}
//                   >
//                     <span className="relative z-10 truncate">{server.name}</span>
//                     {activeServer === idx && videoEnhancement && (
//                       <span className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20"></span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex items-start gap-2 text-yellow-500/80 text-xs">
//                 <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
//                 <p>If the current server is buffering or not working, please switch to another server. Ad-blockers may interfere with playback.</p>
//               </div>
              
//               {videoEnhancement && (
//                 <div className="flex items-start gap-2 text-brand-400/80 text-xs">
//                   <Zap size={12} className="mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium">Video Enhancement Active:</p>
//                     <p className="text-gray-500 mt-0.5">Applying {videoFilter} filter for improved brightness, contrast, and color saturation.</p>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {videoEnhancement && (
//               <div className="mt-4 pt-4 border-t border-gray-800">
//                 <div className="flex flex-col gap-3 mb-4">
//                   <div className="flex items-center gap-2">
//                     <Palette size={14} className="text-brand-400" />
//                     <span className="text-sm text-gray-300">Active Filter Preset:</span>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {Object.keys(filterPresets)
//                       .filter(preset => preset !== 'off')
//                       .map(preset => (
//                         <button
//                           key={preset}
//                           onClick={() => setVideoFilter(preset)}
//                           className={`px-3 py-1.5 text-xs rounded-full border transition-all flex-shrink-0 ${
//                             videoFilter === preset
//                               ? 'bg-gradient-to-r from-brand-500/20 to-purple-500/20 text-brand-300 border-brand-500/30'
//                               : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800'
//                           }`}
//                         >
//                           {preset.charAt(0).toUpperCase() + preset.slice(1)}
//                         </button>
//                       ))
//                     }
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
//                   <div className="bg-gray-900/50 p-2 rounded">
//                     <div className="text-gray-500">Brightness</div>
//                     <div className="text-brand-300 font-medium">
//                       {videoFilter === 'vivid' ? '+8%' : 
//                        videoFilter === 'cinema' ? '+3%' : 
//                        videoFilter === 'gaming' ? '+7%' : '+5%'}
//                     </div>
//                   </div>
//                   <div className="bg-gray-900/50 p-2 rounded">
//                     <div className="text-gray-500">Contrast</div>
//                     <div className="text-brand-300 font-medium">
//                       {videoFilter === 'vivid' ? '+18%' : 
//                        videoFilter === 'cinema' ? '+12%' : 
//                        videoFilter === 'sports' ? '+20%' : '+10%'}
//                     </div>
//                   </div>
//                   <div className="bg-gray-900/50 p-2 rounded">
//                     <div className="text-gray-500">Saturation</div>
//                     <div className="text-brand-300 font-medium">
//                       {videoFilter === 'vivid' ? '+15%' : 
//                        videoFilter === 'cinema' ? '+5%' : 
//                        videoFilter === 'gaming' ? '+12%' : '+8%'}
//                     </div>
//                   </div>
//                   <div className="bg-gray-900/50 p-2 rounded">
//                     <div className="text-gray-500">Color Temp</div>
//                     <div className="text-brand-300 font-medium">
//                       {videoFilter === 'vivid' ? '+0.5°' : 
//                        videoFilter === 'cinema' ? '-0.2°' : 
//                        videoFilter === 'gaming' ? '+0.3°' : 'Neutral'}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
        
//         {streams.length === 1 && videoEnhancement && (
//           <div className="bg-[#0f172a] p-3 border-t border-dark-border">
//             <div className="flex items-center justify-center gap-2 text-xs">
//               <Zap size={12} className="text-brand-400 animate-pulse" />
//               <span className="text-brand-300">Video enhancement active: {videoFilter} preset applied</span>
//               <Zap size={12} className="text-brand-400 animate-pulse delay-300" />
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default VideoPlayer;



























import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Server, ShieldCheck, AlertCircle, Settings, Zap, Eye, Palette, Maximize2, Minimize2, RotateCw, Monitor } from 'lucide-react';
import { StreamSource } from '../types';
import { UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE } from '../services/tmdb';
import Hls from 'hls.js';

interface VideoPlayerProps {
  tmdbId?: string | number;
  type?: 'movie' | 'tv' | 'sports' | 'tv_live';
  season?: number;
  episode?: number;
  customStreams?: StreamSource[];
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  tmdbId, 
  type = 'movie', 
  season = 1, 
  episode = 1, 
  customStreams, 
  title 
}) => {
  const [activeServer, setActiveServer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [videoEnhancement, setVideoEnhancement] = useState(true);
  const [videoFilter, setVideoFilter] = useState('standard');
  const [playerError, setPlayerError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscapeLocked, setIsLandscapeLocked] = useState(false);
  const [orientationError, setOrientationError] = useState<string | null>(null);
  const [iframeDimensions, setIframeDimensions] = useState({ width: '100%', height: '100%' });
  const [isIframeSource, setIsIframeSource] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const originalOrientationRef = useRef<string>('portrait');
  const isIOS = useRef(false);
  const isAndroid = useRef(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width <= 768);
      
      // Check for iOS
      isIOS.current = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      
      // Check for Android
      isAndroid.current = /Android/.test(userAgent);
      
      // Store original orientation
      originalOrientationRef.current = width > height ? 'landscape' : 'portrait';
      
      // Update iframe dimensions for mobile
      if (isIframeSource && isMobile) {
        updateIframeDimensions();
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isIframeSource, isMobile]);

  const updateIframeDimensions = () => {
    if (!isMobile || !isIframeSource) return;
    
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
      const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
      
      if (isLandscapeLocked && isFullscreen) {
        // For landscape mode on mobile
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isLandscape = screenWidth > screenHeight;
        
        if (isLandscape) {
          // Landscape orientation
          setIframeDimensions({
            width: `${screenWidth}px`,
            height: `${screenHeight}px`
          });
        } else {
          // Portrait orientation but forced landscape
          setIframeDimensions({
            width: `${screenHeight}px`,
            height: `${screenWidth}px`
          });
        }
      } else if (isFullscreen) {
        // Fullscreen but not landscape locked
        const width = window.innerWidth;
        const height = window.innerHeight;
        setIframeDimensions({
          width: `${width}px`,
          height: `${height}px`
        });
      } else {
        // Normal mode
        setIframeDimensions({
          width: '100%',
          height: '100%'
        });
      }
      
      // Force iframe to reload if it exists
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src;
        if (currentSrc) {
          // Only reload if we're in fullscreen mode to avoid flickering
          if (isFullscreen) {
            iframeRef.current.src = currentSrc;
          }
        }
      }
    }, 100);
  };

  const filterPresets = {
    standard: 'brightness(1.05) contrast(1.1) saturate(1.08)',
    vivid: 'brightness(1.12) contrast(1.35) saturate(1.45)',
    cinema: 'brightness(0.98) contrast(1.25) saturate(0.95) hue-rotate(-2deg)',
    gaming: 'brightness(1.08) contrast(1.28) saturate(1.25) hue-rotate(1.5deg)',
    sports: 'brightness(1.1) contrast(1.3) saturate(1.3)',
    natural: 'brightness(1.02) contrast(1.05) saturate(1.0)',
    off: 'none'
  };

  const isM3U8Url = (url: string) => {
    return url.includes('.m3u8') || url.includes('/hls/') || url.includes('m3u8');
  };

  const isDirectVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    return videoExtensions.some(ext => url.includes(ext)) || url.includes('videoplayback');
  };

  const isIframeUrl = (url: string) => {
    return !isM3U8Url(url) && !isDirectVideoUrl(url);
  };

  const getVideoFilterStyle = () => {
    if (!videoEnhancement) return { filter: 'none' };
    
    let preset = filterPresets.vivid;
    
    if (title?.toLowerCase().includes('movie') || type === 'movie') {
      preset = filterPresets.cinema;
    } else if (title?.toLowerCase().includes('sport') || type === 'sports') {
      preset = filterPresets.sports;
    } else if (title?.toLowerCase().includes('tv') || type === 'tv') {
      preset = filterPresets.standard;
    } else if (type === 'tv_live') {
      preset = filterPresets.vivid;
    }
    
    if (videoFilter !== 'standard' && filterPresets[videoFilter as keyof typeof filterPresets]) {
      preset = filterPresets[videoFilter as keyof typeof filterPresets];
    }
    
    return { 
      filter: preset,
      WebkitFilter: preset,
      MozFilter: preset,
      msFilter: preset,
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    };
  };

  const getIframeStyle = () => {
    const baseStyle = {
      border: '0',
      width: iframeDimensions.width,
      height: iframeDimensions.height,
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'block',
      overflow: 'hidden'
    };

    if (!videoEnhancement) {
      return baseStyle;
    }

    let preset = filterPresets.vivid;
    
    if (title?.toLowerCase().includes('movie') || type === 'movie') {
      preset = filterPresets.cinema;
    } else if (title?.toLowerCase().includes('sport') || type === 'sports') {
      preset = filterPresets.sports;
    } else if (title?.toLowerCase().includes('tv') || type === 'tv') {
      preset = filterPresets.standard;
    } else if (type === 'tv_live') {
      preset = filterPresets.vivid;
    }
    
    if (videoFilter !== 'standard' && filterPresets[videoFilter as keyof typeof filterPresets]) {
      preset = filterPresets[videoFilter as keyof typeof filterPresets];
    }
    
    return {
      ...baseStyle,
      filter: preset,
      WebkitFilter: preset,
      MozFilter: preset,
      msFilter: preset,
    };
  };

  const streams = useMemo(() => {
    if (customStreams && customStreams.length > 0) {
      return customStreams;
    }
    
    if (!tmdbId) return [];
    
    if (type === 'movie') {
      const movie = UNIQUE_MOVIES.find(m => m.id === tmdbId.toString());
      if (!movie || !movie.streams) return [];
      
      return Object.entries(movie.streams).map(([serverName, url], index) => ({
        id: `movie-${tmdbId}-s${index + 1}`,
        name: serverName,
        url: url as string,
        quality: index === 0 ? 'FHD' : 'HD',
        type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
      }));
    } else if (type === 'tv') {
      const tvShow = UNIQUE_TV_SHOWS.find(tv => tv.id === tmdbId.toString());
      if (!tvShow || !tvShow.streams) return [];
      
      return Object.entries(tvShow.streams).map(([serverName, url], index) => {
        let processedUrl = url as string;
        processedUrl = processedUrl
          .replace('s=1', `s=${season}`)
          .replace('e=1', `e=${episode}`)
          .replace('/1/1/', `/${season}/${episode}/`);
        
        return {
          id: `tv-${tmdbId}-s${index + 1}`,
          name: serverName,
          url: processedUrl,
          quality: 'HD',
          type: isM3U8Url(processedUrl) ? 'hls' : isDirectVideoUrl(processedUrl) ? 'direct' : 'iframe'
        };
      });
    } else if (type === 'sports') {
      const sport = UNIQUE_SPORTS.find(s => s.id === tmdbId.toString());
      if (!sport || !sport.streams) return [];
      
      return Object.entries(sport.streams).map(([serverName, url], index) => ({
        id: `sports-${tmdbId}-s${index + 1}`,
        name: serverName,
        url: url as string,
        quality: index === 0 ? 'FHD' : 'HD',
        type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
      }));
    } else if (type === 'tv_live') {
      const tvLive = UNIQUE_TV_LIVE.find(tv => tv.id === tmdbId.toString());
      if (!tvLive || !tvLive.streams) return [];
      
      return Object.entries(tvLive.streams).map(([serverName, url], index) => ({
        id: `tv_live-${tmdbId}-s${index + 1}`,
        name: serverName,
        url: url as string,
        quality: 'HD',
        type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe'
      }));
    }
    
    return [];
  }, [customStreams, tmdbId, type, season, episode]);

  useEffect(() => {
    setIsLoading(true);
    setPlayerError(false);
    setActiveServer(0);
    setIsIframeSource(false);
    
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
  }, [tmdbId, type, season, episode]);

  useEffect(() => {
    // Reset iframe dimensions when source changes
    setIframeDimensions({ width: '100%', height: '100%' });
    
    if (streams[activeServer] && isIframeUrl(streams[activeServer].url)) {
      setIsIframeSource(true);
    } else {
      setIsIframeSource(false);
    }
  }, [activeServer, streams]);

  const loadHLSStream = (url: string) => {
    if (!videoRef.current) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3,
        manifestLoadingRetryDelay: 500,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 3,
        levelLoadingRetryDelay: 500,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 500,
        startFragPrefetch: true,
        autoStartLoad: true,
      });

      hlsRef.current = hls;
      
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        setPlayerError(false);
        videoRef.current?.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.controls = true;
          }
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setPlayerError(true);
              setIsLoading(false);
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = url;
      videoRef.current.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        setPlayerError(false);
        videoRef.current?.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.controls = true;
          }
        });
      });
      
      videoRef.current.addEventListener('error', () => {
        setPlayerError(true);
        setIsLoading(false);
      });
    } else {
      setPlayerError(true);
      setIsLoading(false);
    }
  };

  const loadDirectVideo = (url: string) => {
    if (!videoRef.current) return;
    
    videoRef.current.src = url;
    videoRef.current.load();
    
    videoRef.current.addEventListener('loadeddata', () => {
      setIsLoading(false);
      setPlayerError(false);
      videoRef.current?.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.controls = true;
        }
      });
    });
    
    videoRef.current.addEventListener('error', () => {
      setPlayerError(true);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (streams.length === 0 || !streams[activeServer]) return;

    setIsLoading(true);
    setPlayerError(false);
    
    const currentStream = streams[activeServer];
    
    if (isM3U8Url(currentStream.url)) {
      loadHLSStream(currentStream.url);
    } else if (isDirectVideoUrl(currentStream.url)) {
      loadDirectVideo(currentStream.url);
    } else {
      // For iframe sources, we need to handle differently
      setIsIframeSource(true);
      // We'll let the iframe handle loading
      setIsLoading(false);
    }
  }, [activeServer, streams]);

  const lockOrientation = async () => {
    if (!isMobile) return true;
    
    try {
      // Try to use Screen Orientation API first
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape');
        setIsLandscapeLocked(true);
        setOrientationError(null);
        
        // Update iframe dimensions for landscape
        if (isIframeSource) {
          updateIframeDimensions();
        }
        return true;
      }
      
      // For devices without Screen Orientation API
      // We'll handle it through CSS and window resize
      setIsLandscapeLocked(true);
      setOrientationError(null);
      
      // Update iframe dimensions
      if (isIframeSource) {
        updateIframeDimensions();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to lock orientation:', error);
      setOrientationError('Failed to lock orientation. Please rotate your device manually.');
      return false;
    }
  };

  const unlockOrientation = async () => {
    if (!isMobile) return;
    
    try {
      // Try to unlock using Screen Orientation API
      if (screen.orientation && screen.orientation.unlock) {
        await screen.orientation.unlock();
      } else if (screen.orientation && screen.orientation.lock) {
        // Some browsers only support lock, so lock to original orientation
        await screen.orientation.lock(originalOrientationRef.current as any);
      }
      
      setIsLandscapeLocked(false);
      setOrientationError(null);
      
      // Reset iframe dimensions
      setIframeDimensions({ width: '100%', height: '100%' });
    } catch (error) {
      console.error('Failed to unlock orientation:', error);
      setIsLandscapeLocked(false);
    }
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      // Entering fullscreen
      try {
        // Request fullscreen first
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }
        
        setIsFullscreen(true);
        
        // On mobile devices, lock to landscape after entering fullscreen
        if (isMobile) {
          // Small delay to ensure fullscreen transition is complete
          setTimeout(async () => {
            await lockOrientation();
            
            // If orientation lock fails, show a message
            if (orientationError) {
              console.warn(orientationError);
            }
            
            // Update iframe dimensions for fullscreen
            if (isIframeSource) {
              updateIframeDimensions();
            }
          }, 300);
        }
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
      }
    } else {
      // Exiting fullscreen
      try {
        // First unlock orientation on mobile
        if (isMobile && isLandscapeLocked) {
          await unlockOrientation();
        }
        
        // Then exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        
        setIsFullscreen(false);
        setIsLandscapeLocked(false);
        
        // Reset iframe dimensions
        setIframeDimensions({ width: '100%', height: '100%' });
      } catch (error) {
        console.error('Failed to exit fullscreen:', error);
      }
    }
  };

  const handleOrientationChange = () => {
    if (isFullscreen && isMobile && !isLandscapeLocked) {
      // Try to lock orientation again if it was lost
      setTimeout(() => {
        if (isFullscreen && isMobile && !isLandscapeLocked) {
          lockOrientation();
        }
      }, 100);
    }
    
    // Update iframe dimensions on orientation change
    if (isIframeSource) {
      updateIframeDimensions();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement || 
                               (document as any).webkitFullscreenElement || 
                               (document as any).msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
      
      // Update iframe dimensions
      if (isIframeSource) {
        updateIframeDimensions();
      }
      
      // If we exited fullscreen but still have landscape lock, unlock it
      if (!fullscreenElement && isLandscapeLocked) {
        unlockOrientation();
      }
    };
    
    // Add orientation change listener for mobile
    if (isMobile) {
      window.addEventListener('orientationchange', handleOrientationChange);
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      // Cleanup: unlock orientation if component unmounts while in landscape lock
      if (isLandscapeLocked) {
        unlockOrientation();
      }
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isMobile, isFullscreen, isLandscapeLocked, isIframeSource]);

  const renderVideoPlayer = () => {
    if (streams.length === 0 || !streams[activeServer]) return null;
    
    const currentStream = streams[activeServer];
    
    if (isM3U8Url(currentStream.url) || isDirectVideoUrl(currentStream.url)) {
      return (
        <video
          ref={videoRef}
          className="w-full h-full"
          style={getVideoFilterStyle()}
          controls
          playsInline
          autoPlay
          muted={false}
          preload="auto"
          crossOrigin="anonymous"
          onCanPlay={() => {
            setIsLoading(false);
            setPlayerError(false);
          }}
          onError={() => {
            setPlayerError(true);
            setIsLoading(false);
          }}
        />
      );
    } else {
      return (
        <iframe
          ref={iframeRef}
          src={currentStream.url}
          className={`w-full h-full ${isIframeSource && isMobile ? 'iframe-mobile-optimized' : ''}`}
          style={getIframeStyle()}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={() => {
            setIsLoading(false);
            setPlayerError(false);
            // Update dimensions after iframe loads
            if (isIframeSource && isMobile) {
              updateIframeDimensions();
            }
          }}
          onError={() => {
            setPlayerError(true);
            setIsLoading(false);
          }}
          title={`${title || 'Video'} Player`}
          referrerPolicy="strict-origin-when-cross-origin"
          scrolling="no"
          frameBorder="0"
        />
      );
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .video-player-iframe, video {
        transition: filter 0.5s ease-out, -webkit-filter 0.5s ease-out !important;
        will-change: filter, transform;
      }
      
      @supports (backdrop-filter: blur(1px)) {
        .video-enhancement-overlay {
          backdrop-filter: brightness(1.02) contrast(1.05) saturate(1.02);
          mix-blend-mode: overlay;
          opacity: 0.02;
          pointer-events: none;
        }
      }
      
      .filter-preset-active {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
        color: white !important;
        border-color: #60a5fa !important;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.3) !important;
      }
      
      /* Fullscreen styles for all devices */
      :fullscreen .video-player-container,
      :-webkit-full-screen .video-player-container,
      :-moz-full-screen .video-player-container,
      :-ms-fullscreen .video-player-container {
        background: #000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        z-index: 999999 !important;
        border-radius: 0 !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      
      :fullscreen .video-player-container > div,
      :-webkit-full-screen .video-player-container > div,
      :-moz-full-screen .video-player-container > div,
      :-ms-fullscreen .video-player-container > div {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        display: flex !important;
        flex-direction: column !important;
      }
      
      :fullscreen .video-player-container .relative,
      :-webkit-full-screen .video-player-container .relative,
      :-moz-full-screen .video-player-container .relative,
      :-ms-fullscreen .video-player-container .relative {
        width: 100% !important;
        height: 100% !important;
        flex: 1 !important;
        min-height: 0 !important;
        aspect-ratio: unset !important;
      }
      
      :fullscreen video,
      :fullscreen iframe,
      :-webkit-full-screen video,
      :-webkit-full-screen iframe,
      :-moz-full-screen video,
      :-moz-full-screen iframe,
      :-ms-fullscreen video,
      :-ms-fullscreen iframe {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: contain !important;
        position: relative !important;
      }
      
      /* Mobile-specific optimizations */
      @media (max-width: 768px) {
        .video-player-container {
          border-radius: 0 !important;
          overflow: visible !important;
        }
        
        .video-player-container .relative {
          overflow: visible !important;
        }
        
        :fullscreen .video-player-container,
        :-webkit-full-screen .video-player-container {
          width: 100% !important;
          height: 100% !important;
          overflow: visible !important;
        }
        
        :fullscreen video,
        :fullscreen iframe,
        :-webkit-full-screen video,
        :-webkit-full-screen iframe {
          object-fit: contain !important;
          overflow: visible !important;
        }
        
        /* Special handling for iframes on mobile */
        .iframe-mobile-optimized {
          -webkit-overflow-scrolling: touch !important;
          overflow: auto !important;
        }
        
        /* Force full width for iframe in mobile fullscreen */
        :fullscreen .iframe-mobile-optimized,
        :-webkit-full-screen .iframe-mobile-optimized {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          transform: none !important;
          overflow: auto !important;
        }
        
        /* Landscape mode optimizations */
        @media (orientation: landscape) {
          :fullscreen .video-player-container,
          :-webkit-full-screen .video-player-container {
            width: 100vw !important;
            height: 100vh !important;
          }
          
          :fullscreen .iframe-mobile-optimized,
          :-webkit-full-screen .iframe-mobile-optimized {
            width: 100vw !important;
            height: 100vh !important;
          }
        }
        
        /* Portrait orientation optimizations */
        @media (orientation: portrait) {
          :fullscreen .video-player-container,
          :-webkit-full-screen .video-player-container {
            width: 100vw !important;
            height: 100vh !important;
          }
          
          :fullscreen .iframe-mobile-optimized,
          :-webkit-full-screen .iframe-mobile-optimized {
            width: 100vh !important;
            height: 100vw !important;
            transform: rotate(90deg) translateY(-100%) !important;
            transform-origin: top left !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
          }
        }
        
        /* Portrait orientation - hide some elements to save space */
        @media (orientation: portrait) and (max-width: 768px) {
          .video-player-container .bg-dark-surface .hidden-portrait {
            display: none !important;
          }
        }
      }
      
      /* iOS Safari specific fixes */
      @supports (-webkit-touch-callout: none) {
        :fullscreen .video-player-container,
        :-webkit-full-screen .video-player-container {
          -webkit-overflow-scrolling: touch !important;
          overflow: hidden !important;
        }
        
        :fullscreen video,
        :-webkit-full-screen video {
          -webkit-transform: translateZ(0) !important;
          transform: translateZ(0) !important;
        }
        
        /* Prevent bounce effect on iOS */
        .iframe-mobile-optimized {
          -webkit-overflow-scrolling: touch !important;
        }
      }
      
      /* Android Chrome specific fixes */
      @media screen and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
        .video-player-container video {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        .iframe-mobile-optimized {
          overflow: auto !important;
        }
      }
      
      /* Orientation lock notification */
      .orientation-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1000001;
        text-align: center;
        max-width: 300px;
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .rotate-icon {
        animation: rotateAnimation 2s linear infinite;
        display: inline-block;
        margin-bottom: 10px;
      }
      
      @keyframes rotateAnimation {
        from { transform: rotate(0deg); }
        to { transform: rotate(90deg); }
      }
      
      /* Ensure iframe is fully visible in all modes */
      iframe {
        box-sizing: border-box !important;
        -webkit-box-sizing: border-box !important;
        -moz-box-sizing: border-box !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Update iframe dimensions when entering/exiting fullscreen
  useEffect(() => {
    if (isIframeSource) {
      updateIframeDimensions();
    }
  }, [isFullscreen, isLandscapeLocked, isIframeSource]);

  if (streams.length === 0) {
    return (
      <div className="w-full aspect-video bg-black rounded-xl border border-dark-border flex items-center justify-center text-gray-400">
        No streams available for this content.
      </div>
    );
  }

  return (
    <>
      {/* Orientation notification for mobile */}
      {isFullscreen && isMobile && orientationError && (
        <div className="orientation-notification">
          <RotateCw size={48} className="rotate-icon text-brand-400 mx-auto" />
          <h3 className="text-lg font-bold mb-2">Rotate Your Device</h3>
          <p className="text-sm text-gray-300 mb-4">
            Please rotate your device to landscape mode for the best viewing experience.
          </p>
          <button
            onClick={() => setOrientationError(null)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div ref={containerRef} className="video-player-container w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-dark-border">
        <div className="bg-dark-surface px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-dark-border gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium text-sm truncate max-w-[200px] sm:max-w-none">
              {title || 'Unknown Title'}
              {isIframeSource && (
                <span className="ml-2 text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded hidden sm:inline-flex items-center gap-1">
                  <Monitor size={10} /> External
                </span>
              )}
              {isLandscapeLocked && isMobile && (
                <span className="ml-2 text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded hidden sm:inline">
                  Landscape
                </span>
              )}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Palette size={14} className="text-brand-400" />
                <span className="text-xs text-gray-300 hidden sm:inline">Enhance:</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setVideoEnhancement(!videoEnhancement)}
                  className={`px-3 py-1 text-xs font-medium rounded-l-lg border ${
                    videoEnhancement 
                      ? 'bg-brand-600 text-white border-brand-500' 
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                  }`}
                  title="Toggle video enhancement"
                >
                  {videoEnhancement ? 'ON' : 'OFF'}
                </button>
                
                {videoEnhancement && (
                  <div className="relative group">
                    <button
                      className="px-3 py-1 text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 border-l-0 rounded-r-lg hover:bg-gray-700 flex items-center gap-1"
                      title="Video enhancement presets"
                    >
                      <Settings size={12} />
                    </button>
                    
                    <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-2">
                        <div className="text-xs text-gray-400 px-2 py-1 mb-1">Filter Presets:</div>
                        {Object.keys(filterPresets).map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setVideoFilter(preset)}
                            className={`w-full text-left px-3 py-2 rounded text-xs font-medium mb-1 transition-all ${
                              videoFilter === preset 
                                ? 'filter-preset-active' 
                                : 'text-gray-300 hover:bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="capitalize">{preset}</span>
                              {videoFilter === preset && (
                                <Zap size={10} className="text-yellow-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <span className="text-xs bg-brand-900 text-brand-200 px-2 py-0.5 rounded hidden sm:flex items-center gap-1">
                <ShieldCheck size={10} /> Secure
              </span>
              <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded flex items-center gap-1">
                <Zap size={10} /> {streams[activeServer]?.quality || 'HD'}
              </span>
              {videoEnhancement && (
                <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded hidden sm:flex items-center gap-1">
                  <Eye size={10} /> Enhanced
                </span>
              )}
              {isIframeSource && (
                <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded flex items-center gap-1 sm:hidden">
                  <Monitor size={10} /> Ext
                </span>
              )}
              <button
                onClick={handleFullscreen}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded hover:bg-gray-700 flex items-center gap-1"
                title="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 size={12} />
                    <span className="hidden sm:inline">Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={12} />
                    <span className="hidden sm:inline">Full</span>
                  </>
                )}
              </button>
              {isMobile && isFullscreen && !isLandscapeLocked && (
                <button
                  onClick={lockOrientation}
                  className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded hover:bg-yellow-800/30 flex items-center gap-1"
                  title="Lock to landscape mode"
                >
                  <RotateCw size={12} />
                  <span className="hidden sm:inline">Landscape</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-video bg-black group overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-brand-600/30 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                </div>
                {videoEnhancement && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-full blur-xl"></div>
                )}
              </div>
              <div className="absolute bottom-10 text-center">
                <div className="text-sm text-gray-400 mb-2">Loading stream...</div>
                {videoEnhancement && (
                  <div className="text-xs text-brand-400">Applying video enhancement</div>
                )}
                {isIframeSource && (
                  <div className="text-xs text-blue-400 mt-1">Loading external player...</div>
                )}
              </div>
            </div>
          )}
          
          {playerError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
              <div className="text-center p-6">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <div className="text-white font-medium mb-2">Failed to load stream</div>
                <div className="text-gray-400 text-sm mb-4">
                  The stream could not be loaded. Please try another server.
                </div>
                <button
                  onClick={() => {
                    setPlayerError(false);
                    setIsLoading(true);
                    // Reload the current stream
                    const currentStream = streams[activeServer];
                    if (currentStream) {
                      if (isIframeSource && iframeRef.current) {
                        iframeRef.current.src = currentStream.url;
                      }
                    }
                  }}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          {videoEnhancement && !isLoading && !playerError && (
            <div className="absolute inset-0 z-10 video-enhancement-overlay"></div>
          )}
          
          {renderVideoPlayer()}
        </div>

        {streams.length > 1 && (
          <div className="bg-[#0f172a] p-4 border-t border-dark-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-gray-400" />
                <span className="text-gray-400 text-sm font-bold">SWITCH SERVER:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {streams.map((server, idx) => (
                  <button
                    key={server.id || idx}
                    onClick={() => setActiveServer(idx)}
                    className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden group ${
                      activeServer === idx
                        ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/20'
                        : 'bg-dark-surface text-gray-400 hover:bg-white/10 hover:text-white border border-dark-border'
                    } ${isMobile ? 'flex-1 min-w-[100px]' : ''}`}
                    aria-label={`Switch to ${server.name}`}
                  >
                    <span className="relative z-10 truncate">{server.name}</span>
                    {activeServer === idx && videoEnhancement && (
                      <span className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20"></span>
                    )}
                    {server.type === 'iframe' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2 text-yellow-500/80 text-xs">
                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                <p>If the current server is buffering or not working, please switch to another server. Ad-blockers may interfere with playback.</p>
              </div>
              
              {videoEnhancement && (
                <div className="flex items-start gap-2 text-brand-400/80 text-xs">
                  <Zap size={12} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Video Enhancement Active:</p>
                    <p className="text-gray-500 mt-0.5">Applying {videoFilter} filter for improved brightness, contrast, and color saturation.</p>
                  </div>
                </div>
              )}
            </div>
            
            {isIframeSource && (
              <div className="mt-4 pt-4 border-t border-blue-800/30">
                <div className="flex items-start gap-2 text-blue-400/80 text-xs">
                  <Monitor size={12} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">External Player Detected:</p>
                    <p className="text-gray-500 mt-0.5">This content uses an external video player. For best experience on mobile, use fullscreen mode and rotate to landscape.</p>
                  </div>
                </div>
              </div>
            )}
            
            {videoEnhancement && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Palette size={14} className="text-brand-400" />
                    <span className="text-sm text-gray-300">Active Filter Preset:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(filterPresets)
                      .filter(preset => preset !== 'off')
                      .map(preset => (
                        <button
                          key={preset}
                          onClick={() => setVideoFilter(preset)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all flex-shrink-0 ${
                            videoFilter === preset
                              ? 'bg-gradient-to-r from-brand-500/20 to-purple-500/20 text-brand-300 border-brand-500/30'
                              : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800'
                          }`}
                        >
                          {preset.charAt(0).toUpperCase() + preset.slice(1)}
                        </button>
                      ))
                    }
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-gray-900/50 p-2 rounded">
                    <div className="text-gray-500">Brightness</div>
                    <div className="text-brand-300 font-medium">
                      {videoFilter === 'vivid' ? '+8%' : 
                       videoFilter === 'cinema' ? '+3%' : 
                       videoFilter === 'gaming' ? '+7%' : '+5%'}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 p-2 rounded">
                    <div className="text-gray-500">Contrast</div>
                    <div className="text-brand-300 font-medium">
                      {videoFilter === 'vivid' ? '+18%' : 
                       videoFilter === 'cinema' ? '+12%' : 
                       videoFilter === 'sports' ? '+20%' : '+10%'}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 p-2 rounded">
                    <div className="text-gray-500">Saturation</div>
                    <div className="text-brand-300 font-medium">
                      {videoFilter === 'vivid' ? '+15%' : 
                       videoFilter === 'cinema' ? '+5%' : 
                       videoFilter === 'gaming' ? '+12%' : '+8%'}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 p-2 rounded">
                    <div className="text-gray-500">Color Temp</div>
                    <div className="text-brand-300 font-medium">
                      {videoFilter === 'vivid' ? '+0.5°' : 
                       videoFilter === 'cinema' ? '-0.2°' : 
                       videoFilter === 'gaming' ? '+0.3°' : 'Neutral'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {streams.length === 1 && videoEnhancement && (
          <div className="bg-[#0f172a] p-3 border-t border-dark-border">
            <div className="flex items-center justify-center gap-2 text-xs">
              <Zap size={12} className="text-brand-400 animate-pulse" />
              <span className="text-brand-300">Video enhancement active: {videoFilter} preset applied</span>
              <Zap size={12} className="text-brand-400 animate-pulse delay-300" />
            </div>
            {isIframeSource && (
              <div className="flex items-center justify-center gap-2 text-xs mt-2 text-blue-300">
                <Monitor size={12} /> Using external video player
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VideoPlayer;