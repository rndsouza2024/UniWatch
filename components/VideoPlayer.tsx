
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { Server, AlertCircle, Zap, Eye, Palette } from 'lucide-react';
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
//   title,
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
//     standard: 'brightness(1.02) contrast(1.05) saturate(1.0)',
//     hdr: 'brightness(1.15) contrast(1.25) saturate(1.25)',
//     vivid: 'brightness(1.12) contrast(1.35) saturate(1.45)',
//     cinema: 'brightness(0.98) contrast(1.25) saturate(0.95) hue-rotate(-2deg)',
//     sharp: 'brightness(1.2) contrast(1.4) saturate(1.1)',
//     gaming: 'brightness(1.08) contrast(1.28) saturate(1.25) hue-rotate(1.5deg)',
//     sports: 'brightness(1.1) contrast(1.3) saturate(1.4)',
//     natural: 'brightness(1.05) contrast(1.1) saturate(1.08)',
//     off: 'none',
//   };

//   const isM3U8Url = (url: string) => {
//     return url.includes('.m3u8') || url.includes('/hls/') || url.includes('m3u8');
//   };

//   const isDirectVideoUrl = (url: string) => {
//     const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
//     return videoExtensions.some((ext) => url.includes(ext)) || url.includes('videoplayback');
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
//       objectFit: 'contain',
//     };
//   };

//   const streams = useMemo(() => {
//     if (customStreams && customStreams.length > 0) {
//       return customStreams;
//     }

//     if (!tmdbId) return [];

//     if (type === 'movie') {
//       const movie = UNIQUE_MOVIES.find((m) => m.id === tmdbId.toString());
//       if (!movie || !movie.streams) return [];

//       return Object.entries(movie.streams).map(([serverName, url], index) => ({
//         id: `movie-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: index === 0 ? 'FHD' : 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe',
//       }));
//     } else if (type === 'tv') {
//       const tvShow = UNIQUE_TV_SHOWS.find((tv) => tv.id === tmdbId.toString());
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
//           type: isM3U8Url(processedUrl) ? 'hls' : isDirectVideoUrl(processedUrl) ? 'direct' : 'iframe',
//         };
//       });
//     } else if (type === 'sports') {
//       const sport = UNIQUE_SPORTS.find((s) => s.id === tmdbId.toString());
//       if (!sport || !sport.streams) return [];

//       return Object.entries(sport.streams).map(([serverName, url], index) => ({
//         id: `sports-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: index === 0 ? 'FHD' : 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe',
//       }));
//     } else if (type === 'tv_live') {
//       const tvLive = UNIQUE_TV_LIVE.find((tv) => tv.id === tmdbId.toString());
//       if (!tvLive || !tvLive.streams) return [];

//       return Object.entries(tvLive.streams).map(([serverName, url], index) => ({
//         id: `tv_live-${tmdbId}-s${index + 1}`,
//         name: serverName,
//         url: url as string,
//         quality: 'HD',
//         type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe',
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
//       setIsFullscreen(
//         !!document.fullscreenElement ||
//           !!(document as any).webkitFullscreenElement ||
//           !!(document as any).msFullscreenElement
//       );
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

//       /* Mobile-specific styles - COMPLETELY REVISED */
//       @media (max-width: 768px) {
//         .video-player-container {
//           width: 100% !important;
//           max-width: 100% !important;
//           border-radius: 8px !important;
//           overflow: hidden !important;
//           display: flex !important;
//           flex-direction: column !important;
//           background: #000 !important;
//         }
        
//         .video-player-container .relative {
//           width: 100% !important;
//           flex: 1 !important;
//           min-height: 300px !important;
//           position: relative !important;
//           background: #000 !important;
//         }
        
//         video, iframe {
//           width: 100% !important;
//           height: 100% !important;
//           position: absolute !important;
//           top: 0 !important;
//           left: 0 !important;
//           right: 0 !important;
//           bottom: 0 !important;
//           object-fit: contain !important;
//           display: block !important;
//         }
        
//         .mobile-controls-bar {
//           width: 100% !important;
//           background: rgba(0, 0, 0, 0.85) !important;
//           backdrop-filter: blur(10px) !important;
//           border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
//           padding: 8px 12px !important;
//           display: flex !important;
//           flex-direction: column !important;
//           gap: 8px !important;
//           position: relative !important;
//           z-index: 50 !important;
//         }
        
