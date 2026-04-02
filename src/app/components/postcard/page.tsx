"use client";
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ShieldCheck, Trash2, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: any;
  currentUserId: number | null;
  onDeletePost: (id: number) => void;
}

export default function PostCard({ post, currentUserId, onDeletePost }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100)); 
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{id: number, username: string, text: string}[]>([
    { id: 1, username: 'art_lover88', text: 'Stunning piece! The colors are incredible.' },
    { id: 2, username: 'digital.creator', text: 'This gives me so much inspiration for my next project. 😍' }
  ]);

  const isVideo = post.media_type === 'video' || 
                  post.media_url?.includes('.mp4') || 
                  post.media_url?.includes('.webm') || 
                  post.media_url?.includes('/video/');

  const performDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/posts/delete/${post.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      onDeletePost(post.id); 
      toast.success("Post deleted");

    } catch (e) {
      console.error("Delete failed", e);
      toast.error("Failed to delete post");
    }
  };

  const confirmDelete = () => {
    setShowMenu(false);
    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <span className="font-medium text-sm">Delete this post?</span>
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

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none mb-6 relative z-0">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-purple-500 flex items-center justify-center overflow-hidden">
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

  
        <div className="relative z-20">
            {currentUserId === post.owner_id ? (
                <>
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition p-1"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl overflow-hidden z-50">
                            <button 
                                onClick={confirmDelete}
                                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors font-medium"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <button className="text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed">
                     <MoreHorizontal size={20} />
                </button>
            )}
        </div>
      </div>

      <div onClick={() => setShowMenu(false)} className="w-full aspect-video rounded-2xl bg-black relative overflow-hidden group cursor-pointer shadow-inner flex items-center justify-center">
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
        
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 z-10 shadow-lg pointer-events-none">
          <ShieldCheck size={14} className="text-cyan-400" />
          <span className="text-[10px] font-bold tracking-wider text-white">HUMAN</span>
        </div>
      </div>    

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
            <button 
              onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
              className={`flex items-center gap-2 transition-colors group ${liked ? 'text-pink-500' : 'text-zinc-500 dark:text-zinc-400 hover:text-pink-500'}`}
            >
                <Heart size={24} className={`transition-all ${liked ? 'fill-current' : 'group-hover:fill-current'}`} />
                <span className="text-sm font-semibold">{likeCount}</span>
            </button>
        
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 transition-colors group ${showComments ? 'text-blue-500' : 'text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400'}`}
            >
                <MessageCircle size={24} className="group-hover:fill-current transition-all" />
                <span className="text-sm font-semibold">{comments.length}</span>
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                toast.success('Link copied to clipboard!');
              }}
              className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
            >
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

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{post.content}</p>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-h-56 overflow-y-auto pr-2 space-y-4 mb-4 no-scrollbar">
            {comments.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4 font-medium">No comments yet. Start the conversation!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group/comment">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 p-[2px] shrink-0">
                    <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-white uppercase">
                        {comment.username.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl rounded-tl-none px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{comment.username}</span>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newComment.trim()) {
                    setComments([...comments, { id: Date.now(), username: 'You', text: newComment.trim() }]);
                    setNewComment('');
                  }
                }}
                placeholder="Add a comment..."
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-full py-2.5 pl-4 pr-12 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-500"
              />
              <button 
                onClick={() => {
                  if (newComment.trim()) {
                    setComments([...comments, { id: Date.now(), username: 'You', text: newComment.trim() }]);
                    setNewComment('');
                  }
                }}
                disabled={!newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-white bg-purple-500 hover:bg-purple-600 disabled:opacity-0 disabled:scale-75 transition-all duration-300"
              >
                <Send size={14} className="ml-[-1px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}