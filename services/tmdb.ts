import { MediaItem } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

// Sports content
const UNIQUE_SPORTS = [
  {
    id: 'bbl2025-26-challenger',
    title: 'BBL 2025-26 Challenger : Sixers vs Hurricanes',
    poster_path: '/images/sports/bbl_1.jpg',
    backdrop_path: '/images/sports/bbl_1.jpg',
    release_date: '2026-01-23',
    vote_average: 8.5,
    duration: 'Live',
    genres: ['Cricket', 'Live', 'Sports'],
    streams: {
      "Server 1": "https://embedsports.top/embed/echo/bbl-challenger-sydney-sixers-vs-hobart-hurricanes-game-126262/2",
      "Server 2": "https://embedsports.top/embed/echo/bbl-challenger-sydney-sixers-vs-hobart-hurricanes-game-126262/4",
      "Server 3- Under Maintenance": ""
    },
    overview: 'BBL 2025-26 Challenger : Sixers vs Hurricanes Live matches'
  },
  {
    id: 'australian-open-live',
    title: 'Australian Open Live',
    poster_path: '/images/sports/tennis.jpg',
    backdrop_path: '/images/sports/tennis.jpg',
    release_date: '2026-01-23',
    vote_average: 5.5,
    duration: 'Live',
    genres: ['Tennis', 'Live', 'Sports'],
    streams: {
      "Server 1": "https://amg01444-tennischannelth-tennischannelnl-samsungnl-x3dq1.amagi.tv/ts-eu-w1-n2/playlist/amg01444-tennischannelth-tennischannelnl-samsungnl/cb553d1e786c648a9dd43e61d4ef42a0dc243dfc087a8d6933fb4b926bc10f41e2e5af97b20cac7822fb0fdf61146d5a4d009247d8780ad7967cac48240d5734c6cdd52e8be24b4daddd0c2d34b07c0e49857671ad594f32d5e0110dc51ab07a0e1ca1494d5e2082b00cb27756c69e0a957f378bbdbe306f2c180680585ee2be5da5edf5084d8c64a9e3194f887943e1835fc8d54abb9d865e97169b24a041cc93a2d88612808e9101ec6d8d5c9f870f07fba957d1ac74b8de93684bf31b4a672d252d270e9c3458a7544a5d8293a314eed261a8a4308c6236b242ed2746c6a719c8248f9b258dacb3de50402aacd049606dc88fc6deab6563ea36a9e081b802b94457633e349a4da1d91ec75b309326a48979b7a52a84fb421234cb90519aa77fe285bfa045862cc6cbf5d7680c1e234c358f53a6957ac869f34ce89f436f0c16049a935b92d2821e28341bcfc07fc40317bcec8e81f4072f8535480da6338f1b4d47e4004150a96df5933769c9010f863e32b218168850f3b529baf68fb6486bfb8e8912bf5ceeb30bc0ff4dfc3e6b1751e58059352f7b74deea691a2339921596b4e4d5375850a2a7b7bdaa351f0836105e09f192c4788981cd2c5d5b81642f6e701f008546b14dda13421421d914b1f85c94e4d4808d4dc11257f3ab196e438f8579b98298a56edb/45/1920x1080_5288800/index.m3u8",
      "Server 2- Under Maintenance": ""
    },
    overview: 'Tennis Channel Live at the Australian Open Live matches'
  },
  {
    id: 'sports-3',
    title: 'Live Cricket - T20 World Cup',
    poster_path: '/images/sports/cricket.jpg',
    backdrop_path: '/images/sports/cricket-bg.jpg',
    release_date: '2024-01-20',
    vote_average: 8.7,
    duration: 'Live',
    genres: ['Sports', 'Live', 'Cricket'],
    streams: {
      "Server 1": "https://bein-esp-klowdtv.amagi.tv/playlistR1080p.m3u8",
       "Server 2 - Under Maintenance": ""
     },
    overview: 'Live T20 World Cup cricket match. Experience the excitement of international cricket.'
  },
  {
    id: 'sports-4',
    title: 'UFC Live Fight Night',
    poster_path: '/images/sports/ufc.jpg',
    backdrop_path: '/images/sports/ufc-bg.jpg',
    release_date: '2024-01-20',
    vote_average: 8.4,
    duration: 'Live',
    genres: ['Sports', 'Live', 'MMA'],
    streams: {
      "Server 1": "https://embedsports.top/embed/live/ufc-1",
      "Server 2": "https://embedsports.top/embed/live/ufc-2"
    },
    overview: 'Live UFC Fight Night. Watch the best MMA fighters in action.'
  },
  {
    id: 'sports-5',
    title: 'Formula 1 Live Racing',
    poster_path: '/images/sports/f1.jpg',
    backdrop_path: '/images/sports/f1-bg.jpg',
    release_date: '2024-01-20',
    vote_average: 8.6,
    duration: 'Live',
    genres: ['Sports', 'Live', 'Racing'],
    streams: {
      "Server 1": "https://embedsports.top/embed/live/f1-1",
      "Server 2": "https://embedsports.top/embed/live/f1-2"
    },
    overview: 'Live Formula 1 Grand Prix. Follow all the racing action from the track.'
  }
];

// Live TV content
const UNIQUE_TV_LIVE = [
  {
    id: 'fx-movie-channel-hd',
    title: 'FX Movie Channel HD',
    poster_path: '/images/tv/FX_Movie_Channel.jpg',
    backdrop_path: '/images/tv/FX_Movie_Channel.jpg',
    release_date: '2024-01-20',
    vote_average: 7.8,
    duration: '24/7',
    genres: ['fx movie channel', 'Live', 'fx movie'],
    streams: {
      "Server 1": "https://daddyhd.com/stream/stream-381.php"     
    },
    overview: 'Watch the FX Movie Channel live in high definition. Enjoy a wide range of movies and TV shows from various genres, all in stunning HD quality.'
  },
  {
    id: 'hbo-usa-hd',
    title: 'HBO USA Channel HD',
    poster_path: '/images/tv/hbo.jpg',
    backdrop_path: '/images/tv/hbo.jpg',
    release_date: '2024-01-20',
    vote_average: 8.1,
    duration: '24/7',
    genres: ['hbo usa channel', 'Live', 'hbo usa'],
    streams: {
      "Server 1": "https://daddyhd.com/stream/stream-321.php"   
    },
    overview: 'Live music channel featuring concerts, music videos, and live performances.'
  },
  {
    id: 'live-3',
    title: 'Live Comedy Central',
    poster_path: '/images/tv/comedy.jpg',
    backdrop_path: '/images/tv/comedy-bg.jpg',
    release_date: '2024-01-20',
    vote_average: 8.3,
    duration: '24/7',
    genres: ['Comedy', 'Live', 'Entertainment'],
    streams: {
      "Server 1": "https://embedsports.top/embed/live/comedy-1",
      "Server 2": "https://embedsports.top/embed/live/comedy-2"
    },
    overview: 'Live comedy shows, stand-up specials, and funny content 24/7.'
  },
  {
    id: 'live-4',
    title: 'Live Kids Channel',
    poster_path: '/images/tv/kids.jpg',
    backdrop_path: '/images/tv/kids-bg.jpg',
    release_date: '2024-01-20',
    vote_average: 7.9,
    duration: '24/7',
    genres: ['Kids', 'Family', 'Live'],
    streams: {
      "Server 1": "https://embedsports.top/embed/live/kids-1",
      "Server 2": "https://embedsports.top/embed/live/kids-2"
    },
    overview: '24/7 kids entertainment with cartoons, educational shows, and fun content.'
  },
  {
    id: 'live-5',
    title: 'Live Documentary Channel',
    poster_path: '/images/tv/documentary.jpg',
    backdrop_path: '/images/tv/documentary-bg.jpg',
    release_date: '2024-01-20',
    vote_average: 8.4,
    duration: '24/7',
    genres: ['Documentary', 'Educational', 'Live'],
    streams: {
      "Server 1": "https://embedsports.top/embed/live/doc-1",
      "Server 2": "https://embedsports.top/embed/live/doc-2"
    },
    overview: 'Live documentary channel featuring nature, science, and history content.'
  }
];

