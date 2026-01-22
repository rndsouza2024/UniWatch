// import React from 'react';
// import { Play, Info, Plus, Star } from 'lucide-react';
// import { MediaItem } from '../types';

// interface HeroProps {
//   item: MediaItem;
// }

// const Hero: React.FC<HeroProps> = ({ item }) => {
//   const getYear = () => {
//     if (item.release_date) {
//       return new Date(item.release_date).getFullYear();
//     }
//     return '';
//   };

//   const getGenres = () => {
//     if (!item.genres || item.genres.length === 0) return '';
//     if (Array.isArray(item.genres)) {
//       return item.genres.slice(0, 3).join(' • ');
//     }
//     return '';
//   };

//   const handlePlay = () => {
//     window.location.hash = `#/watch?id=${item.id}&type=${item.media_type}`;
//   };

//   const handleMoreInfo = () => {
//     window.location.hash = `#/detail?id=${item.id}&type=${item.media_type}`;
//   };

//   return (
//     <div className="relative w-full overflow-hidden bg-dark-bg">
//       {/* Background Image with Fallback */}
//       <div className="relative h-[70vh] sm:h-[80vh] md:h-[85vh]">
//         <div 
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{ 
//             backgroundImage: `url(${item.backdrop_path})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//           }}
//         >
//           {/* Gradient Overlays */}
//           <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/95 to-transparent" />
//           <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/20 to-dark-bg" />
//         </div>

//         {/* Content Container */}
//         <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
//           <div className="w-full max-w-2xl lg:max-w-3xl pt-12 md:pt-20">
//             {/* Metadata Row */}
//             <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
//               <div className="flex items-center gap-2">
//                 <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
//                   {item.media_type === 'movie' ? 'MOVIE' : 'SERIES'}
//                 </span>
//                 {getYear() && (
//                   <span className="text-white text-sm font-medium bg-black/30 px-2 py-1 rounded">
//                     {getYear()}
//                   </span>
//                 )}
//               </div>
              
//               {item.vote_average && (
//                 <div className="flex items-center gap-1 text-yellow-400">
//                   <Star size={16} fill="currentColor" />
//                   <span className="font-bold">{item.vote_average.toFixed(1)}</span>
//                   <span className="text-gray-300 text-sm">/10</span>
//                 </div>
//               )}
              
//               {getGenres() && (
//                 <div className="hidden sm:block text-gray-300 text-sm">
//                   {getGenres()}
//                 </div>
//               )}
//             </div>
            
//             {/* Title */}
//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
//               {item.title}
//             </h1>
            
//             {/* Overview */}
//             <p className="text-gray-200 text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-3xl leading-relaxed drop-shadow-lg">
//               {item.overview}
//             </p>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
//               <button 
//                 onClick={handlePlay}
//                 className="group flex items-center justify-center gap-3 bg-white text-dark-bg px-6 sm:px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-brand-500/30"
//               >
//                 <div className="relative">
//                   <Play size={24} fill="currentColor" className="relative z-10 ml-0.5" />
//                   <div className="absolute inset-0 bg-brand-500 blur-lg opacity-50 group-hover:opacity-70"></div>
//                 </div>
//                 <span className="text-lg">Watch Now</span>
//               </button>
              
//               <button 
//                 onClick={handleMoreInfo}
//                 className="flex items-center justify-center gap-3 bg-gray-800/80 backdrop-blur-sm text-white px-6 sm:px-8 py-4 rounded-lg font-semibold hover:bg-gray-700/80 transition-all duration-300 border border-gray-700 hover:border-gray-600"
//               >
//                 <Info size={22} />
//                 <span className="text-lg">More Info</span>
//               </button>
              
//               <button 
//                 className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-brand-500 hover:bg-brand-500/10 transition-all duration-300 group"
//                 aria-label="Add to favorites"
//               >
//                 <Plus size={22} className="text-gray-300 group-hover:text-brand-400" />
//               </button>
//             </div>
            
//             {/* Additional Info */}
//             <div className="mt-8 flex flex-wrap gap-4 text-gray-400 text-sm">
//               {item.duration && (
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
//                   <span>Duration: {item.duration}</span>
//                 </div>
//               )}
//               {item.media_type && (
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
//                   <span>Type: {item.media_type === 'movie' ? 'Movie' : 'TV Series'}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Bottom Gradient */}
//       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-bg to-transparent"></div>
//     </div>
//   );
// };

// export default Hero;



import React from 'react';
import { Play, Info, Plus, Star, Clock, Film } from 'lucide-react';
import { MediaItem } from '../types';

interface HeroProps {
  item: MediaItem;
  onPlay?: () => void;
  onInfo?: () => void;
  onAdd?: () => void;
}

const Hero: React.FC<HeroProps> = ({ item, onPlay, onInfo, onAdd }) => {
  const getYear = () => {
    if (item.release_date) {
      return new Date(item.release_date).getFullYear();
    }
    return '';
  };

  const getGenres = () => {
    if (!item.genres || item.genres.length === 0) return '';
    if (Array.isArray(item.genres)) {
      return item.genres.slice(0, 3).join(' • ');
    }
    return '';
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    } else {
      window.location.href = `/watch/${item.media_type}/${item.id}#/watch?id=${item.id}&type=${item.media_type}`;
    }
  };

  const handleMoreInfo = () => {
    if (onInfo) {
      onInfo();
    } else {
      window.location.href = `/detail/${item.media_type}/${item.id}#/detail?id=${item.id}&type=${item.media_type}`;
    }
  };

  const handleAddToFavorites = () => {
    if (onAdd) {
      onAdd();
    } else {
      console.log('Added to favorites:', item.id);
    }
  };

  const formatDuration = (duration: string | number) => {
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    return duration;
  };

  return (
    <div className="relative w-full overflow-hidden bg-dark-bg">
      <div className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${item.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/20 to-dark-bg" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full max-w-2xl lg:max-w-3xl pt-12 md:pt-20">
            <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {item.media_type === 'movie' ? 'MOVIE' : 'SERIES'}
                </span>
                {getYear() && (
                  <span className="text-white text-sm font-medium bg-black/30 px-2 py-1 rounded">
                    {getYear()}
                  </span>
                )}
              </div>
              
              {item.vote_average && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold">{item.vote_average.toFixed(1)}</span>
                  <span className="text-gray-300 text-sm">/10</span>
                </div>
              )}
              
              {getGenres() && (
                <div className="hidden sm:block text-gray-300 text-sm">
                  {getGenres()}
                </div>
              )}
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
              {item.title}
            </h1>
            
            <p className="text-gray-200 text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-3xl leading-relaxed drop-shadow-lg">
              {item.overview}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button 
                onClick={handlePlay}
                className="group relative flex items-center justify-center gap-3 bg-white text-dark-bg px-6 sm:px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-brand-500/30 overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Play size={24} fill="currentColor" className="ml-0.5" />
                  <span className="text-lg">Watch Now</span>
                </div>
                <div className="absolute inset-0 bg-brand-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={handleMoreInfo}
                className="flex items-center justify-center gap-3 bg-gray-800/80 backdrop-blur-sm text-white px-6 sm:px-8 py-4 rounded-lg font-semibold hover:bg-gray-700/80 transition-all duration-300 border border-gray-700 hover:border-gray-600"
              >
                <Info size={22} />
                <span className="text-lg">More Info</span>
              </button>
              
              <button 
                onClick={handleAddToFavorites}
                className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-brand-500 hover:bg-brand-500/10 transition-all duration-300 group"
                aria-label="Add to favorites"
              >
                <Plus size={22} className="text-gray-300 group-hover:text-brand-400" />
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4 text-gray-400 text-sm">
              {item.duration && (
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-brand-400" />
                  <span>Duration: {formatDuration(item.duration)}</span>
                </div>
              )}
              {item.media_type && (
                <div className="flex items-center gap-2">
                  <Film size={14} className="text-brand-400" />
                  <span>Type: {item.media_type === 'movie' ? 'Movie' : 'TV Series'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-bg to-transparent"></div>
    </div>
  );
};

export default Hero;