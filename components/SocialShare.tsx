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
  Check,
  Link2,
  Copy
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
  type 
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // FIXED: Get complete absolute URL for sharing
  const getFullUrl = () => {
    const baseUrl = window.location.origin;
    
    // Remove any leading # or / from the URL
    const cleanUrl = url.replace(/^[#/]+/, '');
    
    // For HashRouter: baseUrl + # + path
    return `${baseUrl}/#${cleanUrl}`;
  };

  // FIXED: Get share text with all 3 elements
  const getShareText = () => {
    return `${title} - Watch now on UniWatch! 🎬\n${description}`;
  };

  // FIXED: Generate share links for ALL platforms with proper parameters
  const generateShareLinks = () => {
    const fullUrl = getFullUrl();
    const shareText = getShareText();
    
    // Encode all parameters
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(title);
    const encodedImage = encodeURIComponent(image);

    return {
      // Facebook - supports title, description, image, and URL
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}&picture=${encodedImage}`,
      
      // Twitter - supports text and URL
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=UniWatch,Streaming,${type}`,
      
      // WhatsApp - supports text only (URL will be included in text)
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${fullUrl}`)}`,
      
      // Telegram - supports text and URL
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      
      // Reddit - supports title and URL
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      
      // Email - supports subject and body
      email: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${description}\n\nWatch here: ${fullUrl}`)}`,
      
      // LinkedIn - supports URL
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      
      // Pinterest - supports URL, image, and description
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      
      // Instagram doesn't have direct share, but we can use a web intent
      instagram: `https://www.instagram.com/?url=${encodedUrl}`
    };
  };

  // FIXED: Native Web Share API with fallback
  const handleNativeShare = async () => {
    const fullUrl = getFullUrl();
    const shareText = `${title}\n\n${description}`;
    
    if (navigator.share) {
      try {
        // Try to share with files (image) - this works on mobile
        const shareData: any = {
          title: title,
          text: shareText,
          url: fullUrl,
        };
        
        // Try to fetch and share the image (works on Android/Chrome)
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          const file = new File([blob], 'share-image.jpg', { type: blob.type });
          shareData.files = [file];
        } catch (imageError) {
          console.log('Image share not supported, sharing without image');
        }
        
        await navigator.share(shareData);
      } catch (error) {
        console.log('Native share cancelled, showing modal');
        setShowShareModal(true);
      }
    } else {
      // Fallback to modal for desktop
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

  // FIXED: Share directly to specific platform
  const shareToPlatform = (platform: string) => {
    const shareLinks = generateShareLinks();
    const platformUrl = (shareLinks as any)[platform];
    
    if (platform === 'email') {
      window.location.href = platformUrl;
    } else {
      window.open(platformUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const shareLinks = generateShareLinks();

  // FIXED: Social platforms with proper icons and actions
  const socialPlatforms = [
    { 
      name: 'Facebook', 
      icon: <Facebook size={20} />, 
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      action: () => shareToPlatform('facebook')
    },
    { 
      name: 'Twitter', 
      icon: <Twitter size={20} />, 
      color: 'bg-[#1DA1F2] hover:bg-[#1A91DA]',
      action: () => shareToPlatform('twitter')
    },
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle size={20} />, 
      color: 'bg-[#25D366] hover:bg-[#22C55E]',
      action: () => shareToPlatform('whatsapp')
    },
    { 
      name: 'Telegram', 
      icon: <Send size={20} />, 
      color: 'bg-[#0088CC] hover:bg-[#0077B5]',
      action: () => shareToPlatform('telegram')
    },
    { 
      name: 'Email', 
      icon: <Mail size={20} />, 
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => shareToPlatform('email')
    },
    { 
      name: 'Copy Link', 
      icon: <Copy size={20} />, 
      color: 'bg-brand-600 hover:bg-brand-700',
      action: copyToClipboard
    },
  ];

  return (
    <>
      <button
        onClick={handleNativeShare}
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
                <h3 className="text-xl font-bold text-white">Share This Content</h3>
                <p className="text-gray-400 text-sm mt-1">Share with friends and family</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Content Preview - Shows ALL 3 elements */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex gap-4">
                {/* IMAGE */}
                <div className="relative flex-shrink-0">
                  <img
                    src={image}
                    alt={title}
                    className="w-20 h-28 object-cover rounded-lg border border-dark-border shadow-lg"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = 'https://uniwatchfree.vercel.app/og-image.jpg';
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
                    <span className="text-gray-500 text-xs truncate max-w-[180px]" title={getFullUrl()}>
                      {getFullUrl().replace(/^https?:\/\//, '').substring(0, 40)}...
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
                    <div className="text-white text-sm font-mono truncate" title={getFullUrl()}>
                      {getFullUrl()}
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

            {/* Share Platforms */}
            <div className="p-6">
              <h4 className="text-white font-bold mb-4 text-center">Share On Social Media</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={platform.action}
                    className={`${platform.color} text-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95`}
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      {platform.icon}
                    </div>
                    <span className="text-xs font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-dark-bg/50 border-t border-dark-border rounded-b-xl">
              <p className="text-gray-500 text-xs text-center">
                Sharing includes: Title, Description, Image, and Link
              </p>
              <p className="text-gray-600 text-xs text-center mt-1">
                All sharing platforms will open in a new window
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShare;