// import React, { useEffect } from 'react';
// import { 
//   SITE_URL, 
//   SITE_NAME, 
//   DEFAULT_OG_IMAGE, 
//   TWITTER_HANDLE,
//   SITE_DESCRIPTION 
// } from '../constants';

// interface SEOProps {
//   title: string;
//   description?: string;
//   image?: string;
//   type?: 'website' | 'video.movie' | 'video.tv_show' | 'article';
//   keywords?: string[];
//   videoUrl?: string;
//   videoDuration?: number;
//   videoReleaseDate?: string;
//   articlePublishedTime?: string;
//   articleModifiedTime?: string;
//   canonicalUrl?: string;
// }

// const SEO: React.FC<SEOProps> = ({ 
//   title, 
//   description = SITE_DESCRIPTION,
//   image = DEFAULT_OG_IMAGE,
//   type = 'website',
//   keywords = [],
//   videoUrl,
//   videoDuration,
//   videoReleaseDate,
//   articlePublishedTime,
//   articleModifiedTime,
//   canonicalUrl
// }) => {
//   useEffect(() => {
//     // Document title
//     const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
//     document.title = fullTitle;

//     // Current URL
//     const currentUrl = typeof window !== 'undefined' ? window.location.href : SITE_URL;
//     const canonical = canonicalUrl || currentUrl;
//     const pageDescription = description.substring(0, 155);
//     const allKeywords = ['streaming', 'free movies', 'tv shows', 'live sports', 'iptv', 'HD quality', ...keywords];
    
//     // Helper function to update meta tags
//     const updateMetaTag = (propertyOrName: string, content: string, isProperty = false) => {
//       let element: HTMLMetaElement | null = null;
      
//       if (isProperty) {
//         element = document.querySelector(`meta[property="${propertyOrName}"]`);
//         if (!element) {
//           element = document.createElement('meta');
//           element.setAttribute('property', propertyOrName);
//           document.head.appendChild(element);
//         }
//       } else {
//         element = document.querySelector(`meta[name="${propertyOrName}"]`);
//         if (!element) {
//           element = document.createElement('meta');
//           element.setAttribute('name', propertyOrName);
//           document.head.appendChild(element);
//         }
//       }
//       element.setAttribute('content', content);
//     };

//     // ===== BASIC META TAGS =====
//     updateMetaTag('description', pageDescription);
//     updateMetaTag('keywords', allKeywords.join(', '));
//     updateMetaTag('author', SITE_NAME);
//     updateMetaTag('robots', 'index, follow');

//     // ===== OPEN GRAPH =====
//     updateMetaTag('og:title', fullTitle, true);
//     updateMetaTag('og:description', pageDescription, true);
//     updateMetaTag('og:image', image, true);
//     updateMetaTag('og:image:width', '1200', true);
//     updateMetaTag('og:image:height', '630', true);
//     updateMetaTag('og:type', type, true);
//     updateMetaTag('og:url', canonical, true);
//     updateMetaTag('og:site_name', SITE_NAME, true);
//     updateMetaTag('og:locale', 'en_US', true);

//     // ===== TWITTER =====
//     updateMetaTag('twitter:card', type.includes('video') ? 'player' : 'summary_large_image');
//     updateMetaTag('twitter:title', fullTitle);
//     updateMetaTag('twitter:description', pageDescription);
//     updateMetaTag('twitter:image', image);
//     updateMetaTag('twitter:site', TWITTER_HANDLE);
//     updateMetaTag('twitter:creator', TWITTER_HANDLE);

//     // ===== VIDEO SPECIFIC =====
//     if (type.includes('video')) {
//       updateMetaTag('og:video:url', videoUrl || canonical, true);
//       updateMetaTag('og:video:type', 'video/mp4', true);
//       updateMetaTag('og:video:width', '1280', true);
//       updateMetaTag('og:video:height', '720', true);
//       updateMetaTag('og:video:secure_url', videoUrl || canonical, true);
      
//       if (videoDuration) {
//         updateMetaTag('video:duration', videoDuration.toString(), true);
//       }
//       if (videoReleaseDate) {
//         updateMetaTag('video:release_date', videoReleaseDate, true);
//       }
//     }

//     // ===== ARTICLE SPECIFIC =====
//     if (type === 'article') {
//       if (articlePublishedTime) {
//         updateMetaTag('article:published_time', articlePublishedTime, true);
//       }
//       if (articleModifiedTime) {
//         updateMetaTag('article:modified_time', articleModifiedTime, true);
//       }
//     }

//     // ===== CANONICAL LINK =====
//     let canonicalLink = document.querySelector('link[rel="canonical"]');
//     if (!canonicalLink) {
//       canonicalLink = document.createElement('link');
//       canonicalLink.setAttribute('rel', 'canonical');
//       document.head.appendChild(canonicalLink);
//     }
//     canonicalLink.setAttribute('href', canonical);

