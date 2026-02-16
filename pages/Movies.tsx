import React, { useEffect, useState } from 'react';
import { getMovies, searchContent } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import SEO from '../components/SEO';
import { Movie, MediaItem } from '../types';
import { Film, Search, X } from 'lucide-react';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // ---------- NEW: Fetch latest movies from current year ----------
  const getCurrentYearMovies = async (pageNum: number): Promise<Movie[]> => {
    try {
      const currentYear = new Date().getFullYear();
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&primary_release_date.gte=${currentYear}-01-01&sort_by=primary_release_date.desc&page=${pageNum}&with_original_language=en&vote_count.gte=10`;

      const response = await fetch(url);
      const data = await response.json();

      // If no results for current year, fallback to previous year
      if (data.results.length === 0 && pageNum === 1) {
        const fallbackUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&primary_release_date.gte=${currentYear - 1}-01-01&sort_by=primary_release_date.desc&page=${pageNum}&with_original_language=en&vote_count.gte=10`;
        const fallbackRes = await fetch(fallbackUrl);
        const fallbackData = await fallbackRes.json();
        setHasMore(fallbackData.page < fallbackData.total_pages);
        return fallbackData.results || [];
      }

      setHasMore(data.page < data.total_pages);
      return data.results || [];
    } catch (error) {
      console.error('Failed to fetch current year movies:', error);
      // Fallback to regular popular movies if discover fails
      const fallback = await getMovies('popular', pageNum);
      setHasMore(fallback.length > 0);
      return fallback;
    }
  };
  // ----------------------------------------------------------------

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setIsSearching(true);
    setShowResults(true);
    try {
      const results = await searchContent(searchQuery);
      const withPoster = results.filter(item => item.poster_path);
      setSearchResults(withPoster);
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

  // Initial load – get current year movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await getCurrentYearMovies(1);
        const withPoster = data.filter((movie: Movie) => movie.poster_path);
        setMovies(withPoster);
        setPage(1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Load more – same filter (current year)
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getCurrentYearMovies(nextPage);
      const withPoster = data.filter((movie: Movie) => movie.poster_path);
      setMovies((prev) => [...prev, ...withPoster]);
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
    "name": "Latest Movies",
    "description": "Watch the newest movie releases from the current year on Vega Movies™ Official.",
    "url": "https://official-vegamovies.vercel.app/Movies"
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
        title="Latest Movies - Vega Movies™ Official" 
        description="Watch the newest movie releases from this year in HD." 
        schema={schema}
        path="/movies"
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
            <Film className="text-miraj-gold" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Movies</h1>
            <p className="text-gray-400 text-sm">Newest releases from {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load More Movies'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;