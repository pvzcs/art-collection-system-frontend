// Domain model types

export interface User {
  id: number;
  email: string;
  nickname: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at?: string;
}

export interface Activity {
  id: number;
  name: string;
  deadline: string | null;
  description: string;
  max_uploads_per_user: number;
  created_at: string;
  updated_at: string;
}

export interface Artwork {
  id: number;
  activity_id: number;
  user_id: number;
  file_name: string;
  review_status: 'pending' | 'approved';
  created_at: string;
  updated_at?: string;
  activity?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    nickname: string;
    email?: string;
  };
}
