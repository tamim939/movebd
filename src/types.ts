export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
  category: string;
  isPremium: boolean;
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

export type Category = 'All' | 'Movie' | 'CID' | 'Bachelor Point' | 'Series' | 'Others';

export const CATEGORIES: Category[] = ['All', 'Movie', 'CID', 'Bachelor Point', 'Series', 'Others'];
