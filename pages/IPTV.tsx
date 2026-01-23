import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MOCK_CHANNELS, getCurrentTimeGMT530, formatTimeGMT530, Channel } from '../constants';
import { Search, Tv, Globe, Film, Activity, Star, Menu, X, Share2, Clock, Calendar, ChevronLeft, Users, AlertCircle, Server, ShieldCheck, Zap, Eye } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import SEO from '../components/SEO';
import SocialShare from '../components/SocialShare';

interface ProgramInfo {
  currentProgram: string;
  progress: number;
  nextProgram: string;
  nextProgramTime: string;
  currentScheduleItem: any | null;
}

interface Category {
  id: string;
  icon: React.ReactNode;
  label: string;
}

// Simple debounce function implementation
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const IPTV: React.FC = () => {
  // State Management
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMobileCategories, setShowMobileCategories] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(getCurrentTimeGMT530());
  const [mobileView, setMobileView] = useState<'list' | 'player'>('list');
  const [showAdultWarning, setShowAdultWarning] = useState<boolean>(false);
  const [tempAdultChannel, setTempAdultChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState<number>(0);

  // Refs
  const channelListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Initial check
    checkDesktop();
    
    // Debounced resize handler
    const handleResize = debounce(checkDesktop, 250);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Categories with proper typing
  const categories: Category[] = [
    { id: 'All', icon: <Tv size={16} />, label: 'All Channels' },
    { id: 'Sports', icon: <Activity size={16} />, label: 'Sports' },
    { id: 'News', icon: <Globe size={16} />, label: 'News' },
    { id: 'Entertainment', icon: <Film size={16} />, label: 'Entertainment' },
    { id: 'Adult', icon: <Users size={16} />, label: 'Adult +18' },
  ];

  // Update current time safely
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeGMT530());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Focus management for accessibility
  useEffect(() => {
    if (mobileView === 'player' && !isDesktop) {
      // Set focus to player area for screen readers
      const playerSection = document.querySelector('[data-player-section]');
      if (playerSection) {
        (playerSection as HTMLElement).focus();
      }
    }
  }, [mobileView, isDesktop]);

  // Memoized filtered channels with performance optimization
  const filteredChannels = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const isAllCategory = activeCategory === 'All';
    
    return MOCK_CHANNELS.filter(channel => {
      // Category filter
      if (!isAllCategory && channel.category !== activeCategory) {
        return false;
      }
      
      // Search filter
      if (query) {
        const nameMatch = channel.name.toLowerCase().includes(query);
        const programMatch = channel.currentProgram?.toLowerCase().includes(query);
        const categoryMatch = channel.category.toLowerCase().includes(query);
        return nameMatch || programMatch || categoryMatch;
      }
      
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Memoized program info calculation
  const getCurrentProgramInfo = useCallback((channel: Channel): ProgramInfo => {
    if (!channel.schedule || channel.schedule.length === 0) {
      return {
        currentProgram: channel.currentProgram || 'Live Program',
        progress: channel.progress || 0,
        nextProgram: 'Upcoming Show',
        nextProgramTime: 'Soon',
        currentScheduleItem: null
      };
    }

    const now = currentTime;
    let currentItem = null;
    let nextItem = null;

    // Binary search for schedule items (optimized for performance)
    let left = 0;
    let right = channel.schedule.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const item = channel.schedule[mid];

      if (now >= item.startTime && now <= item.endTime) {
        currentItem = item;
        nextItem = channel.schedule[mid + 1] || null;
        break;
      } else if (now < item.startTime) {
        nextItem = item;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    if (currentItem) {
      const totalDuration = currentItem.endTime.getTime() - currentItem.startTime.getTime();
      const elapsed = now.getTime() - currentItem.startTime.getTime();
      const progress = Math.min(100, (elapsed / totalDuration) * 100);

      return {
        currentProgram: currentItem.title,
        progress,
        nextProgram: nextItem?.title || 'Programming ends',
        nextProgramTime: nextItem ? formatTimeGMT530(nextItem.startTime) : '--:--',
        currentScheduleItem: currentItem
      };
    }

    if (nextItem) {
      return {
        currentProgram: 'Break / Intermission',
        progress: 0,
        nextProgram: nextItem.title,
        nextProgramTime: formatTimeGMT530(nextItem.startTime),
        currentScheduleItem: null,
      };
    }

    return {
      currentProgram: channel.currentProgram || 'Live Program',
      progress: 0,
      nextProgram: 'Programming ends',
      nextProgramTime: '--:--',
      currentScheduleItem: null
    };
  }, [currentTime]);

  // Generate share URL
  const getChannelShareUrl = useCallback((channelId: string) => {
    return typeof window !== 'undefined' 
      ? `${window.location.origin}/iptv?channel=${channelId}`
      : `#/iptv?channel=${channelId}`;
  }, []);

  // Handle channel selection with proper loading state
  const handleChannelSelect = useCallback(async (channel: Channel) => {
    try {
      setIsLoading(true);
      
      // Check for adult content
      if (channel.category === 'Adult') {
        setTempAdultChannel(channel);
        setShowAdultWarning(true);
        return;
      }
      
      // Set selected channel
      setSelectedChannel(channel);
      // Reset stream index when changing channel
      setCurrentStreamIndex(0);
      
      // Switch to player view on mobile
      if (!isDesktop) {
        setMobileView('player');
      }
      
      // Close categories drawer
      setShowMobileCategories(false);
      
      // Scroll to top on mobile
      if (!isDesktop && channelListRef.current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error selecting channel:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isDesktop]);

  // Handle adult content access
  const handleAdultAccess = useCallback(() => {
    if (tempAdultChannel) {
      setSelectedChannel(tempAdultChannel);
      setCurrentStreamIndex(0);
      setShowAdultWarning(false);
      setTempAdultChannel(null);
      
      if (!isDesktop) {
        setMobileView('player');
      }
    }
  }, [tempAdultChannel, isDesktop]);

  // Handle back to list
  const handleBackToList = useCallback(() => {
    setMobileView('list');
    // Focus on search input when returning to list
    if (searchInputRef.current && !isDesktop) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isDesktop]);

  // Handle search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setShowMobileCategories(false);
    
    // Switch to list view on mobile if in player view
    if (!isDesktop && mobileView === 'player') {
      setMobileView('list');
    }
  }, [isDesktop, mobileView]);

  // Get category count
  const getCategoryCount = useCallback((categoryId: string): number => {
    if (categoryId === 'All') return MOCK_CHANNELS.length;
    return MOCK_CHANNELS.filter(c => c.category === categoryId).length;
  }, []);

  // Handle switch server
  const handleSwitchServer = useCallback((index: number) => {
    if (!selectedChannel) return;
    setCurrentStreamIndex(index);
  }, [selectedChannel]);

  // Get current stream URL
  const getCurrentStream = useCallback(() => {
    if (!selectedChannel || !selectedChannel.streams || selectedChannel.streams.length === 0) {
      return null;
    }
    return selectedChannel.streams[currentStreamIndex];
  }, [selectedChannel, currentStreamIndex]);

  // Adult Warning Modal Component
  const AdultWarningModal = () => (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adult-warning-title"
    >
      <div className="bg-[#1e293b] rounded-2xl max-w-md w-full p-6 border border-red-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center" aria-hidden="true">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div>
            <h3 id="adult-warning-title" className="text-xl font-bold text-white">Adult Content Warning</h3>
            <p className="text-gray-400 text-sm">Age Restriction: 18+</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <p className="text-gray-300">
            This channel contains adult content suitable for viewers aged 18 and above.
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-red-400">
              <strong>Warning:</strong> By proceeding, you confirm that you are 18 years or older.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowAdultWarning(false);
              setTempAdultChannel(null);
            }}
            className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Cancel and return to channel list"
          >
            Cancel
          </button>
          <button
            onClick={handleAdultAccess}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Confirm age and proceed to adult content"
          >
            I'm 18+, Proceed
          </button>
        </div>
      </div>
    </div>
  );

  // Loading Overlay
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading channel...</p>
        </div>
      </div>
    );
  }

  // Desktop Layout
  if (isDesktop) {
    return (
      <>
        {showAdultWarning && <AdultWarningModal />}
        
        <div className="min-h-screen bg-[#0b1120] pt-16">
          <SEO 
            title={selectedChannel ? `Watch ${selectedChannel.name} Live Online | UniWatch IPTV` : 'Live IPTV Channels | UniWatch'}
            description={selectedChannel ? `Stream ${selectedChannel.name} live in HD. Available on UniWatch.` : 'Watch live TV channels online for free. Stream sports, news, entertainment and more.'}
            keywords={['iptv', 'live tv', 'online streaming', 'free tv']}
            image={selectedChannel?.logo}
          />
          
          {/* Current Time Display */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-2 bg-dark-surface px-3 py-1.5 rounded-lg border border-dark-border">
            <Clock size={14} className="text-brand-400" />
            <span className="text-sm text-gray-300">{formatTimeGMT530(currentTime)}</span>
            <span className="text-xs text-gray-500">GMT+5:30</span>
          </div>

          <div className="flex h-[calc(100vh-4rem)]">
            {/* Categories Sidebar */}
            <aside 
              className="w-64 bg-[#0f172a] border-r border-[#1e293b] flex flex-col"
              aria-label="Channel categories"
            >
              <div className="p-4 border-b border-[#1e293b]">
                <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <Calendar size={12} />
                  <span>Categories</span>
                </div>
                <nav className="space-y-1" aria-label="Category navigation">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        activeCategory === cat.id
                        ? cat.id === 'Adult' 
                          ? 'bg-red-600 text-white shadow-lg' 
                          : 'bg-brand-600 text-white shadow-lg'
                        : cat.id === 'Adult' 
                          ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                      aria-label={`Select ${cat.label} category`}
                      aria-current={activeCategory === cat.id ? 'page' : undefined}
                    >
                      {cat.icon}
                      {cat.label}
                      <span className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded">
                        {getCategoryCount(cat.id)}
                      </span>
                    </button>
                  ))}
                </nav>
                
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <div className="text-xs text-gray-500 mb-2">Active Filter:</div>
                  <div className="text-sm text-white font-medium">
                    {activeCategory === 'All' 
                      ? 'All Channels' 
                      : `${categories.find(c => c.id === activeCategory)?.label}`}
                    <span className="ml-2 text-xs text-brand-400">
                      ({filteredChannels.length} channels)
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Last updated: {formatTimeGMT530(currentTime)}
                  </div>
                </div>
              </div>
            </aside>

            {/* Channel List */}
            <section 
              className="w-80 bg-[#1e293b] border-r border-[#334155] flex flex-col"
              aria-label="Channel list"
            >
              <div className="p-4 border-b border-[#334155]">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" aria-hidden="true" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search channels or programs..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg py-2.5 pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    aria-label="Search channels"
                  />
                  {searchQuery && (
                    <button 
                      onClick={clearSearch}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      Category: <span className={`${activeCategory === 'Adult' ? 'text-red-400' : 'text-brand-400'}`}>
                        {activeCategory === 'All' ? 'All' : categories.find(c => c.id === activeCategory)?.label}
                      </span>
                    </span>
                    <span className="text-gray-500" aria-hidden="true">•</span>
                    <span className="text-gray-500">
                      Showing: <span className="text-white">{filteredChannels.length}</span> of {MOCK_CHANNELS.length}
                    </span>
                  </div>
                  {searchQuery && (
                    <button 
                      onClick={clearSearch}
                      className="text-xs text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      aria-label="Clear search"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div 
                ref={channelListRef}
                className="flex-1 overflow-y-auto"
                role="list"
                aria-label="List of channels"
              >
                {filteredChannels.length === 0 ? (
                  <div className="p-8 text-center" role="status">
                    <div className="text-gray-500 text-sm mb-2">No channels found</div>
                    <div className="text-xs text-gray-600">
                      Try a different category or search term
                    </div>
                  </div>
                ) : (
                  filteredChannels.map((channel, index) => {
                    const programInfo = getCurrentProgramInfo(channel);
                    return (
                      <button 
                        key={`${channel.id}-${index}`}
                        onClick={() => handleChannelSelect(channel)}
                        className={`w-full text-left px-4 py-4 border-b border-[#334155]/50 cursor-pointer hover:bg-white/5 transition-colors group relative focus:outline-none focus:ring-2 focus:ring-brand-500 focus:z-10 ${
                          selectedChannel?.id === channel.id ? 'bg-[#0f172a]' : ''
                        }`}
                        role="listitem"
                        aria-label={`Select ${channel.name} channel. Now playing: ${programInfo.currentProgram}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded flex-shrink-0 flex items-center justify-center overflow-hidden ${
                              selectedChannel?.id === channel.id ? 'bg-white' : channel.category === 'Adult' ? 'bg-red-500/20' : 'bg-[#334155]'
                            }`}>
                              <img 
                                src={channel.logo} 
                                alt={`${channel.name} logo`}
                                className="w-full h-full object-contain p-1.5"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-sm font-bold truncate ${
                                  selectedChannel?.id === channel.id ? 'text-white' : 'text-gray-300'
                                }`}>
                                  {channel.name}
                                </h4>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  channel.category === 'Adult' 
                                    ? 'bg-red-500/30 text-red-400' 
                                    : channel.category === 'Sports'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-gray-800 text-gray-400'
                                }`}>
                                  {channel.category}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 truncate mb-2">
                                {programInfo.currentProgram}
                              </p>
                              <div className="mt-1">
                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                  <span>Progress</span>
                                  <span>{Math.round(programInfo.progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1">
                                  <div 
                                    className={`h-1 rounded-full transition-all duration-500 ${
                                      channel.category === 'Sports' ? 'bg-red-500' : 
                                      channel.category === 'Adult' ? 'bg-red-400' : 'bg-brand-500'
                                    }`}
                                    style={{ width: `${programInfo.progress}%` }}
                                    role="progressbar"
                                    aria-valuenow={Math.round(programInfo.progress)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {channel.category === 'Sports' && programInfo.progress > 0 && programInfo.progress < 100 && (
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
                                <span className="text-[10px] text-red-400 font-bold">LIVE</span>
                              </div>
                              <span className="text-[10px] text-gray-500">
                                {Math.round(programInfo.progress)}%
                              </span>
                            </div>
                          )}
                          
                          {channel.category === 'Adult' && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full">
                              <AlertCircle size={10} className="text-red-400" aria-hidden="true" />
                              <span className="text-[10px] text-red-400 font-bold">18+</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            {/* Player & Info */}
            <main 
              className="flex-1 flex flex-col bg-black overflow-y-auto"
              data-player-section
              tabIndex={-1}
            >
              {selectedChannel ? (
                <div className="p-6">
                  {/* Channel Header */}
                  <header className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl p-2 flex-shrink-0 ${
                        selectedChannel.category === 'Adult' ? 'bg-red-500/20' : 'bg-white'
                      }`}>
                        <img 
                          src={selectedChannel.logo} 
                          alt={`${selectedChannel.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-2xl font-bold text-white">{selectedChannel.name}</h1>
                          {selectedChannel.category === 'Sports' && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
                              <span className="text-xs text-red-400 font-bold">LIVE NOW</span>
                            </div>
                          )}
                          {selectedChannel.category === 'Adult' && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                              <AlertCircle size={12} className="text-red-400" aria-hidden="true" />
                              <span className="text-xs text-red-400 font-bold">ADULT 18+</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-gray-400 text-sm">
                            Now Playing: <span className="text-white font-medium">{getCurrentProgramInfo(selectedChannel).currentProgram}</span>
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={12} aria-hidden="true" />
                            {formatTimeGMT530(currentTime)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            selectedChannel.category === 'Adult'
                              ? 'bg-red-500/20 text-red-400'
                              : selectedChannel.category === 'Sports'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-brand-500/20 text-brand-400'
                          }`}>
                            {selectedChannel.category}
                          </span>
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                            GMT+5:30
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                            Channel ID: {selectedChannel.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <SocialShare
                        title={selectedChannel.name}
                        description={`Watch ${selectedChannel.name} live stream. ${getCurrentProgramInfo(selectedChannel).currentProgram}`}
                        image={selectedChannel.logo}
                        url={getChannelShareUrl(selectedChannel.id)}
                        type="iptv"
                      />
                    </div>
                  </header>

                  {/* Program Progress */}
                  <section className="mb-6 bg-dark-surface p-4 rounded-xl border border-dark-border">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="text-white font-medium">Now Playing</h4>
                        <p className="text-gray-400 text-sm">{getCurrentProgramInfo(selectedChannel).currentProgram}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Program Progress</div>
                        <div className="text-lg font-bold text-white">{Math.round(getCurrentProgramInfo(selectedChannel).progress)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          selectedChannel.category === 'Sports' ? 'bg-red-500' : 
                          selectedChannel.category === 'Adult' ? 'bg-red-400' : 'bg-brand-500'
                        }`}
                        style={{ width: `${getCurrentProgramInfo(selectedChannel).progress}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(getCurrentProgramInfo(selectedChannel).progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Start</span>
                      <span>Mid</span>
                      <span>End</span>
                    </div>
                  </section>

                  {/* Video Player */}
                  <section className="mb-8" aria-label="Video player">
                    <VideoPlayer 
                      key={`${selectedChannel.id}-${currentStreamIndex}`}
                      title={selectedChannel.name}
                      customStreams={selectedChannel.streams}
                      autoPlay={true}
                    />
                    
                    {/* SERVER SWITCHER - VideoPlayer.tsx Style */}
                    {/* {selectedChannel.streams && selectedChannel.streams.length > 1 && (
                      <div className="mt-4 bg-[#0f172a] p-4 border-t border-dark-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center ">
                          <div className="flex items-center gap-2">
                            <Server size={16} className="text-gray-400" />
                            <span className="text-gray-400 text-sm font-bold">SWITCH SERVER:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedChannel.streams.map((_, idx) => (
                              <button
                                key={`server-${idx}`}
                                onClick={() => setCurrentStreamIndex(idx)}
                                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden group ${
                                  currentStreamIndex === idx
                                    ? selectedChannel.category === 'Adult'
                                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-500/20 transform scale-105'
                                      : selectedChannel.category === 'Sports'
                                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/20 transform scale-105'
                                      : 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/20 transform scale-105'
                                    : 'bg-dark-surface text-gray-400 hover:bg-white/10 hover:text-white border border-dark-border'
                                }`}
                                aria-label={`Switch to Server ${idx + 1}`}
                              >
                                <span className="relative z-10">Server {idx + 1}</span>
                                {currentStreamIndex === idx && (
                                  <span className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20"></span>
                                )}
                                <span className="absolute -right-2 -top-2 w-4 h-4 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                              </button>
                            ))} */}
                          {/* </div> */}
                        {/* </div> */}
                        
                        {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2 text-yellow-500/80 text-xs">
                            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                            <p>If the current server is buffering or not working, please switch to another server. Ad-blockers may interfere with playback.</p>
                          </div>
                          
                          <div className="flex items-start gap-2 text-brand-400/80 text-xs">
                            <Zap size={12} className="mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Quality Information:</p>
                              <p className="text-gray-500 mt-0.5">All servers provide HD quality streaming with adaptive bitrate.</p>
                            </div>
                          </div>
                        </div> */}
                      {/* </div> */}
                    {/* )} */}
                  </section>

                  {/* Program Guide */}
                  <section className="mt-8 bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Tv size={18} className={selectedChannel.category === 'Adult' ? 'text-red-400' : 'text-brand-500'} aria-hidden="true" />
                        <h3 className="text-white font-bold">Program Guide</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={14} aria-hidden="true" />
                        {formatTimeGMT530(currentTime)}
                        <span className="text-xs text-gray-600">(GMT+5:30)</span>
                      </div>
                    </div>
                    
                    {/* Current Program */}
                    <article className="flex gap-4 p-4 bg-brand-900/10 border border-brand-500/20 rounded-lg mb-4">
                      <div className="w-16 flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
                          <span className="text-sm font-bold text-red-500">LIVE</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{formatTimeGMT530(currentTime)}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{getCurrentProgramInfo(selectedChannel).currentProgram}</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          {getCurrentProgramInfo(selectedChannel).currentScheduleItem?.description || 
                           'Live broadcast currently in progress.'}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <div className="text-gray-500">
                            Started: <span className="text-gray-300">
                              {getCurrentProgramInfo(selectedChannel).currentScheduleItem?.startTime 
                                ? formatTimeGMT530(getCurrentProgramInfo(selectedChannel).currentScheduleItem.startTime)
                                : formatTimeGMT530(new Date(currentTime.getTime() - 30 * 60000))}
                            </span>
                          </div>
                          <div className="text-gray-500">
                            Ends: <span className="text-gray-300">
                              {getCurrentProgramInfo(selectedChannel).currentScheduleItem?.endTime 
                                ? formatTimeGMT530(getCurrentProgramInfo(selectedChannel).currentScheduleItem.endTime)
                                : formatTimeGMT530(new Date(currentTime.getTime() + 30 * 60000))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <div className="text-sm text-gray-400">Progress</div>
                        <div className={`text-2xl font-bold ${
                          selectedChannel.category === 'Adult' ? 'text-red-400' : 'text-brand-400'
                        }`}>
                          {Math.round(getCurrentProgramInfo(selectedChannel).progress)}%
                        </div>
                      </div>
                    </article>
                  </section>
                </div>
              ) : (
                // Empty state
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 bg-[#1e293b] rounded-full flex items-center justify-center mb-6" aria-hidden="true">
                    <Tv size={48} className="text-gray-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Select a Channel</h2>
                  <p className="text-gray-400 max-w-md mb-8">
                    Choose a channel from the list to start watching live TV. Click on any channel to begin streaming.
                  </p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={16} aria-hidden="true" />
                    <span>Current time: {formatTimeGMT530(currentTime)} (GMT+5:30)</span>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </>
    );
  }

  // Mobile Layout
  return (
    <>
      {showAdultWarning && <AdultWarningModal />}
      
      <div className="min-h-screen bg-[#0b1120] pt-16">
        <SEO 
          title={selectedChannel ? `Watch ${selectedChannel.name} Live | UniWatch` : 'Live TV Channels | UniWatch'}
          description="Watch live TV channels online for free. Stream sports, news, entertainment and more."
          keywords={['iptv', 'live tv', 'online streaming', 'free tv']}
          image={selectedChannel?.logo}
        />
        
        {/* Mobile Header */}
        <header className="sticky top-16 z-40 bg-[#0b1120] border-b border-[#1e293b] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMobileCategories(!showMobileCategories)}
                className="p-2 bg-brand-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label={showMobileCategories ? "Close categories" : "Open categories"}
              >
                {showMobileCategories ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-brand-400" aria-hidden="true" />
                <span className="text-sm text-gray-300">{formatTimeGMT530(currentTime)}</span>
              </div>
            </div>
            
            {mobileView === 'player' && selectedChannel && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-label="Back to channel list"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Back
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Categories Drawer */}
        {showMobileCategories && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40" 
              onClick={() => setShowMobileCategories(false)}
              aria-hidden="true"
            />
            <aside 
              className="fixed top-0 left-0 w-64 h-full bg-[#0f172a] border-r border-[#1e293b] z-50 overflow-y-auto pt-20"
              aria-label="Category navigation"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <Calendar size={12} aria-hidden="true" />
                  <span>Categories</span>
                </div>
                <nav className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        activeCategory === cat.id
                        ? cat.id === 'Adult' ? 'bg-red-600 text-white shadow-lg' : 'bg-brand-600 text-white shadow-lg'
                        : cat.id === 'Adult' ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                      aria-label={`Select ${cat.label} category`}
                      aria-current={activeCategory === cat.id ? 'page' : undefined}
                    >
                      {cat.icon}
                      {cat.label}
                      <span className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded">
                        {getCategoryCount(cat.id)}
                      </span>
                    </button>
                  ))}
                </nav>
                
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <div className="text-xs text-gray-500 mb-2">Active Filter:</div>
                  <div className="text-sm text-white font-medium">
                    {activeCategory === 'All' 
                      ? 'All Channels' 
                      : `${categories.find(c => c.id === activeCategory)?.label}`}
                    <span className="ml-2 text-xs text-brand-400">
                      ({filteredChannels.length} channels)
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Last updated: {formatTimeGMT530(currentTime)}
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Mobile Channel List */}
        {mobileView === 'list' && (
          <main className="p-4 pb-24">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" aria-hidden="true" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search channels..." 
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg py-2.5 pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                aria-label="Search channels"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Active Filter Info */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">Live Channels</h2>
              <span className="text-sm text-gray-400">{filteredChannels.length} channels</span>
            </div>
            
            {filteredChannels.length === 0 ? (
              <div className="p-8 text-center" role="status">
                <div className="text-gray-500 text-sm mb-2">No channels found</div>
                <div className="text-xs text-gray-600">
                  Try a different category or search term
                </div>
              </div>
            ) : (
              <div className="space-y-3" role="list">
                {filteredChannels.map((channel, index) => {
                  const programInfo = getCurrentProgramInfo(channel);
                  return (
                    <button 
                      key={`${channel.id}-${index}`}
                      onClick={() => handleChannelSelect(channel)}
                      className="w-full bg-[#1e293b] rounded-xl p-4 text-left hover:bg-[#2d3748] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                      role="listitem"
                      aria-label={`Select ${channel.name} channel. Now playing: ${programInfo.currentProgram}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-16 h-16 rounded-lg p-2 flex-shrink-0 ${
                          channel.category === 'Adult' ? 'bg-red-500/20' : 'bg-white'
                        }`}>
                          <img 
                            src={channel.logo} 
                            alt={`${channel.name} logo`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-white truncate">{channel.name}</h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              channel.category === 'Adult' 
                                ? 'bg-red-500/30 text-red-400' 
                                : channel.category === 'Sports'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {channel.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2 truncate">{programInfo.currentProgram}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                channel.category === 'Adult' ? 'bg-red-400' : 'bg-brand-500'
                              }`} aria-hidden="true"></div>
                              <span className="text-xs text-gray-500">Live</span>
                            </div>
                            <div className={`text-xs ${
                              channel.category === 'Adult' ? 'text-red-400' : 'text-brand-400'
                            }`}>
                              {Math.round(programInfo.progress)}% complete
                            </div>
                          </div>
                          
                          <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                channel.category === 'Sports' ? 'bg-red-500' : 
                                channel.category === 'Adult' ? 'bg-red-400' : 'bg-brand-500'
                              }`}
                              style={{ width: `${programInfo.progress}%` }}
                              role="progressbar"
                              aria-valuenow={Math.round(programInfo.progress)}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </main>
        )}

        {/* Mobile Player View */}
        {mobileView === 'player' && selectedChannel && (
          <main 
            className="h-[calc(100vh-8rem)] overflow-y-auto pb-32"
            data-player-section
            tabIndex={-1}
          >
            {/* Player Header */}
            <header className="sticky top-0 z-20 bg-[#0b1120] px-4 py-3 border-b border-[#1e293b]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg p-1.5 ${
                    selectedChannel.category === 'Adult' ? 'bg-red-500/20' : 'bg-white'
                  }`}>
                    <img 
                      src={selectedChannel.logo} 
                      alt={`${selectedChannel.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-lg font-bold text-white">{selectedChannel.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        selectedChannel.category === 'Adult'
                          ? 'bg-red-500/20 text-red-400'
                          : selectedChannel.category === 'Sports'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-brand-500/20 text-brand-400'
                      }`}>
                        {selectedChannel.category}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                        LIVE
                      </span>
                      {selectedChannel.category === 'Adult' && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                          18+
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Now Playing: <span className="text-white">{getCurrentProgramInfo(selectedChannel).currentProgram}</span>
                </div>
              </div>
            </header>

            {/* Video Player */}
            <section className="p-4" aria-label="Video player">
              <VideoPlayer 
                key={`${selectedChannel.id}-${currentStreamIndex}`}
                title={selectedChannel.name}
                customStreams={selectedChannel.streams}
                autoPlay={true}
              />
            </section>

            {/* SERVER SWITCHER - VideoPlayer.tsx Style
            {selectedChannel.streams && selectedChannel.streams.length > 1 && (
              <div className="px-4">
                <div className="bg-[#0f172a] p-4 border-t border-dark-border">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Server size={16} className="text-gray-400" />
                      <span className="text-gray-400 text-sm font-bold">SWITCH SERVER:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedChannel.streams.map((_, idx) => (
                        <button
                          key={`server-${idx}`}
                          onClick={() => setCurrentStreamIndex(idx)}
                          className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden group ${
                            currentStreamIndex === idx
                              ? selectedChannel.category === 'Adult'
                                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-500/20 transform scale-105'
                                : selectedChannel.category === 'Sports'
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/20 transform scale-105'
                                : 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/20 transform scale-105'
                              : 'bg-dark-surface text-gray-400 hover:bg-white/10 hover:text-white border border-dark-border'
                          }`}
                          aria-label={`Switch to Server ${idx + 1}`}
                        >
                          <span className="relative z-10">Server {idx + 1}</span>
                          {currentStreamIndex === idx && (
                            <span className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20"></span>
                          )}
                          <span className="absolute -right-2 -top-2 w-4 h-4 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-start gap-2 text-yellow-500/80 text-xs">
                      <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                      <p>If the current server is buffering or not working, please switch to another server. Ad-blockers may interfere with playback.</p>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Program Info */}
            <section className="px-4">
              <div className="bg-[#1e293b] rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold">Now Playing</h3>
                  <div className={`text-sm ${
                    selectedChannel.category === 'Adult' ? 'text-red-400' : 'text-brand-400'
                  }`}>
                    {Math.round(getCurrentProgramInfo(selectedChannel).progress)}%
                  </div>
                </div>
                
                <h4 className="text-lg text-white font-medium mb-2">{getCurrentProgramInfo(selectedChannel).currentProgram}</h4>
                <p className="text-gray-400 text-sm mb-3">
                  {getCurrentProgramInfo(selectedChannel).currentScheduleItem?.description || 
                   'Live broadcast currently in progress.'}
                </p>
                
                <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedChannel.category === 'Sports' ? 'bg-red-500' : 
                      selectedChannel.category === 'Adult' ? 'bg-red-400' : 'bg-brand-500'
                    }`}
                    style={{ width: `${getCurrentProgramInfo(selectedChannel).progress}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(getCurrentProgramInfo(selectedChannel).progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Start</span>
                  <span>Mid</span>
                  <span>End</span>
                </div>
              </div>

              {/* Time Info */}
              <div className="mt-4 pt-4 border-t border-dark-border text-center">
                <div className="inline-flex items-center gap-2 bg-dark-surface px-4 py-2 rounded-lg">
                  <Clock size={14} className="text-brand-400" aria-hidden="true" />
                  <span className="text-sm text-gray-300">System Time: {formatTimeGMT530(currentTime)}</span>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  All times in Indian Standard Time (GMT+5:30)
                </p>
              </div>
            </section>
          </main>
        )}

        {/* Mobile Bottom Navigation */}
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-[#1e293b] z-30"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-around p-3">
            <button 
              onClick={() => {
                setMobileView('list');
                setShowMobileCategories(false);
              }}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                mobileView === 'list' ? 'text-brand-400' : 'text-gray-400'
              }`}
              aria-label="Go to channels list"
              aria-current={mobileView === 'list' ? 'page' : undefined}
            >
              <Tv size={20} aria-hidden="true" />
              <span className="text-xs">Channels</span>
            </button>
            
            <button 
              onClick={() => {
                if (selectedChannel) {
                  setMobileView('player');
                }
                setShowMobileCategories(false);
              }}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                mobileView === 'player' ? 'text-brand-400' : 'text-gray-400'
              }`}
              aria-label="Go to player"
              aria-current={mobileView === 'player' ? 'page' : undefined}
              disabled={!selectedChannel}
            >
              <Globe size={20} aria-hidden="true" />
              <span className="text-xs">Player</span>
            </button>
            
            <button 
              onClick={() => setShowMobileCategories(true)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                showMobileCategories ? 'text-brand-400' : 'text-gray-400'
              }`}
              aria-label="Open categories"
            >
              <Calendar size={20} aria-hidden="true" />
              <span className="text-xs">Categories</span>
            </button>
          </div>
        </nav>
      {/* Mobile Back and Switch Server Buttons - FIXED SIDE BY SIDE */}
        {mobileView === 'player' && selectedChannel && (
          <div className="fixed bottom-16 left-4 right-4 z-20">
            <div className="flex gap-2 w-full">
              <button
                onClick={handleBackToList}
                className="flex-1 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Back to channel list"
              >
                <ChevronLeft size={18} aria-hidden="true" />
                Back
              </button>
              
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IPTV;



