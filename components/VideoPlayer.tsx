// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { AlertCircle, ChevronDown, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
// import { useRouter } from 'next/router';
// import { StreamSource } from '../types';
// import { UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE } from '../services/tmdb';
// import Hls from 'hls.js';

// interface VideoPlayerProps {
//   tmdbId?: string | number;
//   type?: 'movie' | 'tv' | 'sports' | 'tv_live';
//   season?: number;
//   episode?: number;
//   customStreams?: StreamSource[] | Record<string, string>;
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
//   const router = useRouter();
//   const [activeServer, setActiveServer] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showControls, setShowControls] = useState(true);
//   const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const [videoFilter, setVideoFilter] = useState<string>('standard');
//   const [playerError, setPlayerError] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
  
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const filterPresets: Record<string, string> = {
//     standard: 'brightness(1.0) contrast(1.0) saturate(1.0) sepia(0) hue-rotate(0deg)',
//     cinema: 'brightness(0.95) contrast(1.2) saturate(0.9) sepia(0.1)',
//     hdr: 'brightness(1.1) contrast(1.3) saturate(1.3)',
//     vivid: 'brightness(1.15) saturate(1.5) contrast(1.1)',
//     sports: 'saturate(1.4) contrast(1.2) brightness(1.1)',
//     sharp: 'brightness(1.1) contrast(1.4) saturate(1.1)',
//     gaming: 'brightness(1.05) contrast(1.2) saturate(1.5)',
//     night: 'brightness(0.8) contrast(1.1) sepia(0.2)',
//     grayscale: 'grayscale(1)',
//     warm: 'sepia(0.4) saturate(1.2)',
//     cool: 'hue-rotate(30deg) saturate(1.1)',
//     dream: 'blur(0.5px) brightness(1.1) saturate(1.2)',
//   };

//   const handleUserActivity = () => {
//     setShowControls(true);
//     if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
//     controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3500);
//   };

//   const streams = useMemo(() => {
//     const format = (raw: any): StreamSource[] => {
//       if (!raw) return [];
//       if (Array.isArray(raw)) {
//         return raw.map(s => ({
//           ...s,
//           type: (s.url.includes('.m3u8') || s.url.includes('hls')) ? 'hls' : (s.type || 'iframe')
//         }));
//       }
//       return Object.entries(raw).map(([name, url], i) => {
//         const u = String(url);
//         return {
//           id: `srv-${i}`,
//           name,
//           url: u,
//           quality: 'HD',
//           type: (u.includes('.m3u8') || u.includes('hls') || u.includes('playlist.m3u8')) ? 'hls' : 'iframe'
//         };
//       });
//     };

//     if (customStreams && (Array.isArray(customStreams) ? customStreams.length > 0 : Object.keys(customStreams).length > 0)) {
//       return format(customStreams);
//     }

//     const sourceData = type === 'sports' ? UNIQUE_SPORTS : 
//                       type === 'tv_live' ? UNIQUE_TV_LIVE : 
//                       type === 'movie' ? UNIQUE_MOVIES : UNIQUE_TV_SHOWS;
    
//     const item = sourceData.find(m => String(m.id) === String(tmdbId));
//     if (item?.streams) return format(item.streams);

//     if (type === 'movie') {
//       return [
//         { id: 'f-1', name: 'Server 1', url: `https://xprime.today/watch/${tmdbId}`, quality: 'HD', type: 'iframe' },
//         { id: 'f-2', name: 'Server 2', url: `https://cinemaos.tech/player/${tmdbId}`, quality: 'HD', type: 'iframe' },
//         { id: 'f-3', name: 'Server 3', url: `https://www.vidking.net/embed/movie/${tmdbId}?autoPlay=true&nextEpisode=true&episodeSelector=true`, quality: 'HD', type: 'iframe' },
//         { id: 'f-4', name: 'Server 4', url: `https://vidsrc-embed.ru/embed/movie/${tmdbId}`, quality: 'HD', type: 'iframe' },
//         { id: 'f-5', name: 'Server 5', url: `https://api.cinezo.net/embed/tmdb-movie-${tmdbId}`, quality: 'HD', type: 'iframe' },
//         // { id: 'f-6', name: 'Server 6 - Multi-Lang', url: `https://zxcstream.xyz/player/movie/${tmdbId}/hindi?autoplay=false&back=true&server=0`, quality: 'HD', type: 'iframe' },
//       ];
//     }
    
//     if (type === 'tv') {
//       return [
//         { id: 'f-1', name: 'Server 1', url: `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=true&nextEpisode=true&episodeSelector=true`, quality: 'HD', type: 'iframe' },
//         { id: 'f-2', name: 'Server 2', url: `https://xprime.today/watch/${tmdbId}/${season}/${episode}`, quality: 'HD', type: 'iframe' },
//         { id: 'f-3', name: 'Server 3', url: `https://api.cinezo.net/embed/tmdb-tv-${tmdbId}/${season}/${episode}`, quality: 'HD', type: 'iframe' },
//         { id: 'f-4', name: 'Server 4', url: `https://www.cinezo.net/watch/tv/${tmdbId}?season=${season}&episode=${episode}`, quality: 'HD', type: 'iframe' },
//         { id: 'f-5', name: 'Server 5', url: `https://vidsrc-embed.ru/embed/tv/${tmdbId}/${season}/${episode}`, quality: 'HD', type: 'iframe' },
//       ];
//     }

//     return [];
//   }, [customStreams, tmdbId, type, season, episode]);

//   useEffect(() => {
//     const current = streams[activeServer];
//     if (!current) {
//       setPlayerError(true);
//       setIsLoading(false);
//       return;
//     }
    
//     if (hlsRef.current) hlsRef.current.destroy();
//     setIsLoading(true);
//     setPlayerError(false);

//     if (current.type === 'hls' && videoRef.current) {
//       if (Hls.isSupported()) {
//         const hls = new Hls({ 
//           enableWorker: true,
//           debug: false,
//           maxBufferLength: 30,
//           maxMaxBufferLength: 60,
//           maxBufferSize: 60 * 1000 * 1000,
//         });
//         hlsRef.current = hls;
//         hls.loadSource(current.url);
//         hls.attachMedia(videoRef.current);
//         hls.on(Hls.Events.MANIFEST_PARSED, () => { 
//           setIsLoading(false); 
//           videoRef.current?.play().catch(() => {});
//         });
//         hls.on(Hls.Events.ERROR, (event, data) => { 
//           console.error('HLS Error:', data);
//           setPlayerError(true); 
//           setIsLoading(false); 
//         });
//       } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//         videoRef.current.src = current.url;
//         videoRef.current.onloadedmetadata = () => { 
//           setIsLoading(false); 
//           videoRef.current?.play().catch(() => {}); 
//         };
//         videoRef.current.onerror = () => {
//           setPlayerError(true);
//           setIsLoading(false);
//         };
//       }
//     } else {
//       const timer = setTimeout(() => setIsLoading(false), 2000);
//       return () => clearTimeout(timer);
//     }

//     return () => {
//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//       }
//     };
//   }, [activeServer, streams]);

//   const toggleFullscreen = () => {
//     if (!containerRef.current) return;
//     if (!document.fullscreenElement) {
//       containerRef.current.requestFullscreen().catch(e => console.error(e));
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   useEffect(() => {
//     const handleFS = () => setIsFullscreen(!!document.fullscreenElement);
//     document.addEventListener('fullscreenchange', handleFS);
//     return () => document.removeEventListener('fullscreenchange', handleFS);
//   }, []);

//   if (!streams.length) return (
//     <div className="aspect-video bg-miraj-gray rounded-xl flex flex-col items-center justify-center p-6 text-center border border-white/5">
//         <AlertCircle size={48} className="text-gray-500 mb-4" />
//         <h3 className="text-xl font-bold text-white">No Streams Available</h3>
//         <p className="text-gray-400 mt-2">Try checking back later or select different content</p>
//     </div>
//   );

//   const currentStream = streams[activeServer];

//   return (
//     <div className="relative w-full mt-8 sm:mt-0">
//       {/* Back Button - Repositioned below navbar with proper spacing */}
//       <div className="mb-3 sm:mb-4">
//         <button 
//           onClick={() => router.back()} 
//           className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-black/95 backdrop-blur-md rounded-lg sm:rounded-xl border-2 border-white/20 sm:border hover:bg-miraj-red text-white transition-all duration-300 shadow-2xl hover:shadow-2xl hover:scale-105 active:scale-95 group touch-manipulation min-h-[48px] sm:min-h-0"
//           aria-label="Go back"
//         >
//           <ArrowLeft size={20} className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1 flex-shrink-0" />
//           <span className="font-bold text-sm sm:text-sm tracking-wide">BACK</span>
//         </button>
//       </div>

//       {/* Floating Controls Bar - Outside and above player, centered */}
//       <div className="mb-3 sm:mb-4 flex justify-center">
//         <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 bg-black/70 backdrop-blur-xl px-1.5 xs:px-2 py-1 xs:py-1.5 sm:py-2 rounded-full border border-white/30 shadow-2xl max-w-[95vw] landscape:max-w-none overflow-x-auto">
//           {streams.length > 1 && (
//             <div className="relative group/select flex-shrink-0">
//               <select 
//                 value={activeServer} 
//                 onChange={(e) => setActiveServer(Number(e.target.value))} 
//                 className="bg-transparent text-white text-[9px] xs:text-[10px] font-black border-none rounded-full py-1 pl-1.5 xs:pl-2 pr-5 xs:pr-6 focus:outline-none appearance-none cursor-pointer uppercase tracking-tight transition-all duration-200 hover:text-miraj-gold touch-manipulation min-h-[32px]"
//                 aria-label="Select server"
//               >
//                 {streams.map((s, i) => (
//                   <option key={i} value={i} className="bg-miraj-black">
//                     {s.name || `Server ${i + 1}`}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown size={10} className="xs:w-3 xs:h-3 absolute right-1 xs:right-1.5 top-1/2 -translate-y-1/2 text-miraj-gold pointer-events-none transition-transform duration-200 group-hover/select:translate-y-[1px]" />
//             </div>
//           )}
          
//           {streams.length > 1 && (
//             <div className="w-[1px] h-3 xs:h-4 bg-white/30 flex-shrink-0" />
//           )}
          
//           <div className="relative group/filter flex-shrink-0">
//             <select 
//               value={videoFilter} 
//               onChange={(e) => setVideoFilter(e.target.value)} 
//               className="bg-transparent text-white text-[9px] xs:text-[10px] font-black border-none rounded-full py-1 pl-1.5 xs:pl-2 pr-5 xs:pr-6 focus:outline-none appearance-none cursor-pointer uppercase tracking-tight transition-all duration-200 hover:text-miraj-gold touch-manipulation min-h-[32px]"
//               aria-label="Select video filter"
//             >
//               {Object.keys(filterPresets).map(p => (
//                 <option key={p} value={p} className="bg-miraj-black">{p}</option>
//               ))}
//             </select>
//             <ChevronDown size={10} className="xs:w-3 xs:h-3 absolute right-1 xs:right-1.5 top-1/2 -translate-y-1/2 text-miraj-gold pointer-events-none transition-transform duration-200 group-hover/filter:translate-y-[1px]" />
//           </div>
//         </div>
//       </div>

//       {/* Player Container - Clean player without floating controls inside */}
//       <div 
//         ref={containerRef} 
//         className={`relative bg-black group w-full overflow-hidden transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100]' : 'aspect-video rounded-xl border border-white/10 shadow-2xl'}`}
//         onMouseMove={handleUserActivity}
//         onTouchStart={handleUserActivity}
//       >
//         {/* Fullscreen Button - Floating at center top of player, appears on hover */}
//         <div className={`absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
//           <button 
//             onClick={toggleFullscreen} 
//             className="p-2 sm:p-2.5 bg-black/80 backdrop-blur-md rounded-full border-2 border-white/40 hover:border-miraj-gold hover:text-miraj-gold text-white transition-all duration-300 shadow-2xl hover:bg-black/90 hover:scale-110 active:scale-95 touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px] flex items-center justify-center"
//             aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//           >
//             {isFullscreen ? (
//               <Minimize2 size={20} className="sm:w-6 sm:h-6 transition-transform duration-300"/>
//             ) : (
//               <Maximize2 size={20} className="sm:w-6 sm:h-6 transition-transform duration-300"/>
//             )}
//           </button>
//         </div>

//         {/* Loading Spinner */}
//         {isLoading && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 pointer-events-none">
//             <div className="w-10 h-10 sm:w-10 sm:h-10 border-4 border-white/5 border-t-miraj-gold rounded-full animate-spin mb-3"/>
//             <span className="text-miraj-gold text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] animate-pulse px-4 text-center">
//               {type === 'sports' ? 'LOADING LIVE SPORTS...' : 
//                type === 'tv_live' ? 'CONNECTING TO LIVE TV...' : 'LOADING STREAM...'}
//             </span>
//           </div>
//         )}
        
//         {/* Error State */}
//         {playerError && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-40 p-4 sm:p-6 text-center">
//             <AlertCircle size={40} className="sm:w-10 sm:h-10 text-miraj-red mb-3" />
//             <h3 className="text-lg sm:text-lg font-bold text-white mb-2">Stream Unavailable</h3>
//             <p className="text-gray-400 mb-4 max-w-md text-sm sm:text-sm px-4">
//               This server might be temporarily offline. Please try another server or check back later.
//             </p>
//             {streams.length > 1 && (
//               <button 
//                 onClick={() => setActiveServer(s => (s + 1) % streams.length)} 
//                 className="bg-miraj-gold text-black px-6 sm:px-6 py-2.5 sm:py-2.5 rounded-full font-bold hover:bg-yellow-500 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-sm"
//               >
//                 Try Next Server ({streams.length - 1} remaining)
//               </button>
//             )}
//           </div>
//         )}

//         {/* Player Render */}
//         <div className="w-full h-full flex items-center justify-center">
//           {currentStream.type === 'iframe' ? (
//             <iframe 
//               key={currentStream.url} 
//               src={currentStream.url} 
//               className="w-full h-full border-0" 
//               allowFullScreen 
//               style={{ filter: filterPresets[videoFilter] }} 
//               onLoad={() => setIsLoading(false)}
//               title={`${title} Player`}
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               referrerPolicy="strict-origin-when-cross-origin"
//             />
//           ) : (
//             <video 
//               ref={videoRef} 
//               className="w-full h-full bg-black" 
//               controls 
//               playsInline 
//               autoPlay 
//               style={{ filter: filterPresets[videoFilter] }} 
//               onWaiting={() => setIsLoading(true)} 
//               onPlaying={() => setIsLoading(false)}
//               onError={() => {
//                 setPlayerError(true);
//                 setIsLoading(false);
//               }}
//               poster="/video-poster.jpg"
//               aria-label={`${title} video player`}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;







import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AlertCircle, ChevronDown, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { StreamSource } from '../types';
import { UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE } from '../services/tmdb';
import Hls from 'hls.js';

// TypeScript declarations for Screen Orientation API
declare global {
  interface ScreenOrientation extends EventTarget {
    lock(orientation: OrientationLockType): Promise<void>;
    unlock(): void;
  }
}

type OrientationLockType = 
  | 'any'
  | 'natural'
  | 'landscape'
  | 'portrait'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary';

interface VideoPlayerProps {
  tmdbId?: string | number;
  type?: 'movie' | 'tv' | 'sports' | 'tv_live';
  season?: number;
  episode?: number;
  customStreams?: StreamSource[] | Record<string, string>;
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
  const router = useRouter();
  const [activeServer, setActiveServer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [videoFilter, setVideoFilter] = useState<string>('standard');
  const [playerError, setPlayerError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filterPresets: Record<string, string> = {
    standard: 'brightness(1.0) contrast(1.0) saturate(1.0) sepia(0) hue-rotate(0deg)',
    cinema: 'brightness(0.95) contrast(1.2) saturate(0.9) sepia(0.1)',
    hdr: 'brightness(1.1) contrast(1.3) saturate(1.3)',
    vivid: 'brightness(1.15) saturate(1.5) contrast(1.1)',
    sports: 'saturate(1.4) contrast(1.2) brightness(1.1)',
    sharp: 'brightness(1.1) contrast(1.4) saturate(1.1)',
    gaming: 'brightness(1.05) contrast(1.2) saturate(1.5)',
    night: 'brightness(0.8) contrast(1.1) sepia(0.2)',
    grayscale: 'grayscale(1)',
    warm: 'sepia(0.4) saturate(1.2)',
    cool: 'hue-rotate(30deg) saturate(1.1)',
    dream: 'blur(0.5px) brightness(1.1) saturate(1.2)',
  };

  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      // Only hide if not in fullscreen on mobile - keep visible in fullscreen
      if (!isFullscreen || window.innerWidth > 768) {
        setShowControls(false);
      }
    }, 4000);
  };

  const streams = useMemo(() => {
    const format = (raw: any): StreamSource[] => {
      if (!raw) return [];
      if (Array.isArray(raw)) {
        return raw.map(s => ({
          ...s,
          type: (s.url.includes('.m3u8') || s.url.includes('hls')) ? 'hls' : (s.type || 'iframe')
        }));
      }
      return Object.entries(raw).map(([name, url], i) => {
        const u = String(url);
        return {
          id: `srv-${i}`,
          name,
          url: u,
          quality: 'HD',
          type: (u.includes('.m3u8') || u.includes('hls') || u.includes('playlist.m3u8')) ? 'hls' : 'iframe'
        };
      });
    };

    if (customStreams && (Array.isArray(customStreams) ? customStreams.length > 0 : Object.keys(customStreams).length > 0)) {
      return format(customStreams);
    }

    const sourceData = type === 'sports' ? UNIQUE_SPORTS : 
                      type === 'tv_live' ? UNIQUE_TV_LIVE : 
                      type === 'movie' ? UNIQUE_MOVIES : UNIQUE_TV_SHOWS;
    
    const item = sourceData.find(m => String(m.id) === String(tmdbId));
    if (item?.streams) return format(item.streams);

    if (type === 'movie') {
      return [
        { id: 'f-1', name: 'Server 1', url: `https://xprime.today/watch/${tmdbId}`, quality: 'HD', type: 'iframe' },
        { id: 'f-2', name: 'Server 2', url: `https://cinemaos.tech/player/${tmdbId}`, quality: 'HD', type: 'iframe' },
        { id: 'f-3', name: 'Server 3', url: `https://www.vidking.net/embed/movie/${tmdbId}?autoPlay=true&nextEpisode=true&episodeSelector=true`, quality: 'HD', type: 'iframe' },
        { id: 'f-4', name: 'Server 4', url: `https://vidsrc-embed.ru/embed/movie/${tmdbId}`, quality: 'HD', type: 'iframe' },
        { id: 'f-5', name: 'Server 5', url: `https://api.cinezo.net/embed/tmdb-movie-${tmdbId}`, quality: 'HD', type: 'iframe' },
        { id: 'f-6', name: 'Server 6', url: `https://zxcstream.xyz/player/movie/${tmdbId}/hindi?autoplay=false&back=true&server=0`, quality: 'HD', type: 'iframe' },
      ];
    }
    
    if (type === 'tv') {
      return [
        { id: 'f-1', name: 'Server 1', url: `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=true&nextEpisode=true&episodeSelector=true`, quality: 'HD', type: 'iframe' },
        { id: 'f-2', name: 'Server 2', url: `https://xprime.today/watch/${tmdbId}/${season}/${episode}`, quality: 'HD', type: 'iframe' },
        { id: 'f-3', name: 'Server 3', url: `https://api.cinezo.net/embed/tmdb-tv-${tmdbId}/${season}/${episode}`, quality: 'HD', type: 'iframe' },
        { id: 'f-4', name: 'Server 4', url: `https://www.cinezo.net/watch/tv/${tmdbId}?season=${season}&episode=${episode}`, quality: 'HD', type: 'iframe' },
        { id: 'f-5', name: 'Server 5', url: `https://vidsrc-embed.ru/embed/tv/${tmdbId}/${season}/${episode}`, quality: 'HD', type: 'iframe' },
        { id: 'f-6', name: 'Server 6', url: `https://zxcstream.xyz/player/tv/${tmdbId}/hindi?autoplay=false&back=true&server=0`, quality: 'HD', type: 'iframe' },
      ];
    }

    return [];
  }, [customStreams, tmdbId, type, season, episode]);

  useEffect(() => {
    const current = streams[activeServer];
    if (!current) {
      setPlayerError(true);
      setIsLoading(false);
      return;
    }
    
    if (hlsRef.current) hlsRef.current.destroy();
    setIsLoading(true);
    setPlayerError(false);

    if (current.type === 'hls' && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({ 
          enableWorker: true,
          debug: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000,
          autoStartLoad: true,
        });
        hlsRef.current = hls;
        hls.loadSource(current.url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => { 
          setIsLoading(false); 
          // Force play multiple times to ensure autoplay
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // If autoplay fails, try again after a short delay
              setTimeout(() => {
                videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
              }, 100);
            });
          }
        });
        hls.on(Hls.Events.ERROR, (event, data) => { 
          console.error('HLS Error:', data);
          setPlayerError(true); 
          setIsLoading(false); 
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = current.url;
        videoRef.current.onloadedmetadata = () => { 
          setIsLoading(false); 
          // Force play on Safari/iOS
          videoRef.current?.play().catch(() => {
            setTimeout(() => {
              videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
            }, 100);
          }); 
        };
        videoRef.current.onerror = () => {
          setPlayerError(true);
          setIsLoading(false);
        };
      }
    } else {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [activeServer, streams]);

  // ROBUST FULLSCREEN IMPLEMENTATION - PRODUCTION READY
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      // Check if already in fullscreen
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        // Enter fullscreen with cross-browser support
        const element = containerRef.current;
        
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          // Safari/iOS
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).webkitEnterFullscreen) {
          // iOS Safari video element
          await (element as any).webkitEnterFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          // Firefox
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          // IE/Edge
          await (element as any).msRequestFullscreen();
        }

        // Lock orientation to landscape on mobile if supported
        if (screen.orientation && typeof (screen.orientation as any).lock === 'function') {
          try {
            await (screen.orientation as any).lock('landscape').catch(() => {
              // Orientation lock failed, continue without it
              console.log('Orientation lock not supported or failed');
            });
          } catch (err) {
            // Silently handle orientation lock errors
          }
        }
      } else {
        // Exit fullscreen with cross-browser support
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }

        // Unlock orientation
        if (screen.orientation && typeof (screen.orientation as any).unlock === 'function') {
          try {
            (screen.orientation as any).unlock();
          } catch (err) {
            // Silently handle orientation unlock errors
          }
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      // Fallback: try alternative fullscreen method
      try {
        if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
          (videoRef.current as any).webkitEnterFullscreen();
        }
      } catch (fallbackError) {
        console.error('Fallback fullscreen failed:', fallbackError);
      }
    }
  };

  // Monitor fullscreen state changes with cross-browser support
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add event listeners for all browser variants
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls in fullscreen after inactivity
  useEffect(() => {
    if (isFullscreen) {
      handleUserActivity();
    }
  }, [isFullscreen]);

  // Prevent body scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isFullscreen]);

  if (!streams.length) return (
    <div className="aspect-video bg-miraj-gray rounded-xl flex flex-col items-center justify-center p-6 text-center border border-white/5">
        <AlertCircle size={48} className="text-gray-500 mb-4" />
        <h3 className="text-xl font-bold text-white">No Streams Available</h3>
        <p className="text-gray-400 mt-2">Try checking back later or select different content</p>
    </div>
  );

  const currentStream = streams[activeServer];

  return (
    <div className="relative w-full mt-8 sm:mt-0">
      {/* Back Button - Repositioned below navbar with proper spacing */}
      <div className="mb-3 sm:mb-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-black/95 backdrop-blur-md rounded-lg sm:rounded-xl border-2 border-white/20 sm:border hover:bg-miraj-red text-white transition-all duration-300 shadow-2xl hover:shadow-2xl hover:scale-105 active:scale-95 group touch-manipulation min-h-[48px] sm:min-h-0"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1 flex-shrink-0" />
          <span className="font-bold text-sm sm:text-sm tracking-wide">BACK</span>
        </button>
      </div>

      {/* Floating Controls Bar - Outside and above player, centered */}
      <div className="mb-3 sm:mb-4 flex justify-center">
        <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 bg-black/70 backdrop-blur-xl px-1.5 xs:px-2 py-1 xs:py-1.5 sm:py-2 rounded-full border border-white/30 shadow-2xl max-w-[95vw] landscape:max-w-none overflow-x-auto">
          {streams.length > 1 && (
            <div className="relative group/select flex-shrink-0">
              <select 
                value={activeServer} 
                onChange={(e) => setActiveServer(Number(e.target.value))} 
                className="bg-transparent text-white text-[9px] xs:text-[10px] font-black border-none rounded-full py-1 pl-1.5 xs:pl-2 pr-5 xs:pr-6 focus:outline-none appearance-none cursor-pointer uppercase tracking-tight transition-all duration-200 hover:text-miraj-gold touch-manipulation min-h-[32px]"
                aria-label="Select server"
              >
                {streams.map((s, i) => (
                  <option key={i} value={i} className="bg-miraj-black">
                    {s.name || `Server ${i + 1}`}
                  </option>
                ))}
              </select>
              <ChevronDown size={10} className="xs:w-3 xs:h-3 absolute right-1 xs:right-1.5 top-1/2 -translate-y-1/2 text-miraj-gold pointer-events-none transition-transform duration-200 group-hover/select:translate-y-[1px]" />
            </div>
          )}
          
          {streams.length > 1 && (
            <div className="w-[1px] h-3 xs:h-4 bg-white/30 flex-shrink-0" />
          )}
          
          <div className="relative group/filter flex-shrink-0">
            <select 
              value={videoFilter} 
              onChange={(e) => setVideoFilter(e.target.value)} 
              className="bg-transparent text-white text-[9px] xs:text-[10px] font-black border-none rounded-full py-1 pl-1.5 xs:pl-2 pr-5 xs:pr-6 focus:outline-none appearance-none cursor-pointer uppercase tracking-tight transition-all duration-200 hover:text-miraj-gold touch-manipulation min-h-[32px]"
              aria-label="Select video filter"
            >
              {Object.keys(filterPresets).map(p => (
                <option key={p} value={p} className="bg-miraj-black">{p}</option>
              ))}
            </select>
            <ChevronDown size={10} className="xs:w-3 xs:h-3 absolute right-1 xs:right-1.5 top-1/2 -translate-y-1/2 text-miraj-gold pointer-events-none transition-transform duration-200 group-hover/filter:translate-y-[1px]" />
          </div>
        </div>
      </div>

      {/* Player Container - Clean player without floating controls inside */}
      <div 
        ref={containerRef} 
        className={`relative bg-black group w-full overflow-hidden transition-all duration-500 ${
          isFullscreen 
            ? 'fixed inset-0 z-[100] w-screen h-screen' 
            : 'aspect-video rounded-xl border border-white/10 shadow-2xl'
        }`}
        onMouseMove={handleUserActivity}
        onTouchStart={handleUserActivity}
        onTouchMove={handleUserActivity}
        onClick={handleUserActivity}
      >
        {/* Fullscreen Button - ALWAYS CENTERED, ALWAYS VISIBLE */}
        <div 
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
          style={{ pointerEvents: 'auto' }}
        >
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFullscreen();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="p-3 sm:p-4 bg-black/90 backdrop-blur-md rounded-full border-2 border-white/60 hover:border-miraj-gold hover:text-miraj-gold text-white transition-all duration-200 shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:bg-black active:scale-95 touch-manipulation min-h-[56px] min-w-[56px] sm:min-h-[64px] sm:min-w-[64px] flex items-center justify-center"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            type="button"
          >
            {isFullscreen ? (
              <Minimize2 size={24} className="sm:w-7 sm:h-7"/>
            ) : (
              <Maximize2 size={24} className="sm:w-7 sm:h-7"/>
            )}
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 pointer-events-none">
            <div className="w-10 h-10 sm:w-10 sm:h-10 border-4 border-white/5 border-t-miraj-gold rounded-full animate-spin mb-3"/>
            <span className="text-miraj-gold text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] animate-pulse px-4 text-center">
              {type === 'sports' ? 'LOADING LIVE SPORTS...' : 
               type === 'tv_live' ? 'CONNECTING TO LIVE TV...' : 'LOADING STREAM...'}
            </span>
          </div>
        )}
        
        {/* Error State */}
        {/* {playerError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-40 p-4 sm:p-6 text-center">
            <AlertCircle size={40} className="sm:w-10 sm:h-10 text-miraj-red mb-3" />
            <h3 className="text-lg sm:text-lg font-bold text-white mb-2">Stream Unavailable</h3>
            <p className="text-gray-400 mb-4 max-w-md text-sm sm:text-sm px-4">
              This server might be temporarily offline. Please try another server or check back later.
            </p>
            {streams.length > 1 && (
              <button 
                onClick={() => setActiveServer(s => (s + 1) % streams.length)} 
                className="bg-miraj-gold text-black px-6 sm:px-6 py-2.5 sm:py-2.5 rounded-full font-bold hover:bg-yellow-500 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-sm"
              >
                Try Next Server ({streams.length - 1} remaining)
              </button>
            )}
          </div>
        )} */}

        {/* Player Render
        <div className={`w-full h-full flex items-center justify-center ${isFullscreen ? 'bg-black' : ''}`}>
          {currentStream.type === 'iframe' ? (
            <iframe 
              key={currentStream.url} 
              src={currentStream.url} 
              className="w-full h-full border-0"
              allowFullScreen 
              style={{ filter: filterPresets[videoFilter] }} 
              onLoad={() => setIsLoading(false)}
              title={`${title} Player`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <video 
              ref={videoRef} 
              className="w-full h-full bg-black object-contain"
              controls 
              playsInline 
              autoPlay
              muted={false}
              crossOrigin="anonymous"
              preload="auto"
              style={{ filter: filterPresets[videoFilter] }} 
              onWaiting={() => setIsLoading(true)} 
              onPlaying={() => setIsLoading(false)}
              onCanPlay={() => {
                setIsLoading(false);
                // Force play when ready
                if (videoRef.current) {
                  videoRef.current.play().catch(err => console.log('Autoplay blocked:', err));
                }
              }}
              onLoadedData={() => {
                setIsLoading(false);
                // Force play when loaded
                if (videoRef.current) {
                  videoRef.current.play().catch(err => console.log('Autoplay blocked:', err));
                }
              }}
              onError={(e) => {
                console.error('Video error:', e);
                setPlayerError(true);
                setIsLoading(false);
              }}
              poster="/og-image.jpg"
              aria-label={`${title} video player`}
            />
          )}
        </div> */}
        {/* Player Render */}
<div className={`w-full h-full relative flex items-center justify-center ${isFullscreen ? 'bg-black' : ''}`}>
  {currentStream.type === 'iframe' ? (
    <>
      {/* Poster Overlay */}
      {isLoading && (
        <img
          src="/og-image.jpg"
          alt={`${title} poster`}
          className="absolute inset-0 w-full h-full object-contain bg-black z-10"
        />
      )}

      <iframe 
        key={currentStream.url} 
        src={currentStream.url} 
        className="w-full h-full border-0"
        allowFullScreen 
        style={{ filter: filterPresets[videoFilter] }} 
        onLoad={() => setIsLoading(false)}
        title={`${title} Player`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </>
  ) : (
    <video 
      ref={videoRef} 
      className="w-full h-full bg-black object-contain"
      controls 
      playsInline 
      autoPlay
      muted={false}
      crossOrigin="anonymous"
      preload="auto"
      style={{ filter: filterPresets[videoFilter] }} 
      onWaiting={() => setIsLoading(true)} 
      onPlaying={() => setIsLoading(false)}
      onCanPlay={() => {
        setIsLoading(false);
        if (videoRef.current) {
          videoRef.current.play().catch(err => console.log('Autoplay blocked:', err));
        }
      }}
      onLoadedData={() => {
        setIsLoading(false);
        if (videoRef.current) {
          videoRef.current.play().catch(err => console.log('Autoplay blocked:', err));
        }
      }}
      onError={(e) => {
        console.error('Video error:', e);
        setPlayerError(true);
        setIsLoading(false);
      }}
      poster="/og-image.jpg"
      aria-label={`${title} video player`}
    />
  )}
</div>

      </div>
    </div>
  );
};

export default VideoPlayer;