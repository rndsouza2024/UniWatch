import React, { useState, useEffect } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  RedditShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  RedditIcon,
  LinkedinIcon,
} from 'react-share';
import {
  Share2,
  X,
  Check,
  Copy,
  Link2,
} from 'lucide-react';

interface SocialShareProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'movie' | 'tv' | 'sports' | 'tv_live';
}

const SocialShare: React.FC<SocialShareProps> = ({
  title,
  description,
  image,
  url,
  type,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [absoluteImageUrl, setAbsoluteImageUrl] = useState('');
  const [absolutePageUrl, setAbsolutePageUrl] = useState('');

  useEffect(() => {
    // Get absolute image URL - FIXED
    const getAbsoluteImageUrl = (imgPath: string) => {
      if (!imgPath || imgPath.trim() === '') {
        // Return actual image placeholder instead of fallback
        return 'https://uniwatchfree.vercel.app/og-image.jpg';
      }
      
      // If it's already an absolute URL (starts with http), return as is
      if (imgPath.startsWith('http')) {
        return imgPath;
      }
      
      // If it's a relative path starting with /images/
      if (imgPath.startsWith('/images/')) {
        return `https://uniwatchfree.vercel.app${imgPath}`;
      }
      
      // If it's a relative path starting with /
      if (imgPath.startsWith('/')) {
        return `https://uniwatchfree.vercel.app${imgPath}`;
      }
      
      // For TMDB images (they usually start with image.tmdb.org)
      if (imgPath.includes('image.tmdb.org')) {
        return imgPath;
      }
      
      // If none of the above, assume it's a full URL that was missing http
      return `https://${imgPath}`;
    };

    // Get absolute page URL
    const getAbsolutePageUrl = () => {
      const baseUrl = 'https://uniwatchfree.vercel.app';
      
      // Remove any leading # or / from the URL
      const cleanUrl = url.replace(/^[#/]+/, '');
      
      // For HashRouter: baseUrl/#/path
      return `${baseUrl}/#/${cleanUrl}`;
    };

    const imgUrl = getAbsoluteImageUrl(image);
    const pageUrl = getAbsolutePageUrl();
    
    console.log('Image URL for sharing:', imgUrl); // Debug
    console.log('Page URL for sharing:', pageUrl); // Debug
    
    setAbsoluteImageUrl(imgUrl);
    setAbsolutePageUrl(pageUrl);
  }, [image, url]);

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(absolutePageUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = absolutePageUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareUrl = absolutePageUrl;
  const shareTitle = title;
  const shareDescription = description.length > 100 ? `${description.substring(0, 100)}...` : description;
  const hashtags = ['UniWatch', 'Streaming', type.charAt(0).toUpperCase() + type.slice(1)];

  // Social media buttons data
  const socialButtons = [
    {
      name: 'Facebook',
      component: FacebookShareButton,
      icon: FacebookIcon,
      props: {
        url: shareUrl,
        quote: `${shareTitle}\n\n${shareDescription}`,
        hashtag: '#UniWatch'
      }
    },
    {
      name: 'Twitter',
      component: TwitterShareButton,
      icon: TwitterIcon,
      props: {
        url: shareUrl,
        title: `${shareTitle} - Watch Now`,
        hashtags: hashtags
      }
    },
    {
      name: 'WhatsApp',
      component: WhatsappShareButton,
      icon: WhatsappIcon,
      props: {
        url: shareUrl,
        title: `${shareTitle} - Watch Now`,
        separator: ' '
      }
    },
    {
      name: 'Telegram',
      component: TelegramShareButton,
      icon: TelegramIcon,
      props: {
        url: shareUrl,
        title: `${shareTitle} - Watch Now`
      }
    },
    {
      name: 'Email',
      component: EmailShareButton,
      icon: EmailIcon,
      props: {
        url: shareUrl,
        subject: `${shareTitle} - Watch on UniWatch`,
        body: `${shareDescription}\n\nWatch now: ${shareUrl}`
      }
    },
    {
      name: 'Reddit',
      component: RedditShareButton,
      icon: RedditIcon,
      props: {
        url: shareUrl,
        title: `${shareTitle} - Watch on UniWatch`
      }
    },
    {
      name: 'LinkedIn',
      component: LinkedinShareButton,
      icon: LinkedinIcon,
      props: {
        url: shareUrl,
        title: shareTitle,
        summary: shareDescription,
        source: 'UniWatch'
      }
    }
  ];

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors duration-200 shadow-lg shadow-brand-500/20"
      >
        <Share2 size={18} />
        <span className="font-medium">Share</span>
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-dark-surface rounded-xl w-full max-w-md border border-dark-border shadow-2xl animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div>
                <h3 className="text-xl font-bold text-white">Share "{shareTitle}"</h3>
                <p className="text-gray-400 text-sm mt-1">Share with friends and family</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Content Preview */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex gap-4">
                {/* IMAGE - FIXED */}
                <div className="relative flex-shrink-0">
                  <img
                    src={absoluteImageUrl}
                    alt={shareTitle}
                    className="w-20 h-28 object-cover rounded-lg border border-dark-border shadow-lg"
                    onError={(e) => {
                      // Only use fallback if the image fails to load
                      e.currentTarget.src = 'https://uniwatchfree.vercel.app/og-image.jpg';
                    }}
                  />
                  <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    {type.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* TITLE - FIXED */}
                  <h4 className="text-white font-semibold text-lg line-clamp-2 mb-2">{shareTitle}</h4>
                  
                  {/* DESCRIPTION - FIXED */}
                  <p className="text-gray-400 text-sm line-clamp-3 mb-3">{shareDescription}</p>
                  
                  {/* LINK PREVIEW */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-500 text-xs truncate max-w-[180px]" title={shareUrl}>
                      {shareUrl.replace(/^https?:\/\//, '').substring(0, 40)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Link Section */}
            <div className="p-6 border-b border-dark-border">
              <div className="mb-4">
                <div className="text-gray-400 text-sm mb-2">Share this link:</div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3">
                    <div className="text-white text-sm font-mono truncate" title={shareUrl}>
                      {shareUrl}
                    </div>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      copySuccess 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-brand-600 hover:bg-brand-700 text-white'
                    }`}
                  >
                    {copySuccess ? (
                      <>
                        <Check size={18} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 size={18} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* React Share Buttons - FULLY RESPONSIVE */}
            <div className="p-6">
              <h4 className="text-white font-bold mb-4 text-center">Share On Social Media</h4>
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                {socialButtons.map((social, index) => {
                  const ShareButton = social.component;
                  const Icon = social.icon;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <ShareButton
                        {...social.props}
                        className="rounded-full hover:opacity-90 transition-opacity w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12"
                      >
                        <Icon 
                          size={40} 
                          round 
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      </ShareButton>
                      <span className="text-white text-xs mt-2 text-center hidden sm:block">
                        {social.name}
                      </span>
                      <span className="text-white text-[10px] mt-1 text-center block sm:hidden">
                        {social.name}
                      </span>
                    </div>
                  );
                })}
                
                {/* Copy Link Button */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={copyToClipboard}
                    className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
                      copySuccess 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {copySuccess ? (
                      <Check size={20} className="text-white" />
                    ) : (
                      <Copy size={20} className="text-white" />
                    )}
                  </button>
                  <span className="text-white text-xs mt-2 text-center hidden sm:block">
                    Copy Link
                  </span>
                  <span className="text-white text-[10px] mt-1 text-center block sm:hidden">
                    Copy
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-dark-bg/50 border-t border-dark-border rounded-b-xl">
              <p className="text-gray-500 text-xs text-center">
                Sharing: Title, Description, Image, and Direct Link
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShare;