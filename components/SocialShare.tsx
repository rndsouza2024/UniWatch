// import React, { useState } from 'react';
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   WhatsappShareButton,
//   TelegramShareButton,
//   EmailShareButton,
//   RedditShareButton,
//   LinkedinShareButton,
//   FacebookIcon,
//   TwitterIcon,
//   WhatsappIcon,
//   TelegramIcon,
//   EmailIcon,
//   RedditIcon,
//   LinkedinIcon,
// } from 'react-share';
// import {
//   Share2,
//   X,
//   Link as LinkIcon,
//   Mail,
//   Check,
//   Copy,
//   Link2,
// } from 'lucide-react';

// interface SocialShareProps {
//   title: string;
//   description: string;
//   image: string;
//   url: string;
//   type: 'movie' | 'tv' | 'sports' | 'tv_live';
// }

// const SocialShare: React.FC<SocialShareProps> = ({
//   title,
//   description,
//   image,
//   url,
//   type,
// }) => {
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [copySuccess, setCopySuccess] = useState(false);

//   // Get complete absolute URL for sharing
//   const getFullUrl = () => {
//     const baseUrl = window.location.origin;
    
//     // Remove any leading # or / from the URL
//     const cleanUrl = url.replace(/^[#/]+/, '');
    
//     // For HashRouter: baseUrl + # + path
//     return `${baseUrl}/#${cleanUrl}`;
//   };

//   // Copy URL to clipboard
//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(getFullUrl());
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//     } catch (err) {
//       const textArea = document.createElement('textarea');
//       textArea.value = getFullUrl();
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//     }
//   };

//   const shareUrl = getFullUrl();
//   const shareTitle = title;
//   const shareDescription = description;
//   const hashtags = ['UniWatch', 'Streaming', type.charAt(0).toUpperCase() + type.slice(1)];

//   return (
//     <>
//       <button
//         onClick={() => setShowShareModal(true)}
//         className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors duration-200 shadow-lg shadow-brand-500/20"
//       >
//         <Share2 size={18} />
//         <span className="font-medium">Share</span>
//       </button>

//       {showShareModal && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
//           <div className="bg-dark-surface rounded-xl w-full max-w-md border border-dark-border shadow-2xl animate-slideUp">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-dark-border">
//               <div>
//                 <h3 className="text-xl font-bold text-white">Share This Content</h3>
//                 <p className="text-gray-400 text-sm mt-1">Share with friends and family</p>
//               </div>
//               <button
//                 onClick={() => setShowShareModal(false)}
//                 className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//               >
//                 <X size={24} className="text-gray-400" />
//               </button>
//             </div>

//             {/* Content Preview */}
//             <div className="p-6 border-b border-dark-border">
//               <div className="flex gap-4">
//                 {/* IMAGE */}
//                 <div className="relative flex-shrink-0">
//                   <img
//                     src={image}
//                     alt={title}
//                     className="w-20 h-28 object-cover rounded-lg border border-dark-border shadow-lg"
//                     onError={(e) => {
//                       e.currentTarget.src = 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=750&fit=crop&q=80';
//                     }}
//                   />
//                   <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
//                     {type.toUpperCase()}
//                   </div>
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   {/* TITLE */}
//                   <h4 className="text-white font-semibold text-lg line-clamp-2 mb-2">{title}</h4>
                  
//                   {/* DESCRIPTION */}
//                   <p className="text-gray-400 text-sm line-clamp-3 mb-3">{description}</p>
                  
//                   {/* LINK PREVIEW */}
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                     <span className="text-gray-500 text-xs truncate max-w-[180px]" title={shareUrl}>
//                       {shareUrl.replace(/^https?:\/\//, '').substring(0, 40)}...
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Copy Link Section */}
//             <div className="p-6 border-b border-dark-border">
//               <div className="mb-4">
//                 <div className="text-gray-400 text-sm mb-2">Share this link:</div>
//                 <div className="flex gap-2">
//                   <div className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3">
//                     <div className="text-white text-sm font-mono truncate" title={shareUrl}>
//                       {shareUrl}
//                     </div>
//                   </div>
//                   <button
//                     onClick={copyToClipboard}
//                     className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
//                       copySuccess 
//                         ? 'bg-green-600 hover:bg-green-700 text-white' 
//                         : 'bg-brand-600 hover:bg-brand-700 text-white'
//                     }`}
//                   >
//                     {copySuccess ? (
//                       <>
//                         <Check size={18} />
//                         <span>Copied!</span>
//                       </>
//                     ) : (
//                       <>
//                         <Link2 size={18} />
//                         <span>Copy</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* React Share Buttons */}
//             <div className="p-6">
//               <h4 className="text-white font-bold mb-4 text-center">Share On Social Media</h4>
//               <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
//                 {/* Facebook */}
//                 <div className="flex flex-col items-center">
//                   <FacebookShareButton
//                     url={shareUrl}
//                     quote={`${shareTitle}\n\n${shareDescription}`}
//                     hashtag="#UniWatch"
//                     className="rounded-full"
//                   >
//                     <FacebookIcon size={48} round />
//                   </FacebookShareButton>
//                   <span className="text-white text-xs mt-2">Facebook</span>
//                 </div>

