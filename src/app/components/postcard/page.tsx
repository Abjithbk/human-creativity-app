"use client";
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ShieldCheck } from 'lucide-react';

export default function PostCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100)); 


  const isVideo = post.media_type === 'video' || 
                  post.media_url?.includes('.mp4') || 
                  post.media_url?.includes('.webm') || 
                  post.media_url?.includes('/video/');

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-purple-500 flex items-center justify-center overflow-hidden">
             {/* Show User Avatar or Fallback */}
             {post.owner?.avatar_url ? (
                <img src={post.owner.avatar_url} className="w-full h-full object-cover"/>
             ) : (
                <span className="text-xs font-bold text-zinc-500">{post.owner_id}</span>
             )}
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
               {post.owner?.username || `User #${post.owner_id}`}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{post.title}</p>
          </div>
        </div>
        <button className="text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media Container */}
      <div className="w-full aspect-video rounded-2xl bg-black relative overflow-hidden group cursor-pointer shadow-inner flex items-center justify-center">
        
        {isVideo ? (
          <video 
            src={post.media_url} 
            controls 
            className="w-full h-full object-contain" 
          />
        ) : (
          <img 
            src={post.media_url} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
        )}
        
        {/* Badge Overlay */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 z-10 shadow-lg pointer-events-none">
          <ShieldCheck size={14} className="text-cyan-400" />
          <span className="text-[10px] font-bold tracking-wider text-white">HUMAN</span>
        </div>
      </div>    
      
      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-6">

            <button 
              onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
              className={`flex items-center gap-2 transition-colors group ${liked ? 'text-pink-500' : 'text-zinc-500 dark:text-zinc-400 hover:text-pink-500'}`}
            >
                <Heart size={24} className={`transition-all ${liked ? 'fill-current' : 'group-hover:fill-current'}`} />
                <span className="text-sm font-semibold">{likeCount}</span>
            </button>

        
            <button className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group">
                <MessageCircle size={24} className="group-hover:fill-current transition-all" />
                <span className="text-sm font-semibold">0</span>
            </button>


            <button className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                <Share2 size={24} />
            </button>
        </div>


        <button 
          onClick={() => setSaved(!saved)}
          className={`transition-colors ${saved ? 'text-purple-500' : 'text-zinc-500 dark:text-zinc-400 hover:text-purple-500'}`}
        >
            <Bookmark size={24} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">{post.content}</p>
    </div>
  );
}