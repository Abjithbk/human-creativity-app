"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { X, Heart, Share2, MoreHorizontal, Trash2 } from "lucide-react"; 
import { formatDistanceToNow } from "date-fns"; 
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface Story {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  created_at: string;
  owner_id: number;
  owner?: {
    username: string;
    profile_pic?: string; 
  };
}

interface StoryViewerProps {
  stories: Story[];
  onClose: () => void;
  onGroupComplete: () => void; 
  currentUserId: number | null;
  onDeleteStory: (id: number) => void;
}

export default function StoryViewer({ stories, onClose, onGroupComplete, currentUserId, onDeleteStory }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [showMenu, setShowMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  const currentStory = stories[currentIndex];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentIndex >= stories.length && stories.length > 0) {
      setCurrentIndex(stories.length - 1);
    }
  }, [stories.length, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0); 
    } else {
      onGroupComplete();
    }
  }, [currentIndex, stories.length, onGroupComplete]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const performDelete = async () => {
    try {
        await axios.delete(`http://localhost:8000/posts/delete/${currentStory.id}?type=story`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
  
        setShowMenu(false);
        onDeleteStory(currentStory.id);
        toast.success("Story deleted");

    } catch (err) {
        console.error(err);
        toast.error("Failed to delete story");
    }
  };

const confirmDelete = () => {
    setShowMenu(false); 
    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <span className="font-medium text-sm">Delete this story permanently?</span>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              performDelete();
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md font-semibold transition-colors"
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { 
      duration: 5000,
      style: {
        background: '#18181b', 
        color: '#fff',
        border: '1px solid #3f3f46',
      }
    });
  };

  useEffect(() => {
    setShowMenu(false);
  }, [currentIndex]);

  useEffect(() => {
    if (!currentStory && stories.length === 0) {
        onClose();
    }
  }, [currentStory, stories, onClose]);

  useEffect(() => {
    setProgress(0);
    setIsLiked(false); 
  }, [currentIndex]); 

  useEffect(() => {
    if (!currentStory) return;
    if (currentStory.media_type === "image" || !currentStory.media_type) {
      const duration = 5000; 
      const intervalTime = 50; 
      const step = (intervalTime / duration) * 100;
      const timer = setInterval(() => {
        setProgress((old) => {
          if (old >= 100) return 100;
          return old + step; 
        });
      }, intervalTime);
      return () => clearInterval(timer);
    } 
  }, [currentIndex, currentStory]); 
  
  useEffect(() => {
    if (progress >= 100 && (currentStory?.media_type === "image" || !currentStory?.media_type)) {
        handleNext();
    }
  }, [progress, currentStory, handleNext]);

  const handleVideoUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleLike = () => setIsLiked(!isLiked);

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
      toast.success("Link copied!");
    }
  };

  const handleEmoji = (emoji: string) => {
    console.log(`Reacted with ${emoji}`);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center backdrop-blur-sm">
      <Toaster position="top-center" toastOptions={{ style: { zIndex: 99999 } }} />
      
      <div className="relative w-full max-w-md h-full md:h-[90vh] bg-zinc-900 md:rounded-2xl overflow-hidden shadow-2xl">

        <div className="absolute top-3 left-2 right-2 flex gap-1 z-20">
          {stories.map((_, index) => (
            <div key={index} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-100 ease-linear ${
                    index < currentIndex ? 'w-full' : 
                    index === currentIndex ? 'w-[var(--prog)]' : 'w-0'
                }`}
                style={{ width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold overflow-hidden">
                    {currentStory.owner?.profile_pic ? (
                        <img src={currentStory.owner.profile_pic} className="w-full h-full object-cover" />
                    ) : (
                        <span>{currentStory.owner?.username?.[0]?.toUpperCase() || "U"}</span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold shadow-black drop-shadow-md">
                        {currentStory.owner?.username || "Unknown"}
                    </p>
                    <p className="text-xs text-zinc-300 drop-shadow-md">
                        {currentStory.created_at ? formatDistanceToNow(new Date(currentStory.created_at+"Z"), { addSuffix: true }) : ''}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {currentUserId === currentStory.owner_id && (
                    <div className="relative">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
                            className="p-1 hover:bg-white/10 rounded-full"
                        >
                            <MoreHorizontal size={24} />
                        </button>
              
                        {showMenu && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden z-50">
                                <button 
                             
                                    onClick={(e) => { e.stopPropagation(); confirmDelete(); }}
                                    className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-zinc-700 flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
                    <X size={24} />
                </button>
            </div>
        </div>

        <div className="absolute inset-0 z-10 flex">
            <div className="w-1/3 h-full" onClick={handlePrev}></div>
            <div className="w-2/3 h-full" onClick={handleNext}></div>
        </div>

        <div className="w-full h-full flex items-center justify-center bg-black">
            {currentStory.media_type === "video" || currentStory.media_url.includes(".mp4") ? (
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
                 <input type="text" placeholder="Send a message..." className="bg-transparent border border-white/30 rounded-full px-4 py-2 text-sm text-white placeholder-white/70 w-full mr-4 focus:outline-none focus:border-purple-500 backdrop-blur-sm" />
                 <div className="flex gap-4 text-white">
                    <button onClick={handleLike} className="transition-transform active:scale-125">
                        <Heart size={28} fill={isLiked ? "#ef4444" : "transparent"} className={isLiked ? "text-red-500" : "text-white"} />
                    </button>
                    <button onClick={handleShare}><Share2 size={28} /></button>
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