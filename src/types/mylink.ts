export interface ProfileData {
  uid?: string;
  email?: string;
  handle: string;
  display_name: string;
  badge?: string;
  bio: string;
  avatar_url: string;
  socials?: {
    github?: string;
    email?: string;
    instagram?: string;
  };
}

export interface UserProfileDoc {
  uid: string;
  email: string;
  display_name: string;
  handle: string;
  badge?: string;
  bio: string;
  avatar_url: string;
  socials?: {
    github?: string;
    email?: string;
    instagram?: string;
  };
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
}


export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: string; // emoji e.g. "💻", "📚", "☕", "🐙", "📝", or icon name
  badge?: string; // e.g. "Featured", "Study", "Active", "Coffee Chat"
  is_active: boolean;
  sort_order: number;
  click_count?: number;
  clickCount?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CheerMessage {
  id: string;
  author: string;
  content: string;
  time: string;
}

export interface MyLinkData {
  profile: ProfileData;
  links: LinkItem[];
  cheer_count?: number;
  cheers?: CheerMessage[];
}