//         .mobile-controls-row {
//           display: flex !important;
//           align-items: center !important;
//           justify-content: space-between !important;
//           width: 100% !important;
//           gap: 8px !important;
//         }
        
//         .mobile-controls-group {
//           display: flex !important;
//           align-items: center !important;
//           gap: 8px !important;
//           flex: 1 !important;
//           min-width: 0 !important;
//         }
        
//         .mobile-controls-title {
//           font-size: 12px !important;
//           color: white !important;
//           font-weight: 500 !important;
//           white-space: nowrap !important;
//           overflow: hidden !important;
//           text-overflow: ellipsis !important;
//           max-width: 150px !important;
//         }
        
//         .mobile-enhance-toggle {
//           display: flex !important;
//           align-items: center !important;
//           border-radius: 6px !important;
//           overflow: hidden !important;
//           border: 1px solid rgba(59, 130, 246, 0.5) !important;
//         }
        
//         .mobile-enhance-button {
//           padding: 6px 10px !important;
//           font-size: 11px !important;
//           border: none !important;
//           background: rgba(59, 130, 246, 0.2) !important;
//           color: #93c5fd !important;
//           display: flex !important;
//           align-items: center !important;
//           gap: 4px !important;
//           cursor: pointer !important;
//         }
        
//         .mobile-enhance-button.active {
//           background: #3b82f6 !important;
//           color: white !important;
//         }
        
//         .mobile-select {
//           padding: 6px 10px !important;
//           font-size: 11px !important;
//           border-radius: 6px !important;
//           border: 1px solid rgba(245, 158, 11, 0.5) !important;
//           background: rgba(245, 158, 11, 0.2) !important;
//           color: #fde68a !important;
//           font-weight: 600 !important;
//           min-width: 100px !important;
//           cursor: pointer !important;
//         }
        
//         .mobile-select.filter-select {
//           border-color: rgba(59, 130, 246, 0.5) !important;
//           background: rgba(59, 130, 246, 0.2) !important;
//           color: #93c5fd !important;
//         }
        
//         .mobile-fullscreen-button {
//           padding: 6px 12px !important;
//           background: rgba(255, 255, 255, 0.1) !important;
//           border: 1px solid rgba(255, 255, 255, 0.2) !important;
//           border-radius: 6px !important;
//           color: white !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           cursor: pointer !important;
//         }
        
//         .mobile-server-icon {
//           color: #f59e0b !important;
//           font-size: 14px !important;
//         }
        
//         .mobile-filter-icon {
//           color: #3b82f6 !important;
//           font-size: 14px !important;
//         }
        
//         /* Mobile fullscreen optimizations */
//         @media (max-width: 768px) and (orientation: landscape) {
//           .video-player-container .relative {
//             min-height: 200px !important;
//           }
//         }
//       }
      
//       /* iOS Safari specific fixes */
//       @supports (-webkit-touch-callout: none) {
//         .video-player-container {
//           -webkit-overflow-scrolling: touch !important;
//         }
        
//         video, iframe {
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

//   // Mobile layout with ALWAYS VISIBLE controls
//   if (isMobile) {
//     return (
//       <div
//         ref={containerRef}
//         className="video-player-container w-full bg-black rounded-xl overflow-hidden border border-gray-800"
//         style={{ height: isFullscreen ? '100vh' : 'auto', maxHeight: isFullscreen ? '100vh' : '600px' }}
//       >
//         {/* Video/Iframe Container - Takes most of the space */}
//         <div className="relative w-full" style={{ height: isFullscreen ? 'calc(100vh - 100px)' : '350px', minHeight: '300px' }}>
//           {isLoading && (
//             <div className="absolute inset-0 bg-black flex items-center justify-center z-40">
//               <div className="flex flex-col items-center gap-3">
//                 <div className="w-10 h-10 border-3 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
//                 <span className="text-gray-400 text-sm">Loading...</span>
//               </div>
//             </div>
//           )}

//           {playerError && (
//             <div className="absolute inset-0 bg-black flex items-center justify-center z-40">
//               <div className="flex flex-col items-center gap-3 text-center px-4">
//                 <AlertCircle size={32} className="text-red-500" />
//                 <span className="text-gray-300 text-sm">Failed to load stream</span>
//               </div>
//             </div>
//           )}

//           {renderVideoPlayer()}
//         </div>

//         {/* ALWAYS VISIBLE MOBILE CONTROLS BAR - NEVER HIDES */}
//         <div className="mobile-controls-bar">
//           {/* Top row: Title and Fullscreen */}
//           <div className="mobile-controls-row">
//             <div className="mobile-controls-group">
//               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//               <span className="mobile-controls-title">{title || 'Video Player'}</span>
//             </div>
            
//             <button
//               onClick={handleFullscreen}
//               className="mobile-fullscreen-button"
//               title="Toggle Fullscreen"
//             >
//               <Zap size={16} />
//             </button>
//           </div>

//           {/* Bottom row: Controls */}
//           <div className="mobile-controls-row">
//             {/* Left side: Enhancement toggle */}
//             <div className="mobile-controls-group">
//               <div className="mobile-enhance-toggle">
//                 <button
//                   onClick={() => setVideoEnhancement(true)}
//                   className={`mobile-enhance-button ${videoEnhancement ? 'active' : ''}`}
//                 >
//                   <Eye size={12} />
//                   <span>On</span>
//                 </button>
//                 <button
//                   onClick={() => setVideoEnhancement(false)}
//                   className={`mobile-enhance-button ${!videoEnhancement ? 'active' : ''}`}
//                 >
//                   <span>Off</span>
//                 </button>
//               </div>

//               {/* Filter dropdown - ALWAYS VISIBLE when enhancement is on */}
//               {videoEnhancement && (
//                 <div className="mobile-controls-group" style={{ minWidth: '100px' }}>
//                   <Palette size={14} className="mobile-filter-icon" />
//                   <select
//                     value={videoFilter}
//                     onChange={(e) => setVideoFilter(e.target.value)}
//                     className="mobile-select filter-select"
//                   >
//                     <option value="standard">Standard</option>
//                     <option value="hdr">HDR</option>
//                     <option value="vivid">Vivid</option>
//                     <option value="cinema">Cinema</option>
//                     <option value="sharp">Sharp</option>
//                     <option value="gaming">Gaming</option>
//                     <option value="sports">Sports</option>
//                     <option value="natural">Natural</option>
//                   </select>
//                 </div>
//               )}
//             </div>

//             {/* Right side: Server selector */}
//             {streams.length > 1 && (
//               <div className="mobile-controls-group" style={{ justifyContent: 'flex-end' }}>
//                 <Server size={14} className="mobile-server-icon" />
//                 <select
//                   value={activeServer}
//                   onChange={(e) => setActiveServer(Number(e.target.value))}
//                   className="mobile-select"
//                 >
//                   {streams.map((stream, index) => (
//                     <option key={stream.id} value={index}>
//                       {stream.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Desktop layout (unchanged)
//   return (
//     <div
//       ref={containerRef}
//       className="video-player-container relative w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-dark-border"
//     >
//       {/* VIDEO PLAYER CONTAINER */}
//       <div className="relative w-full bg-black aspect-video">
//         {isLoading && (
//           <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-12 h-12 border-4 border-dark-border border-t-brand-500 rounded-full animate-spin"></div>
//               <span className="text-gray-400 text-sm">Loading stream...</span>
//             </div>
//           </div>
//         )}

//         {playerError && (
//           <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
//             <div className="flex flex-col items-center gap-3 text-center px-4">
//               <AlertCircle size={40} className="text-red-500" />
//               <span className="text-gray-300 text-sm">Failed to load stream. Please try another server.</span>
//             </div>
//           </div>
//         )}

//         {renderVideoPlayer()}
//       </div>

