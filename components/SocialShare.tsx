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

  const getFullUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}${url.startsWith('#') ? '' : '#'}${url}`;
  };

  const getShareText = () => {
    return `${title} - Watch now on UniWatch!`;
  };

  const generateShareLinks = () => {
    const fullUrl = getFullUrl();
    const shareText = getShareText();
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedText = encodeURIComponent(`${shareText}\n\n${description}`);
    const encodedTitle = encodeURIComponent(title);
    const encodedImage = encodeURIComponent(image);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}&picture=${encodedImage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=UniWatch,${type === 'movie' ? 'Movie' : type === 'tv' ? 'TVShow' : type}`,
      whatsapp: `https://wa.me/?text=${encodedText}%0A%0A${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      messenger: `fb-messenger://share/?link=${encodedUrl}&app_id=123456789`
    };
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: getFullUrl(),
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
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

            {/* Content Preview */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex gap-4">
                <img
                  src={image}
                  alt={title}
                  className="w-20 h-20 object-cover rounded-lg border border-dark-border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.image-fallback')?.classList.remove('hidden');
                  }}
                />
                <div className="hidden image-fallback w-20 h-20 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">STREAM</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg line-clamp-2">{title}</h4>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-brand-500/20 text-brand-400 text-xs rounded">
                      {type.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-gray-500 text-xs truncate">
                      {getFullUrl().replace(/^https?:\/\//, '').substring(0, 30)}...
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
                  <div className="text-white text-sm font-mono truncate">{getFullUrl()}</div>
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
              <div className="grid grid-cols-3 gap-3">
                {socialPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${platform.color} text-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95`}
                    onClick={(e) => {
                      if (platform.name === 'Email' || platform.name === 'Messenger') {
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
                Sharing will open in a new window
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShare;