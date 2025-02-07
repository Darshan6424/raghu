
export interface DamageReport {
  id: string;
  location: string;
  description: string;
  image_url: string | null;
  created_at: string;
  verified: boolean;
  latitude: number | null;
  longitude: number | null;
  has_casualties: boolean;
  view_count: number;
  reporter_id: string | null;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  image_url: string | null;
  likes: number | null;
  user_likes: string[] | null;
  profiles: {
    username: string | null;
  } | null;
}
