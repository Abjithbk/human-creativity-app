export interface NavItems {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void
}

export interface StoryItems {
  isUser?: boolean;
  name: string;
  hasBorder?: boolean;
  isViewed?: boolean; 
  image?: string; 
  onClick?: () => void;
}

export interface Filters { label: string; active?: boolean; }

export interface TrendingUsers { name: string; tag: string; }

export interface CategoryItem {
  id: number;
  title: string;
  count: string;
  gradient: string;
}