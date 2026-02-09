import React from 'react';
import Link from 'next/link';
import { Star, Play } from 'lucide-react';
import { MediaItem } from '../types';
import { getImageUrl } from '../services/tmdb';

interface MovieCardProps {
  item: MediaItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const type = item.media_type || (item.title ? 'movie' : 'tv');

  // Format type for display
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'tv_live': return 'Live TV';
      case 'sports': return 'Sports';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <Link href={`/watch/${type}/${item.id}`} className="group relative block h-full">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-miraj-gray border border-white/5 shadow-lg transition-transform duration-300 md:group-hover:scale-105 group-hover:shadow-miraj-red/20 group-hover:border-miraj-gold/30">
        <img
          src={getImageUrl(item.poster_path)}
          alt={title || 'Content Poster'}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-60"
          loading="lazy"
          style={{ filter: 'url(#ultraSharp) brightness(1.05) contrast(1.1) saturate(1.08) hue-rotate(5deg)' }}
          width={500}
          height={750}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 z-10">
          <Star className="text-miraj-gold fill-miraj-gold" size={10} />
          <span className="text-[10px] font-bold text-white">{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
        </div>

        {/* Quality Badge */}
        <div className="absolute top-2 left-2 bg-miraj-red px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-md z-10">
            HD
        </div>

        {/* Hover Overlay */}
        <div className="flex absolute inset-0 flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
             <div className="bg-miraj-gold/90 rounded-full p-4 shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75 flex items-center justify-center">
                <Play className="text-black fill-black ml-1" size={32} />
             </div>
             <span className="mt-3 text-white font-bold text-sm tracking-wider uppercase drop-shadow-lg text-center px-2">Watch Now</span>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-semibold text-gray-100 truncate group-hover:text-miraj-gold transition-colors">{title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{year}</span>
          <span className="border border-white/10 px-1.5 py-0.5 rounded uppercase text-[10px] tracking-wider">
            {getTypeLabel(type)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;