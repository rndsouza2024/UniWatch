// export interface StreamSource {
//   id: string;
//   name: string;
//   url: string;
//   quality?: 'HD' | 'FHD' | '4K';
// }

// export interface MediaItem {
//   id: string | number;
//   title: string; // or name for TV
//   poster_path: string;
//   backdrop_path: string;
//   release_date?: string;
//   first_air_date?: string;
//   vote_average: number;
//   overview: string;
//   media_type: 'movie' | 'tv';
//   genres?: number[] | string[];
//   duration?: string;
//   streams?: StreamSource[];
// }

// export interface Channel {
//   id: string;
//   name: string;
//   logo: string;
//   category: string;
//   currentProgram: string;
//   progress: number;
//   streams: StreamSource[];
// }

// export interface SportMatch {
//   id: string;
//   league: string;
//   leagueLogo?: string;
//   homeTeam: string;
//   homeTeamLogo?: string;
//   awayTeam: string;
//   awayTeamLogo?: string;
//   homeScore?: number;
//   awayScore?: number;
//   status: 'live' | 'scheduled' | 'finished';
//   time: string;
//   date: string;
//   sport: string; // e.g., 'soccer', 'basketball'
//   streams: StreamSource[];
// }

// export interface User {
//   id: string;
//   name: string;
//   avatar: string;
//   email: string;
//   isPremium: boolean;
// }

// export enum NavSection {
//   HOME = 'Home',
//   MOVIES = 'Movies',
//   TV_SHOWS = 'TV Shows',
//   SPORTS = 'Sports',
//   IPTV = 'IPTV',
//   AI_CHAT = 'AI Assistant'
// }









export interface StreamSource {
  id: string;
  name: string;
  url: string;
  quality?: 'HD' | 'FHD' | '4K';
}

export interface MediaItem {
  id: string | number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  media_type: 'movie' | 'tv' | 'sports' | 'tv_live';
  genres?: number[] | string[];
  duration?: string;
  streams?: StreamSource[];
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  currentProgram: string;
  progress: number;
  streams: StreamSource[];
}

export interface SportMatch {
  id: string;
  league: string;
  leagueLogo?: string;
  homeTeam: string;
  homeTeamLogo?: string;
  awayTeam: string;
  awayTeamLogo?: string;
  homeScore?: number;
  awayScore?: number;
  status: 'live' | 'scheduled' | 'finished';
  time: string;
  date: string;
  sport: string;
  streams: StreamSource[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isPremium: boolean;
}

export enum NavSection {
  HOME = 'Home',
  MOVIES = 'Movies',
  TV_SHOWS = 'TV Shows',
  SPORTS = 'Sports',
  IPTV = 'IPTV',
  AI_CHAT = 'AI Assistant'
}