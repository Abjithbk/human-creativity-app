'use client';
import React, {
  useState, useEffect, useRef, useCallback, KeyboardEvent,
} from 'react';
import {
  Send, Search, Plus, X, Paperclip, Reply, Edit2, Trash2,
  Check, ChevronDown, MessageSquare, FileText, Film, Image, ArrowLeft,
} from 'lucide-react';
import api from '@/app/lib/axios';
import { formatDistanceToNow } from 'date-fns';

// ─── Types ─────────────────────────────────────────────────────────────────

interface Sender {
  username: string;
  profile_pic: string | null;
}

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_username: string;
  sender_profile_pic: string | null;
  content: string | null;
  message_type: 'text' | 'image' | 'video' | 'document' | 'system';
  media_url: string | null;
  media_filename: string | null;
  reply_to_id: number | null;
  reply_to: Message | null;
  created_at: string;
  edited_at: string | null;
  is_deleted: boolean;
  sender?: Sender;
}

interface Participant {
  user_id: number;
  role: string;
  is_active: boolean;
  user: Sender | null;
}

interface Conversation {
  id: number;
  type: 'direct' | 'group';
  name: string | null;
  group_pic: string | null;
  updated_at: string | null;
  last_message: Message | null;
  unread_count: number;
  participants: Participant[];
}

interface SearchUser {
  id: number;
  username: string;
  followers_count: number;
  is_following: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') ?? '';
}

function decodeUserId(): number | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id ?? null;
  } catch {
    return null;
  }
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

function dmPartner(convo: Conversation, myId: number): Participant | null {
  if (convo.type !== 'direct') return null;
  return convo.participants.find(p => p.user_id !== myId) ?? null;
}

function convoDisplayName(convo: Conversation, myId: number): string {
  if (convo.type === 'group') return convo.name ?? 'Group';
  const partner = dmPartner(convo, myId);
  return partner?.user?.username ?? 'Unknown';
}

function convoAvatar(convo: Conversation, myId: number): string | null {
  if (convo.type === 'group') return convo.group_pic ?? null;
  return dmPartner(convo, myId)?.user?.profile_pic ?? null;
}

function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return '';
  }
}

// ─── Avatar ────────────────────────────────────────────────────────────────

function Avatar({
  src, name, size = 10,
}: { src: string | null; name: string; size?: number }) {
  const initials = name.slice(0, 2).toUpperCase();
  const cls = `w-${size} h-${size} rounded-full object-cover shrink-0`;
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cls}
        onError={e => { (e.target as HTMLImageElement).src = ''; }}
      />
    );
  }
  return (
    <div
      className={`${cls} bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm`}
    >
      {initials}
    </div>
  );
}

// ─── Message Bubble ────────────────────────────────────────────────────────

