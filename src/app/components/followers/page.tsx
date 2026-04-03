'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, UserCheck, UserPlus, Users, UserMinus } from 'lucide-react';
import api from '@/app/lib/axios';

// ─── Types ─────────────────────────────────────────────────────────────────

interface FollowUser {
  id: number;
  username: string;
  followers_count: number;
  is_following: boolean;
}

type Tab = 'Followers' | 'Following' | 'Search';

// ─── Helpers ───────────────────────────────────────────────────────────────

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') ?? '';
}

// ─── Avatar ────────────────────────────────────────────────────────────────

function UserAvatar({ username, size = 11 }: { username: string; size?: number }) {
  const initials = username.slice(0, 2).toUpperCase();
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0`}
    >
      {initials}
    </div>
  );
}

// ─── User Card ─────────────────────────────────────────────────────────────

function UserCard({
  user,
  onFollowToggle,
  variant,
}: {
  user: FollowUser;
  onFollowToggle: (userId: number, isFollowing: boolean) => Promise<void>;
  variant: 'followers' | 'following' | 'search';
}) {
  const [loading, setLoading] = useState(false);
  const [optimisticFollowing, setOptimisticFollowing] = useState(user.is_following);
  const [optimisticCount, setOptimisticCount] = useState(user.followers_count);

  // Sync when parent refreshes
  useEffect(() => {
    setOptimisticFollowing(user.is_following);
    setOptimisticCount(user.followers_count);
  }, [user.is_following, user.followers_count]);

  const handleToggle = async () => {
    if (loading) return;
    const willFollow = !optimisticFollowing;
    // Optimistic update
    setOptimisticFollowing(willFollow);
    setOptimisticCount(prev => willFollow ? prev + 1 : Math.max(0, prev - 1));
    setLoading(true);
    try {
      await onFollowToggle(user.id, optimisticFollowing);
    } catch {
      // Revert on error
      setOptimisticFollowing(!willFollow);
      setOptimisticCount(prev => !willFollow ? prev + 1 : Math.max(0, prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors duration-150 group">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar username={user.username} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
            {user.username}
          </p>
          <p className="text-xs text-zinc-400">
            {optimisticCount.toLocaleString()} follower{optimisticCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`
          flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200
          ${loading ? 'opacity-60 cursor-not-allowed' : ''}
          ${optimisticFollowing
            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 border border-zinc-200 dark:border-zinc-700'
            : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm shadow-purple-500/20 hover:opacity-90'
          }
        `}
      >
        {loading ? (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : optimisticFollowing ? (
          <>
            <UserMinus size={12} />
            Unfollow
          </>
        ) : (
          <>
            <UserPlus size={12} />
            Follow
          </>
        )}
      </button>
    </div>
  );
}

// ─── Skeleton loader ───────────────────────────────────────────────────────

function SkeletonList() {
  return (
    <div className="space-y-1">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
          <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          <div className="flex-1">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-1/3 mb-2" />
            <div className="h-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full w-1/4" />
          </div>
          <div className="w-20 h-7 rounded-full bg-zinc-100 dark:bg-zinc-900" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function Followers() {
  const [activeTab, setActiveTab] = useState<Tab>('Followers');
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [searchResults, setSearchResults] = useState<FollowUser[]>([]);
  const [localFilter, setLocalFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch followers / following ───────────────────────────────────────

  const fetchFollowers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/follow/my/followers');
      setFollowers(res.data as FollowUser[]);
    } catch (e) {
      console.error('Failed to load followers', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFollowing = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/follow/my/following');
      setFollowing(res.data as FollowUser[]);
    } catch (e) {
      console.error('Failed to load following', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
  }, [fetchFollowers, fetchFollowing]);

  // ── Global search ─────────────────────────────────────────────────────

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await api.get(`/follow/search?query=${encodeURIComponent(q)}`);
      setSearchResults(res.data as FollowUser[]);
    } catch (e) {
      console.error('Search failed', e);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'Search') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(searchQuery), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, activeTab, search]);

  // ── Follow / Unfollow ─────────────────────────────────────────────────

  const handleFollowToggle = useCallback(async (userId: number, isFollowing: boolean) => {
    if (isFollowing) {
      await api.delete(`/follow/unfollow/${userId}`);
    } else {
      await api.post(`/follow/follow/${userId}`, {});
    }

    // Refresh both lists to keep in sync
    const [fwRes, fgRes] = await Promise.all([
      api.get('/follow/my/followers'),
      api.get('/follow/my/following'),
    ]);
    setFollowers(fwRes.data);
    setFollowing(fgRes.data);

    // Also update search results if we're on search tab
    if (searchQuery.trim()) {
      const srRes = await api.get(
        `/follow/search?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(srRes.data);
    }
  }, [searchQuery]);

  // ── Filter local list ─────────────────────────────────────────────────

  const filterList = (list: FollowUser[]) =>
    localFilter.trim()
      ? list.filter(u => u.username.toLowerCase().includes(localFilter.toLowerCase()))
      : list;

  const tabs: Tab[] = ['Followers', 'Following', 'Search'];
  const tabIcons: Record<Tab, React.ReactNode> = {
    Followers: <Users size={15} />,
    Following: <UserCheck size={15} />,
    Search: <Search size={15} />,
  };

  const currentList = activeTab === 'Followers' ? filterList(followers) : filterList(following);

  // ─────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto text-zinc-900 dark:text-white">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">People</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your connections</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setLocalFilter('');
              setSearchQuery('');
            }}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200
              ${activeTab === tab
                ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }
            `}
          >
            {tabIcons[tab]}
            {tab}
          </button>
        ))}
      </div>

      {/* Search / Filter bar */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        {activeTab === 'Search' ? (
          <input
            autoFocus
            type="text"
            placeholder="Search all users by username…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        ) : (
          <input
            type="text"
            placeholder={`Filter ${activeTab.toLowerCase()}…`}
            value={localFilter}
            onChange={e => setLocalFilter(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        )}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 overflow-hidden">

        {/* ── Followers / Following ────────────────────────────────── */}
        {activeTab !== 'Search' && (
          <>
            {/* Count header */}
            <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {activeTab === 'Followers' ? followers.length : following.length} {activeTab.toLowerCase()}
              </span>
              <button
                onClick={activeTab === 'Followers' ? fetchFollowers : fetchFollowing}
                className="text-xs text-purple-500 hover:text-purple-600 font-semibold transition-colors"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <SkeletonList />
            ) : currentList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                <Users size={40} className="opacity-20" />
                <p className="text-sm">
                  {localFilter
                    ? `No ${activeTab.toLowerCase()} matching "${localFilter}"`
                    : activeTab === 'Followers'
                      ? 'Nobody follows you yet'
                      : "You're not following anyone yet"
                  }
                </p>
                {!localFilter && activeTab === 'Followers' && (
                  <p className="text-xs text-zinc-400">Share your profile to get followers</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
                {currentList.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onFollowToggle={handleFollowToggle}
                    variant={activeTab === 'Followers' ? 'followers' : 'following'}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Global Search ────────────────────────────────────────── */}
        {activeTab === 'Search' && (
          <>
            {!searchQuery.trim() && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                <Search size={40} className="opacity-20" />
                <p className="text-sm">Search for people on Canvas</p>
                <p className="text-xs text-zinc-500">Find and follow creators you love</p>
              </div>
            )}

            {searchQuery.trim() && searchLoading && (
              <div className="py-8 text-center text-zinc-400 text-sm">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Searching…
              </div>
            )}

            {searchQuery.trim() && !searchLoading && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
                <UserPlus size={40} className="opacity-20" />
                <p className="text-sm">No users found for &quot;{searchQuery}&quot;</p>
              </div>
            )}

            {searchQuery.trim() && !searchLoading && searchResults.length > 0 && (
              <>
                <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-900">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {searchResults.map(user => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onFollowToggle={handleFollowToggle}
                      variant="search"
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
