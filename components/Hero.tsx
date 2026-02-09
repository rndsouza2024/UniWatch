import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, TVShow } from '../types';
import { getImageUrl } from '../services/tmdb';

interface HeroProps {
  items: (Movie | TVShow)[];
}

const Hero: React.FC<HeroProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  if (!items || items.length === 0) return null;

  const item = items[currentIndex];
  if (!item) return null;

  const title = 'title' in item ? item.title : item.name;
  const date = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const type = 'media_type' in item ? item.media_type : ('title' in item ? 'movie' : 'tv');

  const slug = title 
  ? `${item.id}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` 
  : `${item.id}`;

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden group">
      {/* Background Image with Transition */}
      <div key={item.id} className="absolute inset-0 animate-in fade-in duration-700">
        <img
          src={getImageUrl(item.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-miraj-black via-miraj-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-miraj-black/80 via-miraj-black/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full h-full flex flex-col justify-end p-4 sm:p-8 md:p-12 lg:p-16 pb-8 md:pb-24 z-20">
        <div className="max-w-4xl flex flex-col gap-3 md:gap-6">
            
            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 animate-in slide-in-from-bottom-5 duration-700 delay-100">
                <span className="bg-miraj-red text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded">
                #{currentIndex + 1} Trending
                </span>
                <div className="flex items-center gap-1 text-miraj-gold">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs md:text-sm font-bold">{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <span className="text-gray-300 text-xs md:text-sm font-medium flex items-center gap-1">
                    <Calendar size={14} /> {year}
                </span>
                <span className="border border-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {type === 'movie' ? 'Movie' : type === 'tv' ? 'TV Show' : (type as string).replace('_', ' ')}
                </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl animate-in slide-in-from-bottom-5 duration-700 delay-200 line-clamp-2 md:line-clamp-none">
                {title}
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-xs sm:text-sm md:text-lg line-clamp-2 md:line-clamp-3 max-w-xl lg:max-w-2xl drop-shadow-md animate-in slide-in-from-bottom-5 duration-700 delay-300">
                {item.overview}
            </p>

            {/* Buttons - Dynamic Mobile/Desktop Layout */}
            <div className="flex flex-row items-center gap-3 mt-2 w-full sm:w-auto animate-in slide-in-from-bottom-5 duration-700 delay-500">
                <Link
                    href={`/watch/${type}/${slug}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-miraj-gold hover:bg-white text-black font-bold py-2.5 px-4 sm:py-3 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.4)] text-sm sm:text-base whitespace-nowrap"
                >
                    <Play fill="currentColor" size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="tracking-wide">WATCH NOW</span>
                </Link>
                
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium py-2.5 px-4 sm:py-3 sm:px-8 rounded-full border border-white/10 transition-colors text-sm sm:text-base whitespace-nowrap">
                    <Info size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>More Info</span>
                </button>
            </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on Mobile */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-miraj-red/80 p-3 rounded-full text-white backdrop-blur-sm border border-white/10 transition-all opacity-0 group-hover:opacity-100 z-30 hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-miraj-red/80 p-3 rounded-full text-white backdrop-blur-sm border border-white/10 transition-all opacity-0 group-hover:opacity-100 z-30 hidden md:block"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 right-1/2 translate-x-1/2 md:translate-x-0 md:right-12 md:bottom-12 z-30 flex gap-2">
        {items.map((_, idx) => (
            <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-miraj-gold w-4 md:w-6' : 'bg-white/50 hover:bg-white'}`}
            />
        ))}
      </div>
    </div>
  );
};

export default Hero;