//                 {/* Twitter */}
//                 <div className="flex flex-col items-center">
//                   <TwitterShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     hashtags={hashtags}
//                     className="rounded-full"
//                   >
//                     <TwitterIcon size={48} round />
//                   </TwitterShareButton>
//                   <span className="text-white text-xs mt-2">Twitter</span>
//                 </div>

//                 {/* WhatsApp */}
//                 <div className="flex flex-col items-center">
//                   <WhatsappShareButton
//                     url={shareUrl}
//                     title={`${shareTitle}\n\n${shareDescription}`}
//                     separator=" "
//                     className="rounded-full"
//                   >
//                     <WhatsappIcon size={48} round />
//                   </WhatsappShareButton>
//                   <span className="text-white text-xs mt-2">WhatsApp</span>
//                 </div>

//                 {/* Telegram */}
//                 <div className="flex flex-col items-center">
//                   <TelegramShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     className="rounded-full"
//                   >
//                     <TelegramIcon size={48} round />
//                   </TelegramShareButton>
//                   <span className="text-white text-xs mt-2">Telegram</span>
//                 </div>

//                 {/* Email */}
//                 <div className="flex flex-col items-center">
//                   <EmailShareButton
//                     url={shareUrl}
//                     subject={shareTitle}
//                     body={`${shareDescription}\n\n${shareUrl}`}
//                     className="rounded-full"
//                   >
//                     <EmailIcon size={48} round />
//                   </EmailShareButton>
//                   <span className="text-white text-xs mt-2">Email</span>
//                 </div>

//                 {/* Reddit */}
//                 <div className="flex flex-col items-center">
//                   <RedditShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     className="rounded-full"
//                   >
//                     <RedditIcon size={48} round />
//                   </RedditShareButton>
//                   <span className="text-white text-xs mt-2">Reddit</span>
//                 </div>

//                 {/* LinkedIn */}
//                 <div className="flex flex-col items-center">
//                   <LinkedinShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     summary={shareDescription}
//                     source="UniWatch"
//                     className="rounded-full"
//                   >
//                     <LinkedinIcon size={48} round />
//                   </LinkedinShareButton>
//                   <span className="text-white text-xs mt-2">LinkedIn</span>
//                 </div>

//                 {/* Copy Link Button */}
//                 <div className="flex flex-col items-center">
//                   <button
//                     onClick={copyToClipboard}
//                     className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
//                       copySuccess 
//                         ? 'bg-green-600 hover:bg-green-700' 
//                         : 'bg-gray-600 hover:bg-gray-700'
//                     }`}
//                   >
//                     {copySuccess ? (
//                       <Check size={24} className="text-white" />
//                     ) : (
//                       <Copy size={24} className="text-white" />
//                     )}
//                   </button>
//                   <span className="text-white text-xs mt-2">Copy Link</span>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="px-6 py-4 bg-dark-bg/50 border-t border-dark-border rounded-b-xl">
//               <p className="text-gray-500 text-xs text-center">
//                 Sharing includes: Title, Description, Image, and Link
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SocialShare;









