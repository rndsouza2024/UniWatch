import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/router'

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId?: string | null;
  title: string;
  autoplay?: boolean;
  loop?: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title,
  autoplay = true,
  loop = true
}) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)
  const [playerReady, setPlayerReady] = useState(false)
  const router = useRouter()

  // ✅ CONDITIONAL RENDERING – NO VIDEO → RENDER NOTHING
  if (!videoId) {
    return null
  }

  useEffect(() => {
    // Guard: don't run effect if no videoId or container
    if (!videoId || !playerRef.current) return

    // Clean up previous player
    if (playerInstanceRef.current) {
      try {
        playerInstanceRef.current.destroy()
      } catch (e) {}
      playerInstanceRef.current = null
    }

    let isMounted = true

    const initializePlayer = () => {
      if (!isMounted || !playerRef.current || !videoId) return
      if (!window.YT?.Player) {
        console.warn('YT.Player not ready, retrying...')
        setTimeout(initializePlayer, 100)
        return
      }

      try {
        playerInstanceRef.current = new window.YT.Player(playerRef.current, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            showinfo: 0,
            controls: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            fs: 1,
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: videoId,
            iv_load_policy: 3
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true)
              console.log('YouTube Player Ready:', videoId)
              event.target.mute()
              event.target.playVideo()
            },
            onStateChange: (event: any) => {
              if (event.data === 0) event.target.playVideo() // loop
            },
            onError: (event: any) => {
              console.error('YouTube Player Error:', event.data)
            }
          }
        })
      } catch (error) {
        console.error('Failed to create YouTube player:', error)
      }
    }

    // Load API if not present
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScript = document.getElementsByTagName('script')[0]
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(tag, firstScript)
      }
      window.onYouTubeIframeAPIReady = initializePlayer
    } else {
      initializePlayer()
    }

    return () => {
      isMounted = false
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy()
        } catch (e) {}
        playerInstanceRef.current = null
      }
    }
  }, [videoId]) // ✅ Only recreate when videoId changes

  return (
    <div className="relative w-full mt-8 sm:mt-0">
      {/* Back Button */}
      <div className="mb-3 sm:mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-black/95 backdrop-blur-md rounded-lg sm:rounded-xl border-2 border-white/20 sm:border hover:bg-miraj-red text-white transition-all duration-300 shadow-2xl hover:shadow-2xl hover:scale-105 active:scale-95 group touch-manipulation min-h-[48px] sm:min-h-0"
          aria-label="Go back"
        >
          <ArrowLeft
            size={20}
            className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1 flex-shrink-0"
          />
          <span className="font-bold text-sm sm:text-sm tracking-wide">BACK</span>
        </button>
      </div>

      {/* YouTube Player Container */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <div
          ref={playerRef}
          className="absolute inset-0 w-full h-full"
          aria-label={`YouTube video player for ${title}`}
          title={title}
          // style={{ filter: 'brightness(1.1) contrast(1.1)' }}
            style={{
                  filter: 'brightness(1.02) contrast(1.05) saturate(1.02)'
                }}
        />
        {!playerReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
            <div className="w-12 h-12 border-4 border-miraj-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-bold tracking-wider text-sm">LOADING TRAILER...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubePlayer