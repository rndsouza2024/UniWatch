import React, { useEffect, useState } from 'react';
import { getTrending, getMovies, getTVShows, getSports, getLiveTV, searchContent, UNIQUE_MOVIES, UNIQUE_TV_SHOWS, UNIQUE_SPORTS, UNIQUE_TV_LIVE, UNIQUE_HINDI_DUBBED, UNIQUE_ADULT } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import SEO from '../components/SEO';
import { TVShow } from '../types';
import { Tv, Search, X } from 'lucide-react';

const TVShows: React.FC = () => {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setIsSearching(true);
    setShowResults(true);
    try {
      const results = await searchContent(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies('popular', 1);
        setMovies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await getTVShows('popular', 1);
        setShows(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getTVShows('popular', nextPage);
      setShows((prev) => [...prev, ...data]);
      setPage(nextPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Popular TV Shows",
    "description": "Watch your favorite TV series and shows on Vega Movies Official.",
    "url": "https://vegamoviesofficial.vercel.app/tv"
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-miraj-black">
        <div className="w-10 h-10 border-4 border-miraj-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-miraj-black pt-24 pb-20">
      <SEO 
        title="TV Shows - Vega Movies Official" 
        description="Watch your favorite TV series and shows." 
        schema={schema}
        path="/tv"
      />
                 {/* SEARCH SECTION */}
      <div className="container mx-auto px-4 md:px-6 relative z-20 mt-8 md:mt-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 shadow-2xl transition-all duration-300 focus-within:border-miraj-gold focus-within:bg-white/15">
              <Search className="text-gray-400 ml-4" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows, sports, live TV..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2 py-3 text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="text-gray-400" size={18} />
                </button>
              )}
              <button
                type="submit"
                disabled={isSearching || searchQuery.trim().length < 2}
                className="bg-miraj-gold hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSearching ? 'Searching...' : 'Find'}
              </button>
            </div>
          </form>

          {/* SEARCH RESULTS */}
          {showResults && (
            <div className="mt-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Search Results {searchResults.length > 0 && (
                    <span className="text-miraj-gold ml-2">({searchResults.length})</span>
                  )}
                </h2>
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-white/10 border-t-miraj-gold rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {searchResults.map((item) => (
                    <MovieCard key={`search-${item.media_type}-${item.id}`} item={item as any} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <Search className="text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400 text-center">
                    No results found for "<span className="text-white font-semibold">{searchQuery}</span>"
                  </p>
                  <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-miraj-gray rounded-full border border-white/10">
                <Tv className="text-miraj-gold" size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white">TV Shows</h1>
                <p className="text-gray-400 text-sm">Binge-worthy series available now</p>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {shows.map((show) => (
            <MovieCard key={`${show.id}-${page}`} item={show} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More Shows'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TVShows;