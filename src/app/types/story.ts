export interface Story {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  created_at: string;
  owner_id: number;
  owner?: {
    username: string;
    profile_pic?: string; 
  };
}

export interface StoryViewerProps {
  stories: Story[];
  onClose: () => void;
  onGroupComplete: () => void; 
  currentUserId: number | null;
  onDeleteStory: (id: number) => void;
}