import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {

  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "UwatchFree Official",
        "url": "https://vegamoviesofficial.vercel.app/",
        "description": "UwatchFree Official - Official Site for free Movie and Tv Shows in HD quality. No registration required.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://vegamoviesofficial.vercel.app/#/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "UwatchFree Official",
        "url": "https://vegamoviesofficial.vercel.app/",
        "logo": "https://vegamoviesofficial.vercel.app/logo.png",
        "sameAs": [
          "https://facebook.com/UwatchFreeOfficial",
          "https://twitter.com/UwatchFreeOfficial"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "support@uwatchfree.official",
          "contactType": "customer support"
        }
      },
      {
        "@type": "CollectionPage",
        "name": "Streaming Library",
        "description": "Browse our extensive collection of Movies, TV Shows, Live Sports, and Live TV Channels.",
        "url": "https://vegamoviesofficial.vercel.app/",
        "hasPart": [
          {
            "@type": "SiteNavigationElement",
            "name": "Movies",
            "url": "https://vegamoviesofficial.vercel.app/Movies",
            "description": "Watch the latest blockbuster movies in HD."
          },
          {
            "@type": "SiteNavigationElement",
            "name": "TV Shows",
            "url": "https://vegamoviesofficial.vercel.app/tv",
            "description": "Stream trending TV series and episodes."
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Live Sports",
            "url": "https://vegamoviesofficial.vercel.app/Sports",
            "description": "Live coverage of Premier League, NBA, F1, and more."
          },
          {
            "@type": "SiteNavigationElement",
            "name": "Live TV",
            "url": "https://vegamoviesofficial.vercel.app/live",
            "description": "24/7 Live TV Channels for News and Entertainment."
          }
        ]
      }
    ]
  };

  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
               {/* Google Translate Init Script */}
        <script 
          type="text/javascript" 
          dangerouslySetInnerHTML={{
            __html: `
              window.googleTranslateElementInit = function() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  autoDisplay: false
                }, 'google_translate_element');
              };
            `
          }}
        />
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}