// import React, { useState, useEffect } from 'react';
// import { GetServerSideProps } from 'next';
// import { useRouter } from 'next/router';
// import { getDetails, getCast, getImageUrl, getRecommendations } from '../../services/tmdb';
// import VideoPlayer from '../../components/VideoPlayer';
// import SEO from '../../components/SEO';
// import { ContentDetails, CastMember, MediaItem } from '../../types';
// import { Calendar, Clock, Star, User, Share2, X, Copy, Check } from 'lucide-react';
// import Link from 'next/link';

// interface WatchPageProps {
//   details: ContentDetails | null;
//   cast: CastMember[];
//   initialRecommendations: MediaItem[];
//   type: 'movie' | 'tv' | 'sports' | 'tv_live';
//   id: string;
// }

// const WatchPage: React.FC<WatchPageProps> = ({ details, cast, initialRecommendations, type, id }) => {
//   const router = useRouter();
//   const [recommendations, setRecommendations] = useState<MediaItem[]>(initialRecommendations || []);
//   const [isShareOpen, setIsShareOpen] = useState(false);
//   const [copiedLink, setCopiedLink] = useState(false);
  
//   // TV State
//   const [season, setSeason] = useState(1);
//   const [episode, setEpisode] = useState(1);

//   // Client-side recommendations fallback
//   useEffect(() => {
//     if ((!initialRecommendations || initialRecommendations.length === 0) && details) {
//         getRecommendations(type, id).then(setRecommendations);
//     }
//   }, [type, id, details, initialRecommendations]);

//   if (!details) {
//       return (
//           <div className="min-h-screen bg-miraj-black flex items-center justify-center">
//              <div className="text-center">
//                  <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
//                  <Link href="/" className="text-miraj-gold hover:underline">Return Home</Link>
//              </div>
//           </div>
//       );
//   }

//   const title = details.title || details.name || 'Unknown Title';
//   const date = details.release_date || details.first_air_date;
//   const year = date ? new Date(date).getFullYear() : 'N/A';
//   const description = details.overview || `Watch ${title} online for free.`;
  
//   // Determine schema type based on content type
//   let schemaType = 'Movie';
//   if (type === 'tv') schemaType = 'TVSeries';
//   else if (type === 'sports') schemaType = 'SportsEvent';
//   else if (type === 'tv_live') schemaType = 'TVSeries';

//   const schema = {
//     "@context": "https://schema.org",
//     "@type": schemaType,
//     "name": title,
//     "description": description,
//     "image": [getImageUrl(details.poster_path, 'original')],
//     "datePublished": date,
//     "aggregateRating": details.vote_average ? {
//       "@type": "AggregateRating",
//       "ratingValue": details.vote_average.toFixed(1),
//       "bestRating": "10",
//       "ratingCount": 100
//     } : undefined,
//     "genre": details.genres?.map(g => g.name),
//     "actor": cast.slice(0, 5).map(person => ({
//         "@type": "Person",
//         "name": person.name
//     }))
//   };

//   const breadcrumbSchema = {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     "itemListElement": [
//       {
//         "@type": "ListItem",
//         "position": 1,
//         "name": "Home",
//         "item": "https://uwatchfree-official.vercel.app"
//       },
//       {
//         "@type": "ListItem",
//         "position": 2,
//         "name": type === 'movie' ? 'Movies' : 
//                 type === 'tv' ? 'TV Shows' : 
//                 type === 'sports' ? 'Sports' : 'Live TV',
//         "item": `https://uwatchfree-official.vercel.app/${type === 'movie' ? 'movies' : 
//                 type === 'tv' ? 'tv' : 
//                 type === 'sports' ? 'sports' : 'live'}`
//       },
//       {
//         "@type": "ListItem",
//         "position": 3,
//         "name": title
//       }
//     ]
//   };

//   const handleCopyLink = () => {
//      if (typeof window !== 'undefined') {
//          navigator.clipboard.writeText(window.location.href);
//          setCopiedLink(true);
//          setTimeout(() => setCopiedLink(false), 2000);
//      }
//   };