// 15 UNIQUE MOVIES (ALL FROM TMDB)
const UNIQUE_MOVIES = [
  {
    id: '1236153',
    title: 'Mercy (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/pyok1kZJCfyuFapYXzHcy7BLlQa.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/pyok1kZJCfyuFapYXzHcy7BLlQa.jpg',
    release_date: '2026-01-16',
    vote_average: 6.4,
    duration: '2h 40m',
    genres: ['Action ', 'Adventure', 'Comedy'],
    streams: {
      "Server 1": "https://xprime.today/watch/1236153",
      "Server 2": "https://cinemaos.tech/player/1236153",
      "Server 3": "https://zxcstream.xyz/player/movie/1236153/english?autoplay=false&back=true&server=0",
      "Server 4 - HINDI": "https://byseqekaho.com/e/j1pt36tomnsn",
      "Server 5": "https://www.cinezo.net/watch/movie/1236153",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1236153",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1236153"
    },
    overview: 'In the near future, a detective stands on trial accused of murdering his wife. He has ninety minutes to prove his innocence to the advanced AI Judge he once championed, before it determines his fate.'
  },
  {
    id: '1584215',
    title: 'The Internship (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/fYqSOkix4rbDiZW0ACNnvZCpT6X.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/fYqSOkix4rbDiZW0ACNnvZCpT6X.jpg',
    release_date: '2026-01-16',
    vote_average: 5.6,
    duration: '2h 40m',
    genres: ['Action ', 'Adventure', 'Thriller'],
    streams: {
      "Server 1": "https://xprime.today/watch/1584215",
      "Server 2": "https://cinemaos.tech/player/1584215",
      "Server 3": "https://zxcstream.xyz/player/movie/1584215/english?autoplay=false&back=true&server=0",
      "Server 4 - HINDI": "https://byseqekaho.com/e/8d5wcz776i0h",
      "Server 5": "https://www.cinezo.net/watch/movie/1584215",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1584215",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1584215"
    },
    overview: 'A CIA-trained assassin recruits other graduates from her secret childhood program, The Internship, to violently destroy the organization. The CIA fights back with deadly force.'
  },
  {
    id: '1412598',
    title: 'Killer Whale (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/cqbXxAw9sUr4tJ5ffEwtnz6IL9o.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/cqbXxAw9sUr4tJ5ffEwtnz6IL9o.jpg',
    release_date: '2026-01-16',
    vote_average: 6.5,
    duration: '2h 40m',
    genres: ['Thriller ', 'Horror', 'Action'],
    streams: {
      "Server 1": "https://xprime.today/watch/1412598",
      "Server 2": "https://cinemaos.tech/player/1412598",
      "Server 3": "https://zxcstream.xyz/player/movie/1412598/english?autoplay=false&back=true&server=0",
      "Server 4 - HINDI": "https://byseqekaho.com/e/f7ekm2bm3nvv",
      "Server 5": "https://www.cinezo.net/watch/movie/1412598",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1412598",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1412598"
    },
    overview: 'Follows best friends Maddie and Trish as they find themselves trapped in a remote lagoon with the dangerous killer whale named Ceto.'
  },
  {
    id: '1443762',
    title: 'The Big Fake (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/qNEL6chkH2s6gwvt0Jt9NfiXG8m.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/qNEL6chkH2s6gwvt0Jt9NfiXG8m.jpg',
    release_date: '2026-01-16',
    vote_average: 4.6,
    duration: '2h 40m',
    genres: ['Thriller ', 'Horror', 'Action'],
    streams: {
      "Server 1": "https://xprime.today/watch/1443762",
      "Server 2": "https://cinemaos.tech/player/1443762",
      "Server 3": "https://zxcstream.xyz/player/movie/1443762/english?autoplay=false&back=true&server=0",
      "Server 4 - HINDI": "https://byseqekaho.com/e/0szn0b18ol41",
      "Server 5": "https://www.cinezo.net/watch/movie/1443762",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1443762",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1443762"
    },
    overview: 'Toni Chichiarelli arrives in Rome with the dream of becoming a painter, but his talent leads him elsewhere — from art galleries to state secrets. Between art, crime, and power, his signature ends up everywhere — even in the history of Italy.'
  },
  {
    id: '1306368',
    title: 'The Rip (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/p4bW2sJKAwcHuLpfoZK7Zo63osA.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/p4bW2sJKAwcHuLpfoZK7Zo63osA.jpg',
    release_date: '2026-01-16',
    vote_average: 5.6,
    duration: '2h 40m',
    genres: ['Action ', 'Adventure', 'Comedy'],
    streams: {
      "Server 1": "https://xprime.today/watch/1306368",
      "Server 2": "https://cinemaos.tech/player/1306368",
      "Server 3": "https://zxcstream.xyz/player/movie/1306368/english?autoplay=false&back=true&server=0",
      "Server 4 - HINDI": "https://byseqekaho.com/e/333a6f7gx1dw",
      "Server 5": "https://www.cinezo.net/watch/movie/1306368",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1306368",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1306368"
    },
    overview: 'Trust frays when a team of Miami cops discovers millions in cash inside a run-down stash house, calling everyone — and everything — into question.'
  },
  {
    id: '1034716',
    title: 'People We Meet on Vacation (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/xzZaU0MN6L9oc1pl0RUXSB7hWwD.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/xzZaU0MN6L9oc1pl0RUXSB7hWwD.jpg',
    release_date: '2026-01-16',
    vote_average: 7.4,
    duration: '2h 40m',
    genres: ['Comedy ', 'Drama', 'Romance'],
    streams: {
      "Server 1": "https://xprime.today/watch/1034716",
      "Server 2": "https://cinemaos.tech/player/1034716",
      "Server 3": "https://zxcstream.xyz/player/movie/1034716/english?autoplay=false&back=true&server=0",
      "Server 4 - HINDI": "https://byseqekaho.com/e/8anidmdjsvs4",
      "Server 5": "https://www.cinezo.net/watch/movie/1034716",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1034716",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1034716"
    },
    overview: 'Poppys a free spirit. Alex loves a plan. After years of summer vacations, these polar-opposite pals wonder if they could be a perfect romantic match.'
  },
   {
    id: '1614077',
    title: 'Sulutan (2025)',
    poster_path: 'https://image.tmdb.org/t/p/w500/kd11696ab32WhHUeq5ZkWi9k09Y.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/kd11696ab32WhHUeq5ZkWi9k09Y.jpg',
    release_date: '2026-01-26',
    vote_average: 6.2,
    duration: '1h 19m',
    genres: ['Adult', 'Romance', 'Drama'],
    streams: {
      "Server 1": "https://xprime.today/watch/1614077",
      "Server 2": "https://cinemaos.tech/player/1614077",
      "Server 3": "https://zxcstream.xyz/player/movie/1614077/tagalog?autoplay=false&back=true&server=0",
      "Server 4": "https://byseqekaho.com/e/ytxpdjdt2sqb",
      "Server 5": "https://www.cinezo.net/watch/movie/1614077",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1614077",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1614077"
    },
    overview: 'Lena and Mara are drawn into a secret affair that defies boundaries and threatens everything they’ve built. When Mara uncovers her groom’s betrayal, she finds solace in Lena, a newfound friend who soon becomes something more. As passion and secrecy collide, their choices endanger careers, fracture relationships, and lead to devastating consequences.'
  },
  {
    id: '1555917',
    title: 'The Secret of Maria Makinang (2025)',
    poster_path: 'https://image.tmdb.org/t/p/w500/aaIyWoyk13wp2SmzVTA1X2VSLaz.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/aaIyWoyk13wp2SmzVTA1X2VSLaz.jpg',
    release_date: '2025-10-22',
    vote_average: 5.1,
    duration: '1h 19m',
    genres: ['Adult', 'Romance', 'Drama'],
    streams: {
      "Server 1": "https://xprime.today/watch/1555917",
      "Server 2": "https://cinemaos.tech/player/1555917",
      "Server 3": "https://zxcstream.xyz/player/movie/1555917/tagalog?autoplay=false&back=true&server=0",
      "Server 4": "https://byseqekaho.com/e/h4zfrz9rchim",
      "Server 5": "https://www.cinezo.net/watch/movie/1555917",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1555917",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1555917"
    },
    overview: 'It tells the story of Maria, a young woman who appears only during the full moon. She falls for a man named Danilo, and their love is tested through time, because for Danilo, decades have passed, but for Maria, it has only been a few moments.'
  },
  {
    id: '1597538',
    title: 'Angkinin Mo Ako (2025)',
    poster_path: 'https://image.tmdb.org/t/p/w500/2YZ24F49pRkNb45YWI6yckrTYE.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/2YZ24F49pRkNb45YWI6yckrTYE.jpg',
    release_date: '2025-10-23',
    vote_average: 5.1,
    duration: '1h 10m',
    genres: ['Adult', 'Romance', 'Drama'],
    streams: {
      "Server 1": "https://xprime.today/watch/1597538",
      "Server 2": "https://cinemaos.tech/player/1597538",
      "Server 3": "https://zxcstream.xyz/player/movie/1597538/tagalog?autoplay=false&back=true&server=0",
      "Server 4": "https://byseqekaho.com/e/7j7jdm0pcl8o",
      "Server 5": "https://www.cinezo.net/watch/movie/1597538",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1597538",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1597538"
    },
    overview: 'Cess Garcia and VMX’s next big thing Dara Lima star in a steamy drama about two sisters and the man who sparks their sensual awakening. A female lawyer hires a young man as tutor for her younger sister but unknown to her, their review sessions are becoming wild'
  },
  {
    id: '1213898',
    title: 'Border 2 (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/hju9XncHxUxUS1GAJ4YqpdFCa5t.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/hju9XncHxUxUS1GAJ4YqpdFCa5t.jpg',
    release_date: '2026-01-23',
    vote_average: 5.1,
    duration: '3h 19m',
    genres: ['War', 'Action', 'Drama'],
    streams: {
      "Server 1": "https://xprime.today/watch/1213898",
      "Server 2": "https://cinemaos.tech/player/1213898",
      "Server 3": "https://zxcstream.xyz/player/movie/1213898/hindi?autoplay=false&back=true&server=0",
      "Server 4": "https://byseqekaho.com/e/arek24r0hs1i",
      "Server 5": "https://www.cinezo.net/watch/movie/1213898",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1213898",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1213898"
    },
    overview: 'During the events of the 1971 Indo-Pak war, a new generation of young Indian warriors were getting ready to defend the nation from an even bigger threat to the Indian motherland.'
  },
  {
    id: '1617536',
    title: 'One Two Cha Cha Chaa (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/cWfX0Pog0ZHgTKY3glhIjvkWxgB.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/cWfX0Pog0ZHgTKY3glhIjvkWxgB.jpg',
    release_date: '2026-01-16',
    vote_average: 5.1,
    duration: '2h 40m',
    genres: ['Action ', 'Adventure', 'Comedy'],
    streams: {
      "Server 1": "https://xprime.today/watch/1617536",
      "Server 2": "https://cinemaos.tech/player/1617536",
      "Server 3": "https://zxcstream.xyz/player/movie/1617536/hindi?autoplay=false&back=true&server=0",
      "Server 4": "https://byseqekaho.com/e/c9foe0i6blcn",
      "Server 5": "https://www.cinezo.net/watch/movie/1617536",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1617536",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1617536"
    },
    overview: 'So, Fuel Up, Gear Up, Level Up and Fasten your seat belts for the wildest and wackiest road trip of all time.'
  },
  {
    id: '1282440',
    title: 'Happy Patel: Khatarnak Jasoos (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/vsCkxiY2c26C6y4RyTVkpdXIfCW.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/vsCkxiY2c26C6y4RyTVkpdXIfCW.jpg',
    release_date: '2026-01-23',
    vote_average: 5.1,
    duration: '2h 02m',
    genres: ['Comedy ', 'Action', 'Romance'],
    streams: {
      "Server 1": "https://xprime.today/watch/1282440",
      "Server 2": "https://cinemaos.tech/player/1282440",
      "Server 3": "https://zxcstream.xyz/player/movie/1282440/hindi?autoplay=false&back=true&server=0",
      "Server 4": "https://byseqekaho.com/e/encokgewcj88",
      "Server 5": "https://www.cinezo.net/watch/movie/1282440",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1282440",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1282440"
    },
    overview: 'Happy Patel, a chronically unsuccessful MI7 operative, is finally assigned a mission in Goa, where he uncovers his Indian roots and must rescue a high-profile scientist from crime lord Mama. Unaware of his Indian heritage and armed with a comically British accent, Happy’s blunders trigger a string of chaotic mishaps that could lead him to expose a criminal network.'
  },
    {
    id: '1599099',
    title: 'Azad Bharat (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/zeUHs0NACraRyOPlUyuuBC0Iarz.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/zeUHs0NACraRyOPlUyuuBC0Iarz.jpg',
    release_date: '2026-01-16',
    vote_average: 5.1,
    duration: '2h 20m',
    genres: ['Adventure', 'Comedy', 'Fantasy'],
    streams: {
      "Server 1": "https://xprime.today/watch/1599099",
      "Server 2": "https://cinemaos.tech/player/1599099",
      "Server 3": "https://zxcstream.xyz/player/movie/1599099/hindi?autoplay=false&back=true&server=0",
      "Server 4": "https://byseqekaho.com/e/cmmjdn01dvbu",
      "Server 5": "https://www.cinezo.net/watch/movie/1599099",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1599099",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1599099"
    },
    overview: 'Rahu Ketu (2026) In the magical world of writer Churu Lal Sharma, his unlucky creations Rahu and Ketu spring to life, causing hilarious chaos instead of fighting corruption. When the mischievous Meenu Taxi steals Churus mystical notebook, the bumbling duo are dragged into absurd adventures that land them in the middle of a drug mafia.'
  },
   {
    id: '1382160',
    title: '45 (2025)',
    poster_path: 'https://image.tmdb.org/t/p/w500/luDTygZ6uAwaknc2isXZcz8YMvE.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/luDTygZ6uAwaknc2isXZcz8YMvE.jpg',
    release_date: '2025-12-25',
    vote_average: 5.1,
    duration: '2h 24m',
    genres: ['Action', 'Drama', 'Thriller'],
    streams: {
      "Server 1": "https://xprime.today/watch/1382160",
      "Server 2": "https://cinemaos.tech/player/1382160",
      "Server 3": "https://zxcstream.xyz/player/movie/1382160/hindi?autoplay=false&back=true&server=0",
      "Server 4 (Kannada)": "https://byseqekaho.com/e/eo0jjw0mwg9t",
      "Server 5 (Hindi)": "https://byseqekaho.com/e/rfifotoan62n"
     },
    overview: 'A captivating new project by Suraj Production and the Magical Composer’s Debut film, #45Themovie is set to redefine the cinema-watching experience with its unique narrative and compelling performances.'
  },
     {
    id: '1510339',
    title: 'Mark (2025)',
    poster_path: 'https://image.tmdb.org/t/p/w500/6LTDv6XHiHN0N77QIFg2tidVvhh.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/6LTDv6XHiHN0N77QIFg2tidVvhh.jpg',
    release_date: '2025-12-25',
    vote_average: 5.1,
    duration: '2h 24m',
    genres: ['Action', 'Drama', 'Thriller'],
    streams: {
      "Server 1(Telugu)": "https://xprime.today/watch/1510339",
      "Server 3": "https://zxcstream.xyz/player/movie/1510339/hindi?autoplay=false&back=true&server=0",
      "Server 4 (Kannada)": "https://byseqekaho.com/e/se2m96qhd0jh",
      "Server 5 (Hindi)": "https://byseqekaho.com/e/7g36yabhfauq"
    },
    overview: 'Mark is suspended from his police duties for his unruly yet effective ways of operating, but when 18 children are abducted and found dead, races to catch the criminals. With only 18 hours left, he must confront powerful foes and use unconventional tactics to succeed.'
  },
  {
    id: '1457939',
    title: 'Rahu Ketu (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/zjgWWOIsEqYNSa1fGRr82mBo3gv.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/zjgWWOIsEqYNSa1fGRr82mBo3gv.jpg',
    release_date: '2026-01-16',
    vote_average: 5.1,
    duration: '2h 20m',
    genres: ['Adventure','Comedy', 'Fantasy'],
    streams: {
      "Server 1": "https://xprime.today/watch/1457939",
      "Server 2": "https://cinemaos.tech/player/1457939",
      "Server 3": "https://zxcstream.xyz/player/movie/1457939/hindi?autoplay=false&back=true&server=0",
      "Server 4": "https://byseqekaho.com/e/mecoep0szpat",
      "Server 5": "https://www.cinezo.net/watch/movie/1457939",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1457939",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1599099"
    },
    overview: 'Rahu Ketu (2026) In the magical world of writer Churu Lal Sharma, his unlucky creations Rahu and Ketu spring to life, causing hilarious chaos instead of fighting corruption. When the mischievous Meenu Taxi steals Churus mystical notebook, the bumbling duo are dragged into absurd adventures that land them in the middle of a drug mafia.'
  },  
  {
    id: '1594670',
    title: 'Psych Siddhartha (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/9UZrHOeryYvgVaEfUMY3hk1OWg0.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/rHFjswQM8tdAL8RYqRJDsJBCngY.jpg',
    release_date: '2026-01-01',
    vote_average: 8.1,
    duration: '2h 27m',
    genres: ['Comedy', 'Romance'],
      streams: {
      "Server 1": "https://xprime.today/watch/1594670",
      "Server 2": "https://cinemaos.tech/player/1594670",
      "Server 3": "https://zxcstream.xyz/player/movie/1594670/hindi?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5": "https://www.cinezo.net/watch/movie/1594670",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1594670",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1594670"
    },
    overview: 'Psych Siddhartha (2026) is a layered psychological drama that explores emotional collapse, fragile hope, and the enduring scars of unresolved trauma. At its center is Siddharth, a man battered by repeated personal losses that have left him isolated, financially strained, and emotionally exhausted. Life has reduced him to survival mode, where every attempt to move forward seems to be met with another setback.  '
  },
    {
    id: '1196946',
    title: 'Ikkis (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/8PWu0V10nMqG5SrA13wLRXTD2fH.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/wbhoYwvqgadchfMgUOfOp87QZDS.jpg',
    release_date: '2026-01-01',
    vote_average: 8.1,
    duration: '2h 27m',
    genres: ['War', 'History', 'Biography'],
      streams: {
      "Server 1": "https://xprime.today/watch/1196946",
      "Server 2": "https://cinemaos.tech/player/1196946",
      "Server 3": "https://zxcstream.xyz/player/movie/1196946/hindi?autoplay=false&back=true&server=0",
      "Server 4": "https://be2719.rcr22.ams01.r66nv9ed.com/hls2/04/10676/4ti3fkm5oiok_h/index-v1-a1.m3u8?t=PybnbX8vVf1N88tPgT62lx9zv6hFhMK7_THcXW5YI4c&s=1769050786&e=10800&f=53380330&srv=1065&asn=13335&sp=4000&p=0",
      "Server 5": "https://www.cinezo.net/watch/movie/1196946",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/1196946",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-1196946"
    },
    overview: 'Second Lieutenant and Indias youngest Param Vir Chakra recipient, Arun Khetarpal, gave his life fighting for his battalion and the country during the 1971 Battle of Basantar. Ikkis also takes a reflective look at the futility of war through the eyes of Khetarpals father, who visits his ancestral home in Sargodha and Alma Mater for reunion, which now happens to be in post-partition Pakistan, 30 years later.'
  },
  {
    id: '872585',
    title: 'Oppenheimer',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaB0.jpg',
    release_date: '2023-07-21',
    vote_average: 8.1,
    duration: '3h 0m',
      streams: {
      "Server 1": "https://xprime.today/watch/872585",
      "Server 2": "https://cinemaos.tech/player/872585",
      "Server 3": "https://zxcstream.xyz/player/movie/872585/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/872585",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/872585",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-872585"
    },
    // streams: {
    //   "Server 1": "https://vidsrc.cc/v2/embed/movie/872585",
    //   "Server 2": "https://zxcstream.xyz/player/movie/872585/english?autoplay=false&back=true&server=0",
    //   "Server 3": "https://apicinetaro.falex43350.workers.dev/movie/872585/english"
    // },
    genres: ['Drama', 'History', 'Biography'],
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'
  },
  {
    id: '346698',
    title: 'Barbie',
    poster_path: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg',
    release_date: '2023-07-21',
    vote_average: 7.2,
    duration: '1h 54m',
       streams: {
      "Server 1": "https://xprime.today/watch/346698",
      "Server 2": "https://cinemaos.tech/player/346698",
      "Server 3": "https://zxcstream.xyz/player/movie/346698/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/346698",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/346698",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-346698"
    },
    genres: ['Comedy', 'Adventure', 'Fantasy'],
    overview: 'Barbie and Ken are having the time of their lives in the colorful world of Barbie Land.'
  },
  {
    id: '569094',
    title: 'Spider-Man: Across the Spider-Verse',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4hD5ri.jpg',
    release_date: '2023-06-02',
    vote_average: 8.7,
    duration: '2h 20m',
      streams: {
      "Server 1": "https://xprime.today/watch/569094",
      "Server 2": "https://cinemaos.tech/player/569094",
      "Server 3": "https://zxcstream.xyz/player/movie/569094/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/569094",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/569094",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-569094"
    },
    genres: ['Animation', 'Action', 'Adventure'],
    overview: 'Miles Morales returns for an epic adventure across the multiverse.'
  },
  {
    id: '447365',
    title: 'Guardians of the Galaxy Vol. 3',
    poster_path: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg',
    release_date: '2023-05-05',
    vote_average: 8.0,
    duration: '2h 30m',
     streams: {
      "Server 1": "https://xprime.today/watch/447365",
      "Server 2": "https://cinemaos.tech/player/447365",
      "Server 3": "https://zxcstream.xyz/player/movie/447365/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/447365",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/447365",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-447365"
    },
    genres: ['Action', 'Adventure', 'Comedy'],
    overview: 'Peter Quill must rally his team to defend the universe.'
  },
  {
    id: '385687',
    title: 'Fast X',
    poster_path: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4hD5ri.jpg',
    release_date: '2023-05-19',
    vote_average: 7.2,
    duration: '2h 21m',
       streams: {
      "Server 1": "https://xprime.today/watch/385687",
      "Server 2": "https://cinemaos.tech/player/385687",
      "Server 3": "https://zxcstream.xyz/player/movie/385687/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/385687",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/385687",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-385687"
    },
    genres: ['Action', 'Crime', 'Thriller'],
    overview: 'Dom Toretto and his family are targeted by a vengeful son.'
  },
  {
    id: '603692',
    title: 'John Wick: Chapter 4',
    poster_path: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg',
    release_date: '2023-03-24',
    vote_average: 7.8,
    duration: '2h 49m',
      streams: {
      "Server 1": "https://xprime.today/watch/603692",
      "Server 2": "https://cinemaos.tech/player/603692",
      "Server 3": "https://zxcstream.xyz/player/movie/603692/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/603692",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/603692",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-603692"
    },
    genres: ['Action', 'Crime', 'Thriller'],
    overview: 'John Wick uncovers a path to defeating The High Table.'
  },
  {
    id: '667538',
    title: 'Transformers: Rise of the Beasts',
    poster_path: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/2vFuG6bWGyQUzYS9d69E5l85nIz.jpg',
    release_date: '2023-06-09',
    vote_average: 7.3,
    duration: '2h 7m',
    streams: {
      "Server 1": "https://xprime.today/watch/667538",
      "Server 2": "https://cinemaos.tech/player/667538",
      "Server 3": "https://zxcstream.xyz/player/movie/667538/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/667538",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/667538",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-667538"
    },
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    overview: 'Optimus Prime and the Autobots take on their biggest challenge.'
  },
  {
    id: '298618',
    title: 'The Flash',
    poster_path: 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/yF1eOkaYvwiORauRCPWznV9xVvi.jpg',
    release_date: '2023-06-16',
    vote_average: 6.9,
    duration: '2h 24m',
     streams: {
      "Server 1": "https://xprime.today/watch/298618",
      "Server 2": "https://cinemaos.tech/player/298618",
      "Server 3": "https://zxcstream.xyz/player/movie/298618/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/298618",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/298618",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-298618"
    },
    genres: ['Action', 'Adventure', 'Fantasy'],
    overview: 'Barry Allen uses his super speed to change the past.'
  },
   {
    id: '575264',
    title: 'Mission: Impossible - Dead Reckoning Part One',
    poster_path: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
    release_date: '2023-07-14',
    vote_average: 7.7,
    duration: '2h 43m',
       streams: {
      "Server 1": "https://xprime.today/watch/575264",
      "Server 2": "https://cinemaos.tech/player/575264",
      "Server 3": "https://zxcstream.xyz/player/movie/575264/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/575264",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/575264",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-575264"
    },
    genres: ['Action', 'Adventure', 'Thriller'],
    overview: 'Ethan Hunt and his IMF team must track down a dangerous weapon.'
  },
  {
    id: '447277',
    title: 'The Little Mermaid',
    poster_path: 'https://image.tmdb.org/t/p/w500/ym1dxyOk4jFcSl4Q2zmRrA5BEEN.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/7pFwXl9QqgU7wQeQ5tCgxArqMFH.jpg',
    release_date: '2023-05-26',
    vote_average: 6.7,
    duration: '2h 15m',
       streams: {
      "Server 1": "https://xprime.today/watch/447277",
      "Server 2": "https://cinemaos.tech/player/447277",
      "Server 3": "https://zxcstream.xyz/player/movie/447277/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/447277",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/447277",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-447277"
    },
    genres: ['Adventure', 'Family', 'Fantasy'],
    overview: 'A young mermaid trades her voice for human legs.'
  },
  {
    id: '157336',
    title: 'Interstellar',
    poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    release_date: '2014-11-07',
    vote_average: 8.4,
    duration: '2h 49m',
       streams: {
      "Server 1": "https://xprime.today/watch/157336",
      "Server 2": "https://cinemaos.tech/player/157336",
      "Server 3": "https://zxcstream.xyz/player/movie/157336/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/157336",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/157336",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-157336"
    },
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    overview: 'A team of explorers travel through a wormhole in space.'
  },
  {
    id: '27205',
    title: 'Inception',
    poster_path: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    release_date: '2010-07-16',
    vote_average: 8.4,
    duration: '2h 28m',
        streams: {
      "Server 1": "https://xprime.today/watch/27205",
      "Server 2": "https://cinemaos.tech/player/27205",
      "Server 3": "https://zxcstream.xyz/player/movie/27205/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/27205",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/27205",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-27205"
    },
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    overview: 'A thief who steals corporate secrets through dream-sharing.'
  },
  {
    id: '155',
    title: 'The Dark Knight',
    poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/hkC4yNDFmW1yQuQhtZydMeRuaAb.jpg',
    release_date: '2008-07-18',
    vote_average: 8.5,
    duration: '2h 32m',
      streams: {
      "Server 1": "https://xprime.today/watch/155",
      "Server 2": "https://cinemaos.tech/player/155",
      "Server 3": "https://zxcstream.xyz/player/movie/155/english?autoplay=false&back=true&server=0",
      "Server 4": "",
      "Server 5 ": "https://www.cinezo.net/watch/movie/155",
      "Server 6": "https://vidsrc-embed.ru/embed/movie/155",
      "Server 7": "https://api.cinezo.net/embed/tmdb-movie-155"
    },
    genres: ['Action', 'Crime', 'Drama'],
    overview: 'Batman faces the Joker in Gotham City.'
  }
];

