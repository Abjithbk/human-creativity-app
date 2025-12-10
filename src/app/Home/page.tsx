'use client';
import React, { useState, useEffect } from 'react';
import { 
  Home, Compass, PlayCircle, LayoutGrid, Bell, User, Settings, 
  Search, Plus, MoreHorizontal, ShieldCheck, Sun, Moon,
  Heart, MessageCircle, Share2, Bookmark 
} from 'lucide-react';

interface NavItems {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface StoryItems {
  isUser?: boolean;
  name: string;
  hasBorder?: boolean;
}

interface Filters {
  label: string;
  active?: boolean;
}

interface TrendingUser {
  name: string;
  tag: string;
}

const NavItem = ({ icon, label, active }: NavItems) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group 
    ${active 
      ? 'bg-zinc-100 dark:bg-zinc-900 text-purple-600 dark:text-purple-400 font-semibold' 
      : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
    }`}>
    <span className={`transition-transform group-hover:scale-110 ${active ? 'scale-100' : ''}`}>
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </div>
);

const StoryItem = ({ isUser, name, hasBorder }: StoryItems) => (
  <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
    <div className={`w-[70px] h-[70px] rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105 
      ${hasBorder ? 'bg-gradient-to-tr from-cyan-400 to-purple-600' : ''} 
      ${isUser 
        ? 'border border-dashed border-zinc-400 dark:border-zinc-700 flex items-center justify-center hover:border-zinc-500' 
        : ''
      }`}>
      {isUser ? (
        <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
          <Plus size={24} className="text-purple-500" />
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-black" />
      )}
    </div>
    <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate w-16 text-center group-hover:text-black dark:group-hover:text-white transition-colors">
      {name}
    </span>
  </div>
);

const Filter = ({ label, active }: Filters) => (
  <button className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 
    ${active 
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 border-transparent' 
      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white'
    }`}>
    {label}
  </button>
);

const TrendingUser = ({ name, tag }: TrendingUser) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 ring-2 ring-white dark:ring-black group-hover:ring-zinc-200 dark:group-hover:ring-zinc-700 transition-all" />
      <div>
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
          {name}
        </h4>
        <p className="text-xs text-zinc-500">{tag}</p>
      </div>
    </div>
    <button className="text-xs font-bold text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100">
      Follow
    </button>
  </div>
);


export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  
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

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white font-sans flex overflow-hidden selection:bg-purple-500 selection:text-white transition-colors duration-300">
      
      <aside className="w-64 flex flex-col justify-between p-6 border-r border-zinc-200 dark:border-zinc-900 h-screen sticky top-0 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-3 mb-10 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Canvas
            </h1>
          </div>
          
          <nav className="space-y-2">
            <NavItem icon={<Home size={20} />} label="Home" active />
            <NavItem icon={<Compass size={20} />} label="Explore" />
            <NavItem icon={<PlayCircle size={20} />} label="Reels" />
            <NavItem icon={<LayoutGrid size={20} />} label="Categories" />
            <NavItem icon={<Bell size={20} />} label="Notifications" />
            <NavItem icon={<User size={20} />} label="Profile" />
            <NavItem icon={<Settings size={20} />} label="Settings" />
          </nav>
        </div>

        <div className="flex flex-col items-center gap-4">
  <button className="flex-1 w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition transform active:scale-95">
    <Plus size={20} /> Create
  </button>

  <button 
    onClick={() => setDarkMode(!darkMode)}
    className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors border border-zinc-200 dark:border-zinc-800"
    title="Toggle Theme"
  >
    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
  </button>
</div>


      </aside>
      <main className="flex-1 overflow-y-auto px-10 py-8 h-screen scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="flex gap-6 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <StoryItem isUser name="Your Story" />
          <StoryItem name="anna_art" hasBorder />
          <StoryItem name="design_daily" hasBorder />
          <StoryItem name="music_flow" hasBorder />
          <StoryItem name="pixel_jim" hasBorder />
        </div>

        <div className="flex gap-3 mb-8">
          <Filter label="All" active />
          <Filter label="Art" />
          <Filter label="Photo" />
          <Filter label="Music" />
          <Filter label="Crafts" />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-purple-500" />
              <div>
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-100">elara_studios</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Art</p>
              </div>
            </div>
            <button className="text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white transition">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-800 relative overflow-hidden group cursor-pointer shadow-inner">
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 z-10 shadow-lg">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span className="text-[10px] font-bold tracking-wider text-white">HUMAN</span>
            </div>
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-cyan-600/60 to-transparent transform skew-y-6 translate-y-12 opacity-80 mix-blend-overlay"></div>
          </div>    
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors group">
                    <Heart size={24} className="group-hover:fill-current transition-all" />
                    <span className="text-sm font-semibold">4.2k</span>
                </button>
                <button className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group">
                    <MessageCircle size={24} className="group-hover:fill-current transition-all" />
                    <span className="text-sm font-semibold">86</span>
                </button>
                <button className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    <Share2 size={24} />
                </button>
            </div>
            <button className="text-zinc-500 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
                <Bookmark size={24} />
            </button>
          </div>
        </div>
      </main>

      <aside className="w-80 p-8 border-l border-zinc-200 dark:border-zinc-900 hidden xl:block h-screen sticky top-0 transition-colors duration-300">
        
        <div className="relative mb-8 group">
          <Search className="absolute left-3 top-3 text-zinc-400 dark:text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-zinc-800 dark:text-zinc-300 transition-all placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
          />
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl p-5 mb-8 border border-purple-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600 blur-[50px] opacity-20 group-hover:opacity-30 transition duration-500"></div>
          
          <div className="flex items-center gap-2 mb-2 text-purple-400">
            <ShieldCheck size={18} />
            <span className="font-semibold text-sm">Plagiarism Shield Active</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We use perceptual hashing to protect your uploads. Your art belongs to you.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Trending Humans</h3>
          <div className="space-y-5">
            <TrendingUser name="Artist Name" tag="Traditional Ink" />
            <TrendingUser name="Artist Name" tag="Traditional Ink" />
            <TrendingUser name="Artist Name" tag="Traditional Ink" />
          </div>
        </div>
      </aside>

    </div>
  );
}