//       {/* Desktop Controls */}
//       <div className="absolute top-0 left-0 right-0 z-50 bg-dark-surface/70 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-dark-border/40 gap-3 rounded-t-xl transition-all duration-300 hover:bg-dark-surface/80">
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
//           <span className="text-white font-medium text-sm truncate">
//             {title || 'Unknown Title'}
//           </span>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* ENHANCEMENT TOGGLE */}
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-1.5">
//               <Palette size={14} className="text-brand-400 flex-shrink-0" />
//               <span className="text-xs text-gray-300">Enhance:</span>
//             </div>
//             <div className="flex items-center">
//               <button
//                 onClick={() => setVideoEnhancement(!videoEnhancement)}
//                 className={`px-3 py-1 text-xs font-medium rounded-l-lg border transition-all ${
//                   videoEnhancement
//                     ? 'bg-brand-600 text-white border-brand-500'
//                     : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-500'
//                 }`}
//               >
//                 <Eye size={12} className="inline mr-1" />
//                 On
//               </button>
//               <button
//                 onClick={() => setVideoEnhancement(false)}
//                 className={`px-3 py-1 text-xs font-medium rounded-r-lg border-l-0 border transition-all ${
//                   !videoEnhancement
//                     ? 'bg-brand-600 text-white border-brand-500'
//                     : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-500'
//                 }`}
//               >
//                 Off
//               </button>
//             </div>
//           </div>

//           {/* FILTER PRESETS DROPDOWN */}
//           {videoEnhancement && (
//             <div className="flex items-center gap-2">
//               <select
//                 value={videoFilter}
//                 onChange={(e) => setVideoFilter(e.target.value)}
//                 className="bg-brand-500 text-white text-xs font-bold border border-brand-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-400/40 transition-all hover:bg-brand-400 min-w-[100px]"
//               >
//                 <option value="standard" className="bg-black text-brand-400 font-semibold">
//                   Standard
//                 </option>
//                 <option value="hdr" className="bg-black text-brand-400 font-semibold">
//                   HDR
//                 </option>
//                 <option value="vivid" className="bg-black text-brand-400 font-semibold">
//                   Vivid
//                 </option>
//                 <option value="cinema" className="bg-black text-brand-400 font-semibold">
//                   Cinema
//                 </option>
//                 <option value="sharp" className="bg-black text-brand-400 font-semibold">
//                   Sharp
//                 </option>
//                 <option value="gaming" className="bg-black text-brand-400 font-semibold">
//                   Gaming
//                 </option>
//                 <option value="sports" className="bg-black text-brand-400 font-semibold">
//                   Sports
//                 </option>
//                 <option value="natural" className="bg-black text-brand-400 font-semibold">
//                   Natural
//                 </option>
//               </select>
//             </div>
//           )}

//           {streams.length > 1 && (
//             <div className="flex items-center gap-2">
//               <Server size={14} className="text-amber-400 font-bold flex-shrink-0" />
//               <select
//                 value={activeServer}
//                 onChange={(e) => setActiveServer(Number(e.target.value))}
//                 className="bg-amber-500 text-black text-xs font-bold border border-amber-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-400/40 transition-all hover:bg-amber-400 min-w-[100px]"
//               >
//                 {streams.map((stream, index) => (
//                   <option key={stream.id} value={index} className="bg-black text-amber-400 font-semibold">
//                     {stream.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <button
//             onClick={handleFullscreen}
//             className="p-2 rounded-lg bg-transparent hover:bg-dark-700 text-gray-300 hover:text-white transition-all border border-transparent hover:border-dark-border flex-shrink-0"
//             title="Toggle Fullscreen"
//           >
//             <Zap size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Server, AlertCircle, Zap, Eye, Palette } from 'lucide-react';
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
  title,
}) => {
  const [activeServer, setActiveServer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [videoEnhancement, setVideoEnhancement] = useState(true);
  const [videoFilter, setVideoFilter] = useState('standard');
  const [playerError, setPlayerError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  const filterPresets = {
    standard: 'brightness(1.02) contrast(1.05) saturate(1.0)',
    hdr: 'brightness(1.15) contrast(1.25) saturate(1.25)',
    vivid: 'brightness(1.12) contrast(1.35) saturate(1.45)',
    cinema: 'brightness(0.98) contrast(1.25) saturate(0.95) hue-rotate(-2deg)',
    sharp: 'brightness(1.2) contrast(1.4) saturate(1.1)',
    gaming: 'brightness(1.08) contrast(1.28) saturate(1.25) hue-rotate(1.5deg)',
    sports: 'brightness(1.1) contrast(1.3) saturate(1.4)',
    natural: 'brightness(1.05) contrast(1.1) saturate(1.08)',
    off: 'none',
  };

  const isM3U8Url = (url: string) => {
    return url.includes('.m3u8') || url.includes('/hls/') || url.includes('m3u8');
  };

  const isDirectVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    return videoExtensions.some((ext) => url.includes(ext)) || url.includes('videoplayback');
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
      transform: 'translate3d(0,0,0)',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    };
  };

  const streams = useMemo(() => {
    if (customStreams && customStreams.length > 0) {
      return customStreams;
    }

    if (!tmdbId) return [];

    if (type === 'movie') {
      const movie = UNIQUE_MOVIES.find((m) => m.id === tmdbId.toString());
      if (!movie || !movie.streams) return [];

      return Object.entries(movie.streams).map(([serverName, url], index) => ({
        id: `movie-${tmdbId}-s${index + 1}`,
        name: serverName,
        url: url as string,
        quality: index === 0 ? 'FHD' : 'HD',
        type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe',
      }));
    } else if (type === 'tv') {
      const tvShow = UNIQUE_TV_SHOWS.find((tv) => tv.id === tmdbId.toString());
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
          type: isM3U8Url(processedUrl) ? 'hls' : isDirectVideoUrl(processedUrl) ? 'direct' : 'iframe',
        };
      });
    } else if (type === 'sports') {
      const sport = UNIQUE_SPORTS.find((s) => s.id === tmdbId.toString());
      if (!sport || !sport.streams) return [];

      return Object.entries(sport.streams).map(([serverName, url], index) => ({
        id: `sports-${tmdbId}-s${index + 1}`,
        name: serverName,
        url: url as string,
        quality: index === 0 ? 'FHD' : 'HD',
        type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe',
      }));
    } else if (type === 'tv_live') {
      const tvLive = UNIQUE_TV_LIVE.find((tv) => tv.id === tmdbId.toString());
      if (!tvLive || !tvLive.streams) return [];

      return Object.entries(tvLive.streams).map(([serverName, url], index) => ({
        id: `tv_live-${tmdbId}-s${index + 1}`,
        name: serverName,
        url: url as string,
        quality: 'HD',
        type: isM3U8Url(url as string) ? 'hls' : isDirectVideoUrl(url as string) ? 'direct' : 'iframe',
      }));
    }

    return [];
  }, [customStreams, tmdbId, type, season, episode]);

  useEffect(() => {
    setIsLoading(true);
    setPlayerError(false);
    setActiveServer(0);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  }, [tmdbId, type, season, episode]);

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
      setIsLoading(false);
    }
  }, [activeServer, streams]);

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!document.fullscreenElement ||
          !!(document as any).webkitFullscreenElement ||
          !!(document as any).msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

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
          src={currentStream.url}
          className="w-full h-full border-0"
          style={getVideoFilterStyle()}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setPlayerError(true);
            setIsLoading(false);
          }}
          title={`${title || 'Video'} Player`}
          referrerPolicy="strict-origin-when-cross-origin"
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

      /* MOBILE RESPONSIVE ENHANCEMENTS - COMPLETE OVERHAUL */
      @media (max-width: 768px) {
        /* Base mobile container */
        .video-player-container {
          width: 100% !important;
          max-width: 100% !important;
          min-height: 250px !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          background: #000 !important;
          position: relative !important;
        }
        
        /* Video container - dynamic height */
        .video-player-container .video-container {
          width: 100% !important;
          flex: 1 !important;
          position: relative !important;
          background: #000 !important;
          min-height: 200px !important;
          max-height: 70vh !important;
        }
        
        /* Video/iframe elements */
        .video-player-container video,
        .video-player-container iframe {
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          object-fit: contain !important;
          display: block !important;
        }
        
        /* Mobile controls bar - ALWAYS VISIBLE */
        .mobile-controls-bar {
          width: 100% !important;
          background: rgba(0, 0, 0, 0.95) !important;
          backdrop-filter: blur(15px) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
          padding: 10px 12px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
          position: relative !important;
          z-index: 9999 !important;
          flex-shrink: 0 !important;
        }
        
        /* Mobile controls layout */
        .mobile-controls-row {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          gap: 10px !important;
          flex-wrap: nowrap !important;
        }
        
        .mobile-controls-group {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          flex: 1 !important;
          min-width: 0 !important;
          flex-wrap: nowrap !important;
        }
        
        /* Title area */
        .mobile-controls-title {
          font-size: 13px !important;
          color: white !important;
          font-weight: 500 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          flex: 1 !important;
          min-width: 50px !important;
        }
        
        /* Enhancement toggle */
        .mobile-enhance-toggle {
          display: flex !important;
          align-items: center !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          border: 1px solid rgba(59, 130, 246, 0.6) !important;
          flex-shrink: 0 !important;
        }
        
        .mobile-enhance-button {
          padding: 8px 12px !important;
          font-size: 12px !important;
          border: none !important;
          background: rgba(59, 130, 246, 0.2) !important;
          color: #93c5fd !important;
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          flex-shrink: 0 !important;
        }
        
        .mobile-enhance-button.active {
          background: #3b82f6 !important;
          color: white !important;
          font-weight: 600 !important;
        }
        
        /* Select dropdowns */
        .mobile-select {
          padding: 8px 12px !important;
          font-size: 12px !important;
          border-radius: 8px !important;
          border: 1px solid rgba(245, 158, 11, 0.6) !important;
          background: rgba(245, 158, 11, 0.2) !important;
          color: #fde68a !important;
          font-weight: 600 !important;
          min-width: 100px !important;
          max-width: 150px !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        
        .mobile-select.filter-select {
          border-color: rgba(59, 130, 246, 0.6) !important;
          background: rgba(59, 130, 246, 0.2) !important;
          color: #93c5fd !important;
        }
        
        /* Fullscreen button */
        .mobile-fullscreen-button {
          padding: 8px 12px !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          border-radius: 8px !important;
          color: white !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
        }
        
        .mobile-fullscreen-button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
        
        /* Icons */
        .mobile-server-icon {
          color: #f59e0b !important;
          font-size: 14px !important;
          flex-shrink: 0 !important;
        }
        
        .mobile-filter-icon {
          color: #3b82f6 !important;
          font-size: 14px !important;
          flex-shrink: 0 !important;
        }
        
        /* Live indicator */
        .mobile-live-indicator {
          width: 8px !important;
          height: 8px !important;
          background: #ef4444 !important;
          border-radius: 50% !important;
          margin-right: 6px !important;
          flex-shrink: 0 !important;
          animation: pulse 1.5s infinite !important;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      }
      
      /* LANDSCAPE ORIENTATION OPTIMIZATIONS */
      @media (max-width: 768px) and (orientation: landscape) {
        .video-player-container {
          height: 100vh !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          flex-direction: row !important;
        }
        
        .video-player-container .video-container {
          height: 100% !important;
          max-height: 100% !important;
          flex: 1 !important;
        }
        
        .mobile-controls-bar {
          width: auto !important;
          min-width: 180px !important;
          height: 100% !important;
          border-top: none !important;
          border-left: 1px solid rgba(255, 255, 255, 0.15) !important;
          padding: 15px 12px !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          gap: 20px !important;
        }
        
        .mobile-controls-row {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 15px !important;
        }
        
        .mobile-controls-group {
          flex-direction: column !important;
          align-items: flex-start !important;
          width: 100% !important;
        }
        
        .mobile-select {
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
        }
        
        .mobile-enhance-toggle {
          width: 100% !important;
          justify-content: stretch !important;
        }
        
        .mobile-enhance-button {
          flex: 1 !important;
          justify-content: center !important;
        }
        
        .mobile-controls-title {
          font-size: 14px !important;
          white-space: normal !important;
          word-break: break-word !important;
        }
      }
      
      /* SMALL MOBILE PHONES */
      @media (max-width: 480px) {
        .mobile-controls-bar {
          padding: 8px 10px !important;
          gap: 8px !important;
        }
        
        .mobile-enhance-button {
          padding: 6px 10px !important;
          font-size: 11px !important;
        }
        
        .mobile-select {
          padding: 6px 10px !important;
          font-size: 11px !important;
          min-width: 90px !important;
        }
        
        .mobile-controls-title {
          font-size: 12px !important;
          max-width: 100px !important;
        }
      }
      
      /* VERY SMALL PHONES */
      @media (max-width: 360px) {
        .mobile-controls-bar {
          padding: 6px 8px !important;
        }
        
        .mobile-enhance-toggle {
          flex-direction: column !important;
          width: 60px !important;
        }
        
        .mobile-enhance-button {
          width: 100% !important;
          justify-content: center !important;
          padding: 5px 6px !important;
        }
        
        .mobile-controls-title {
          font-size: 11px !important;
          max-width: 80px !important;
        }
        
        .mobile-select {
          min-width: 80px !important;
          font-size: 10px !important;
          padding: 5px 8px !important;
        }
      }
      
      /* iOS Safari specific fixes */
      @supports (-webkit-touch-callout: none) {
        .video-player-container {
          -webkit-overflow-scrolling: touch !important;
        }
        
        video, iframe {
          -webkit-transform: translateZ(0) !important;
          transform: translateZ(0) !important;
        }
        
        .mobile-select {
          -webkit-appearance: none !important;
          appearance: none !important;
          padding-right: 30px !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2393c5fd' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 8px center !important;
          background-size: 16px !important;
        }
        
        .mobile-select.filter-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2393c5fd' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
        }
      }
      
      /* Android Chrome fixes */
      @supports not (-webkit-touch-callout: none) {
        .mobile-select {
          cursor: pointer !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (streams.length === 0) {
    return (
      <div className="w-full aspect-video bg-black rounded-xl border border-dark-border flex items-center justify-center text-gray-400">
        No streams available for this content.
      </div>
    );
  }

  // MOBILE LAYOUT - COMPLETELY REVISED FOR ROBUST RESPONSIVENESS
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="video-player-container w-full bg-black rounded-xl overflow-hidden border border-gray-800"
        style={{
          height: isFullscreen ? '100vh' : isLandscape ? '100vh' : 'auto',
          maxHeight: isFullscreen ? '100vh' : isLandscape ? '100vh' : '600px'
        }}
      >
        {/* Video/Iframe Container - Dynamic height */}
        <div 
          className="video-container relative w-full"
          style={{
            height: isFullscreen ? '100%' : isLandscape ? '100%' : 'auto',
            minHeight: isLandscape ? '100%' : '300px',
            flex: '1 1 auto'
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-40">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-gray-400 text-sm">Loading...</span>
              </div>
            </div>
          )}

          {playerError && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-40">
              <div className="flex flex-col items-center gap-3 text-center px-4">
                <AlertCircle size={32} className="text-red-500" />
                <span className="text-gray-300 text-sm">Failed to load stream</span>
              </div>
            </div>
          )}

          {renderVideoPlayer()}
        </div>

        {/* ALWAYS VISIBLE MOBILE CONTROLS BAR - COMPLETELY RESPONSIVE */}
        <div className="mobile-controls-bar">
          {/* Top row: Title and Fullscreen */}
          <div className="mobile-controls-row">
            <div className="mobile-controls-group">
              <div className="mobile-live-indicator"></div>
              <span className="mobile-controls-title">{title || 'Video Player'}</span>
            </div>
            
            <button
              onClick={handleFullscreen}
              className="mobile-fullscreen-button"
              title="Toggle Fullscreen"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Zap size={16} />
            </button>
          </div>

          {/* Bottom row: Controls - ALWAYS VISIBLE */}
          <div className="mobile-controls-row">
            {/* Left side: Enhancement toggle and filter */}
            <div className="mobile-controls-group">
              <div className="mobile-enhance-toggle">
                <button
                  onClick={() => setVideoEnhancement(true)}
                  className={`mobile-enhance-button ${videoEnhancement ? 'active' : ''}`}
                  aria-label="Enable video enhancement"
                >
                  <Eye size={12} />
                  <span>On</span>
                </button>
                <button
                  onClick={() => setVideoEnhancement(false)}
                  className={`mobile-enhance-button ${!videoEnhancement ? 'active' : ''}`}
                  aria-label="Disable video enhancement"
                >
                  <span>Off</span>
                </button>
              </div>

              {/* Filter dropdown - ALWAYS VISIBLE when enhancement is on */}
              {videoEnhancement && (
                <div className="mobile-controls-group">
                  <Palette size={14} className="mobile-filter-icon" />
                  <select
                    value={videoFilter}
                    onChange={(e) => setVideoFilter(e.target.value)}
                    className="mobile-select filter-select"
                    aria-label="Video filter preset"
                  >
                    <option value="standard">Standard</option>
                    <option value="hdr">HDR</option>
                    <option value="vivid">Vivid</option>
                    <option value="cinema">Cinema</option>
                    <option value="sharp">Sharp</option>
                    <option value="gaming">Gaming</option>
                    <option value="sports">Sports</option>
                    <option value="natural">Natural</option>
                  </select>
                </div>
              )}
            </div>

            {/* Right side: Server selector */}
            {streams.length > 1 && (
              <div className="mobile-controls-group">
                <Server size={14} className="mobile-server-icon" />
                <select
                  value={activeServer}
                  onChange={(e) => setActiveServer(Number(e.target.value))}
                  className="mobile-select"
                  aria-label="Select video server"
                >
                  {streams.map((stream, index) => (
                    <option key={stream.id} value={index}>
                      {stream.name} {stream.quality ? `(${stream.quality})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DESKTOP LAYOUT (unchanged)
  return (
    <div
      ref={containerRef}
      className="video-player-container relative w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-dark-border"
    >
      {/* VIDEO PLAYER CONTAINER */}
      <div className="relative w-full bg-black aspect-video">
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-dark-border border-t-brand-500 rounded-full animate-spin"></div>
              <span className="text-gray-400 text-sm">Loading stream...</span>
            </div>
          </div>
        )}

        {playerError && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <AlertCircle size={40} className="text-red-500" />
              <span className="text-gray-300 text-sm">Failed to load stream. Please try another server.</span>
            </div>
          </div>
        )}

        {renderVideoPlayer()}
      </div>

      {/* Desktop Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-dark-surface/70 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-dark-border/40 gap-3 rounded-t-xl transition-all duration-300 hover:bg-dark-surface/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
          <span className="text-white font-medium text-sm truncate">
            {title || 'Unknown Title'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* ENHANCEMENT TOGGLE */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Palette size={14} className="text-brand-400 flex-shrink-0" />
              <span className="text-xs text-gray-300">Enhance:</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setVideoEnhancement(!videoEnhancement)}
                className={`px-3 py-1 text-xs font-medium rounded-l-lg border transition-all ${
                  videoEnhancement
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-500'
                }`}
              >
                <Eye size={12} className="inline mr-1" />
                On
              </button>
              <button
                onClick={() => setVideoEnhancement(false)}
                className={`px-3 py-1 text-xs font-medium rounded-r-lg border-l-0 border transition-all ${
                  !videoEnhancement
                    ? 'bg-brand-600 text-white border-brand-500'
                    : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-500'
                }`}
              >
                Off
              </button>
            </div>
          </div>

          {/* FILTER PRESETS DROPDOWN */}
          {videoEnhancement && (
            <div className="flex items-center gap-2">
              <select
                value={videoFilter}
                onChange={(e) => setVideoFilter(e.target.value)}
                className="bg-brand-500 text-white text-xs font-bold border border-brand-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-400/40 transition-all hover:bg-brand-400 min-w-[100px]"
              >
                <option value="standard" className="bg-black text-brand-400 font-semibold">
                  Standard
                </option>
                <option value="hdr" className="bg-black text-brand-400 font-semibold">
                  HDR
                </option>
                <option value="vivid" className="bg-black text-brand-400 font-semibold">
                  Vivid
                </option>
                <option value="cinema" className="bg-black text-brand-400 font-semibold">
                  Cinema
                </option>
                <option value="sharp" className="bg-black text-brand-400 font-semibold">
                  Sharp
                </option>
                <option value="gaming" className="bg-black text-brand-400 font-semibold">
                  Gaming
                </option>
                <option value="sports" className="bg-black text-brand-400 font-semibold">
                  Sports
                </option>
                <option value="natural" className="bg-black text-brand-400 font-semibold">
                  Natural
                </option>
              </select>
            </div>
          )}

          {streams.length > 1 && (
            <div className="flex items-center gap-2">
              <Server size={14} className="text-amber-400 font-bold flex-shrink-0" />
              <select
                value={activeServer}
                onChange={(e) => setActiveServer(Number(e.target.value))}
                className="bg-amber-500 text-black text-xs font-bold border border-amber-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-400/40 transition-all hover:bg-amber-400 min-w-[100px]"
              >
                {streams.map((stream, index) => (
                  <option key={stream.id} value={index} className="bg-black text-amber-400 font-semibold">
                    {stream.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleFullscreen}
            className="p-2 rounded-lg bg-transparent hover:bg-dark-700 text-gray-300 hover:text-white transition-all border border-transparent hover:border-dark-border flex-shrink-0"
            title="Toggle Fullscreen"
          >
            <Zap size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;