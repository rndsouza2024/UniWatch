// // pages/api/streams.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import {
//   UNIQUE_MOVIES,
//   UNIQUE_TV_SHOWS,
//   UNIQUE_SPORTS,
//   UNIQUE_TV_LIVE,
//   UNIQUE_HINDI_DUBBED,
//   UNIQUE_ADULT,
// } from '../../services/tmdb';
// import { StreamSource } from '../../types';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { id, type, season = '1', episode = '1' } = req.query;

//   if (!id || !type) {
//     return res.status(400).json({ error: 'Missing id or type' });
//   }

//   const idStr = String(id);
//   const mediaType = type as string;
//   const s = parseInt(season as string, 10) || 1;
//   const e = parseInt(episode as string, 10) || 1;

//   let streams: Record<string, string> | undefined;

//   // ----- 1. STATIC STREAMS (from tmdb.ts) -----
//   if (mediaType === 'movie') {
//     const movie = [...UNIQUE_MOVIES, ...UNIQUE_HINDI_DUBBED, ...UNIQUE_ADULT].find(
//       (item) => String(item.id) === idStr
//     );
//     streams = movie?.streams;
//   } else if (mediaType === 'tv') {
//     const tv = UNIQUE_TV_SHOWS.find((item) => String(item.id) === idStr);
//     streams = tv?.streams;
//   } else if (mediaType === 'sports') {
//     const sports = UNIQUE_SPORTS.find((item) => String(item.id) === idStr);
//     streams = sports?.streams;
//   } else if (mediaType === 'tv_live') {
//     const live = UNIQUE_TV_LIVE.find((item) => String(item.id) === idStr);
//     streams = live?.streams;
//   }

//   // ----- 2. FALLBACK STREAMS (same as VideoPlayer's internal fallback) -----
//   if (!streams) {
//     const isNumeric = /^\d+$/.test(idStr.split('-')[0]); // handle IDs like "123-movie-name"
//     const cleanId = idStr.split('-')[0];

//     if (mediaType === 'movie') {
//       streams = {
//         'Server 1': `https://xprime.today/watch/${cleanId}`,
//         'Server 2': `https://cinemaos.tech/player/${cleanId}`,
//         'Server 3': `https://www.vidking.net/embed/movie/${cleanId}?autoPlay=true&nextEpisode=true&episodeSelector=true`,
//         'Server 4': `https://vidsrc-embed.ru/embed/movie/${cleanId}`,
//         'Server 5': `https://api.cinezo.net/embed/tmdb-movie-${cleanId}`,
//         'Server 6': `https://zxcstream.xyz/player/movie/${cleanId}/hindi?autoplay=false&back=true&server=0`,
//       };
//     } else if (mediaType === 'tv') {
//       streams = {
//         'Server 1': `https://www.vidking.net/embed/tv/${cleanId}/${s}/${e}?autoPlay=true&nextEpisode=true&episodeSelector=true`,
//         'Server 2': `https://xprime.today/watch/${cleanId}/${s}/${e}`,
//         'Server 3': `https://api.cinezo.net/embed/tmdb-tv-${cleanId}/${s}/${e}`,
//         'Server 4': `https://www.cinezo.net/watch/tv/${cleanId}?season=${s}&episode=${e}`,
//         'Server 5': `https://vidsrc-embed.ru/embed/tv/${cleanId}/${s}/${e}`,
//         'Server 6': `https://zxcstream.xyz/player/tv/${cleanId}/hindi?autoplay=false&back=true&server=0`,
//       };
//     } else {
//       // For sports/tv_live without static streams – return empty (VideoPlayer will handle)
//       streams = {};
//     }
//   }

//   if (!streams || Object.keys(streams).length === 0) {
//     return res.status(404).json({ error: 'No streams available for this content' });
//   }

//   // Convert to array format expected by VideoPlayer
//   const streamArray: StreamSource[] = Object.entries(streams).map(([name, url], i) => ({
//     id: `srv-${i}`,
//     name,
//     url: String(url),
//     quality: 'HD',
//     type: String(url).includes('.m3u8') || String(url).includes('hls') ? 'hls' : 'iframe',
//   }));

//   res.status(200).json({ streams: streamArray });
// }






// pages/api/streams.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {
  UNIQUE_MOVIES,
  UNIQUE_TV_SHOWS,
  UNIQUE_SPORTS,
  UNIQUE_TV_LIVE,
  UNIQUE_HINDI_DUBBED,
  UNIQUE_ADULT,
} from '../../services/tmdb';
import { StreamSource } from '../../types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, type, season = '1', episode = '1' } = req.query;

  if (!id || !type) {
    return res.status(400).json({ error: 'Missing id or type' });
  }

  const idStr = String(id);
  const mediaType = type as string;
  const s = parseInt(season as string, 10) || 1;
  const e = parseInt(episode as string, 10) || 1;

  // Allow both object and array streams
  let streams: Record<string, string> | StreamSource[] | undefined;

  // ----- 1. STATIC STREAMS (from tmdb.ts) -----
  if (mediaType === 'movie') {
    const movie = [...UNIQUE_MOVIES, ...UNIQUE_HINDI_DUBBED, ...UNIQUE_ADULT].find(
      (item) => String(item.id) === idStr
    );
    streams = movie?.streams;
  } else if (mediaType === 'tv') {
    const tv = UNIQUE_TV_SHOWS.find((item) => String(item.id) === idStr);
    streams = tv?.streams;
  } else if (mediaType === 'sports') {
    const sports = UNIQUE_SPORTS.find((item) => String(item.id) === idStr);
    streams = sports?.streams;
  } else if (mediaType === 'tv_live') {
    const live = UNIQUE_TV_LIVE.find((item) => String(item.id) === idStr);
    streams = live?.streams;
  }

  // ----- 2. FALLBACK STREAMS (if no static streams) -----
  if (!streams) {
    const cleanId = idStr.split('-')[0]; // handle IDs like "123-movie-name"

    if (mediaType === 'movie') {
      streams = {
        'Server 1': `https://xprime.today/watch/${cleanId}`,
        'Server 2': `https://cinemaos.tech/player/${cleanId}`,
        'Server 3': `https://www.vidking.net/embed/movie/${cleanId}?autoPlay=true&nextEpisode=true&episodeSelector=true`,
        'Server 4': `https://vidsrc-embed.ru/embed/movie/${cleanId}`,
        'Server 5': `https://api.cinezo.net/embed/tmdb-movie-${cleanId}`,
        'Server 6': `https://zxcstream.xyz/player/movie/${cleanId}/hindi?autoplay=false&back=true&server=0`,
      };
    } else if (mediaType === 'tv') {
      streams = {
        'Server 1': `https://www.vidking.net/embed/tv/${cleanId}/${s}/${e}?autoPlay=true&nextEpisode=true&episodeSelector=true`,
        'Server 2': `https://xprime.today/watch/${cleanId}/${s}/${e}`,
        'Server 3': `https://api.cinezo.net/embed/tmdb-tv-${cleanId}/${s}/${e}`,
        'Server 4': `https://www.cinezo.net/watch/tv/${cleanId}?season=${s}&episode=${e}`,
        'Server 5': `https://vidsrc-embed.ru/embed/tv/${cleanId}/${s}/${e}`,
        'Server 6': `https://zxcstream.xyz/player/tv/${cleanId}/hindi?autoplay=false&back=true&server=0`,
      };
    } else {
      // For sports/tv_live without static streams – return empty array
      streams = [];
    }
  }

  // Convert to array format expected by VideoPlayer
  let streamArray: StreamSource[] = [];

  if (Array.isArray(streams)) {
    // If already an array, assume it's in the correct format
    streamArray = streams;
  } else if (streams && typeof streams === 'object') {
    streamArray = Object.entries(streams).map(([name, url], i) => ({
      id: `srv-${i}`,
      name,
      url: String(url),
      quality: 'HD',
      type: String(url).includes('.m3u8') || String(url).includes('hls') ? 'hls' : 'iframe',
    }));
  }

  if (streamArray.length === 0) {
    return res.status(404).json({ error: 'No streams available for this content' });
  }

  res.status(200).json({ streams: streamArray });
}