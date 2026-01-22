import { MediaItem, Channel, SportMatch, StreamSource } from './types';

// Social sharing base URL
export const SITE_URL = 'https://uniwatchfree.vercel.app';
export const SITE_NAME = 'UniWatch';
export const DEFAULT_OG_IMAGE = 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaB0.jpg';
export const TWITTER_HANDLE = '@UniWatch';
export const SITE_DESCRIPTION = 'Stream movies, TV shows, sports and IPTV for free in HD. No signup required.';


// Timezone offset for GMT+5:30 (India)
export const TIMEZONE_OFFSET = 5.5;

// Function to get current time in GMT+5:30
export const getCurrentTimeGMT530 = (): Date => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * TIMEZONE_OFFSET));
};

// Function to format time in GMT+5:30
export const formatTimeGMT530 = (date: Date): string => {
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Function to format date
export const formatDateGMT530 = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// In your constants.ts file, add this function
export const getProxiedM3U8Url = (originalUrl: string): string => {
  if (originalUrl.includes('manifest.googlevideo.com')) {
    // Use vite dev server proxy in development
    if (process.env.NODE_ENV === 'development') {
      return `/api/m3u8-proxy${originalUrl.replace('https://manifest.googlevideo.com', '')}`
    }
  }
  return originalUrl
}
// Function to check if a match is live
export const isMatchLive = (startTime: Date, duration: number): boolean => {
  const now = getCurrentTimeGMT530();
  const endTime = new Date(startTime.getTime() + duration * 60000);
  return now >= startTime && now <= endTime;
};

// Function to get match status and time display
export const getMatchStatusAndTime = (match: {
  startTime: Date;
  duration: number;
  sport: string;
  status?: 'scheduled' | 'live' | 'finished';
}): { status: 'scheduled' | 'live' | 'finished'; displayTime: string; progress: number } => {
  const now = getCurrentTimeGMT530();
  const startTime = match.startTime;
  const endTime = new Date(startTime.getTime() + match.duration * 60000);
  
  if (now < startTime) {
    const hoursUntil = Math.floor((startTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    const minutesUntil = Math.floor((startTime.getTime() - now.getTime()) / (1000 * 60)) % 60;
    
    let displayTime = '';
    if (hoursUntil > 0) {
      displayTime = `Starts in ${hoursUntil}h ${minutesUntil}m`;
    } else {
      displayTime = `Starts in ${minutesUntil}m`;
    }
    
    return {
      status: 'scheduled',
      displayTime: formatTimeGMT530(startTime),
      progress: 0
    };
  }
  
  if (now > endTime) {
    return {
      status: 'finished',
      displayTime: 'FT',
      progress: 100
    };
  }
  
  // Match is live
  const elapsedMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
  const progress = Math.min(100, (elapsedMinutes / match.duration) * 100);
  
  let displayTime = '';
  if (match.sport === 'Soccer') {
    if (elapsedMinutes >= 45 && elapsedMinutes < 60) {
      displayTime = 'HT';
    } else if (elapsedMinutes >= 90) {
      displayTime = '90+';
    } else {
      displayTime = `${elapsedMinutes}'`;
    }
  } else if (match.sport === 'Basketball') {
    const quarters = Math.floor(elapsedMinutes / 12);
    const quarterMinutes = elapsedMinutes % 12;
    displayTime = `Q${quarters + 1} ${quarterMinutes}'`;
  } else if (match.sport === 'Football') {
    const quarters = Math.floor(elapsedMinutes / 15);
    const quarterMinutes = elapsedMinutes % 15;
    displayTime = `Q${quarters + 1} ${quarterMinutes}'`;
  } else {
    displayTime = `${elapsedMinutes}'`;
  }
  
  return {
    status: 'live',
    displayTime,
    progress
  };
};

// Function to generate share URLs
export const generateShareUrls = (title: string, url: string, image?: string) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedImage = encodeURIComponent(image || DEFAULT_OG_IMAGE);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=${TWITTER_HANDLE}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`
  };
};

// Function to get social share metadata
export const getSocialMeta = (title: string, description: string, image?: string, type: string = 'website') => {
  const url = typeof window !== 'undefined' ? window.location.href : SITE_URL;
  
  return {
    title,
    description,
    url,
    image: image || DEFAULT_OG_IMAGE,
    type,
    siteName: SITE_NAME,
    twitterHandle: TWITTER_HANDLE,
    shareUrls: generateShareUrls(title, url, image)
  };
};

// Import movie and TV data from tmdb.ts to use their streams
import { UNIQUE_MOVIES, UNIQUE_TV_SHOWS } from './services/tmdb';

// Generic Helper to get streams for media
export const getMediaStreams = (type: 'movie' | 'tv', id: string | number, season = 1, episode = 1): StreamSource[] => {
    if (type === 'movie') {
        const movie = UNIQUE_MOVIES.find(m => m.id === id.toString());
        if (!movie || !movie.streams) return [];
        
        const streamSources: StreamSource[] = [];
        Object.entries(movie.streams).forEach(([serverName, url], index) => {
            streamSources.push({
                id: `movie-${id}-s${index + 1}`,
                name: serverName,
                url: url as string,
                quality: index === 0 ? 'FHD' : 'HD'
            });
        });
        return streamSources;
    } else {
        const tvShow = UNIQUE_TV_SHOWS.find(tv => tv.id === id.toString());
        if (!tvShow || !tvShow.streams) return [];
        
        const streamSources: StreamSource[] = [];
        Object.entries(tvShow.streams).forEach(([serverName, url], index) => {
            let processedUrl = url as string;
            processedUrl = processedUrl
                .replace('s=1', `s=${season}`)
                .replace('e=1', `e=${episode}`)
                .replace('/1/1/', `/${season}/${episode}/`);
            
            streamSources.push({
                id: `tv-${id}-s${index + 1}`,
                name: serverName,
                url: processedUrl,
                quality: 'HD'
            });
        });
        return streamSources;
    }
};

// ==============================================================================
// MOCK DATA - CHANNELS (With Program Schedule)
// ==============================================================================
export const MOCK_CHANNELS: Channel[] = [
  { 
    id: 'c1', 
    name: 'Al Jazeera News Live', 
    logo: '/images/channels/alzazeera.png', 
    category: 'News', 
    currentProgram: 'Global Headlines', 
    progress: 80, 
    streams: [
        { id: 'c1-s1', name: 'Server 1', url: 'https://d1cy85syyhvqz5.cloudfront.net/v1/master/7b67fbda7ab859400a821e9aa0deda20ab7ca3d2/aljazeeraLive/AJE/index.m3u8', quality: 'HD' },
        { id: 'c1-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
           ],
    schedule: [
      {
        id: 'prog1',
        title: 'Al Jazeera News Headlines',
        startTime: new Date(Date.now() - 30 * 60000),
        endTime: new Date(Date.now() + 30 * 60000),
        description: 'Latest world news updates'
      }
    ]
  },
  { 
    id: 'c2', 
    name: 'CNN International', 
    logo: '/images/channels/cnn.png', 
    category: 'News', 
    currentProgram: 'Global Headlines', 
    progress: 80, 
    streams: [
        { id: 'c2-s1', name: 'Server 1', url: 'https://amg01918-cnnus-amg01918c1-vizio-us-1813.playouts.now.amagi.tv/playlist/amg01918-cnnus-cnnheadlines-vizious/playlist.m3u8', quality: 'HD' },
          { id: 'c2-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
           ],
    schedule: [
      {
        id: 'prog1',
        title: 'Global Headlines',
        startTime: new Date(Date.now() - 30 * 60000),
        endTime: new Date(Date.now() + 30 * 60000),
        description: 'Latest world news updates'
      }
    ]
  },
  { 
    id: 'c3', 
    name: 'ABC News Live', 
    logo: '/images/channels/abc.png', 
    category: 'News', 
    currentProgram: 'ABC News Live', 
    progress: 80, 
    streams: [
        { id: 'c3-s1', name: 'Server 1', url: 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8', quality: 'HD' },
                  { id: 'c3-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }       
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'ABC News Headlines',
        startTime: new Date(Date.now() - 30 * 60000),
        endTime: new Date(Date.now() + 30 * 60000),
        description: 'Latest world news updates'
      }
    ]
  },
  { 
    id: 'c4', 
    name: 'Euronews HD', 
    logo: '/images/channels/euronews.png', 
    category: 'News', 
    currentProgram: 'Euronews World Live', 
    progress: 80, 
    streams: [
        { id: 'c4-s1', name: 'Server 1', url: 'https://amg00882-amg00882c2-lg-au-4259.playouts.now.amagi.tv/playlist.m3u8', quality: 'HD' },
                  { id: 'c4-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }       
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'Euronews World Headlines',
        startTime: new Date(Date.now() - 30 * 60000),
        endTime: new Date(Date.now() + 30 * 60000),
        description: 'Latest world news updates'
      }
    ]
  },
  { 
    id: 'c5', 
    name: 'BBC News Live', 
    logo: '/images/channels/bbc.png', 
    category: 'News', 
    currentProgram: 'BBC News Live', 
    progress: 80, 
    streams: [
        { id: 'c5s1', name: 'Server 1', url: 'https://vs-hls-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv14/b=5070016/main.m3u8', quality: 'HD' },
                  { id: 'c5-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }       
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'BBC News Headlines',
        startTime: new Date(Date.now() - 30 * 60000),
        endTime: new Date(Date.now() + 30 * 60000),
        description: 'Latest world news updates'
      }
    ]
  },
  { 
    id: 'c6', 
    name: 'Reuters News Live', 
    logo: '/images/channels/reuters.png', 
    category: 'News', 
    currentProgram: 'Reuters News Live', 
    progress: 80, 
    streams: [
        { id: 'c6s1', name: 'Server 1', url: 'https://amg00453-reuters-amg00453c1-vizio-us-2107.playouts.now.amagi.tv/playlist/amg00453-reuters-reuters-vizious/playlist.m3u8', quality: 'HD' },
                  { id: 'c6-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }       
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'Reuters News Headlines',
        startTime: new Date(Date.now() - 30 * 60000),
        endTime: new Date(Date.now() + 30 * 60000),
        description: 'Live Reuters Channel in HD quality.'
      }
    ]
  },
  { 
    id: 'c7', 
    name: 'USA Today News Live', 
    logo: '/images/channels/usatoday.png', 
    category: 'News', 
    currentProgram: 'USA Today News Live', 
    progress: 80, 
    streams: [
        { id: 'c7s1', name: 'Server 1', url: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00731-gannettcoinc-usatodaynews-vizious/playlist.m3u8', quality: 'HD' },
                  { id: 'c7-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }       
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'USA Today News Headlines',
        startTime: new Date(Date.now() - 30 * 60000),
        endTime: new Date(Date.now() + 30 * 60000),
        description: 'Live Reuters Channel in HD quality.'
      }
    ]
  },
  { 
    id: 'c8', 
    name: 'Sky Sports Main Event', 
    logo: '/images/channels/sky-sports-main-event.png', 
    category: 'Sports', 
    currentProgram: 'Premier League: MCY vs LIV', 
    progress: 45, 
    streams: [
        { id: 'c8-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-35.php', quality: 'HD' },
                  { id: 'c8-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'Premier League: MCY vs LIV',
        startTime: new Date(Date.now() - 45 * 60000), // Started 45 mins ago
        endTime: new Date(Date.now() + 45 * 60000), // Ends in 45 mins
        description: 'Live coverage of Manchester City vs Liverpool'
      },
      {
        id: 'prog2',
        title: 'Post-Match Analysis',
        startTime: new Date(Date.now() + 45 * 60000),
        endTime: new Date(Date.now() + 105 * 60000),
        description: 'Expert analysis and highlights'
      }
    ]
  },
  { 
    id: 'e1', 
    name: 'HBO', 
    logo: '/images/channels/hbo.png', 
    category: 'Entertainment', 
    currentProgram: 'House of the Dragon', 
    progress: 20, 
    streams: [
        { id: 'e1-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-321.php', quality: 'HD' },
                  { id: 'e1-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'House of the Dragon',
        startTime: new Date(Date.now() - 10 * 60000),
        endTime: new Date(Date.now() + 50 * 60000),
        description: 'Season Finale'
      }
    ]
  },
  { 
    id: 'e2', 
    name: 'Investigation Discovery (ID USA)', 
    logo: '/images/channels/investigationdiscovery.png', 
    category: 'Entertainment', 
    currentProgram: 'House of the Crime', 
    progress: 20, 
    streams: [
        { id: 'e2-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-324.php', quality: 'HD' },
          { id: 'e2-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'House of the Crime',
        startTime: new Date(Date.now() - 10 * 60000),
        endTime: new Date(Date.now() + 50 * 60000),
        description: 'Season Finale'
      }
    ]
  },
  { 
    id: 'e3', 
    name: 'History USA', 
    logo: '/images/channels/history-usa.png', 
    category: 'Entertainment', 
    currentProgram: 'Human Biggest Fear', 
    progress: 50, 
    streams: [
        { id: 'e3-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-322.php', quality: 'HD' },
          { id: 'e3-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'Human Biggest Fear',
        startTime: new Date(Date.now() - 10 * 60000),
        endTime: new Date(Date.now() + 50 * 60000),
        description: 'Episode 02'
      }
    ]
  },
  { 
    id: 'e4', 
    name: 'Comedy Central', 
    logo: '/images/channels/comedy-central.png', 
    category: 'Entertainment', 
    currentProgram: 'Comedy Biggest Fear', 
    progress: 50, 
    streams: [
        { id: 'e4-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-310.php', quality: 'HD' },
          { id: 'e4-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ],
    schedule: [
      {
        id: 'prog1',
        title: 'Comedy Biggest Fear',
        startTime: new Date(Date.now() - 10 * 60000),
        endTime: new Date(Date.now() + 50 * 60000),
        description: 'Episode 05'
      }
    ]
  },
       { 
    id: 'a1', 
    name: 'Adult Channel 01', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a1-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-501.php', quality: 'HD' },
          { id: 'a1-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
   { 
    id: 'a2', 
    name: 'Adult Channel 02', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a2-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-502.php', quality: 'HD' },
        { id: 'a2-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a3', 
    name: 'Adult Channel 03', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a3-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-503.php', quality: 'HD' },
        { id: 'a3-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a4', 
    name: 'Adult Channel 04', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a4-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-504.php', quality: 'HD' },
        { id: 'a4-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a5', 
    name: 'Adult Channel 05', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a5-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-505.php', quality: 'HD' },
        { id: 'a5-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a6', 
    name: 'Adult Channel 06', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a6-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-506.php', quality: 'HD' },
        { id: 'a6-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a7', 
    name: 'Adult Channel 07', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a7-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-507.php', quality: 'HD' },
        { id: 'a7-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a8', 
    name: 'Adult Channel 08', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a8-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-508.php', quality: 'HD' },
        { id: 'a8-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a9', 
    name: 'Adult Channel 09', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a9-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-509.php', quality: 'HD' },
        { id: 'a9-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a10', 
    name: 'Adult Channel 10', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a10-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-510.php', quality: 'HD' },
        { id: 'a10-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a11', 
    name: 'Adult Channel 11', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a11-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-511.php', quality: 'HD' },
        { id: 'a11-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a12', 
    name: 'Adult Channel 12', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a12-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-512.php', quality: 'HD' },
        { id: 'a12-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a13', 
    name: 'Adult Channel 13', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a13-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-513.php', quality: 'HD' },
        { id: 'a13-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a14', 
    name: 'Adult Channel 14', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a14-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-514.php', quality: 'HD' },
        { id: 'a14-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a15', 
    name: 'Adult Channel 15', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a15-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-515.php', quality: 'HD' },
        { id: 'a15-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a16', 
    name: 'Adult Channel 16', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a16-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-516.php', quality: 'HD' },
        { id: 'a16-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a17', 
    name: 'Adult Channel 17', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a17-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-517.php', quality: 'HD' },
        { id: 'a17-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a18', 
    name: 'Adult Channel 18', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a18-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-518.php', quality: 'HD' },
        { id: 'a18-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  { 
    id: 'a19', 
    name: 'Adult Channel 19', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a19-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-519.php', quality: 'HD' },
        { id: 'a19-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
{ 
    id: 'a20', 
    name: 'Adult Channel 20', 
    logo: '/images/channels/18only.png', 
    category: 'Adult', 
    currentProgram: 'Live Channels', 
    progress: 60, 
    streams: [
        { id: 'a20-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-520.php', quality: 'HD' },
        { id: 'a20-s2', name: 'Server 2 - Under Maintenance', url: '', quality: 'HD' }
    ]
  },
  // ... (other channels with schedule)
];

// ==============================================================================
// MOCK DATA - MATCHES (With Real Time Data)
// ==============================================================================
export const MOCK_MATCHES: SportMatch[] = [
  // Soccer - Live match
  { 
    id: 's1', 
    league: 'Premier League', 
    leagueLogo: '/images/leagues/premier-league.png',
    homeTeam: 'Arsenal', 
    homeTeamLogo: '/images/teams/arsenal.png',
    awayTeam: 'Chelsea', 
    awayTeamLogo: '/images/teams/chelsea.png',
    homeScore: 0, 
    awayScore: 0, 
    startTime: new Date(Date.now() - 75 * 60000), // Started 75 mins ago
    duration: 90,
    sport: 'Soccer', 
    streams: [
        { id: 's1-s1', name: 'Server 1', url: 'https://daddyhd.com/stream/stream-35.php', quality: 'HD' },
        { id: 's1-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=arsenal_official&parent=localhost', quality: 'HD' },
        { id: 's1-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/123456789', quality: 'HD' },
        { id: 's1-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x1y2z3', quality: 'HD' }
    ]
  },
  
  // Soccer - Finished match
  { 
    id: 's2', 
    league: 'La Liga', 
    leagueLogo: '/images/leagues/laliga.png',
    homeTeam: 'Real Madrid', 
    homeTeamLogo: '/images/teams/real-madrid.png',
    awayTeam: 'Barcelona', 
    awayTeamLogo: '/images/teams/barcelona.png',
    homeScore: 3, 
    awayScore: 3, 
    startTime: new Date(Date.now() - 120 * 60000), // Started 2 hours ago
    duration: 90,
    sport: 'Soccer', 
    streams: [
        { id: 's2-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/elclasico', quality: 'HD' },
        { id: 's2-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=laliga&parent=localhost', quality: 'HD' },
        { id: 's2-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/11223344', quality: 'HD' },
        { id: 's2-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x3r4t5', quality: 'HD' }
    ]
  },
  
  // Basketball - Scheduled
  { 
    id: 's3', 
    league: 'NBA', 
    leagueLogo: '/images/leagues/nba.png',
    homeTeam: 'Lakers', 
    homeTeamLogo: '/images/teams/lakers.png',
    awayTeam: 'Warriors', 
    awayTeamLogo: '/images/teams/warriors.png',
    startTime: new Date(Date.now() + 120 * 60000), // Starts in 2 hours
    duration: 48,
    sport: 'Basketball', 
    streams: [
        { id: 's3-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/nba_highlights', quality: 'HD' },
        { id: 's3-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=nba&parent=localhost', quality: 'HD' },
        { id: 's3-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/987654321', quality: 'HD' },
        { id: 's3-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x9w8v7', quality: 'HD' }
    ]
  },
  
  // Am. Football - Live
  { 
    id: 's4', 
    league: 'NFL', 
    leagueLogo: '/images/leagues/nfl.png',
    homeTeam: 'Chiefs', 
    homeTeamLogo: '/images/teams/chiefs.png',
    awayTeam: 'Bills', 
    awayTeamLogo: '/images/teams/bills.png',
    homeScore: 14, 
    awayScore: 10, 
    startTime: new Date(Date.now() - 25 * 60000), // Started 25 mins ago
    duration: 60,
    sport: 'Football', 
    streams: [
        { id: 's4-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/nfl_live', quality: 'HD' },
        { id: 's4-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=nfl&parent=localhost', quality: 'HD' },
        { id: 's4-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/55667788', quality: 'HD' },
        { id: 's4-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x2q1w3', quality: 'HD' }
    ]
  },
  
  // Cricket - Live
  { 
    id: 's5', 
    league: 'ICC World Cup', 
    leagueLogo: '/images/leagues/icc.png',
    homeTeam: 'India', 
    homeTeamLogo: '/images/teams/india.png',
    awayTeam: 'Australia', 
    awayTeamLogo: '/images/teams/australia.png',
    homeScore: 245, 
    awayScore: 198, 
    startTime: new Date(Date.now() - 230 * 60000), // Started 3h 50m ago
    duration: 300,
    sport: 'Cricket', 
    streams: [
        { id: 's5-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/cricket_live', quality: 'HD' },
        { id: 's5-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=icc&parent=localhost', quality: 'HD' },
        { id: 's5-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/33445566', quality: 'HD' },
        { id: 's5-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x4s5t6', quality: 'HD' }
    ]
  },
  
  // Tennis - Live
  { 
    id: 's6', 
    league: 'Australian Open', 
    leagueLogo: '/images/leagues/australian-open.png',
    homeTeam: 'Djokovic', 
    homeTeamLogo: '/images/teams/djokovic.png',
    awayTeam: 'Nadal', 
    awayTeamLogo: '/images/teams/nadal.png',
    homeScore: 2, 
    awayScore: 1, 
    startTime: new Date(Date.now() - 95 * 60000), // Started 1h 35m ago
    duration: 180,
    sport: 'Tennis', 
    streams: [
        { id: 's6-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/tennis_live', quality: 'HD' },
        { id: 's6-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=tennis&parent=localhost', quality: 'HD' },
        { id: 's6-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/66778899', quality: 'HD' },
        { id: 's6-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x5u6v7', quality: 'HD' }
    ]
  },
  
  // Motorsport - Scheduled
  { 
    id: 's7', 
    league: 'Formula 1', 
    leagueLogo: '/images/leagues/f1.png',
    homeTeam: 'Red Bull', 
    homeTeamLogo: '/images/teams/redbull.png',
    awayTeam: 'Mercedes', 
    awayTeamLogo: '/images/teams/mercedes.png',
    startTime: new Date(Date.now() + 180 * 60000), // Starts in 3 hours
    duration: 120,
    sport: 'Motorsport', 
    streams: [
        { id: 's7-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/f1_live', quality: 'HD' },
        { id: 's7-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=f1&parent=localhost', quality: 'HD' },
        { id: 's7-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/88990011', quality: 'HD' },
        { id: 's7-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x6w7x8', quality: 'HD' }
    ]
  },
  
  // Golf - Live
  { 
    id: 's8', 
    league: 'PGA Tour', 
    leagueLogo: '/images/leagues/pga.png',
    homeTeam: 'McIlroy', 
    homeTeamLogo: '/images/teams/mcilroy.png',
    awayTeam: 'Scheffler', 
    awayTeamLogo: '/images/teams/scheffler.png',
    homeScore: -5, 
    awayScore: -4, 
    startTime: new Date(Date.now() - 240 * 60000), // Started 4 hours ago
    duration: 240,
    sport: 'Golf', 
    streams: [
        { id: 's8-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/golf_live', quality: 'HD' },
        { id: 's8-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=golf&parent=localhost', quality: 'HD' },
        { id: 's8-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/99001122', quality: 'HD' },
        { id: 's8-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x7y8z9', quality: 'HD' }
    ]
  },
  
  // NHL - Live
  { 
    id: 's9', 
    league: 'NHL', 
    leagueLogo: '/images/leagues/nhl.png',
    homeTeam: 'Maple Leafs', 
    homeTeamLogo: '/images/teams/mapleleafs.png',
    awayTeam: 'Bruins', 
    awayTeamLogo: '/images/teams/bruins.png',
    homeScore: 3, 
    awayScore: 2, 
    startTime: new Date(Date.now() - 50 * 60000), // Started 50 mins ago
    duration: 60,
    sport: 'NHL', 
    streams: [
        { id: 's9-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/nhl_live', quality: 'HD' },
        { id: 's9-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=nhl&parent=localhost', quality: 'HD' },
        { id: 's9-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/11223344', quality: 'HD' },
        { id: 's9-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x8z9a1', quality: 'HD' }
    ]
  },
  
  // Boxing - Scheduled
  { 
    id: 's10', 
    league: 'WBC Heavyweight', 
    leagueLogo: '/images/leagues/wbc.png',
    homeTeam: 'Fury', 
    homeTeamLogo: '/images/teams/fury.png',
    awayTeam: 'Usyk', 
    awayTeamLogo: '/images/teams/usyk.png',
    startTime: new Date(Date.now() + 300 * 60000), // Starts in 5 hours
    duration: 60,
    sport: 'Boxing', 
    streams: [
        { id: 's10-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/boxing_live', quality: 'HD' },
        { id: 's10-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=boxing&parent=localhost', quality: 'HD' },
        { id: 's10-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/22334455', quality: 'HD' },
        { id: 's10-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x9a1b2', quality: 'HD' }
    ]
  },
  
  // Rugby - Scheduled
  { 
    id: 's11', 
    league: 'Six Nations', 
    leagueLogo: '/images/leagues/sixnations.png',
    homeTeam: 'England', 
    homeTeamLogo: '/images/teams/england.png',
    awayTeam: 'Wales', 
    awayTeamLogo: '/images/teams/wales.png',
    startTime: new Date(Date.now() + 90 * 60000), // Starts in 1.5 hours
    duration: 80,
    sport: 'Rugby', 
    streams: [
        { id: 's11-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/rugby_live', quality: 'HD' },
        { id: 's11-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=rugby&parent=localhost', quality: 'HD' },
        { id: 's11-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/33445566', quality: 'HD' },
        { id: 's11-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x1b2c3', quality: 'HD' }
    ]
  },
  
  // Cycling - Live
  { 
    id: 's12', 
    league: 'Tour de France', 
    leagueLogo: '/images/leagues/tourdefrance.png',
    homeTeam: 'Pogacar', 
    homeTeamLogo: '/images/teams/pogacar.png',
    awayTeam: 'Vingegaard', 
    awayTeamLogo: '/images/teams/vingegaard.png',
    homeScore: 0, 
    awayScore: 0, 
    startTime: new Date(Date.now() - 180 * 60000), // Started 3 hours ago
    duration: 240,
    sport: 'Cycling', 
    streams: [
        { id: 's12-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/cycling_live', quality: 'HD' },
        { id: 's12-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=cycling&parent=localhost', quality: 'HD' },
        { id: 's12-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/44556677', quality: 'HD' },
        { id: 's12-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x2c3d4', quality: 'HD' }
    ]
  },
  
  // Ice Hockey - Live
  { 
    id: 's13', 
    league: 'KHL', 
    leagueLogo: '/images/leagues/khl.png',
    homeTeam: 'CSKA Moscow', 
    homeTeamLogo: '/images/teams/cska.png',
    awayTeam: 'SKA St. Petersburg', 
    awayTeamLogo: '/images/teams/ska.png',
    homeScore: 2, 
    awayScore: 1, 
    startTime: new Date(Date.now() - 35 * 60000), // Started 35 mins ago
    duration: 60,
    sport: 'Ice Hockey', 
    streams: [
        { id: 's13-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/icehockey_live', quality: 'HD' },
        { id: 's13-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=icehockey&parent=localhost', quality: 'HD' },
        { id: 's13-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/55667788', quality: 'HD' },
        { id: 's13-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x3d4e5', quality: 'HD' }
    ]
  },
  
  // Horse Racing - Scheduled
  { 
    id: 's14', 
    league: 'Kentucky Derby', 
    leagueLogo: '/images/leagues/kentuckyderby.png',
    homeTeam: 'Mage', 
    homeTeamLogo: '/images/teams/mage.png',
    awayTeam: 'Two Phil\'s', 
    awayTeamLogo: '/images/teams/twophils.png',
    startTime: new Date(Date.now() + 240 * 60000), // Starts in 4 hours
    duration: 5,
    sport: 'Horse Racing', 
    streams: [
        { id: 's14-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/horseracing_live', quality: 'HD' },
        { id: 's14-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=horseracing&parent=localhost', quality: 'HD' },
        { id: 's14-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/66778899', quality: 'HD' },
        { id: 's14-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x4e5f6', quality: 'HD' }
    ]
  },
  
  // Snooker - Live
  { 
    id: 's15', 
    league: 'World Championship', 
    leagueLogo: '/images/leagues/snooker.png',
    homeTeam: 'O\'Sullivan', 
    homeTeamLogo: '/images/teams/osullivan.png',
    awayTeam: 'Trump', 
    awayTeamLogo: '/images/teams/trump.png',
    homeScore: 5, 
    awayScore: 3, 
    startTime: new Date(Date.now() - 60 * 60000), // Started 1 hour ago
    duration: 180,
    sport: 'Snooker', 
    streams: [
        { id: 's15-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/snooker_live', quality: 'HD' },
        { id: 's15-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=snooker&parent=localhost', quality: 'HD' },
        { id: 's15-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/77889900', quality: 'HD' },
        { id: 's15-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x5f6g7', quality: 'HD' }
    ]
  },
  
  // Sailing - Live
  { 
    id: 's16', 
    league: 'America\'s Cup', 
    leagueLogo: '/images/leagues/americascup.png',
    homeTeam: 'Team NZ', 
    homeTeamLogo: '/images/teams/teamnz.png',
    awayTeam: 'Team USA', 
    awayTeamLogo: '/images/teams/teamusa.png',
    homeScore: 4, 
    awayScore: 3, 
    startTime: new Date(Date.now() - 150 * 60000), // Started 2.5 hours ago
    duration: 180,
    sport: 'Sailing', 
    streams: [
        { id: 's16-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/sailing_live', quality: 'HD' },
        { id: 's16-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=sailing&parent=localhost', quality: 'HD' },
        { id: 's16-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/88990011', quality: 'HD' },
        { id: 's16-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x6g7h8', quality: 'HD' }
    ]
  },
  
  // Handball - Scheduled
  { 
    id: 's17', 
    league: 'EHF Champions League', 
    leagueLogo: '/images/leagues/ehf.png',
    homeTeam: 'Barcelona', 
    homeTeamLogo: '/images/teams/barcelona-handball.png',
    awayTeam: 'PSG', 
    awayTeamLogo: '/images/teams/psg-handball.png',
    startTime: new Date(Date.now() + 120 * 60000), // Starts in 2 hours
    duration: 60,
    sport: 'Handball', 
    streams: [
        { id: 's17-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/handball_live', quality: 'HD' },
        { id: 's17-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=handball&parent=localhost', quality: 'HD' },
        { id: 's17-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/99001122', quality: 'HD' },
        { id: 's17-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x7h8i9', quality: 'HD' }
    ]
  },
  
  // Volleyball - Live
  { 
    id: 's18', 
    league: 'FIVB World Championship', 
    leagueLogo: '/images/leagues/fivb.png',
    homeTeam: 'Brazil', 
    homeTeamLogo: '/images/teams/brazil-volleyball.png',
    awayTeam: 'USA', 
    awayTeamLogo: '/images/teams/usa-volleyball.png',
    homeScore: 2, 
    awayScore: 1, 
    startTime: new Date(Date.now() - 70 * 60000), // Started 70 mins ago
    duration: 90,
    sport: 'Volleyball', 
    streams: [
        { id: 's18-s1', name: 'Server 1', url: 'https://www.youtube.com/embed/volleyball_live', quality: 'HD' },
        { id: 's18-s2', name: 'Server 2', url: 'https://player.twitch.tv/?channel=volleyball&parent=localhost', quality: 'HD' },
        { id: 's18-s3', name: 'Server 3', url: 'https://player.vimeo.com/video/10111233', quality: 'HD' },
        { id: 's18-s4', name: 'Server 4', url: 'https://www.dailymotion.com/embed/video/x8i9j0', quality: 'HD' }
    ]
  }
];