// 15 UNIQUE TV SHOWS (ALL FROM TMDB)
const UNIQUE_TV_SHOWS = [
  {
    id: '311632',
    title: 'Space Gen: Chandrayaan S01 (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/d6WIr1vycFCCdYewgRf8dpWxQQE.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/d6WIr1vycFCCdYewgRf8dpWxQQE.jpg',
    release_date: '2026-01-08',
    vote_average: 7.2,
    duration: '45m',
    streams: {
      "Server 1": "https://zxcstream.xyz/player/tv/311632/s=1/e=1/hindi?autoplay=false&back=true&server=0",
      "Server 2": "https://xprime.today/watch/311632/1/1",
      "Server 3": "https://byseqekaho.com/e/yxv57pc9qtxs",
      "Server 4 ": "https://api.cinezo.net/embed/tmdb-tv-311632/1/1",
      "Server 5 ": "https://www.cinezo.net/watch/tv/311632?season=1&episode=1",
     },
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    overview: 'Indian space engineers face mounting pressure to redeem themselves following the Chandrayaan 2 lunar mission\'s unexpected outcome.'
  },
  {
    id: '308482',
    title: 'Taskaree: The Smuggler"s Web S01 (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/25fKRXvQLBq4nXu9vjOVJcvCiiD.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/25fKRXvQLBq4nXu9vjOVJcvCiiD.jpg',
    release_date: '2026-01-08',
    vote_average: 7.2,
    duration: '45m',
    streams: {
      "Server 1": "https://zxcstream.xyz/player/tv/308482/s=1/e=1/hindi?autoplay=false&back=true&server=0",
      "Server 2": "https://xprime.today/watch/308482/1/1",
      "Server 3": "https://byseqekaho.com/e/wrnmbynqqeyk",
      "Server 4 ": "https://api.cinezo.net/embed/tmdb-tv-308482/1/1",
      "Server 5 ": "https://www.cinezo.net/watch/tv/308482?season=1&episode=1",
     },
    genres: ['Crime', 'Drama', 'Mystery'],
    overview: 'A dedicated customs officer and his team take on a notorious smuggler leading a powerful syndicate, but unexpected obstacles threaten their mission.'
  },
  {
    id: '297594',
    title: 'Bindiya Ke Bahubali S02 (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/eSJGKRff52Pg2SfOiIdC4IlMMQR.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/eSJGKRff52Pg2SfOiIdC4IlMMQR.jpg',
    release_date: '2026-01-08',
    vote_average: 7.2,
    duration: '45m',
    streams: {
      "Server 1": "https://zxcstream.xyz/player/tv/297594/s=2/e=1/hindi?autoplay=false&back=true&server=0",
      "Server 2": "https://xprime.today/watch/297594/2/1",
      "Server 3": "https://byseqekaho.com/e/hv81w9p30urb",
      "Server 4 ": "https://api.cinezo.net/embed/tmdb-tv-297594/2/1",
      "Server 5 ": "https://www.cinezo.net/watch/tv/297594?season=2&episode=1",
     },
    genres: ['Drama', 'Crime', 'Mystery'],
    overview: 'With humour, absurdity and family cat and mouse at its center, this is a tale of family gangsters in a fictitious madhouse city, Bindiya. As the current Don is put behind bars, the gangster familys alliances shift, new love, friendships, and betrayals explode until Bindiya becomes a full-blown circus-where love is a deal, power is personal, and every one has a card and blood on their hands.'
  },
  {
    id: '311171',
    title: 'Bhootiyapa (2025)',
    poster_path: 'https://image.tmdb.org/t/p/w500/4NGdzyuffqhb1jMEvTfri3jn5Fj.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/4NGdzyuffqhb1jMEvTfri3jn5Fj.jpg',
    release_date: '2025-01-08',
    vote_average: 7.2,
    duration: '45m',
    streams: {
      "Server 1": "https://zxcstream.xyz/player/tv/311171/s=1/e=1/hindi?autoplay=false&back=true&server=0",
      "Server 2": "https://xprime.today/watch/311171/1/1",
      "Server 3": "https://byseqekaho.com/e/f1i18ua20w0r"     
     },
    genres: ['Drama', 'Crime', 'Mystery'],
    overview: 'Bhootiyapa revolves around a film crew documenting the untold stories of these ghosts, who, despite their spectral existence, have tales to tell about love, loss and laughter. Each ghost, from a different era, adds a layer of mystery and mirth to the story, revealing how life after death can be as vibrant and surprising as mortal life itself.'
  },
  {
    id: '243826',
    title: 'Pharma (2025)',
    poster_path: 'https://image.tmdb.org/t/p/w500/hQWT47GFQyvO1tFqx6IgCOvrrr8.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/hQWT47GFQyvO1tFqx6IgCOvrrr8.jpg',
    release_date: '2025-01-08',
    vote_average: 7.2,
    duration: '45m',
    streams: {
      "Server 1": "https://zxcstream.xyz/player/tv/243826/s=1/e=1/hindi?autoplay=false&back=true&server=0",
      "Server 2 (Malayalam)": "https://xprime.today/watch/243826/1/1",
      "Server 3 (Hindi)": "https://short.icu/PqYLFFeKU"     
     },
    genres: ['Drama', 'Crime', 'Mystery'],
    overview: 'A young medical representative struggles against the pharma game, masters it and eventually fights against it.'
  },
  {
    id: '61859',
    title: 'The Night Manager S02 (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/1MccRnw41qQjREuZkovqP2UX1i3.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/lJoaiZcYMc8RkmPLROcdS2WQxn9.jpg',
    release_date: '2026-01-08',
    vote_average: 7.2,
    duration: '45m',
    streams: {
      "Server 1": "https://zxcstream.xyz/player/tv/61859/s=1/e=1/english?autoplay=false&back=true&server=0",
      "Server 2": "https://xprime.today/watch/61859/2/1",
      "Server 3": "https://vidsrc-embed.ru/embed/tv/61859",
      "Server 4 ": "https://api.cinezo.net/embed/tmdb-tv-61859/2/1",
      "Server 5 ": "https://www.cinezo.net/watch/tv/61859?season=1&episode=1",
      "Server 4 - Hindi": "https://byseqekaho.com/e/p9vhhvpow8rk",
           
     },
    genres: ['Spy', 'Crime', 'Mystery'],
    overview: 'Former British soldier Jonathan Pine navigates the shadowy recesses of Whitehall and Washington where an unholy alliance operates between the intelligence community and the secret arms trade. To infiltrate the inner circle of lethal arms dealer Richard Onslow Roper, Pine must himself become a criminal.'
  },
  {
    id: '259731',
    title: 'His & Hers S01 (2026)',
    poster_path: 'https://image.tmdb.org/t/p/w500/cDSXLVQLkCSBIpBx3UW04TsfZ5c.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/n4hJLZmBG8kZccNn7bNgBDsVQ6a.jpg',
    release_date: '2026-01-08',
    vote_average: 7.2,
    duration: '45m',
    streams: {
      "Server 1": "https://zxcstream.xyz/player/tv/259731/s=1/e=1/english?autoplay=false&back=true&server=0",
      "Server 2": "https://xprime.today/watch/259731/1/1",
      "Server 3": "https://vidsrc-embed.ru/embed/tv/259731",
      "Server 4 ": "https://api.cinezo.net/embed/tmdb-tv-259731/1/1",
      "Server 5 ": "https://www.cinezo.net/watch/tv/259731?season=1&episode=1",
      "Server 6- HINDI": "https://short.icu/tyiiqPGLF?thumbnail=https://freestreaming.vercel.app/His_And_Hers_S01_2026.jpg"
    },
    genres: ['Drama', 'Crime', 'Mystery'],
    overview: 'Two estranged spouses — one a detective, the other a news reporter — vie to solve a murder in which each believes the other is a prime suspect.'
  },
  {
    id: '100088',
    title: 'The Last of Us',
    poster_path: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
    release_date: '2023-01-15',
    vote_average: 8.8,
    duration: '50m',
    streams: {
      "Server 1": "https://zxcstream.xyz/player/tv/100088/s=1/e=1/english?autoplay=false&back=true&server=0",
      "Server 2": "https://vidsrc-embed.ru/embed/tv/100088",
      "Server 3": "https://xprime.today/watch/100088/2/1",
      "Server 4": "https://api.cinezo.net/embed/tmdb-tv-100088/2/1",
      "Server 5 ": "https://www.cinezo.net/watch/tv/100088?season=2&episode=1",
      "Server 6- HINDI": ""
       },
    genres: ['Drama', 'Action', 'Sci-Fi'],
    overview: 'After a global pandemic destroys civilization.'
  },
  {
    id: '94997',
    title: 'House of the Dragon',
    poster_path: 'https://image.tmdb.org/t/p/w500/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg',
    release_date: '2022-08-21',
    vote_average: 8.5,
    duration: '55m',
    streams: {
      "Server 1": "https://www.zxcstream.xyz/player/tv/94997/2/1?autoplay=false&back=true&server=0",
      "Server 2": "https://vidsrc-embed.ru/embed/tv/94997",
      "Server 3": "https://xprime.today/watch/94997/2/1",
      "Server 4": "https://api.cinezo.net/embed/tmdb-tv-94997/2/1",
      "Server 5 ": "https://www.cinezo.net/watch/tv/94997?season=2&episode=1",
      "Server 6- HINDI": ""
       },
    genres: ['Drama', 'Action', 'Adventure'],
    overview: 'The story of House Targaryen set 200 years before Game of Thrones.'
  },
  {
    id: '119051',
    title: 'Wednesday',
    poster_path: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/9G3mCR9qQ8U7Oi2f7nPmNpXMGFA.jpg',
    release_date: '2022-11-23',
    vote_average: 8.5,
    duration: '45m',
      streams: {
        "Server 1": "https://www.zxcstream.xyz/player/tv/119051/2/1?autoplay=false&back=true&server=0",
        "Server 2": "https://vidsrc-embed.ru/embed/tv/119051",
        "Server 3": "https://xprime.today/watch/119051/2/1",
        "Server 4": "https://api.cinezo.net/embed/tmdb-tv-119051/2/1",
        "Server 5 ": "https://www.cinezo.net/watch/tv/119051?season=2&episode=1",
        "Server 6- HINDI": ""
        },
      genres: ['Comedy', 'Crime', 'Fantasy'],
    overview: 'Wednesday Addams attempts to master her psychic ability.'
  },
  {
    id: '1399',
    title: 'Game of Thrones',
    poster_path: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/mUkuc2wyV9dHLG0D0Loaw5pO2s8.jpg',
    release_date: '2011-04-17',
    vote_average: 8.5,
    duration: '1h',
    streams: {
      "Server 1": "https://vidsrc.cc/v2/embed/tv/1399",
      "Server 2": "https://zxcstream.xyz/player/tv/1399/s=1/e=1/english?autoplay=false&back=true&server=0",
      "Server 3": "https://apicinetaro.falex43350.workers.dev/tv/1399/1/1/english"
    },
    genres: ['Drama', 'Fantasy', 'Adventure'],
    overview: 'Nine noble families fight for control over Westeros.'
  },
  {
    id: '66732',
    title: 'Stranger Things',
    poster_path: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    release_date: '2016-07-15',
    vote_average: 8.7,
    duration: '50m',
     streams: {
        "Server 1": "https://www.zxcstream.xyz/player/tv/66732/5/1?autoplay=false&back=true&server=0",
        "Server 2": "https://vidsrc-embed.ru/embed/tv/66732",
        "Server 3": "https://xprime.today/watch/66732/5/1",
        "Server 4": "https://api.cinezo.net/embed/tmdb-tv-66732/5/1",
        "Server 5 ": "https://www.cinezo.net/watch/tv/66732?season=5&episode=1",
        "Server 6- HINDI": ""
        },
    genres: ['Drama', 'Fantasy', 'Horror'],
    overview: 'When a young boy vanishes, a small town uncovers a mystery.'
  },
  {
    id: '71912',
    title: 'The Witcher',
    poster_path: 'https://image.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/7vBpX7e4Dp3dG2c5QZ6w4qyY6qy.jpg',
    release_date: '2019-12-20',
    vote_average: 8.2,
    duration: '1h',
    genres: ['Action', 'Adventure', 'Drama'],
     streams: {
        "Server 1": "https://www.zxcstream.xyz/player/tv/71912/4/1?autoplay=false&back=true&server=0",
        "Server 2": "https://vidsrc-embed.ru/embed/tv/71912",
        "Server 3": "https://xprime.today/watch/71912/4/1",
        "Server 4": "https://api.cinezo.net/embed/tmdb-tv-71912/4/1",
        "Server 5 ": "https://www.cinezo.net/watch/tv/71912?season=4&episode=1",
        "Server 6- HINDI": ""
        },
     overview: 'Geralt of Rivia, a mutated monster-hunter for hire.'
  }
  
];
// Helper to format TMDB response
const formatMedia = (item: any, type: 'movie' | 'tv' | 'sports' | 'tv_live'): MediaItem => {
  // Convert streams object to array if it exists
  let streamsArray = [];
  if (item.streams && typeof item.streams === 'object') {
    streamsArray = Object.entries(item.streams).map(([name, url], index) => ({
      id: `${item.id}-server-${index + 1}`,
      name,
      url: url as string,
      quality: index === 0 ? 'FHD' : 'HD'
    }));
  }
  
  return {
    id: item.id?.toString() || Math.random().toString(),
    title: item.title || item.name || 'Unknown Title',
    poster_path: item.poster_path || '/images/placeholder.jpg',
    backdrop_path: item.backdrop_path || item.poster_path || '/images/placeholder.jpg',
    release_date: item.release_date || item.first_air_date || '2024-01-01',
    vote_average: item.vote_average || 7.0,
    overview: item.overview || 'No description available.',
    media_type: type as any,
    genres: item.genres || ['Action', 'Drama'],
    duration: item.duration || (type === 'movie' ? '2h' : '1h'),
    streams: streamsArray
  };
};

// Get mock sports
const getMockSports = (): MediaItem[] => {
  return UNIQUE_SPORTS.map(sport => formatMedia(sport, 'sports'));
};

// Get mock TV live
const getMockTVLive = (): MediaItem[] => {
  return UNIQUE_TV_LIVE.map(tv => formatMedia(tv, 'tv_live'));
};

// Get mock trending (mix of movies and TV shows)
const getMockTrending = (): MediaItem[] => {
  const trendingMovies = UNIQUE_MOVIES.slice(0, 5);
  const trendingTV = UNIQUE_TV_SHOWS.slice(0, 5);
  
  const movies = trendingMovies.map(movie => formatMedia(movie, 'movie'));
  const tvShows = trendingTV.map(tv => formatMedia(tv, 'tv'));
  
  return [...movies, ...tvShows];
};

// Get mock movies (all 15 unique movies)
const getMockMovies = (): MediaItem[] => {
  return UNIQUE_MOVIES.map(movie => formatMedia(movie, 'movie'));
};

// Get mock TV shows (all 15 unique TV shows)
const getMockTVShows = (): MediaItem[] => {
  return UNIQUE_TV_SHOWS.map(tv => formatMedia(tv, 'tv'));
};

// Fetch sports content
export const fetchSports = async (): Promise<MediaItem[]> => {
  try {
    return getMockSports();
  } catch (error) {
    return getMockSports();
  }
};

