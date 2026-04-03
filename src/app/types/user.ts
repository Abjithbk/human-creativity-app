export interface FollowUser {
  id: number;
  username: string;
  followers_count: number;
  is_following: boolean;
}

export type Tab = 'Followers' | 'Following' | 'Search';