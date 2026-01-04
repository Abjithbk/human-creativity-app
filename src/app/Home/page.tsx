'use client';
import React, { useState, useEffect } from 'react';
import { 
  Home, Compass, PlayCircle, LayoutGrid, Bell, User, Settings, 
  Search, Plus, ShieldCheck, Sun, Moon 
} from 'lucide-react';
import Categories from '../components/categories/page';
import Notifications from '../components/notifications/page';
import Setting from '../components/settings/page';
import Profile from '../components/profile/page';
import Explore from '../components/explore/page';
import Reels from '../components/reels/page';
import PostCard from '../components/postcard/page';
import StoryViewer from '../components/stories/page'; 
import axios from 'axios';
import Link from 'next/link';

interface NavItems {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void
}

interface StoryItems {
  isUser?: boolean;
  name: string;
  hasBorder?: boolean;
  isViewed?: boolean; 
  image?: string; 
  onClick?: () => void;
}

interface Filters {
  label: string;
  active?: boolean;
}

interface TrendingUser {
  name: string;
  tag: string;
}

const NavItem = ({ icon, label, active, onClick }: NavItems) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group 
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

const StoryItem = ({ isUser, name, hasBorder, isViewed, image, onClick }: StoryItems) => {
  const isVideo = image?.includes(".mp4") || image?.includes(".webm") || image?.includes("/video/");

  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
      <div className={`w-[70px] h-[70px] rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105 
        ${hasBorder && !isViewed ? 'bg-gradient-to-tr from-cyan-400 via-white-400 to-purple-600' : ''} 
        ${hasBorder && isViewed ? 'bg-zinc-300 dark:bg-zinc-700' : ''}
        ${isUser 
          ? 'border border-dashed border-zinc-400 dark:border-zinc-700 flex items-center justify-center hover:border-zinc-500' 
          : ''
        }`}>
        {isUser ? (
          <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <Plus size={24} className="text-purple-500" />
          </div>
        ) : (
          <div className="w-full h-full rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-black overflow-hidden relative">
            {image ? (
              isVideo ? (
                <video 
                  src={image} 
                  className="w-full h-full object-cover" 
                  muted 
                />
              ) : (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full bg-zinc-300 dark:bg-zinc-700" />
            )}
          </div>
        )}
      </div>
      <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate w-16 text-center group-hover:text-black dark:group-hover:text-white transition-colors">
        {name}
      </span>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState('Home');
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [viewedUsers, setViewedUsers] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isSystemDark);
      
      // 4. NEW: Load viewed status from LocalStorage
      const savedViews = localStorage.getItem('viewedStories');
      if (savedViews) {
        setViewedUsers(JSON.parse(savedViews));
      }
    } 
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await axios.get("http://localhost:8000/posts");
        setPosts(postsRes.data);

        const storiesRes = await axios.get("http://localhost:8000/posts/stories");
        setStories(storiesRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    if (activeTab === 'Home') {
      fetchData();
    }
  }, [activeTab]);

  const handleStoryClick = (index: number, userId: number) => {
    setSelectedStoryIndex(index);
    

    if (!viewedUsers.includes(userId)) {
      const newViewed = [...viewedUsers, userId];
      setViewedUsers(newViewed);
      localStorage.setItem('viewedStories', JSON.stringify(newViewed));
    }
  };

  const uniqueStoryUsers = stories.reduce((acc: any[], story, index) => {
    const isUserAlreadyAdded = acc.some(
      (item) => item.owner?.username === story.owner?.username
    );

    if (!isUserAlreadyAdded) {
      acc.push({ ...story, originalIndex: index });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white font-sans flex overflow-hidden selection:bg-purple-500 selection:text-white transition-colors duration-300 ">
      
      <aside className="w-64 flex flex-col justify-between p-6 border-r border-zinc-200 dark:border-zinc-900 h-screen sticky top-0 transition-colors duration-300">
        <div>
          <div onClick={() => setActiveTab('Home')} className="flex items-center gap-3 mb-10 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Canvas
            </h1>
          </div>
          
          <nav className="space-y-2">
            <NavItem icon={<Home size={20} />} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
            <NavItem icon={<Compass size={20} />} label="Explore" active={activeTab === 'Explore'} onClick={() => setActiveTab('Explore')}/>
            <NavItem icon={<PlayCircle size={20} />} label="Reels" active={activeTab === 'Reels'} onClick={() => setActiveTab('Reels')}/>
            <NavItem icon={<LayoutGrid size={20} />} label="Categories" active={activeTab === 'Categories'} onClick={() => setActiveTab('Categories')}/>
            <NavItem icon={<Bell size={20} />} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
            <NavItem icon={<User size={20} />} label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')}/>
            <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')}/>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link href='/create' className='w-full'>
            <button className="flex-1 w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition transform active:scale-95">
              <Plus size={20} /> Create
            </button>
          </Link>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors border border-zinc-200 dark:border-zinc-800"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="flex-1 overflow-y-auto px-10 py-8 h-screen no-scrollbar">
       {activeTab === 'Home' && (
          <>
            <div className="flex gap-6 mb-8 overflow-x-auto pb-4 no-scrollbar">
              
              <Link href="/create">
                <StoryItem isUser name="Your Story" />
              </Link>
            
              {uniqueStoryUsers.map((story) => (
                 <StoryItem 
                   key={story.id}
                   name={story.owner?.username || "User"} 
                   hasBorder 
                   image={story.media_url} 
                   isViewed={viewedUsers.includes(story.owner_id)}
                   onClick={() => handleStoryClick(story.originalIndex, story.owner_id)}
                 />
              ))}

              {stories.length === 0 && (
                <div className="flex items-center text-sm text-zinc-500">
                  <span className="ml-2">No active stories</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-8">
              <Filter label="All" active />
              <Filter label="Art" />
              <Filter label="Photo" />
              <Filter label="Music" />
              <Filter label="Crafts" />
            </div>

            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <p>No posts yet.</p>
                  <Link href="/create" className="text-purple-500 hover:underline">Be the first to upload one!</Link>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'Categories' && <Categories />}
        {activeTab === 'Notifications' && <Notifications />}
        {activeTab === 'Settings' && <Setting />}
        {activeTab === 'Profile' && <Profile />}
        {activeTab === 'Explore' && <Explore />}
        {activeTab === 'Reels' && <Reels />}
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
            <TrendingUser name="Design Daily" tag="Digital Art" />
            <TrendingUser name="Pixel Jim" tag="Voxel Art" />
          </div>
        </div>
      </aside>

      {selectedStoryIndex !== null && stories.length > 0 && (
        <StoryViewer 
          stories={stories} 
          initialIndex={selectedStoryIndex} 
          onClose={() => setSelectedStoryIndex(null)} 
        />
      )}

    </div>
  );
}