// Fetch TV live content
export const fetchTVLive = async (): Promise<MediaItem[]> => {
  try {
    return getMockTVLive();
  } catch (error) {
    return getMockTVLive();
  }
};

// Fetch trending content
export const fetchTrending = async (): Promise<MediaItem[]> => {
  try {
    if (!API_KEY) {
      return getMockTrending();
    }

    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`);
    
    if (!response.ok) {
      return getMockTrending();
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return getMockTrending();
    }
    
    return data.results.slice(0, 10).map((item: any) => 
      formatMedia(item, item.media_type === 'tv' ? 'tv' : 'movie')
    );
  } catch (error) {
    return getMockTrending();
  }
};

// Fetch movies
export const fetchMovies = async (): Promise<MediaItem[]> => {
  try {
    if (!API_KEY) return getMockMovies();
    
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`);
    
    if (!response.ok) return getMockMovies();
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return getMockMovies();
    }
    
    return data.results.slice(0, 15).map((item: any) => formatMedia(item, 'movie'));
  } catch (error) {
    return getMockMovies();
  }
};

// Fetch TV shows
export const fetchTVShows = async (): Promise<MediaItem[]> => {
  try {
    if (!API_KEY) return getMockTVShows();
    
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US`);
    
    if (!response.ok) return getMockTVShows();
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return getMockTVShows();
    }
    
    return data.results.slice(0, 15).map((item: any) => formatMedia(item, 'tv'));
  } catch (error) {
    return getMockTVShows();
  }
};

// Fetch by genre
export const fetchByGenre = async (type: 'movie' | 'tv' | 'sports' | 'tv_live', genreId?: string): Promise<MediaItem[]> => {
  try {
    if (type === 'movie') {
      return fetchMovies();
    } else if (type === 'tv') {
      return fetchTVShows();
    } else if (type === 'sports') {
      return fetchSports();
    } else if (type === 'tv_live') {
      return fetchTVLive();
    } else {
      return fetchTrending();
    }
  } catch (error) {
    return [];
  }
};

// Fetch by ID
export const fetchById = async (id: string, type: 'movie' | 'tv' | 'sports' | 'tv_live'): Promise<MediaItem | null> => {
  try {
    if (type === 'movie') {
      const mockList = getMockMovies();
      return mockList.find(m => m.id === id) || mockList[0] || null;
    } else if (type === 'tv') {
      const mockList = getMockTVShows();
      return mockList.find(m => m.id === id) || mockList[0] || null;
    } else if (type === 'sports') {
      const mockList = getMockSports();
      return mockList.find(m => m.id === id) || mockList[0] || null;
    } else if (type === 'tv_live') {
      const mockList = getMockTVLive();
      return mockList.find(m => m.id === id) || mockList[0] || null;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Export the movies and TV shows for use in VideoPlayer
export { UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE };