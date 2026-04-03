export interface Sender {
  username: string;
  profile_pic: string | null;
}

export interface Message {
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

export interface Participant {
  user_id: number;
  role: string;
  is_active: boolean;
  user: Sender | null;
}

export interface Conversation {
  id: number;
  type: 'direct' | 'group';
  name: string | null;
  group_pic: string | null;
  updated_at: string | null;
  last_message: Message | null;
  unread_count: number;
  participants: Participant[];
}

export interface SearchUser {
  id: number;
  username: string;
  followers_count: number;
  is_following: boolean;
}

export interface NotificationItem {
  id: number;
  type: 'like' | 'follow' | 'system';
  user: string;
  message: string;
  time: string;
  unread: boolean;
}
export interface Post {
  id?: string | number;
  image?: string;
  title?: string;
  likes?: number;
  views?: number;
}
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  is_verified: boolean;
  bio?: string;
  profile_pic?: string;
  role: string;
  created_at: string;
  posts: any[];
  followers: any[];
  following: any[];
  creations: number;
  post: Post[];
}