//   return (
//     <div className="min-h-screen bg-miraj-black pt-20 md:pt-28 pb-20">
//       <SEO 
//         title={`${title} - Watch Free on UwatchFreeOfficial`} 
//         description={description}
//         image={getImageUrl(details.poster_path, 'original')}
//         type="video.movie"
//         schema={schema}
//         path={router.asPath}
//       />
//       {/* Breadcrumb Schema */}
//       <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
//         />

//       {/* Share Modal */}
//       {isShareOpen && (
//           <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
//               <div className="bg-miraj-gray border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
//                   <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
//                       <h3 className="text-lg font-bold text-white flex items-center gap-2">Share Content</h3>
//                       <button onClick={() => setIsShareOpen(false)}><X size={24} className="text-gray-400" /></button>
//                   </div>
//                   <div className="p-6">
//                        <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg p-2">
//                           <input className="bg-transparent text-gray-300 text-sm flex-1 outline-none" readOnly value={typeof window !== 'undefined' ? window.location.href : ''} />
//                           <button onClick={handleCopyLink} className="p-2 bg-white/10 rounded hover:bg-white/20">
//                              {copiedLink ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-white" />}
//                           </button>
//                        </div>
//                   </div>
//               </div>
//           </div>
//       )}

//       {/* Player */}
//       <div className="container mx-auto px-0 md:px-6 mb-8 mt-4 relative z-10">
//         <div className="w-full max-w-7xl mx-auto">
//             <VideoPlayer 
//                 tmdbId={details.id} 
//                 type={type} 
//                 title={title}
//                 season={season}
//                 episode={episode}
//                 customStreams={details.streams}
//             />
//             {type === 'tv' && (
//                 <div className="bg-miraj-gray border border-white/5 p-4 mt-4 rounded-xl flex items-center gap-4">
//                     <div className="flex flex-col">
//                         <label className="text-xs text-gray-400 font-bold mb-1">SEASON</label>
//                         <input type="number" min="1" value={season} onChange={(e) => setSeason(parseInt(e.target.value))} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-20 text-center font-bold focus:border-miraj-gold focus:outline-none" />
//                     </div>
//                     <div className="flex flex-col">
//                         <label className="text-xs text-gray-400 font-bold mb-1">EPISODE</label>
//                         <input type="number" min="1" value={episode} onChange={(e) => setEpisode(parseInt(e.target.value))} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-20 text-center font-bold focus:border-miraj-gold focus:outline-none" />
//                     </div>
//                 </div>
//             )}
//         </div>
//       </div>

//       {/* Details */}
//       <div className="container mx-auto px-4 md:px-6 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 max-w-7xl mx-auto">
//              <div className="hidden md:block w-[300px] flex-shrink-0">
//                 <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl relative border border-white/10">
//                     <img src={getImageUrl(details.poster_path)} alt={title} className="w-full h-full object-cover" style={{ filter: 'url(#ultraSharp) brightness(1.05) contrast(1.1) saturate(1.08) hue-rotate(5deg)' }}/>
//                 </div>
//             </div>
//             <div className="min-w-0">
//                 <div className="flex justify-between items-start flex-wrap gap-4">
//                     <h1 className="text-2xl md:text-5xl font-bold text-white mb-2">{title}</h1>
//                     <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 hover:bg-miraj-gold hover:text-black transition-colors border border-white/5">
//                         <Share2 size={18} /> <span className="hidden sm:inline font-bold text-sm">Share</span>
//                     </button>
//                 </div>
                
//                 <div className="flex items-center gap-4 text-sm text-gray-300 mb-6 flex-wrap">
//                     <span className="flex items-center gap-1 text-miraj-gold font-bold bg-miraj-gold/10 px-2 py-1 rounded"><Star size={14} fill="currentColor" /> {details.vote_average?.toFixed(1) || 'N/A'}</span>
//                     <span className="flex items-center gap-1"><Calendar size={16} /> {year}</span>
//                     {details.runtime && <span className="flex items-center gap-1"><Clock size={16} /> {details.runtime}m</span>}
//                     <span className="border border-white/20 px-2 py-0.5 rounded text-xs uppercase font-bold">
//                       {type === 'tv_live' ? 'Live TV' : type.replace('_', ' ')}
//                     </span>
//                 </div>

//                 <p className="text-gray-400 leading-relaxed text-lg mb-8">{description}</p>

//                 {/* Cast */}
//                 {cast.length > 0 && (
//                     <div className="mb-8">
//                         <h3 className="text-lg font-bold text-white mb-4">Cast</h3>
//                         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
//                             {cast.slice(0, 5).map(person => (
//                                 <div key={person.id} className="text-center group">
//                                     <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-white/5 border border-white/5 group-hover:border-miraj-gold/50 transition-colors">
//                                         {person.profile_path ? (
//                                             <img src={getImageUrl(person.profile_path)} alt={person.name} className="w-full h-full object-cover" />
//                                         ) : <User className="w-full h-full p-4 text-gray-500" />}
//                                     </div>
//                                     <p className="text-xs font-bold text-white truncate">{person.name}</p>
//                                     <p className="text-[10px] text-gray-500 truncate">{person.character}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>

//         {/* Recommendations */}
//         {recommendations.length > 0 && (
//             <div className="mt-12 border-t border-white/10 pt-8">
//                 <h3 className="text-2xl font-bold text-white mb-6">You May Also Like</h3>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                     {recommendations.map(item => (
//                          <Link key={item.id} href={`/watch/${item.media_type || 'movie'}/${item.id}`} className="group relative block">
//                             <div className="aspect-[2/3] rounded-xl overflow-hidden bg-miraj-gray border border-white/5 shadow-lg">
//                                 <img src={getImageUrl(item.poster_path)} alt={item.title || item.name} className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" style={{ filter: 'url(#ultraSharp) brightness(1.05) contrast(1.1) saturate(1.08) hue-rotate(5deg)' }}/>
//                             </div>
//                             <h4 className="mt-2 text-sm font-bold text-white truncate group-hover:text-miraj-gold transition-colors">{item.title || item.name}</h4>
//                          </Link>
//                     ))}
//                 </div>
//             </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { slug } = context.query;
  
//   if (!slug || !Array.isArray(slug) || slug.length < 2) {
//     return { notFound: true };
//   }

//   const type = slug[0] as 'movie' | 'tv' | 'sports' | 'tv_live';
//   const rawId = slug[1];
  
//   // For sports and live TV, use the full slug (they have hyphens)
//   let id = rawId;
//   if ((type === 'movie' || type === 'tv') && /^\d+/.test(rawId)) {
//       // For numeric IDs, get the number part
//       id = rawId.split('-')[0];
//   }

//   try {
//     let details: ContentDetails | null = null;
//     try {
//         details = await getDetails(type, id);
//     } catch (e) {
//         console.warn("Details fetch failed:", e);
//     }

//     if (!details) {
//         return { notFound: true };
//     }

//     let cast: CastMember[] = [];
//     if (type === 'movie' || type === 'tv') {
//         try {
//             cast = await getCast(type, id);
//         } catch (e) { console.warn("Cast fetch failed"); }
//     }

//     let recommendations: MediaItem[] = [];
//     try {
//         recommendations = await getRecommendations(type, id);
//     } catch (e) { console.warn("Recs fetch failed"); }

//     return {
//       props: {
//         details,
//         cast,
//         initialRecommendations: recommendations,
//         type,
//         id
//       }
//     };
//   } catch (error) {
//     console.error("Critical Server Side Error", error);
//     return {
//         notFound: true
//     };
//   }
// };

// export default WatchPage;








import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getDetails, getCast, getImageUrl, getRecommendations } from '../../services/tmdb';
import VideoPlayer from '../../components/VideoPlayer';
import SEO from '../../components/SEO';
import { ContentDetails, CastMember, MediaItem } from '../../types';
import { Calendar, Clock, Star, User, Share2, X, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface WatchPageProps {
  details: ContentDetails | null;
  cast: CastMember[];
  initialRecommendations: MediaItem[];
  type: 'movie' | 'tv' | 'sports' | 'tv_live';
  id: string;
}

const WatchPage: React.FC<WatchPageProps> = ({ details, cast, initialRecommendations, type, id }) => {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<MediaItem[]>(initialRecommendations || []);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // TV State
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  // Client-side recommendations fallback
  useEffect(() => {
    if ((!initialRecommendations || initialRecommendations.length === 0) && details) {
        getRecommendations(type, id).then(setRecommendations);
    }
  }, [type, id, details, initialRecommendations]);

  if (!details) {
      return (
          <div className="min-h-screen bg-miraj-black flex items-center justify-center">
             <div className="text-center">
                 <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
                 <Link href="/" className="text-miraj-gold hover:underline">Return Home</Link>
             </div>
          </div>
      );
  }

  const title = details.title || details.name || 'Unknown Title';
  const date = details.release_date || details.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const description = details.overview || `Watch ${title} online for free.`;
  
  // Determine schema type based on content type
  let schemaType = 'Movie';
  if (type === 'tv') schemaType = 'TVSeries';
  else if (type === 'sports') schemaType = 'SportsEvent';
  else if (type === 'tv_live') schemaType = 'TVSeries';

  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": title,
    "description": description,
    "image": [getImageUrl(details.poster_path, 'original')],
    "datePublished": date,
    "aggregateRating": details.vote_average ? {
      "@type": "AggregateRating",
      "ratingValue": details.vote_average.toFixed(1),
      "bestRating": "10",
      "ratingCount": 100
    } : undefined,
    "genre": details.genres?.map(g => g.name),
    "actor": cast.slice(0, 5).map(person => ({
        "@type": "Person",
        "name": person.name
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://uwatchfree-official.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": type === 'movie' ? 'Movies' : 
                type === 'tv' ? 'TV Shows' : 
                type === 'sports' ? 'Sports' : 'Live TV',
        "item": `https://uwatchfree-official.vercel.app/${type === 'movie' ? 'movies' : 
                type === 'tv' ? 'tv' : 
                type === 'sports' ? 'sports' : 'live'}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title
      }
    ]
  };

  const handleCopyLink = () => {
     if (typeof window !== 'undefined') {
         navigator.clipboard.writeText(window.location.href);
         setCopiedLink(true);
         setTimeout(() => setCopiedLink(false), 2000);
     }
  };

  return (
    <div className="min-h-screen bg-miraj-black pt-20 md:pt-28 pb-20">
      <SEO 
        title={`${title} - Watch Free on UwatchFreeOfficial`} 
        description={description}
        image={getImageUrl(details.poster_path, 'original')}
        type="video.movie"
        schema={schema}
        path={router.asPath}
      />
      {/* Breadcrumb Schema */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

      {/* Share Modal */}
      {isShareOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-miraj-gray border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">Share Content</h3>
                      <button onClick={() => setIsShareOpen(false)}><X size={24} className="text-gray-400" /></button>
                  </div>
                  <div className="p-6">
                       <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg p-2">
                          <input className="bg-transparent text-gray-300 text-sm flex-1 outline-none" readOnly value={typeof window !== 'undefined' ? window.location.href : ''} />
                          <button onClick={handleCopyLink} className="p-2 bg-white/10 rounded hover:bg-white/20">
                             {copiedLink ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-white" />}
                          </button>
                       </div>
                  </div>
              </div>
          </div>
      )}

      {/* Player */}
      <div className="container mx-auto px-0 md:px-6 mb-8 mt-4 relative z-10">
        <div className="w-full max-w-7xl mx-auto">
            <VideoPlayer 
                tmdbId={details.id} 
                type={type} 
                title={title}
                season={season}
                episode={episode}
                customStreams={details.streams}
            />
            {type === 'tv' && (
                <div className="bg-miraj-gray border border-white/5 p-4 mt-4 rounded-xl flex items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 font-bold mb-1">SEASON</label>
                        <input type="number" min="1" value={season} onChange={(e) => setSeason(parseInt(e.target.value))} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-20 text-center font-bold focus:border-miraj-gold focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 font-bold mb-1">EPISODE</label>
                        <input type="number" min="1" value={episode} onChange={(e) => setEpisode(parseInt(e.target.value))} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-20 text-center font-bold focus:border-miraj-gold focus:outline-none" />
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Details */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 max-w-7xl mx-auto">
             <div className="hidden md:block w-[300px] flex-shrink-0">
                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl relative border border-white/10">
                    <img src={getImageUrl(details.poster_path)} alt={title} className="w-full h-full object-cover" style={{ filter: 'url(#ultraSharp) brightness(1.05) contrast(1.1) saturate(1.08) hue-rotate(5deg)' }}/>
                </div>
            </div>
            <div className="min-w-0">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <h1 className="text-2xl md:text-5xl font-bold text-white mb-2">{title}</h1>
                    <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 hover:bg-miraj-gold hover:text-black transition-colors border border-white/5">
                        <Share2 size={18} /> <span className="hidden sm:inline font-bold text-sm">Share</span>
                    </button>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-6 flex-wrap">
                    <span className="flex items-center gap-1 text-miraj-gold font-bold bg-miraj-gold/10 px-2 py-1 rounded"><Star size={14} fill="currentColor" /> {details.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="flex items-center gap-1"><Calendar size={16} /> {year}</span>
                    {details.runtime && <span className="flex items-center gap-1"><Clock size={16} /> {details.runtime}m</span>}
                    <span className="border border-white/20 px-2 py-0.5 rounded text-xs uppercase font-bold">
                      {type === 'tv_live' ? 'Live TV' : type.replace('_', ' ')}
                    </span>
                </div>

                <p className="text-gray-400 leading-relaxed text-lg mb-8">{description}</p>

                {/* Cast */}
                {cast.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4">Cast</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {cast.slice(0, 5).map(person => (
                                <div key={person.id} className="text-center group">
                                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-white/5 border border-white/5 group-hover:border-miraj-gold/50 transition-colors">
                                        {person.profile_path ? (
                                            <img src={getImageUrl(person.profile_path)} alt={person.name} className="w-full h-full object-cover" />
                                        ) : <User className="w-full h-full p-4 text-gray-500" />}
                                    </div>
                                    <p className="text-xs font-bold text-white truncate">{person.name}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{person.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
            <div className="mt-12 border-t border-white/10 pt-8">
                <h3 className="text-2xl font-bold text-white mb-6">You May Also Like</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {recommendations.map(item => (
                         <Link key={item.id} href={`/watch/${item.media_type || 'movie'}/${item.id}`} className="group relative block">
                            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-miraj-gray border border-white/5 shadow-lg">
                                <img src={getImageUrl(item.poster_path)} alt={item.title || item.name} className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" style={{ filter: 'url(#ultraSharp) brightness(1.05) contrast(1.1) saturate(1.08) hue-rotate(5deg)' }}/>
                            </div>
                            <h4 className="mt-2 text-sm font-bold text-white truncate group-hover:text-miraj-gold transition-colors">{item.title || item.name}</h4>
                         </Link>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  
  if (!slug || !Array.isArray(slug) || slug.length < 2) {
    return { notFound: true };
  }

  const type = slug[0] as 'movie' | 'tv' | 'sports' | 'tv_live';
  const rawId = slug[1];
  
  // For sports and live TV, use the full slug (they have hyphens)
  let id = rawId;
  if ((type === 'movie' || type === 'tv') && /^\d+/.test(rawId)) {
      // For numeric IDs, get the number part
      id = rawId.split('-')[0];
  }

  try {
    let details: ContentDetails | null = null;
    try {
        details = await getDetails(type, id);
    } catch (e) {
        console.warn("Details fetch failed:", e);
    }

    if (!details) {
        return { notFound: true };
    }

    let cast: CastMember[] = [];
    if (type === 'movie' || type === 'tv') {
        try {
            cast = await getCast(type, id);
        } catch (e) { console.warn("Cast fetch failed"); }
    }

    let recommendations: MediaItem[] = [];
    try {
        recommendations = await getRecommendations(type, id);
    } catch (e) { console.warn("Recs fetch failed"); }

    return {
      props: {
        details,
        cast,
        initialRecommendations: recommendations,
        type,
        id
      }
    };
  } catch (error) {
    console.error("Critical Server Side Error", error);
    return {
        notFound: true
    };
  }
};

export default WatchPage;