import React, { useState } from 'react';
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
  Link as LinkIcon,
  Mail,
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

  // Get complete absolute URL for sharing
  const getFullUrl = () => {
    const baseUrl = 'https://uniwatchfree.vercel.app';
    
    // Remove any leading # from the URL
    const cleanUrl = url.replace(/^#+/, '');
    
    // For HashRouter: baseUrl + # + path
    return `${baseUrl}/#/${cleanUrl}`;
  };

  // Convert image path to absolute URL
  const getAbsoluteImageUrl = (imgPath: string) => {
    if (!imgPath) return 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=750&fit=crop&q=80';
    
    // If it's already an absolute URL (starts with http), return as is
    if (imgPath.startsWith('http')) {
      return imgPath;
    }
    
    // If it's a relative path starting with /, prepend base URL
    if (imgPath.startsWith('/')) {
      return `https://uniwatchfree.vercel.app${imgPath}`;
    }
    
    // For TMDB images (they might already be full URLs from the data)
    return imgPath;
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    const fullUrl = getFullUrl();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareUrl = getFullUrl();
  const shareTitle = title;
  const shareDescription = description;
  const absoluteImageUrl = getAbsoluteImageUrl(image);
  const hashtags = ['UniWatch', 'Streaming', type.charAt(0).toUpperCase() + type.slice(1)];

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

            {/* Content Preview */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex gap-4">
                {/* IMAGE */}
                <div className="relative flex-shrink-0">
                  <img
                    src={absoluteImageUrl}
                    alt={title}
                    className="w-20 h-28 object-cover rounded-lg border border-dark-border shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=750&fit=crop&q=80';
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

            {/* React Share Buttons */}
            <div className="p-6">
              <h4 className="text-white font-bold mb-4 text-center">Share On Social Media</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {/* Facebook */}
                <div className="flex flex-col items-center">
                  <FacebookShareButton
                    url={shareUrl}
                    quote={`${shareTitle}\n\n${shareDescription}`}
                    hashtag="#UniWatch"
                    className="rounded-full"
                  >
                    <FacebookIcon size={48} round />
                  </FacebookShareButton>
                  <span className="text-white text-xs mt-2">Facebook</span>
                </div>

                {/* Twitter */}
                <div className="flex flex-col items-center">
                  <TwitterShareButton
                    url={shareUrl}
                    title={`Watch ${shareTitle} on UniWatch\n${shareDescription}`}
                    hashtags={hashtags}
                    className="rounded-full"
                  >
                    <TwitterIcon size={48} round />
                  </TwitterShareButton>
                  <span className="text-white text-xs mt-2">Twitter</span>
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col items-center">
                  <WhatsappShareButton
                    url={shareUrl}
                    title={`Watch ${shareTitle} on UniWatch\n\n${shareDescription}`}
                    separator="\n"
                    className="rounded-full"
                  >
                    <WhatsappIcon size={48} round />
                  </WhatsappShareButton>
                  <span className="text-white text-xs mt-2">WhatsApp</span>
                </div>

                {/* Telegram */}
                <div className="flex flex-col items-center">
                  <TelegramShareButton
                    url={shareUrl}
                    title={`Watch ${shareTitle} on UniWatch`}
                    className="rounded-full"
                  >
                    <TelegramIcon size={48} round />
                  </TelegramShareButton>
                  <span className="text-white text-xs mt-2">Telegram</span>
                </div>

                {/* Email */}
                <div className="flex flex-col items-center">
                  <EmailShareButton
                    url={shareUrl}
                    subject={`Watch ${shareTitle} on UniWatch`}
                    body={`${shareDescription}\n\nWatch now: ${shareUrl}`}
                    className="rounded-full"
                  >
                    <EmailIcon size={48} round />
                  </EmailShareButton>
                  <span className="text-white text-xs mt-2">Email</span>
                </div>

                {/* Reddit */}
                <div className="flex flex-col items-center">
                  <RedditShareButton
                    url={shareUrl}
                    title={`Watch ${shareTitle} on UniWatch`}
                    className="rounded-full"
                  >
                    <RedditIcon size={48} round />
                  </RedditShareButton>
                  <span className="text-white text-xs mt-2">Reddit</span>
                </div>

                {/* LinkedIn */}
                <div className="flex flex-col items-center">
                  <LinkedinShareButton
                    url={shareUrl}
                    title={`Watch ${shareTitle} on UniWatch`}
                    summary={shareDescription}
                    source="UniWatch"
                    className="rounded-full"
                  >
                    <LinkedinIcon size={48} round />
                  </LinkedinShareButton>
                  <span className="text-white text-xs mt-2">LinkedIn</span>
                </div>

                {/* Copy Link Button */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={copyToClipboard}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      copySuccess 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {copySuccess ? (
                      <Check size={24} className="text-white" />
                    ) : (
                      <Copy size={24} className="text-white" />
                    )}
                  </button>
                  <span className="text-white text-xs mt-2">Copy Link</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-dark-bg/50 border-t border-dark-border rounded-b-xl">
              <p className="text-gray-500 text-xs text-center">
                Sharing includes: Title, Description, Image, and Link
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShare;