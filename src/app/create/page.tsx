"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Upload, X, Sun, Moon, ArrowLeft, Video, Image as ImageIcon } from "lucide-react"; 
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';

export default function CreatePost() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [postType, setPostType] = useState<"post" | "story">("post");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isSystemDark);
    } 
  },[]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },[darkMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || (postType === 'post' && !title)) {
      toast.error("Please provide a file and a title."); 
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Uploading...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.dismiss(loadingToast);
        toast.error("You must be logged in!");
        router.push("/");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content || " ");
      formData.append("file", file);
      formData.append("type", postType); 
      
      await axios.post("http://localhost:8000/posts/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      toast.success(postType === 'story' ? "Story added!" : "Posted successfully!");
      
      router.push("/Home"); 
    } catch (error) {
      console.error("Upload failed", error);
      toast.dismiss(loadingToast);
      toast.error("Something went wrong with the upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex items-center justify-center p-4 relative transition-colors duration-300">
      
      <Toaster position="top-center" reverseOrder={false} />

      <div className="absolute top-6 left-6">
        <Link href="/Home">
          <button className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-purple-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
        </Link>
      </div>

      <div className="absolute top-6 right-6">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-purple-500 transition-colors shadow-sm"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            {postType === 'story' ? 'Add to Story' : 'Share Art'}
          </h1>
          <p className="text-zinc-500">
            {postType === 'story' ? 'Share a moment (expires in 24h)' : 'Show your creativity to the world'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPostType("post")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                postType === "post" 
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-purple-600" 
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <ImageIcon size={16} /> Post / Reel
            </button>
            <button
              type="button"
              onClick={() => setPostType("story")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                postType === "story" 
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-purple-600" 
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <Video size={16} /> Story
            </button>
          </div>

          <div className="relative group">
            <div className={`border-2 border-dashed rounded-2xl p-8 transition-colors text-center cursor-pointer overflow-hidden
              ${preview ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-300 dark:border-zinc-700 hover:border-purple-400'}`}>
              <input 
                type="file" 
                accept="image/*,video/mp4,video/webm"
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {preview ? (
                <div className="relative w-full h-48 flex items-center justify-center bg-black rounded-lg">
                  {file?.type.startsWith("video/") ? (
                    <video 
                      src={preview} 
                      controls 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  )}
                  
                  <button 
                    type="button"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setFile(null); 
                      setPreview(null);
                      const input = e.currentTarget.closest('.group')?.querySelector('input');
                      if (input) input.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 z-20"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-500">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Upload size={24} className="text-purple-500" />
                  </div>
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-zinc-400">JPG, PNG, MP4, WebM</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1 text-zinc-700 dark:text-zinc-300">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
                placeholder={postType === 'story' ? "My Day" : "The Starry Night"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1 text-zinc-700 dark:text-zinc-300">Description</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none text-zinc-900 dark:text-white placeholder-zinc-400"
                placeholder={postType === 'story' ? "Quick caption..." : "Tell us about your art..."}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold shadow-lg shadow-purple-500/25 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : (postType === 'story' ? "Add to Story" : "Post Artwork")}
          </button>
        </form>
      </div>
    </div>
  );
}