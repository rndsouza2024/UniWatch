import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_MATCHES, getMatchStatusAndTime, getCurrentTimeGMT530, formatTimeGMT530, formatDateGMT530 } from '../constants';
import { Play, Search, ArrowLeft, Tv, RefreshCcw, Share2, Clock, Calendar, Target } from 'lucide-react';
import { SportMatch } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import SEO from '../components/SEO';
import SocialShare from '../components/SocialShare';

const Sports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMatch, setSelectedMatch] = useState<SportMatch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<Date>(getCurrentTimeGMT530());

  // Update current time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeGMT530());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const tabs = useMemo(() => {
    const sports = Array.from(new Set(MOCK_MATCHES.map(match => match.sport)));
    const sportTabs = sports.map(sport => ({
      id: sport,
      label: sport === 'Football' ? 'Am. Football' : sport
    }));
    
    return [
      { id: 'All', label: 'All Sports' },
      ...sportTabs.sort((a, b) => a.label.localeCompare(b.label))
    ];
  }, []);

  const filteredMatches = useMemo(() => {
    return MOCK_MATCHES.filter(match => {
      const sportMatch = activeTab === 'All' || match.sport === activeTab;
      const searchMatch = !searchQuery || 
        match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.sport.toLowerCase().includes(searchQuery.toLowerCase());
      
      return sportMatch && searchMatch;
    });
  }, [activeTab, searchQuery]);

  const grouped = useMemo(() => {
    return filteredMatches.reduce((acc, match) => {
      if (!acc[match.league]) acc[match.league] = [];
      acc[match.league].push(match);
      return acc;
    }, {} as Record<string, typeof filteredMatches>);
  }, [filteredMatches]);

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  const getImageSrc = (path: string, imageId: string) => {
    if (imageErrors[imageId]) {
      return `https://via.placeholder.com/150/1e293b/ffffff?text=${imageId.split('-')[0].toUpperCase()}`;
    }
    return path;
  };

  const getMatchShareUrl = (match: SportMatch) => {
    return `#/sports?match=${match.id}`;
  };

  // Function to get time until match starts
  const getTimeUntilStart = (startTime: Date): string => {
    const now = currentTime;
    const diffMs = startTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Starting now';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `Starts in ${diffHours}h ${diffMinutes}m`;
    }
    return `Starts in ${diffMinutes}m`;
  };

  // Function to get match timing display
  const getMatchTimingDisplay = (match: SportMatch) => {
    const { status, displayTime, progress } = getMatchStatusAndTime(match);
    
    const startTimeStr = formatTimeGMT530(match.startTime);
    const dateStr = formatDateGMT530(match.startTime);
    
    return {
      status,
      displayTime,
      progress,
      startTime: startTimeStr,
      date: dateStr,
      isLive: status === 'live',
      isFinished: status === 'finished',
      isScheduled: status === 'scheduled'
    };
  };

  // Render Watch Mode
  if (selectedMatch) {
    const matchTiming = getMatchTimingDisplay(selectedMatch);
    const pageTitle = `${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam} Live Stream`;
    const pageDesc = `Watch ${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam} live online. Free HD stream for ${selectedMatch.league}.`;
    const pageImage = selectedMatch.homeTeamLogo || selectedMatch.awayTeamLogo || selectedMatch.leagueLogo;

    return (
      <div className="min-h-screen bg-black pt-20 px-4 sm:px-6 lg:px-8">
        <SEO 
          title={pageTitle}
          description={pageDesc}
          image={pageImage}
          type="video.movie"
        />
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setSelectedMatch(null)}
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="font-medium">Back to Schedule</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-dark-surface px-3 py-1.5 rounded-lg">
                <Clock size={14} className="text-brand-400" />
                <span className="text-sm text-gray-300">{formatTimeGMT530(currentTime)} GMT+5:30</span>
              </div>
              <SocialShare
                title={pageTitle}
                description={pageDesc}
                image={pageImage || ''}
                url={getMatchShareUrl(selectedMatch)}
                type="sport"
              />
            </div>
          </div>

          {/* Match Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-dark-surface p-6 rounded-xl border border-dark-border">
            <div className="flex items-center gap-8 w-full">
              {/* Home Team */}
              <div className="text-center flex-1">
                {selectedMatch.homeTeamLogo && (
                  <img 
                    src={getImageSrc(selectedMatch.homeTeamLogo, `home-${selectedMatch.id}`)} 
                    alt={selectedMatch.homeTeam} 
                    className="w-24 h-24 mx-auto mb-3 object-contain"
                    onError={() => handleImageError(`home-${selectedMatch.id}`)}
                  />
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-white">{selectedMatch.homeTeam}</h1>
                <div className="mt-2 text-gray-400 text-sm">
                  <span className="px-2 py-1 bg-brand-500/20 text-brand-400 rounded text-xs">
                    Home
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-gray-500 text-sm">{matchTiming.date}</span>
                </div>
                
                <span className="text-brand-500 font-bold uppercase tracking-wider text-sm mb-2">
                  {selectedMatch.league}
                </span>
                
                <div className="text-4xl md:text-5xl font-mono text-white font-bold mb-2">
                  {selectedMatch.homeScore !== undefined && selectedMatch.awayScore !== undefined 
                    ? `${selectedMatch.homeScore} - ${selectedMatch.awayScore}`
                    : 'VS'
                  }
                </div>
                
                {/* Match Status */}
                <div className="flex flex-col items-center gap-2 mt-3">
                  {matchTiming.isLive && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/30 text-red-500 rounded-full font-bold">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> 
                      LIVE - {matchTiming.displayTime}
                    </div>
                  )}
                  
                  {matchTiming.isScheduled && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 border border-yellow-600/30 text-yellow-500 rounded-full font-bold">
                      <Clock size={14} />
                      {matchTiming.startTime} • {getTimeUntilStart(selectedMatch.startTime)}
                    </div>
                  )}
                  
                  {matchTiming.isFinished && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600/30 text-green-500 rounded-full font-bold">
                      <Target size={14} />
                      FINISHED • {matchTiming.displayTime}
                    </div>
                  )}
                  
                  <div className="text-gray-500 text-sm bg-black/50 px-3 py-1 rounded-full">
                    {selectedMatch.sport} • {selectedMatch.duration} mins
                  </div>
                </div>
              </div>

              {/* Away Team */}
              <div className="text-center flex-1">
                {selectedMatch.awayTeamLogo && (
                  <img 
                    src={getImageSrc(selectedMatch.awayTeamLogo, `away-${selectedMatch.id}`)} 
                    alt={selectedMatch.awayTeam} 
                    className="w-24 h-24 mx-auto mb-3 object-contain"
                    onError={() => handleImageError(`away-${selectedMatch.id}`)}
                  />
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-white">{selectedMatch.awayTeam}</h1>
                <div className="mt-2 text-gray-400 text-sm">
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                    Away
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Progress Bar */}
          {matchTiming.isLive && (
            <div className="mb-6 bg-dark-surface p-4 rounded-xl border border-dark-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Match Progress</span>
                <span className="text-sm font-bold text-white">{Math.round(matchTiming.progress)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${matchTiming.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>0'</span>
                <span>Half</span>
                <span>{selectedMatch.duration}'</span>
              </div>
            </div>
          )}

          {/* Video Player */}
          <VideoPlayer 
            title={`${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`}
            customStreams={selectedMatch.streams}
          />
          
          {/* Match Info */}
          <div className="mt-8 mb-16 md:mb-16 ">

            <div className="bg-dark-surface p-6 rounded-xl border border-dark-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Tv size={18} /> Match Info
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  GMT+5:30
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">League</span>
                  <span className="text-white font-medium">{selectedMatch.league}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Sport</span>
                  <span className="text-white font-medium">{selectedMatch.sport}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Match Time</span>
                  <span className="text-white font-medium">{matchTiming.startTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Match Date</span>
                  <span className="text-white font-medium">{matchTiming.date}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-medium">{selectedMatch.duration} minutes</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                    matchTiming.isLive ? 'bg-red-500/20 text-red-500' : 
                    matchTiming.isFinished ? 'bg-green-500/20 text-green-500' : 
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {matchTiming.isLive ? 'LIVE' : matchTiming.isFinished ? 'FINISHED' : 'SCHEDULED'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* <div className="bg-dark-surface p-6 rounded-xl border border-dark-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <RefreshCcw size={18} /> Stream Servers
                </h3>
                <SocialShare
                  title={`Watch ${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`}
                  description={`Live stream of ${selectedMatch.league} match`}
                  image={selectedMatch.homeTeamLogo || ''}
                  url={getMatchShareUrl(selectedMatch)}
                  type="sport"
                />
              </div>
              <div className="space-y-3">
                {selectedMatch.streams.map((stream, index) => (
                  <div key={stream.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                        <span className="text-brand-400 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <span className="text-white font-medium">{stream.name}</span>
                        <span className="ml-2 px-2 py-0.5 text-xs bg-brand-500/20 text-brand-400 rounded">
                          {stream.quality}
                        </span>
                      </div>
                    </div>
                    <button className="text-xs px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded transition-colors">
                      Select Server
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  // Render Schedule List
  return (
    <div className="min-h-screen bg-[#0b1120] pt-20 px-4 sm:px-6 lg:px-8 pb-10">
      <SEO 
        title="Live Sports Schedule & Streams | UniWatch"
        description="Check live scores and watch live sports streams including Soccer, Basketball, Tennis, and more."
        keywords={['sports schedule', 'live soccer', 'nba streams', 'premier league live']}
      />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Sports Center</h1>
          <div className="flex items-center gap-3">
            <p className="text-gray-400 text-sm">Live Scores, Fixtures & Streams</p>
            <div className="flex items-center gap-1.5 bg-dark-surface px-2.5 py-1 rounded-full">
              <Clock size={12} className="text-brand-400" />
              <span className="text-xs text-gray-300">{formatTimeGMT530(currentTime)}</span>
              <span className="text-xs text-gray-500">GMT+5:30</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search event..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark-surface border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
              ? 'bg-white text-black shadow-lg' 
              : 'bg-dark-surface text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="space-y-6">
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([league, matches]) => (
            <div key={league} className="bg-dark-surface/50 border border-dark-border rounded-xl overflow-hidden">
              <div className="bg-[#1e293b] px-6 py-4 flex justify-between items-center border-b border-dark-border">
                <div className="flex items-center gap-3">
                  {matches[0].leagueLogo && (
                    <img 
                      src={getImageSrc(matches[0].leagueLogo, `league-${league}`)} 
                      alt={league} 
                      className="h-8 w-auto object-contain"
                      onError={() => handleImageError(`league-${league}`)}
                    />
                  )}
                  <h3 className="text-white font-bold text-lg">{league}</h3>
                  <span className="text-xs text-gray-400 ml-2">
                    ({matches.length} {matches.length === 1 ? 'match' : 'matches'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase">{matches[0].sport}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{formatDateGMT530(currentTime)}</span>
                </div>
              </div>
              
              <div>
                {matches.map(match => {
                  const matchTiming = getMatchTimingDisplay(match);
                  return (
                    <div key={match.id} className="p-5 border-b border-dark-border/50 hover:bg-white/5 transition-colors group">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Time/Status */}
                        <div className="w-32 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {matchTiming.isLive ? (
                              <>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 border border-red-600/30 text-red-500 rounded-full font-bold text-xs">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> 
                                  LIVE
                                </div>
                                <div className="text-red-400 font-bold text-lg">{matchTiming.displayTime}</div>
                              </>
                            ) : matchTiming.isFinished ? (
                              <>
                                <div className="px-3 py-1.5 bg-green-600/20 border border-green-600/30 text-green-500 rounded-full font-bold text-xs">
                                  FINISHED
                                </div>
                                <div className="text-green-400 font-bold text-lg">{matchTiming.displayTime}</div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600/20 border border-yellow-600/30 text-yellow-500 rounded-full font-bold text-xs">
                                  <Clock size={12} />
                                  UPCOMING
                                </div>
                                <div className="text-gray-300 font-bold text-lg">{matchTiming.startTime}</div>
                              </>
                            )}
                            <div className="text-gray-600 text-xs mt-1">
                              {getTimeUntilStart(match.startTime)}
                            </div>
                          </div>
                        </div>

                        {/* Teams and Score */}
                        <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                          {/* Home Team */}
                          <div className="flex items-center justify-end gap-4">
                            <span className="font-bold text-white text-lg">{match.homeTeam}</span>
                            {match.homeTeamLogo && (
                              <img 
                                src={getImageSrc(match.homeTeamLogo, `home-thumb-${match.id}`)} 
                                alt={match.homeTeam} 
                                className="w-10 h-10 object-contain"
                                onError={() => handleImageError(`home-thumb-${match.id}`)}
                              />
                            )}
                          </div>
                          
                          <div className={`px-4 py-3 rounded text-sm font-mono font-bold min-w-[90px] text-center ${
                            matchTiming.isLive 
                              ? 'bg-red-500/10 text-white border border-red-500/20' 
                              : matchTiming.isFinished
                              ? 'bg-green-500/10 text-white border border-green-500/20'
                              : 'bg-gray-800 text-gray-400 border border-gray-700'
                          }`}>
                            {matchTiming.isFinished || (match.homeScore !== undefined && match.awayScore !== undefined) 
                              ? `${match.homeScore || 0} - ${match.awayScore || 0}`
                              : 'VS'
                            }
                          </div>
                          
                          {/* Away Team */}
                          <div className="flex items-center justify-start gap-4">
                            {match.awayTeamLogo && (
                              <img 
                                src={getImageSrc(match.awayTeamLogo, `away-thumb-${match.id}`)} 
                                alt={match.awayTeam} 
                                className="w-10 h-10 object-contain"
                                onError={() => handleImageError(`away-thumb-${match.id}`)}
                              />
                            )}
                            <span className="font-bold text-white text-lg">{match.awayTeam}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button 
                            onClick={() => setSelectedMatch(match)}
                            className={`px-6 py-2.5 rounded font-bold uppercase text-xs tracking-wider transition-all ${
                              matchTiming.isLive
                              ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
                              : matchTiming.isFinished
                              ? 'bg-green-600 hover:bg-green-500 text-white'
                              : 'bg-brand-600 hover:bg-brand-500 text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Play size={14} fill="currentColor" /> 
                              {matchTiming.isLive ? 'Watch Live' : 
                              matchTiming.isFinished ? 'Watch Replay' : 'Set Reminder'}
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              const shareData = {
                                title: `${match.homeTeam} vs ${match.awayTeam}`,
                                text: `Watch ${match.league} match live on UniWatch`,
                                url: getMatchShareUrl(match),
                              };
                              
                              if (navigator.share) {
                                navigator.share(shareData);
                              }
                            }}
                            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded font-bold uppercase text-xs tracking-wider transition-colors flex items-center gap-2"
                          >
                            <Share2 size={12} />
                            Share
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar for Live Matches */}
                      {matchTiming.isLive && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
                            <span>Match Progress</span>
                            <span>{Math.round(matchTiming.progress)}% • {matchTiming.displayTime}</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div 
                              className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${matchTiming.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>0'</span>
                            <span>Half</span>
                            <span>{match.duration}'</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-dark-surface rounded-xl border border-dark-border">
            <div className="text-gray-500 text-lg mb-4">No matches found</div>
            <button 
              onClick={() => {
                setActiveTab('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Footer with current time */}
      <div className="mt-8 pt-6 border-t border-dark-border text-center">
        <div className="inline-flex items-center gap-2 bg-dark-surface px-4 py-2 rounded-lg">
          <Clock size={14} className="text-brand-400" />
          <span className="text-sm text-gray-300">Current Time: {formatTimeGMT530(currentTime)}</span>
          <span className="text-xs text-gray-500">(GMT+5:30)</span>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          All times are displayed in Indian Standard Time (GMT+5:30)
        </p>
      </div>
    </div>
  );
};

export default Sports;
