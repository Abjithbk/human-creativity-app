"use client";
import { useState, useEffect, useRef } from "react";
import { X, Heart, Share2 } from "lucide-react"; 
import { formatDistanceToNow } from "date-fns"; 
interface Story {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  created_at: string;
  owner: {
    username: string;
    avatar_url?: string; 
  };
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const currentStory = stories[currentIndex];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setProgress(0);
    setIsLiked(false); 

    if (currentStory && currentStory.media_type === "image") {
      const timer = setInterval(() => {
        setProgress((old) => {
          if (old >= 100) {
            handleNext();
            return 100;
          }
          return old + 2; 
        });
      }, 100);
      return () => clearInterval(timer);
    } 
  }, [currentIndex]); 

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleVideoUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);

  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Story by ${currentStory?.owner?.username}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {

      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleEmoji = (emoji: string) => {
    console.log(`Reacted with ${emoji}`);

  };


  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-full max-w-md h-full md:h-[90vh] bg-zinc-900 md:rounded-2xl overflow-hidden shadow-2xl">
        
  
        <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
        
            <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>

        <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold overflow-hidden">
           
                    {currentStory.owner?.avatar_url ? (
                        <img src={currentStory.owner.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                        <span>{currentStory.owner?.username?.[0]?.toUpperCase() || "U"}</span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold shadow-black drop-shadow-md">
                        {currentStory.owner?.username || "Unknown"}
                    </p>
                    <p className="text-xs text-zinc-300 drop-shadow-md">
                   
                        {currentStory.created_at ? formatDistanceToNow(new Date(currentStory.created_at + "Z"), { addSuffix: true }) : ''}
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
                <X size={24} />
            </button>
        </div>

   
        <div className="absolute inset-0 z-10 flex">
            <div className="w-1/3 h-full" onClick={handlePrev}></div>
            <div className="w-2/3 h-full" onClick={handleNext}></div>
        </div>


        <div className="w-full h-full flex items-center justify-center bg-black">
            {currentStory.media_type === "video" ? (
                <video
                    key={currentStory.id} 
                    ref={videoRef}
                    src={currentStory.media_url}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    onTimeUpdate={handleVideoUpdate}
                    onEnded={handleNext} 
                />
            ) : (
                <img
                    key={currentStory.id} 
                    src={currentStory.media_url}
                    alt="Story"
                    className="w-full h-full object-cover"
                />
            )}
        </div>


        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/80 to-transparent pt-20">
            <div className="flex items-center justify-between mb-4">
                <input 
                    type="text" 
                    placeholder="Send a message..." 
                    className="bg-transparent border border-white/30 rounded-full px-4 py-2 text-sm text-white placeholder-white/70 w-full mr-4 focus:outline-none focus:border-purple-500 backdrop-blur-sm"
                />
                
                <div className="flex gap-4 text-white">
                    <button onClick={handleLike} className="transition-transform active:scale-125">
                        <Heart 
                            size={28} 
                            fill={isLiked ? "#ef4444" : "transparent"} 
                            className={isLiked ? "text-red-500" : "text-white"} 
                        />
                    </button>
                    <button onClick={handleShare}>
                        <Share2 size={28} />
                    </button>
                </div>
            </div>
            <div className="flex justify-between px-2">
                {["🔥", "😂", "😍", "😢", "👏", "🎉"].map((emoji) => (
                    <button 
                        key={emoji} 
                        onClick={() => handleEmoji(emoji)}
                        className="text-2xl hover:scale-125 transition-transform"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}