import React, { useState } from 'react';
import { 
  Share2, 
  X, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Link as LinkIcon, 
  Mail, 
  Send, 
  MessageSquare,
  Check
} from 'lucide-react';

interface SocialShareProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'movie' | 'tv' | 'sport' | 'iptv';
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  title, 
  description, 
  image, 
  url, 
  type 
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // FIXED: Proper URL construction for HashRouter
  const getFullUrl = () => {
    const baseUrl = window.location.origin;
    
    // Ensure URL starts with /# for HashRouter
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    
    // For HashRouter: baseUrl + # + path
    return `${baseUrl}/#${formattedUrl}`;
  };

  // FIXED: Better share text with hashtags
  const getShareText = () => {
    return `${title} - Watch now on UniWatch! 🎬`;
  };

  // FIXED: Generate proper share links with ALL 3 elements
  const generateShareLinks = () => {
    const fullUrl = getFullUrl();
    const shareText = getShareText();
    
    // Encode all parameters
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedText = encodeURIComponent(`${shareText}\n\n${description}`);
    const encodedTitle = encodeURIComponent(title);
    const encodedImage = encodeURIComponent(image);

    // Platform-specific share links
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}&picture=${encodedImage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=UniWatch,FreeStreaming,${type}`,
      whatsapp: `https://wa.me/?text=${encodedText}%0A%0A${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedText}`
    };
  };

  // FIXED: Native Web Share API with all 3 elements
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: title,
          text: description,
          url: getFullUrl(),
        });
        setIsSharing(false);
      } catch (error) {
        console.log('Sharing cancelled');
        setIsSharing(false);
        // Fallback to modal
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  // FIXED: Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getFullUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareLinks = generateShareLinks();

  // FIXED: Social platforms with proper share URLs
  const socialPlatforms = [
    { 
      name: 'Facebook', 
      icon: <Facebook size={20} />, 
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      url: shareLinks.facebook 
    },
    { 
      name: 'Twitter', 
      icon: <Twitter size={20} />, 
      color: 'bg-[#1DA1F2] hover:bg-[#1A91DA]',
      url: shareLinks.twitter 
    },
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle size={20} />, 
      color: 'bg-[#25D366] hover:bg-[#22C55E]',
      url: shareLinks.whatsapp 
    },
    { 
      name: 'Telegram', 
      icon: <Send size={20} />, 
      color: 'bg-[#0088CC] hover:bg-[#0077B5]',
      url: shareLinks.telegram 
    },
    { 
      name: 'Reddit', 
      icon: <MessageSquare size={20} />, 
      color: 'bg-[#FF4500] hover:bg-[#E03E00]',
      url: shareLinks.reddit 
    },
    { 
      name: 'Email', 
      icon: <Mail size={20} />, 
      color: 'bg-gray-600 hover:bg-gray-700',
      url: shareLinks.email 
    },
  ];

  return (
    <>
      <button
        onClick={handleNativeShare}
        disabled={isSharing}
        className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors duration-200 shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Share2 size={18} />
        <span className="font-medium">{isSharing ? 'Sharing...' : 'Share'}</span>
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-dark-surface rounded-xl w-full max-w-md border border-dark-border shadow-2xl animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div>
                <h3 className="text-xl font-bold text-white">Share Content</h3>
                <p className="text-gray-400 text-sm mt-1">Share with friends and family</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Content Preview - ALL 3 ELEMENTS VISIBLE */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex gap-4">
                {/* IMAGE */}
                <div className="relative flex-shrink-0">
                  <img
                    src={image}
                    alt={title}
                    className="w-20 h-28 object-cover rounded-lg border border-dark-border"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = `${window.location.origin}/logo.png`;
                    }}
                  />
                  <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    {type.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* TITLE */}
                  <h4 className="text-white font-semibold text-lg line-clamp-2 mb-2">{title}</h4>
                  
                  {/* DESCRIPTION */}
                  <p className="text-gray-400 text-sm line-clamp-3 mb-3">{description}</p>
                  
                  {/* LINK PREVIEW */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-500 text-xs truncate max-w-[200px]" title={getFullUrl()}>
                      {getFullUrl().replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Link Section */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex gap-2">
                <div className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3">
                  <div className="text-gray-400 text-xs mb-1">Share Link</div>
                  <div className="text-white text-sm font-mono truncate" title={getFullUrl()}>
                    {getFullUrl()}
                  </div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    copySuccess 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {copySuccess ? (
                    <span className="flex items-center gap-2">
                      <Check size={18} />
                      Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LinkIcon size={18} />
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Social Platforms */}
            <div className="p-6">
              <h4 className="text-white font-bold mb-4 text-center">Share On</h4>
              <div className="grid grid-cols-3 gap-3">
                {socialPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={`${platform.color} text-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95`}
                    onClick={(e) => {
                      if (platform.name === 'Email') {
                        e.preventDefault();
                        window.location.href = platform.url;
                      }
                    }}
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      {platform.icon}
                    </div>
                    <span className="text-xs font-medium">{platform.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-dark-bg/50 border-t border-dark-border rounded-b-xl">
              <p className="text-gray-500 text-xs text-center">
                Sharing will open in a new window • All 3 elements (Title, Image, Link) included
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShare;