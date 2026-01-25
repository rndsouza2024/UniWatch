// import React, { useState } from 'react';
// import { Play, Star, Share2 } from 'lucide-react';
// import { MediaItem } from '../types';
// import SocialShare from './SocialShare';

// interface MediaCardProps {
//   item: MediaItem;
// }

// const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
//   const [showShare, setShowShare] = useState(false);

//   const handleWatch = () => {
//     window.location.hash = `#/watch?id=${item.id}&type=${item.media_type}`;
//   };

//   const handleShareClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setShowShare(!showShare);
//   };

//   const getShareUrl = () => {
//     return `#/watch?id=${item.id}&type=${item.media_type}`;
//   };

//   return (
//     <div 
//       className="group relative cursor-pointer"
//       onClick={handleWatch}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => e.key === 'Enter' && handleWatch()}
//     >
//       <div className="relative rounded-xl overflow-hidden bg-dark-surface border border-dark-border transition-all duration-300 group-hover:border-brand-500 group-hover:shadow-2xl group-hover:shadow-brand-500/20">
//         {/* Image Container */}
//         <div className="aspect-[2/3] relative overflow-hidden">
//           <img 
//             src={item.poster_path} 
//             alt={`Poster for ${item.title}`}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//             loading="lazy"
//              style={{
//              filter: 'brightness(1.12) contrast(1.08) saturate(1.03)',
//               }}
//           />
          
//           {/* Overlay Gradient */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
//           {/* Play Button */}
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <div className="bg-brand-600 rounded-full p-5 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
//               <Play size={28} fill="white" className="ml-1" />
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <button 
//               onClick={handleShareClick}
//               className="p-2 bg-black/80 backdrop-blur-sm rounded-full hover:bg-brand-600 transition-colors shadow-lg"
//               title="Share"
//             >
//               <Share2 size={16} className="text-white" />
//             </button>
//           </div>
          
//           {/* Rating Badge */}
//           {item.vote_average > 0 && (
//             <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
//               <Star size={14} fill="#fbbf24" className="text-yellow-400" />
//               <span className="text-yellow-400 font-bold text-sm">
//                 {item.vote_average.toFixed(1)}
//               </span>
//             </div>
//           )}
          
//           {/* Type Badge */}
//           <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-white border border-white/20">
//             {item.media_type === 'movie' ? 'MOVIE' : 'TV'}
//           </div>
//         </div>
        
//         {/* Content */}
//         <div className="p-4">
//           <h3 className="text-white font-bold text-base truncate group-hover:text-brand-400 transition-colors">
//             {item.title}
//           </h3>
          
//           <div className="flex items-center justify-between mt-3">
//             <div className="flex items-center gap-2">
//               <span className="text-gray-400 text-sm">
//                 {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
//               </span>
//               {item.genres?.[0] && (
//                 <>
//                   <span className="text-gray-600">•</span>
//                   <span className="text-gray-400 text-xs">{item.genres[0]}</span>
//                 </>
//               )}
//             </div>
            
//             {item.duration && (
//               <span className="text-gray-500 text-xs bg-gray-800/50 px-2 py-1 rounded">
//                 {item.duration}
//               </span>
//             )}
//           </div>
          
//           {/* Share Modal */}
//           {showShare && (
//             <div className="absolute left-0 right-0 top-full mt-3 bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-50 border border-dark-border animate-fadeIn">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-white font-bold">Share "{item.title}"</h4>
//                 <button 
//                   onClick={() => setShowShare(false)}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <SocialShare
//                 title={`Watch ${item.title}`}
//                 description={item.overview || `Stream ${item.title} in HD quality`}
//                 image={item.poster_path}
//                 url={getShareUrl()}
//                 type={item.media_type}
//               />
//             </div>
//           )}
          
//           {/* Hover Info */}
//           <div className="absolute left-0 right-0 bottom-full mb-3 bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-dark-border">
//             <p className="text-gray-200 text-sm line-clamp-3">{item.overview}</p>
//             <div className="mt-3 pt-3 border-t border-gray-700">
//               <button 
//                 onClick={handleWatch}
//                 className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
//               >
//                 Watch Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediaCard;







import React, { useState } from 'react';
import { Play, Star, Share2 } from 'lucide-react';
import { MediaItem } from '../types';
import SocialShare from './SocialShare';

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const [showShare, setShowShare] = useState(false);

  const handleWatch = () => {
    window.location.hash = `#/watch?id=${item.id}&type=${item.media_type}`;
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShare(!showShare);
  };

  const getShareUrl = () => {
    return `watch?id=${item.id}&type=${item.media_type}`;
  };

  // Get absolute image URL
  const getAbsoluteImageUrl = (path: string) => {
    if (!path) return 'https://uniwatchfree.vercel.app/og-image.jpg';
    
    if (path.startsWith('http')) return path;
    
    if (path.startsWith('/images/')) {
      return window.location.origin + path;
    }
    
    if (path.startsWith('/')) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    }
    
    return 'https://uniwatchfree.vercel.app/og-image.jpg';
  };

  // Get share image
  const getShareImage = () => {
    return getAbsoluteImageUrl(item.poster_path || item.backdrop_path || '');
  };

  return (
    <div 
      className="group relative cursor-pointer"
      onClick={handleWatch}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleWatch()}
    >
      <div className="relative rounded-xl overflow-hidden bg-dark-surface border border-dark-border transition-all duration-300 group-hover:border-brand-500 group-hover:shadow-2xl group-hover:shadow-brand-500/20">
        {/* Image Container */}
        <div className="aspect-[2/3] relative overflow-hidden">
          <img 
            src={getAbsoluteImageUrl(item.poster_path)} 
            alt={`Poster for ${item.title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            style={{
              filter: 'brightness(1.12) contrast(1.08) saturate(1.03)',
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-brand-600 rounded-full p-5 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play size={28} fill="white" className="ml-1" />
            </div>
          </div>
          
          {/* Share Button */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handleShareClick}
              className="p-2 bg-black/80 backdrop-blur-sm rounded-full hover:bg-brand-600 transition-colors shadow-lg"
              title="Share"
            >
              <Share2 size={16} className="text-white" />
            </button>
          </div>
          
          {/* Rating Badge */}
          {item.vote_average > 0 && (
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Star size={14} fill="#fbbf24" className="text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          )}
          
          {/* Type Badge */}
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-white border border-white/20">
            {item.media_type === 'movie' ? 'MOVIE' : 'TV'}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-bold text-base truncate group-hover:text-brand-400 transition-colors">
            {item.title}
          </h3>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">
                {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
              </span>
              {item.genres?.[0] && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 text-xs">{item.genres[0]}</span>
                </>
              )}
            </div>
            
            {item.duration && (
              <span className="text-gray-500 text-xs bg-gray-800/50 px-2 py-1 rounded">
                {item.duration}
              </span>
            )}
          </div>
          
          {/* Share Modal */}
          {showShare && (
            <div className="absolute left-0 right-0 top-full mt-3 bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl z-50 border border-dark-border animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-bold text-sm">Share "{item.title}"</h4>
                <button 
                  onClick={() => setShowShare(false)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <SocialShare
                  title={`Watch ${item.title}`}
                  description={item.overview || `Watch ${item.title} in HD quality on UniWatch.`}
                  image={getShareImage()}
                  url={getShareUrl()}
                  type={item.media_type}
                />
              </div>
            </div>
          )}
          
          {/* Hover Info */}
          <div className="absolute left-0 right-0 bottom-full mb-3 bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-dark-border">
            <p className="text-gray-200 text-sm line-clamp-3">{item.overview}</p>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <button 
                onClick={handleWatch}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;