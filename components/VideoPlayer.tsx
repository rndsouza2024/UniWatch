import React, { useState, useEffect, useMemo } from 'react';
import { Server, ShieldCheck, AlertCircle, Settings, Zap, Eye, Palette } from 'lucide-react';
import { StreamSource } from '../types';
import { UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE } from '../services/tmdb';

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

  const filterPresets = {
    standard: 'brightness(1.05) contrast(1.1) saturate(1.08)',
    vivid: 'brightness(1.12) contrast(1.35) saturate(1.45)',
    cinema: 'brightness(0.98) contrast(1.25) saturate(0.95) hue-rotate(-2deg)',
    gaming: 'brightness(1.08) contrast(1.28) saturate(1.25) hue-rotate(1.5deg)',
    sports: 'brightness(1.1) contrast(1.3) saturate(1.3)',
    natural: 'brightness(1.02) contrast(1.05) saturate(1.0)',
    off: 'none'
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
      WebkitBackfaceVisibility: 'hidden'
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
        quality: index === 0 ? 'FHD' : 'HD'
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
          quality: 'HD'
        };
      });
    } else if (type === 'sports') {
      const sport = UNIQUE_SPORTS.find(s => s.id === tmdbId.toString());
      if (!sport || !sport.streams) return [];
      
      return Object.entries(sport.streams).map(([serverName, url], index) => ({
        id: `sports-${tmdbId}-s${index + 1}`,
        name: serverName,
        url: url as string,
        quality: index === 0 ? 'FHD' : 'HD'
      }));
    } else if (type === 'tv_live') {
      const tvLive = UNIQUE_TV_LIVE.find(tv => tv.id === tmdbId.toString());
      if (!tvLive || !tvLive.streams) return [];
      
      return Object.entries(tvLive.streams).map(([serverName, url], index) => ({
        id: `tv_live-${tmdbId}-s${index + 1}`,
        name: serverName,
        url: url as string,
        quality: 'HD'
      }));
    }
    
    return [];
  }, [customStreams, tmdbId, type, season, episode]);

  useEffect(() => {
    setIsLoading(true);
    setActiveServer(0);
  }, [tmdbId, type, season, episode]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setTimeout(() => {
      const iframe = document.querySelector('iframe');
      if (iframe && videoEnhancement) {
        iframe.style.transition = 'filter 0.5s ease-out';
      }
    }, 100);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .video-player-iframe {
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

  return (
    <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-dark-border">
      <div className="bg-dark-surface px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-dark-border gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium text-sm">Playing: {title || 'Unknown Title'}</span>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Palette size={14} className="text-brand-400" />
              <span className="text-xs text-gray-300">Enhance:</span>
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
            <span className="text-xs bg-brand-900 text-brand-200 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck size={10} /> Secure
            </span>
            <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded flex items-center gap-1">
              <Zap size={10} /> {streams[activeServer]?.quality || 'HD'}
            </span>
            {videoEnhancement && (
              <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded flex items-center gap-1">
                <Eye size={10} /> Enhanced
              </span>
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
            </div>
          </div>
        )}
        
        {videoEnhancement && !isLoading && (
          <div className="absolute inset-0 z-10 video-enhancement-overlay"></div>
        )}
        
        <iframe
          src={streams[activeServer].url}
          className="video-player-iframe w-full h-full"
          style={getVideoFilterStyle()}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={handleIframeLoad}
          title={`${title || 'Video'} Player - UniWatch`}
          referrerPolicy="strict-origin-when-cross-origin"
        />
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
                  className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden group ${
                    activeServer === idx
                      ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/20 transform scale-105'
                      : 'bg-dark-surface text-gray-400 hover:bg-white/10 hover:text-white border border-dark-border'
                  }`}
                  aria-label={`Switch to ${server.name}`}
                >
                  <span className="relative z-10">{server.name}</span>
                  {activeServer === idx && videoEnhancement && (
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20"></span>
                  )}
                  <span className="absolute -right-2 -top-2 w-4 h-4 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
          
          {videoEnhancement && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette size={14} className="text-brand-400" />
                  <span className="text-sm text-gray-300">Active Filter Preset:</span>
                </div>
                <div className="flex gap-2">
                  {Object.keys(filterPresets)
                    .filter(preset => preset !== 'off')
                    .map(preset => (
                      <button
                        key={preset}
                        onClick={() => setVideoFilter(preset)}
                        className={`px-3 py-1 text-xs rounded-full border transition-all ${
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
              
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
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
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;