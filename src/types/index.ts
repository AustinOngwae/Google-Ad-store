export interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  created_at: string;
}

export interface UserAdStatus {
    user_id: string;
    ad_id: string;
    is_saved: boolean;
    is_blocked: boolean;
}

export type AdWithStatus = Ad & {
    is_saved?: boolean;
    is_blocked?: boolean;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  role?: string;
}