function MessageBubble({
  msg, isMine, onReply, onEdit, onDelete, myId,
}: {
  msg: Message;
  isMine: boolean;
  onReply: (m: Message) => void;
  onEdit: (m: Message) => void;
  onDelete: (id: number) => void;
  myId: number;
}) {
  const [hover, setHover] = useState(false);

  if (msg.is_deleted) {
    return (
      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
        <span className="text-xs italic text-zinc-400 dark:text-zinc-600 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
          Message deleted
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 mb-1 group`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Avatar (other person) */}
      {!isMine && (
        <Avatar
          src={msg.sender?.profile_pic ?? null}
          name={msg.sender_username}
          size={7}
        />
      )}

      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {/* Sender name (group) */}
        {!isMine && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500 mb-1 ml-1">
            {msg.sender_username}
          </span>
        )}

        {/* Reply preview */}
        {msg.reply_to && (
          <div className={`text-xs px-3 py-1.5 mb-1 rounded-t-xl border-l-2 border-purple-500 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 truncate max-w-xs`}>
            <span className="font-semibold text-purple-500">
              {msg.reply_to.sender_username}
            </span>
            : {msg.reply_to.content ?? '📎 Media'}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed
            ${isMine
              ? 'bg-gradient-to-br from-purple-600 to-cyan-500 text-white rounded-br-sm'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 rounded-bl-sm'
            }`}
        >
          {/* Media content */}
          {msg.message_type === 'image' && msg.media_url && (
            <img
              src={msg.media_url}
              alt="image"
              className="max-w-[220px] max-h-[200px] object-cover rounded-xl mb-2 cursor-pointer"
              onClick={() => window.open(msg.media_url!, '_blank')}
            />
          )}
          {msg.message_type === 'video' && msg.media_url && (
            <video
              src={msg.media_url}
              controls
              className="max-w-[220px] max-h-[160px] rounded-xl mb-2"
            />
          )}
          {msg.message_type === 'document' && msg.media_url && (
            <a
              href={msg.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 mb-2 hover:underline ${isMine ? 'text-white/90' : 'text-purple-500'}`}
            >
              <FileText size={16} />
              <span className="text-xs truncate max-w-[180px]">
                {msg.media_filename ?? 'Document'}
              </span>
            </a>
          )}

          {/* Text content */}
          {msg.content && (
            <span>{msg.content}</span>
          )}

          {/* Edited tag */}
          {msg.edited_at && (
            <span className={`text-[10px] ml-1 ${isMine ? 'text-white/60' : 'text-zinc-400'}`}>
              (edited)
            </span>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 mx-1">
          {timeAgo(msg.created_at)}
        </span>
      </div>

      {/* Action buttons (hover) */}
      <div
        className={`flex items-center gap-1 transition-opacity duration-150 ${hover ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${isMine ? 'flex-row-reverse' : ''}`}
      >
        <button
          onClick={() => onReply(msg)}
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-purple-500 transition-colors"
          title="Reply"
        >
          <Reply size={13} />
        </button>
        {isMine && msg.message_type === 'text' && (
          <button
            onClick={() => onEdit(msg)}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-cyan-500 transition-colors"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
        )}
        {isMine && (
          <button
            onClick={() => onDelete(msg.id)}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── New DM Modal ──────────────────────────────────────────────────────────

function NewDMModal({
  onClose, onStart,
}: { onClose: () => void; onStart: (userId: number) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await api.get(`/follow/search?query=${encodeURIComponent(q)}`, {
        headers: authHeader(),
      });
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-zinc-900 dark:text-white">New Message</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search people..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full pl-9 pr-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto">
          {loading && (
            <div className="text-center py-6 text-zinc-400 text-sm">Searching…</div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="text-center py-6 text-zinc-400 text-sm">No users found</div>
          )}
          {!loading && !query && (
            <div className="text-center py-8 text-zinc-400 text-sm">
              Type a username to search
            </div>
          )}
          {results.map(user => (
            <button
              key={user.id}
              onClick={() => { onStart(user.id); onClose(); }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left"
            >
              <Avatar src={null} name={user.username} size={9} />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user.username}</p>
                <p className="text-xs text-zinc-400">{user.followers_count} followers</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function Messages() {
  const myId = decodeUserId();

  // Conversation list
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [convoLoading, setConvoLoading] = useState(true);

  // Selected conversation
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);

  // Messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const oldestId = useRef<number | null>(null);

  // Input
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editMsg, setEditMsg] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ user_id: number; username: string }[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  // UI
  const [showNewDM, setShowNewDM] = useState(false);
  const [convoSearch, setConvoSearch] = useState('');

  // Refs
  const bottomRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Load conversations ────────────────────────────────────────────────

  const loadConversations = useCallback(async () => {
    setConvoLoading(true);
    try {
      const res = await api.get('/chat/', { headers: authHeader() });
      setConvos(res.data as Conversation[]);
    } catch (e) {
      console.error('Failed to load conversations', e);
    } finally {
      setConvoLoading(false);
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // ── Load messages for active conversation ─────────────────────────────

  const loadMessages = useCallback(async (convoId: number, beforeId?: number) => {
    setMsgLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (beforeId) params.set('before_id', String(beforeId));
      const res = await api.get(`/chat/${convoId}/messages?${params}`, {
        headers: authHeader(),
      });
      const fetched: Message[] = res.data;
      if (beforeId) {
        setMessages(prev => [...fetched, ...prev]);
      } else {
        setMessages(fetched);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'auto' }), 50);
      }
      setHasMore(fetched.length === 50);
      if (fetched.length > 0) {
        oldestId.current = fetched[0].id;
      }
    } catch (e) {
      console.error('Failed to load messages', e);
    } finally {
      setMsgLoading(false);
    }
  }, []);

  // Mark read
  const markRead = useCallback(async (convoId: number) => {
    try {
      await api.post(`/chat/${convoId}/read`, {}, { headers: authHeader() });
      setConvos(prev =>
        prev.map(c => c.id === convoId ? { ...c, unread_count: 0 } : c)
      );
    } catch { /* silent */ }
  }, []);

  // ── WebSocket setup ───────────────────────────────────────────────────

  const connectWS = useCallback((convoId: number) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const token = getToken();
    if (!token) return;

    const ws = new WebSocket(
      `ws://localhost:8000/chat/ws/${convoId}?token=${token}`
    );

    ws.onopen = () => {
      wsRef.current = ws;
    };

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === 'new_message') {
          const newMsg: Message = {
            ...data.message,
            sender: {
              username: data.message.sender_username,
              profile_pic: data.message.sender_profile_pic,
            },
          };
          setMessages(prev => [...prev, newMsg]);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 30);

          // Update last message in convo list
          setConvos(prev =>
            prev.map(c =>
              c.id === convoId
                ? { ...c, last_message: newMsg, updated_at: newMsg.created_at }
                : c
            )
          );
        }

        if (data.event === 'message_edited') {
          setMessages(prev =>
            prev.map(m =>
              m.id === data.message.id ? { ...m, ...data.message } : m
            )
          );
        }

        if (data.event === 'message_deleted') {
          setMessages(prev =>
            prev.map(m =>
              m.id === data.message_id ? { ...m, is_deleted: true, content: null } : m
            )
          );
        }

        if (data.event === 'user_typing') {
          if (myId && data.user_id !== myId) {
            setTypingUsers(prev => {
              if (prev.some(u => u.user_id === data.user_id)) return prev;
              return [...prev, { user_id: data.user_id, username: data.username }];
            });
            // Typing indicator auto-clears after 4s (server TTL is 5s)
            setTimeout(() => {
              setTypingUsers(prev => prev.filter(u => u.user_id !== data.user_id));
            }, 4000);
          }
        }

        if (data.event === 'user_online') {
          setOnlineUsers(prev => new Set([...prev, data.user_id]));
        }

        if (data.event === 'user_offline') {
          setOnlineUsers(prev => {
            const next = new Set(prev);
            next.delete(data.user_id);
            return next;
          });
        }
      } catch { /* invalid json - ignore */ }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    ws.onerror = e => {
      console.error('WS error', e);
    };
  }, [myId]);

  // ── Select conversation ───────────────────────────────────────────────

  const selectConvo = useCallback((convo: Conversation) => {
    setActiveConvo(convo);
    setMessages([]);
    setReplyTo(null);
    setEditMsg(null);
    setInput('');
    setTypingUsers([]);
    oldestId.current = null;
    loadMessages(convo.id);
    connectWS(convo.id);
    markRead(convo.id);
  }, [loadMessages, connectWS, markRead]);

  // Cleanup WS on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  // ── Typing signal ─────────────────────────────────────────────────────

  const sendTyping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message_type: 'system', content: 'typing' }));
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ message_type: 'system', content: 'stop_typing' }));
      }
    }, 2000);
  }, []);

  // ── Send message ──────────────────────────────────────────────────────

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!activeConvo || (!text && !editMsg)) return;

    if (editMsg) {
      // Edit existing
      if (!text) return;
      try {
        await api.patch(
          `/chat/messages/${editMsg.id}`,
          { content: text },
          { headers: authHeader() }
        );
        // WS will broadcast message_edited — but also update locally for instant feedback
        setMessages(prev =>
          prev.map(m =>
            m.id === editMsg.id
              ? { ...m, content: text, edited_at: new Date().toISOString() }
              : m
          )
        );
      } catch (e) {
        console.error('Edit failed', e);
      }
      setEditMsg(null);
      setInput('');
      return;
    }

    if (!text) return;

    // Send over WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          message_type: 'text',
          content: text,
          reply_to_id: replyTo?.id ?? null,
        })
      );
      setInput('');
      setReplyTo(null);
      inputRef.current?.focus();
    } else {
      console.warn('WebSocket not connected');
    }
  }, [input, activeConvo, editMsg, replyTo]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // ── Delete message ────────────────────────────────────────────────────

  const deleteMessage = useCallback(async (msgId: number) => {
    try {
      await api.delete(`/chat/messages/${msgId}`, { headers: authHeader() });
      // WS broadcasts message_deleted
    } catch (e) {
      console.error('Delete failed', e);
    }
  }, []);

  // ── Create / open DM ─────────────────────────────────────────────────

  const startDM = useCallback(async (userId: number) => {
    try {
      const res = await api.post(
        '/chat/',
        { type: 'direct', participant_ids: [userId] },
        { headers: authHeader() }
      );
      const convo: Conversation = res.data;
      await loadConversations();
      // Find or use the returned conversation
      setConvos(prev => {
        const exists = prev.find(c => c.id === convo.id);
        if (!exists) return [{ ...convo, unread_count: 0 }, ...prev];
        return prev;
      });
      selectConvo(convo);
    } catch (e) {
      console.error('Failed to create DM', e);
    }
  }, [loadConversations, selectConvo]);

  // ── Filtered convos ───────────────────────────────────────────────────

  const filteredConvos = convos.filter(c => {
    const name = convoDisplayName(c, myId ?? 0).toLowerCase();
    return name.includes(convoSearch.toLowerCase());
  });

  // ── Partner online status ─────────────────────────────────────────────

  const partnerOnline = activeConvo && myId
    ? (() => {
        const partner = dmPartner(activeConvo, myId);
        return partner ? onlineUsers.has(partner.user_id) : false;
      })()
    : false;

  // ─────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-3rem)] flex overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm">

      {/* ── LEFT PANEL: Conversation list ───────────────────────────── */}
      <aside
        className={`w-80 shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800
          ${activeConvo ? 'hidden md:flex' : 'flex'}`}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Messages</h2>
            <button
              onClick={() => setShowNewDM(true)}
              className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-md hover:opacity-90 transition-opacity"
              title="New message"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Search conversations */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={convoSearch}
              onChange={e => setConvoSearch(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full pl-9 pr-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {convoLoading && (
            <div className="flex flex-col gap-3 p-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-2/3 mb-2" />
                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!convoLoading && filteredConvos.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400 py-16">
              <MessageSquare size={36} className="opacity-30" />
              <p className="text-sm">No conversations yet</p>
              <button
                onClick={() => setShowNewDM(true)}
                className="text-xs text-purple-500 hover:text-purple-600 font-semibold"
              >
                Start one ↗
              </button>
            </div>
          )}

          {filteredConvos.map(convo => {
            const name = convoDisplayName(convo, myId ?? 0);
            const avatarSrc = convoAvatar(convo, myId ?? 0);
            const lastMsg = convo.last_message;
            const isActive = activeConvo?.id === convo.id;

            return (
              <button
                key={convo.id}
                onClick={() => selectConvo(convo)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-150 text-left
                  ${isActive
                    ? 'bg-zinc-100 dark:bg-zinc-900'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
              >
                <div className="relative shrink-0">
                  <Avatar src={avatarSrc} name={name} size={11} />
                  {/* Online dot for DM partner */}
                  {convo.type === 'direct' && (() => {
                    const partner = dmPartner(convo, myId ?? 0);
                    return partner && onlineUsers.has(partner.user_id) ? (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                    ) : null;
                  })()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm truncate ${isActive ? 'font-semibold text-zinc-900 dark:text-white' : 'font-medium text-zinc-700 dark:text-zinc-200'}`}>
                      {name}
                    </span>
                    {convo.updated_at && (
                      <span className="text-[10px] text-zinc-400 shrink-0 ml-1">
                        {timeAgo(convo.updated_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-zinc-400 truncate flex-1">
                      {lastMsg
                        ? (lastMsg.is_deleted
                          ? '🚫 Deleted'
                          : lastMsg.message_type !== 'text'
                            ? `📎 ${lastMsg.message_type}`
                            : lastMsg.content ?? '')
                        : 'No messages yet'}
                    </p>
                    {convo.unread_count > 0 && (
                      <span className="shrink-0 min-w-[18px] h-[18px] bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {convo.unread_count > 99 ? '99+' : convo.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── RIGHT PANEL: Chat window ────────────────────────────────── */}
      <section className={`flex-1 flex flex-col min-w-0 ${activeConvo ? 'flex' : 'hidden md:flex'}`}>
        {activeConvo ? (
          <>
            {/* Chat header */}
            <header className="flex items-center gap-3 px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              {/* Back on mobile */}
              <button
                onClick={() => setActiveConvo(null)}
                className="md:hidden p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="relative shrink-0">
                <Avatar
                  src={convoAvatar(activeConvo, myId ?? 0)}
                  name={convoDisplayName(activeConvo, myId ?? 0)}
                  size={10}
                />
                {partnerOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 dark:text-white truncate">
                  {convoDisplayName(activeConvo, myId ?? 0)}
                </p>
                <p className="text-xs text-zinc-400">
                  {partnerOnline ? (
                    <span className="text-green-500 font-medium">● Active now</span>
                  ) : 'Offline'}
                </p>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 no-scrollbar">
              {/* Load more */}
              {hasMore && (
                <div className="text-center mb-4">
                  <button
                    onClick={() => oldestId.current && loadMessages(activeConvo.id, oldestId.current)}
                    disabled={msgLoading}
                    className="text-xs text-purple-500 hover:text-purple-600 font-semibold flex items-center gap-1 mx-auto"
                  >
                    <ChevronDown size={14} className="rotate-180" />
                    {msgLoading ? 'Loading…' : 'Load earlier messages'}
                  </button>
                </div>
              )}

              {msgLoading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Loading messages…</p>
                </div>
              )}

              {!msgLoading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400">
                  <MessageSquare size={40} className="opacity-20" />
                  <p className="text-sm">No messages yet. Say hi! 👋</p>
                </div>
              )}

              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMine={msg.sender_id === myId}
                  onReply={setReplyTo}
                  onEdit={m => { setEditMsg(m); setInput(m.content ?? ''); setTimeout(() => inputRef.current?.focus(), 50); }}
                  onDelete={deleteMessage}
                  myId={myId ?? 0}
                />
              ))}

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl rounded-bl-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-xs text-zinc-400">
                    {typingUsers.map(u => u.username).join(', ')} is typing…
                  </span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="shrink-0 px-4 pb-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              {/* Reply preview */}
              {replyTo && (
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl px-3 py-2 mb-2">
                  <Reply size={14} className="text-purple-500 shrink-0" />
                  <p className="text-xs text-zinc-500 flex-1 truncate">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {replyTo.sender_username}:
                    </span>{' '}
                    {replyTo.content ?? '📎 Media'}
                  </p>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Edit indicator */}
              {editMsg && (
                <div className="flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl px-3 py-2 mb-2">
                  <Edit2 size={14} className="text-cyan-500 shrink-0" />
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 flex-1 truncate">
                    Editing message
                  </p>
                  <button
                    onClick={() => { setEditMsg(null); setInput(''); }}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Input row */}
              <div className="flex items-end gap-2">
                <div className="flex-1 relative bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus-within:border-purple-500 transition-colors">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                    value={input}
                    onChange={e => {
                      setInput(e.target.value);
                      sendTyping();
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent px-4 py-3 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none resize-none overflow-hidden"
                    style={{ maxHeight: '120px' }}
                  />
                </div>

                {/* Send */}
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editMsg ? <Check size={18} /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-400 p-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center">
              <MessageSquare size={36} className="text-purple-500/60" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-1">
                Your Messages
              </h3>
              <p className="text-sm text-zinc-400 max-w-xs">
                Send private photos and messages to people on Canvas.
              </p>
            </div>
            <button
              onClick={() => setShowNewDM(true)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-opacity"
            >
              Send a message
            </button>
          </div>
        )}
      </section>

      {/* New DM Modal */}
      {showNewDM && (
        <NewDMModal
          onClose={() => setShowNewDM(false)}
          onStart={startDM}
        />
      )}
    </div>
  );
}
