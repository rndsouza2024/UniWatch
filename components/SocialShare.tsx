// import React, { useState, useEffect } from 'react';
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
//   Check,
//   Copy,
//   Link2,
//   Facebook,
//   Twitter,
//   MessageCircle,
//   Mail,
//   MessageSquare,
//   Linkedin,
//   Globe,
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
//   const [absoluteImageUrl, setAbsoluteImageUrl] = useState('');
//   const [absolutePageUrl, setAbsolutePageUrl] = useState('');
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     // Check if mobile
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     // Get absolute image URL - FIXED LOGIC
//     const getAbsoluteImageUrl = (imgPath: string) => {
//       console.log('Original image path:', imgPath); // Debug
      
//       if (!imgPath || imgPath.trim() === '' || imgPath === 'undefined') {
//         console.log('No image path, using placeholder');
//         return 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=750&fit=crop&q=80';
//       }
      
//       // If it's already a full URL
//       if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
//         console.log('Already absolute URL:', imgPath);
//         return imgPath;
//       }
      
//       // If it's a local path starting with /images/
//       if (imgPath.startsWith('/images/')) {
//         const fullUrl = `https://uniwatchfree.vercel.app${imgPath}`;
//         console.log('Converted local to absolute:', fullUrl);
//         return fullUrl;
//       }
      
//       // If it's a relative path
//       if (imgPath.startsWith('/')) {
//         const fullUrl = `https://uniwatchfree.vercel.app${imgPath}`;
//         console.log('Converted relative to absolute:', fullUrl);
//         return fullUrl;
//       }
      
//       // If it's a TMDB path (they sometimes don't have protocol)
//       if (imgPath.includes('image.tmdb.org')) {
//         const fullUrl = `https:${imgPath}`;
//         console.log('Added protocol to TMDB:', fullUrl);
//         return fullUrl;
//       }
      
//       console.log('Returning as-is after checks:', imgPath);
//       return imgPath;
//     };

//     // Get absolute page URL
//     const getAbsolutePageUrl = () => {
//       const baseUrl = 'https://uniwatchfree.vercel.app';
      
//       // Remove any leading # from URL
//       let cleanUrl = url;
//       if (url.startsWith('#')) {
//         cleanUrl = url.substring(1);
//       }
      
//       // Remove leading / if present
//       if (cleanUrl.startsWith('/')) {
//         cleanUrl = cleanUrl.substring(1);
//       }
      
//       const fullUrl = `${baseUrl}/#/${cleanUrl}`;
//       console.log('Page URL for sharing:', fullUrl);
//       return fullUrl;
//     };

//     const imgUrl = getAbsoluteImageUrl(image);
//     const pageUrl = getAbsolutePageUrl();
    
//     console.log('Final image URL:', imgUrl);
//     console.log('Final page URL:', pageUrl);
    
//     setAbsoluteImageUrl(imgUrl);
//     setAbsolutePageUrl(pageUrl);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, [image, url]);

//   // Copy URL to clipboard
//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(absolutePageUrl);
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//     } catch (err) {
//       const textArea = document.createElement('textarea');
//       textArea.value = absolutePageUrl;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//     }
//   };

//   const shareUrl = absolutePageUrl;
//   const shareTitle = `${title} - Watch Free on UniWatch`;
//   const shareDescription = description.length > 120 ? `${description.substring(0, 120)}...` : description;
//   const hashtags = ['UniWatch', 'Streaming', type.charAt(0).toUpperCase() + type.slice(1)];

