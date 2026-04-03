export interface PostCardProps {
  post: any;
  currentUserId: number | null;
  onDeletePost: (id: number) => void;
}

export type Tab = "Creations" | "About";