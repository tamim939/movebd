export interface DownloadLink {
  label: string;
  url: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  isPremium: boolean;
  adLink: string;
  botLink?: string;
  downloadLinks: DownloadLink[];
  createdAt: any;
}

export interface UserProfile {
  id: string; // telegramId
  username?: string;
  firstName: string;
  photoUrl?: string;
  isSubscribed: boolean;
  subscriptionExpiresAt?: any;
  role: 'user' | 'admin';
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export type Category = string;

export const DEFAULT_CATEGORIES: Category[] = ['All', 'Movie', 'CID', 'Bachelor Point', 'Series', 'Others'];