//   // Social media platforms data
//   const socialPlatforms = [
//     {
//       name: 'Facebook',
//       component: FacebookShareButton,
//       icon: Facebook,
//       color: 'bg-blue-600 hover:bg-blue-700',
//       iconColor: 'text-white',
//       props: {
//         url: shareUrl,
//         quote: `${shareTitle}\n\n${shareDescription}`,
//         hashtag: '#UniWatch'
//       }
//     },
//     {
//       name: 'Twitter',
//       component: TwitterShareButton,
//       icon: Twitter,
//       color: 'bg-sky-500 hover:bg-sky-600',
//       iconColor: 'text-white',
//       props: {
//         url: shareUrl,
//         title: shareTitle,
//         hashtags: hashtags
//       }
//     },
//     {
//       name: 'WhatsApp',
//       component: WhatsappShareButton,
//       icon: MessageCircle,
//       color: 'bg-green-600 hover:bg-green-700',
//       iconColor: 'text-white',
//       props: {
//         url: shareUrl,
//         title: shareTitle,
//         separator: ' - '
//       }
//     },
//     {
//       name: 'Telegram',
//       component: TelegramShareButton,
//       icon: MessageSquare,
//       color: 'bg-blue-500 hover:bg-blue-600',
//       iconColor: 'text-white',
//       props: {
//         url: shareUrl,
//         title: shareTitle
//       }
//     },
//     {
//       name: 'Email',
//       component: EmailShareButton,
//       icon: Mail,
//       color: 'bg-gray-700 hover:bg-gray-800',
//       iconColor: 'text-white',
//       props: {
//         url: shareUrl,
//         subject: shareTitle,
//         body: `${shareDescription}\n\nWatch now: ${shareUrl}`
//       }
//     },
//     {
//       name: 'Reddit',
//       component: RedditShareButton,
//       icon: Globe,
//       color: 'bg-orange-600 hover:bg-orange-700',
//       iconColor: 'text-white',
//       props: {
//         url: shareUrl,
//         title: shareTitle
//       }
//     },
//     {
//       name: 'LinkedIn',
//       component: LinkedinShareButton,
//       icon: Linkedin,
//       color: 'bg-blue-700 hover:bg-blue-800',
//       iconColor: 'text-white',
//       props: {
//         url: shareUrl,
//         title: shareTitle,
//         summary: shareDescription,
//         source: 'UniWatch'
//       }
//     }
//   ];

//   return (
//     <>
//       {/* Share Button */}
//       <button
//         onClick={() => setShowShareModal(true)}
//         className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all duration-300 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30"
//       >
//         <Share2 size={18} />
//         <span className="font-medium text-sm sm:text-base">Share</span>
//       </button>

//       {/* Share Modal */}
//       {showShareModal && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-3 sm:p-4 animate-fadeIn">
//           <div 
//             className="bg-gray-900 rounded-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl border border-gray-800 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-800 sticky top-0 bg-gray-900 rounded-t-2xl">
//               <div>
//                 <h3 className="text-lg sm:text-xl font-bold text-white">Share "{title}"</h3>
//                 <p className="text-gray-400 text-xs sm:text-sm mt-1">Share with friends and family</p>
//               </div>
//               <button
//                 onClick={() => setShowShareModal(false)}
//                 className="p-2 hover:bg-gray-800 rounded-full transition-colors"
//                 aria-label="Close"
//               >
//                 <X size={22} className="text-gray-400" />
//               </button>
//             </div>

//             {/* Content Preview */}
//             <div className="p-5 sm:p-6 border-b border-gray-800">
//               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//                 {/* Image */}
//                 <div className="relative flex-shrink-0 self-center sm:self-start">
//                   <div className="relative w-32 h-48 sm:w-40 sm:h-60 rounded-xl overflow-hidden border-2 border-gray-700 shadow-xl">
//                     <img
//                       src={absoluteImageUrl}
//                       alt={title}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         console.error('Image failed to load:', absoluteImageUrl);
//                         e.currentTarget.src = 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=750&fit=crop&q=80';
//                       }}
//                     />
//                   </div>
//                   <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
//                     {type.toUpperCase()}
//                   </div>
//                 </div>
                
//                 {/* Content */}
//                 <div className="flex-1 min-w-0">
//                   <h4 className="text-white font-bold text-lg sm:text-xl leading-tight mb-3">
//                     {title}
//                   </h4>
                  
