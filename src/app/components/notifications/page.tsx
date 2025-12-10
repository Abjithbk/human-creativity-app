import React, { useState } from 'react';
import { Heart, UserPlus, ShieldCheck } from 'lucide-react';

interface NotificationItem {
  id: number;
  type: 'like' | 'follow' | 'system';
  user: string;
  message: string;
  time: string;
  unread: boolean;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    type: 'like',
    user: 'anna_art',
    message: 'liked your oil painting.',
    time: '2m ago',
    unread: true,
  },
  {
    id: 2,
    type: 'follow',
    user: 'design_daily',
    message: 'started following you.',
    time: '1h ago',
    unread: true,
  },
  {
    id: 3,
    type: 'system',
    user: 'Canvas Team',
    message: 'Your "Neon City" post was awarded the Human Verified Badge! 🛡️',
    time: '5h ago',
    unread: false,
  },
];

export default function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>(notifications);

  const handleMarkAllRead = () => {
    setItems((prevItems) => 
      prevItems.map((item) => ({ ...item, unread: false }))
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-zinc-900 dark:text-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Notifications</h2>
        <button onClick={handleMarkAllRead} className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
          Mark all read
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`
              flex items-center gap-4 p-5 rounded-2xl transition-all duration-200
              ${item.unread 
                ? 'bg-zinc-50 dark:bg-zinc-900/60 border border-transparent' 
                : 'bg-transparent border border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/30'}
            `}>
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center shrink-0
              ${item.type === 'like' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : ''}
              ${item.type === 'follow' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : ''}
              ${item.type === 'system' ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-white shadow-md shadow-blue-500/20' : ''}
            `}>
              {item.type === 'like' && <Heart size={20} fill="currentColor" />}
              {item.type === 'follow' && <UserPlus size={20} />}
              {item.type === 'system' && <ShieldCheck size={20} />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                <span className="font-bold text-zinc-900 dark:text-white mr-1">
                  {item.user}
                </span>
                {item.message}
              </p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">{item.time}</p>
            </div>
            {item.unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}