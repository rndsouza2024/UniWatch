import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
  schema?: Record<string, any>;
  path?: string;
  keywords?: string[];
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Vega Movies Official - Official Site for free Movie and Tv Shows in HD quality. No registration required.",
  image = "https://vegamoviesofficial.vercel.app/og-image.jpg",
  type = "website",
  schema,
  path = "",
  keywords = ['Vegamovies', 'Vega movies', 'Vega Movies official', 'Vegamovies NL', 'free movies', 'online movies', 'watch movies online', 'movie streaming', 'film', 'cinema', 'entertainment', 'hollywood movies', 'bollywood movies', 'hollywood dubbed movies', 'web Series Online', 'live sports', 'streaming', 'free movies', 'HD streaming']
}) => {
  const siteUrl = "https://vegamoviesofficial.vercel.app";
  const url = `${siteUrl}${path}`;
  const formattedTitle = title.includes('Vega Movies Official') ? title : `${title} | Vega Movies Official`;

  return (
    <Head>
      <>
        <title>{formattedTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="canonical" href={url} />
        
        {/* Open Graph */}
        <meta property="og:site_name" content="Vega Movies Official" />
        <meta property="og:title" content={formattedTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={formattedTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@Vega MoviesOfficial" />
        <meta name="twitter:creator" content="@Vega MoviesOfficial" />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Vega Movies Official" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Structured Data (JSON-LD) */}
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}
      </>
    </Head>
  );
};

export default SEO;