//     // ===== STRUCTURED DATA =====
//     const generateStructuredData = () => {
//       let schemaType = 'WebSite';
//       if (type === 'video.movie') schemaType = 'Movie';
//       else if (type === 'video.tv_show') schemaType = 'TVSeries';
//       else if (type === 'article') schemaType = 'Article';
      
//       const structuredData: any = {
//         '@context': 'https://schema.org',
//         '@type': schemaType,
//         name: fullTitle,
//         description: pageDescription,
//         url: canonical,
//         image: image,
//         publisher: {
//           '@type': 'Organization',
//           name: SITE_NAME,
//           url: SITE_URL,
//           logo: {
//             '@type': 'ImageObject',
//             url: 'https://uniwatchfree.vercel.app/favicon-32x32.png'
//           }
//         },
//         mainEntityOfPage: {
//           '@type': 'WebPage',
//           '@id': canonical
//         }
//       };
      
//       if (type.includes('video')) {
//         structuredData.duration = videoDuration ? `PT${videoDuration}M` : undefined;
//         structuredData.datePublished = videoReleaseDate;
//         structuredData.contentUrl = videoUrl;
//         structuredData.embedUrl = videoUrl;
//         structuredData.thumbnailUrl = image;
        
//         if (type === 'video.movie') {
//           structuredData.genre = keywords.length > 0 ? keywords[0] : 'Entertainment';
//         }
//       }
      
//       if (type === 'article') {
//         structuredData.datePublished = articlePublishedTime;
//         structuredData.dateModified = articleModifiedTime;
//         structuredData.author = {
//           '@type': 'Organization',
//           name: SITE_NAME
//         };
//       }
      
//       return structuredData;
//     };

//     // Remove existing schema
//     const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
//     existingSchemas.forEach(schema => schema.remove());

//     // Add main schema
//     const mainSchema = document.createElement('script');
//     mainSchema.type = 'application/ld+json';
//     mainSchema.text = JSON.stringify(generateStructuredData());
//     document.head.appendChild(mainSchema);

//     // Add Website schema (for all pages)
//     const websiteSchema = document.createElement('script');
//     websiteSchema.type = 'application/ld+json';
//     websiteSchema.text = JSON.stringify({
//       "@context": "https://schema.org",
//       "@type": "WebSite",
//       "name": SITE_NAME,
//       "description": SITE_DESCRIPTION,
//       "url": SITE_URL,
//       "potentialAction": {
//         "@type": "SearchAction",
//         "target": `${SITE_URL}/#/search?q={search_term_string}`,
//         "query-input": "required name=search_term_string"
//       }
//     });
//     document.head.appendChild(websiteSchema);

//     // Add Organization schema
//     const organizationSchema = document.createElement('script');
//     organizationSchema.type = 'application/ld+json';
//     organizationSchema.text = JSON.stringify({
//       "@context": "https://schema.org",
//       "@type": "Organization",
//       "name": SITE_NAME,
//       "url": SITE_URL,
//       "logo": "https://uniwatchfree.vercel.app/favicon-32x32.png",
//       "sameAs": [
//         `https://twitter.com/${TWITTER_HANDLE.replace('@', '')}`
//       ]
//     });
//     document.head.appendChild(organizationSchema);

//   }, [title, description, image, type, keywords, videoUrl, videoDuration, videoReleaseDate, articlePublishedTime, articleModifiedTime, canonicalUrl]);

//   return null;
// };

// export default SEO;









