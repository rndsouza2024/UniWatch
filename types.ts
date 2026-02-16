// export interface StreamSource {
//   id: string;
//   name: string;
//   url: string;
//   quality: string;
//   type: 'hls' | 'direct' | 'iframe';
// }

// export interface MediaItem {
//   id: number | string;
//   title?: string;
//   name?: string;
//   poster_path: string;
//   backdrop_path: string;
//   release_date?: string;
//   first_air_date?: string;
//   vote_average: number;
//   overview: string;
//   media_type: 'movie' | 'tv' | 'sports' | 'tv_live';
//   duration?: string;
//   genres?: string[] | { id: number; name: string }[];
//   streams?: Record<string, string> | StreamSource[];
//   yt_id?: string; 

// }

// export interface Movie extends MediaItem {
//   media_type: 'movie';
//   title: string;
// }

// export interface TVShow extends MediaItem {
//   media_type: 'tv';
//   name: string;
// }

// export interface ContentDetails {
//   id: number | string;
//   title?: string;
//   name?: string;
//   poster_path: string;
//   backdrop_path: string;
//   vote_average: number;
//   overview: string;
//   release_date?: string;
//   first_air_date?: string;
//   genres: { id: number; name: string }[];
//   runtime?: number;
//   number_of_seasons?: number;
//   streams?: Record<string, string> | StreamSource[];
//   media_type?: 'movie' | 'tv' | 'sports' | 'tv_live';
//   yt_id?: string;
// }

// export interface CastMember {
//   id: number;
//   name: string;
//   character: string;
//   profile_path: string | null;
// }







// types/index.ts

export interface StreamSource {
  id: string;
  name: string;
  url: string;
  quality: string;
  type: 'hls' | 'direct' | 'iframe';
}

export interface MediaItem {
  id: number | string;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  media_type: 'movie' | 'tv' | 'sports' | 'tv_live';
  duration?: string;
  genres?: string[] | { id: number; name: string }[];
  streams?: Record<string, string> | StreamSource[];
  yt_id?: string; // ✅ CUSTOM TRAILER ID – FIXES BUILD ERROR
}

export interface Movie extends MediaItem {
  media_type: 'movie';
  title: string;
}

export interface TVShow extends MediaItem {
  media_type: 'tv';
  name: string;
}

export interface ContentDetails {
  id: number | string;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  genres?: string[] | { id: number; name: string }[]; // ✅ SUPPORTS BOTH FORMATS
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  type?: string;
  streams?: Record<string, string> | StreamSource[];
  media_type?: 'movie' | 'tv' | 'sports' | 'tv_live';
  yt_id?: string; // ✅ CUSTOM TRAILER ID
  duration?: string; // ✅ FOR SPORTS / LIVE TV
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}