//                   <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
//                     {description}
//                   </p>
                  
//                   {/* URL Preview */}
//                   <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
//                     <div className="flex items-center gap-2 mb-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-gray-400 text-xs">Direct Link</span>
//                     </div>
//                     <div className="text-white text-sm font-mono truncate" title={shareUrl}>
//                       {shareUrl.replace(/^https?:\/\//, '').substring(0, 50)}...
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Copy Link Section */}
//             <div className="p-5 sm:p-6 border-b border-gray-800">
//               <div className="mb-4">
//                 <label className="text-gray-300 text-sm font-medium mb-2 block">Copy this link:</label>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5">
//                     <div className="text-white text-sm truncate font-medium" title={shareUrl}>
//                       {shareUrl}
//                     </div>
//                   </div>
//                   <button
//                     onClick={copyToClipboard}
//                     className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 min-w-[120px] ${
//                       copySuccess 
//                         ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20' 
//                         : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20'
//                     }`}
//                   >
//                     {copySuccess ? (
//                       <>
//                         <Check size={18} />
//                         <span className="text-sm sm:text-base">Copied!</span>
//                       </>
//                     ) : (
//                       <>
//                         <Copy size={18} />
//                         <span className="text-sm sm:text-base">Copy</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Social Share Buttons - FULLY RESPONSIVE */}
//             <div className="p-5 sm:p-6">
//               <h4 className="text-white font-bold text-lg mb-5 text-center">Share On Social Media</h4>
              
//               {/* Desktop Grid (7 columns) */}
//               <div className="hidden md:grid md:grid-cols-7 gap-3">
//                 {socialPlatforms.map((platform, index) => {
//                   const ShareButton = platform.component;
//                   const Icon = platform.icon;
                  
//                   return (
//                     <div key={index} className="flex flex-col items-center">
//                       <ShareButton
//                         {...platform.props}
//                         className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                       >
//                         <div className={`w-14 h-14 ${platform.color} rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl`}>
//                           <Icon size={24} className={platform.iconColor} />
//                         </div>
//                       </ShareButton>
//                       <span className="text-white text-xs mt-3 text-center font-medium">
//                         {platform.name}
//                       </span>
//                     </div>
//                   );
//                 })}
                
//                 {/* Copy Link Button */}
//                 <div className="flex flex-col items-center">
//                   <button
//                     onClick={copyToClipboard}
//                     className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg ${
//                       copySuccess 
//                         ? 'bg-green-600 hover:bg-green-700' 
//                         : 'bg-gray-700 hover:bg-gray-800'
//                     }`}
//                   >
//                     {copySuccess ? (
//                       <Check size={24} className="text-white" />
//                     ) : (
//                       <Link2 size={24} className="text-white" />
//                     )}
//                   </button>
//                   <span className="text-white text-xs mt-3 text-center font-medium">
//                     Copy Link
//                   </span>
//                 </div>
//               </div>

//               {/* Mobile Grid (4 columns) */}
//               <div className="grid grid-cols-4 gap-4 md:hidden">
//                 {/* Row 1 */}
//                 <div className="flex flex-col items-center">
//                   <FacebookShareButton
//                     url={shareUrl}
//                     quote={`${shareTitle}\n\n${shareDescription}`}
//                     hashtag="#UniWatch"
//                     className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
//                       <Facebook size={26} className="text-white" />
//                     </div>
//                   </FacebookShareButton>
//                   <span className="text-white text-xs mt-2 text-center">Facebook</span>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <TwitterShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     hashtags={hashtags}
//                     className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg">
//                       <Twitter size={26} className="text-white" />
//                     </div>
//                   </TwitterShareButton>
//                   <span className="text-white text-xs mt-2 text-center">Twitter</span>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <WhatsappShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     separator=" - "
//                     className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
//                       <MessageCircle size={26} className="text-white" />
//                     </div>
//                   </WhatsappShareButton>
//                   <span className="text-white text-xs mt-2 text-center">WhatsApp</span>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <TelegramShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
//                       <MessageSquare size={26} className="text-white" />
//                     </div>
//                   </TelegramShareButton>
//                   <span className="text-white text-xs mt-2 text-center">Telegram</span>
//                 </div>

//                 {/* Row 2 */}
//                 <div className="flex flex-col items-center">
//                   <EmailShareButton
//                     url={shareUrl}
//                     subject={shareTitle}
//                     body={`${shareDescription}\n\nWatch now: ${shareUrl}`}
//                     className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
//                       <Mail size={26} className="text-white" />
//                     </div>
//                   </EmailShareButton>
//                   <span className="text-white text-xs mt-2 text-center">Email</span>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <RedditShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
//                       <Globe size={26} className="text-white" />
//                     </div>
//                   </RedditShareButton>
//                   <span className="text-white text-xs mt-2 text-center">Reddit</span>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <LinkedinShareButton
//                     url={shareUrl}
//                     title={shareTitle}
//                     summary={shareDescription}
//                     source="UniWatch"
//                     className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
//                       <Linkedin size={26} className="text-white" />
//                     </div>
//                   </LinkedinShareButton>
//                   <span className="text-white text-xs mt-2 text-center">LinkedIn</span>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <button
//                     onClick={copyToClipboard}
//                     className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg ${
//                       copySuccess 
//                         ? 'bg-green-600 hover:bg-green-700' 
//                         : 'bg-gray-700 hover:bg-gray-800'
//                     }`}
//                   >
//                     {copySuccess ? (
//                       <Check size={26} className="text-white" />
//                     ) : (
//                       <Link2 size={26} className="text-white" />
//                     )}
//                   </button>
//                   <span className="text-white text-xs mt-2 text-center">Copy Link</span>
//                 </div>
//               </div>

//               {/* Mobile Scroll View for 7 items */}
//               <div className="md:hidden mt-6">
//                 <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5">
//                   {socialPlatforms.map((platform, index) => {
//                     const ShareButton = platform.component;
//                     const Icon = platform.icon;
                    
//                     return (
//                       <div key={index} className="flex-shrink-0">
//                         <div className="flex flex-col items-center">
//                           <ShareButton
//                             {...platform.props}
//                             className="rounded-2xl hover:scale-105 transition-transform duration-300"
//                           >
//                             <div className={`w-16 h-16 ${platform.color} rounded-2xl flex items-center justify-center shadow-lg`}>
//                               <Icon size={26} className={platform.iconColor} />
//                             </div>
//                           </ShareButton>
//                           <span className="text-white text-xs mt-2 text-center min-w-[70px]">
//                             {platform.name}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
                  
//                   {/* Copy Link for mobile scroll */}
//                   <div className="flex-shrink-0">
//                     <div className="flex flex-col items-center">
//                       <button
//                         onClick={copyToClipboard}
//                         className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg ${
//                           copySuccess 
//                             ? 'bg-green-600 hover:bg-green-700' 
//                             : 'bg-gray-700 hover:bg-gray-800'
//                         }`}
//                       >
//                         {copySuccess ? (
//                           <Check size={26} className="text-white" />
//                         ) : (
//                           <Link2 size={26} className="text-white" />
//                         )}
//                       </button>
//                       <span className="text-white text-xs mt-2 text-center min-w-[70px]">
//                         Copy Link
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="px-5 sm:px-6 py-4 bg-gray-800/30 border-t border-gray-800 rounded-b-2xl">
//               <p className="text-gray-500 text-xs text-center">
//                 All share buttons include title, description, and direct link
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SocialShare;








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
        return 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=750&fit=crop&q=80';
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
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=750&fit=crop&q=80';
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

            {/* Social Share Buttons - SINGLE CLEAN GRID */}
            <div className="p-6">
              <h4 className="text-white font-bold text-lg mb-5 text-center">Share On Social Media</h4>
              
              <div className="grid grid-cols-4 gap-4">
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