import React, { useEffect } from 'react';
import { 
  SITE_URL, 
  SITE_NAME, 
  DEFAULT_OG_IMAGE, 
  TWITTER_HANDLE,
  SITE_DESCRIPTION 
} from '../constants';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'video.movie' | 'video.tv_show' | 'article';
  keywords?: string[];
  videoUrl?: string;
  videoDuration?: number;
  videoReleaseDate?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = SITE_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  keywords = [],
  videoUrl,
  videoDuration,
  videoReleaseDate,
  articlePublishedTime,
  articleModifiedTime,
  canonicalUrl
}) => {
  useEffect(() => {
    // Get absolute image URL
    const getAbsoluteImageUrl = (imgPath: string) => {
      if (!imgPath) return DEFAULT_OG_IMAGE;
      
      if (imgPath.startsWith('http')) {
        return imgPath;
      }
      
      if (imgPath.startsWith('/')) {
        return `https://uniwatchfree.vercel.app${imgPath}`;
      }
      
      return imgPath;
    };

    // Document title
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // Current URL
    const currentUrl = typeof window !== 'undefined' ? window.location.href : SITE_URL;
    const canonical = canonicalUrl || currentUrl;
    const pageDescription = description.substring(0, 155);
    const allKeywords = ['streaming', 'free movies', 'tv shows', 'live sports', 'iptv', 'HD quality', ...keywords];
    const absoluteImage = getAbsoluteImageUrl(image);
    
    // Helper function to update meta tags
    const updateMetaTag = (propertyOrName: string, content: string, isProperty = false) => {
      let element: HTMLMetaElement | null = null;
      
      if (isProperty) {
        element = document.querySelector(`meta[property="${propertyOrName}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', propertyOrName);
          document.head.appendChild(element);
        }
      } else {
        element = document.querySelector(`meta[name="${propertyOrName}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', propertyOrName);
          document.head.appendChild(element);
        }
      }
      element.setAttribute('content', content);
    };

    // ===== BASIC META TAGS =====
    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', allKeywords.join(', '));
    updateMetaTag('author', SITE_NAME);
    updateMetaTag('robots', 'index, follow');

    // ===== OPEN GRAPH =====
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:image', absoluteImage, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:site_name', SITE_NAME, true);
    updateMetaTag('og:locale', 'en_US', true);

    // ===== TWITTER =====
    updateMetaTag('twitter:card', type.includes('video') ? 'player' : 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', absoluteImage);
    updateMetaTag('twitter:site', TWITTER_HANDLE);
    updateMetaTag('twitter:creator', TWITTER_HANDLE);

    // ===== VIDEO SPECIFIC =====
    if (type.includes('video')) {
      updateMetaTag('og:video:url', videoUrl || canonical, true);
      updateMetaTag('og:video:type', 'video/mp4', true);
      updateMetaTag('og:video:width', '1280', true);
      updateMetaTag('og:video:height', '720', true);
      updateMetaTag('og:video:secure_url', videoUrl || canonical, true);
      
      if (videoDuration) {
        updateMetaTag('video:duration', videoDuration.toString(), true);
      }
      if (videoReleaseDate) {
        updateMetaTag('video:release_date', videoReleaseDate, true);
      }
    }

    // ===== ARTICLE SPECIFIC =====
    if (type === 'article') {
      if (articlePublishedTime) {
        updateMetaTag('article:published_time', articlePublishedTime, true);
      }
      if (articleModifiedTime) {
        updateMetaTag('article:modified_time', articleModifiedTime, true);
      }
    }

    // ===== CANONICAL LINK =====
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // ===== STRUCTURED DATA =====
    const generateStructuredData = () => {
      let schemaType = 'WebSite';
      if (type === 'video.movie') schemaType = 'Movie';
      else if (type === 'video.tv_show') schemaType = 'TVSeries';
      else if (type === 'article') schemaType = 'Article';
      
      const structuredData: any = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: fullTitle,
        description: pageDescription,
        url: canonical,
        image: absoluteImage,
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: 'https://uniwatchfree.vercel.app/favicon-32x32.png'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical
        }
      };
      
      if (type.includes('video')) {
        structuredData.duration = videoDuration ? `PT${videoDuration}M` : undefined;
        structuredData.datePublished = videoReleaseDate;
        structuredData.contentUrl = videoUrl;
        structuredData.embedUrl = videoUrl;
        structuredData.thumbnailUrl = absoluteImage;
        
        if (type === 'video.movie') {
          structuredData.genre = keywords.length > 0 ? keywords[0] : 'Entertainment';
        }
      }
      
      if (type === 'article') {
        structuredData.datePublished = articlePublishedTime;
        structuredData.dateModified = articleModifiedTime;
        structuredData.author = {
          '@type': 'Organization',
          name: SITE_NAME
        };
      }
      
      return structuredData;
    };

    // Remove existing schema
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(schema => schema.remove());

    // Add main schema
    const mainSchema = document.createElement('script');
    mainSchema.type = 'application/ld+json';
    mainSchema.text = JSON.stringify(generateStructuredData());
    document.head.appendChild(mainSchema);

    // Add Website schema (for all pages)
    const websiteSchema = document.createElement('script');
    websiteSchema.type = 'application/ld+json';
    websiteSchema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE_NAME,
      "description": SITE_DESCRIPTION,
      "url": SITE_URL,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/#/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });
    document.head.appendChild(websiteSchema);

    // Add Organization schema
    const organizationSchema = document.createElement('script');
    organizationSchema.type = 'application/ld+json';
    organizationSchema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": "https://uniwatchfree.vercel.app/favicon-32x32.png",
      "sameAs": [
        `https://twitter.com/${TWITTER_HANDLE.replace('@', '')}`
      ]
    });
    document.head.appendChild(organizationSchema);

  }, [title, description, image, type, keywords, videoUrl, videoDuration, videoReleaseDate, articlePublishedTime, articleModifiedTime, canonicalUrl]);

  return null;
};

export default SEO;