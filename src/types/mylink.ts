export interface ProfileData {
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
