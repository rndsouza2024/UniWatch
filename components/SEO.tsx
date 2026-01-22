import React, { useEffect } from 'react';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from '../constants';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'video.movie' | 'video.tv_show' | 'article';
  keywords?: string[];
  videoUrl?: string;
  videoDuration?: number;
  videoReleaseDate?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  keywords = [],
  videoUrl,
  videoDuration,
  videoReleaseDate,
  articlePublishedTime,
  articleModifiedTime
}) => {
  useEffect(() => {
    // Update Title
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Get current URL
    const currentUrl = typeof window !== 'undefined' ? window.location.href : SITE_URL;

    // Basic Meta Tags
    setMeta('description', description);
    setMeta('keywords', keywords.join(', '));
    setMeta('author', SITE_NAME);
    setMeta('robots', 'index, follow');
    setMeta('theme-color', '#0f172a');
    
    // Open Graph
    setProperty('og:title', fullTitle);
    setProperty('og:description', description);
    setProperty('og:image', image);
    setProperty('og:image:width', '1200');
    setProperty('og:image:height', '630');
    setProperty('og:type', type);
    setProperty('og:url', currentUrl);
    setProperty('og:site_name', SITE_NAME);
    setProperty('og:locale', 'en_US');
    
    // Twitter
    setMeta('twitter:card', type.includes('video') ? 'player' : 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
    setMeta('twitter:site', TWITTER_HANDLE);
    setMeta('twitter:creator', TWITTER_HANDLE);
    
    // Video specific meta
    if (type.includes('video')) {
      setProperty('og:video:url', videoUrl || currentUrl);
      setProperty('og:video:type', 'video/mp4');
      setProperty('og:video:width', '1280');
      setProperty('og:video:height', '720');
      setProperty('og:video:secure_url', videoUrl || currentUrl);
      
      if (videoDuration) {
        setProperty('video:duration', videoDuration.toString());
      }
      if (videoReleaseDate) {
        setProperty('video:release_date', videoReleaseDate);
      }
    }
    
    // Article specific meta
    if (type === 'article') {
      if (articlePublishedTime) {
        setProperty('article:published_time', articlePublishedTime);
      }
      if (articleModifiedTime) {
        setProperty('article:modified_time', articleModifiedTime);
      }
    }
    
    // Structured Data (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'video.movie' ? 'Movie' : 
               type === 'video.tv_show' ? 'TVSeries' : 
               type === 'article' ? 'Article' : 'WebSite',
      name: fullTitle,
      description: description,
      url: currentUrl,
      image: image,
      ...(type.includes('video') && {
        duration: videoDuration ? `PT${videoDuration}M` : undefined,
        datePublished: videoReleaseDate,
        contentUrl: videoUrl,
        embedUrl: videoUrl
      })
    };
    
    // Remove existing schema
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    // Add new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [title, description, image, type, keywords, videoUrl, videoDuration, videoReleaseDate, articlePublishedTime, articleModifiedTime]);

  return null;
};

export default SEO;