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
    // Get absolute image URL
    const getAbsoluteImageUrl = (imgPath: string) => {
      if (!imgPath || imgPath.trim() === '' || imgPath === 'undefined') {
        return 'https://uniwatchfree.vercel.app/og-image.jpg';
      }
      
      if (imgPath.startsWith('http')) {
        return imgPath;
      }
      
      if (imgPath.startsWith('/')) {
        return `https://uniwatchfree.vercel.app${imgPath}`;
      }
      
      if (imgPath.includes('image.tmdb.org')) {
        return `https:${imgPath}`;
      }
      
      return imgPath;
    };

    // Get absolute page URL
    const getAbsolutePageUrl = () => {
      const baseUrl = 'https://uniwatchfree.vercel.app';
      let cleanUrl = url.replace(/^[#/]+/, '');
      return `${baseUrl}/#/${cleanUrl}`;
    };

    setAbsoluteImageUrl(getAbsoluteImageUrl(image));
    setAbsolutePageUrl(getAbsolutePageUrl());
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
  const shareTitle = `${title} - Watch Free on UniWatch`;
  const shareDescription = description.length > 120 ? `${description.substring(0, 120)}...` : description;
  const hashtags = ['UniWatch', 'Streaming', type.charAt(0).toUpperCase() + type.slice(1)];

  // Social media platforms
  const socialPlatforms = [
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
        title: shareTitle,
        hashtags: hashtags
      }
    },
    {
      name: 'WhatsApp',
      component: WhatsappShareButton,
      icon: WhatsappIcon,
      props: {
        url: shareUrl,
        title: shareTitle,
        separator: ' - '
      }
    },
    {
      name: 'Telegram',
      component: TelegramShareButton,
      icon: TelegramIcon,
      props: {
        url: shareUrl,
        title: shareTitle
      }
    },
    {
      name: 'Email',
      component: EmailShareButton,
      icon: EmailIcon,
      props: {
        url: shareUrl,
        subject: shareTitle,
        body: `${shareDescription}\n\nWatch now: ${shareUrl}`
      }
    },
    {
      name: 'Reddit',
      component: RedditShareButton,
      icon: RedditIcon,
      props: {
        url: shareUrl,
        title: shareTitle
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
        className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all duration-300 shadow-lg shadow-brand-500/20"
      >
        <Share2 size={18} />
        <span className="font-medium">Share</span>
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-gray-900 rounded-2xl w-full max-w-lg border border-gray-800 shadow-2xl animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-white">Share "{title}"</h3>
                <p className="text-gray-400 text-sm mt-1">Share with friends and family</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Content Preview */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <div className="relative w-32 h-48 rounded-lg overflow-hidden border-2 border-gray-700">
                    <img
                      src={absoluteImageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://uniwatchfree.vercel.app/og-image.jpg';
                      }}
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {type.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-lg mb-3">{title}</h4>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {description}
                  </p>
                  
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-400 text-xs">Direct Link</span>
                    </div>
                    <div className="text-white text-sm truncate" title={shareUrl}>
                      {shareUrl.replace(/^https?:\/\//, '').substring(0, 50)}...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Link Section */}
            <div className="p-6 border-b border-gray-800">
              <div className="mb-4">
                <label className="text-gray-300 text-sm font-medium mb-2 block">Copy this link:</label>
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                    <div className="text-white text-sm truncate font-medium" title={shareUrl}>
                      {shareUrl}
                    </div>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all duration-300 min-w-[120px] ${
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
                        <Copy size={18} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Social Share Buttons - SINGLE RESPONSIVE GRID */}
            <div className="p-6">
              <h4 className="text-white font-bold text-lg mb-5 text-center">Share On Social Media</h4>
              
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {socialPlatforms.map((platform, index) => {
                  const ShareButton = platform.component;
                  const Icon = platform.icon;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <ShareButton
                        {...platform.props}
                        className="rounded-full hover:opacity-90 transition-opacity"
                      >
                        <Icon 
                          size={40} 
                          round 
                          bgStyle={{ fill: 'transparent' }}
                          iconFillColor="white"
                        />
                      </ShareButton>
                      <span className="text-white text-xs mt-2 text-center">
                        {platform.name}
                      </span>
                    </div>
                  );
                })}
                
                {/* Copy Link Button */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={copyToClipboard}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      copySuccess 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {copySuccess ? (
                      <Check size={20} className="text-white" />
                    ) : (
                      <Link2 size={20} className="text-white" />
                    )}
                  </button>
                  <span className="text-white text-xs mt-2 text-center">
                    Copy Link
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800 rounded-b-2xl">
              <p className="text-gray-500 text-xs text-center">
                All share buttons include title, description, and direct link
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShare;