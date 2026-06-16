import { Movie } from './types';

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Karuppu (2026) Movie',
    description: 'Upcoming blockbuster action thriller.',
    thumbnail: 'https://picsum.photos/seed/movie1/800/600',
    link: 'https://t.me/example',
    category: 'Movie',
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Dragon Glimpse',
    description: 'A dark fantasy adventure.',
    thumbnail: 'https://picsum.photos/seed/movie2/800/600',
    link: 'https://t.me/example',
    category: 'Movie',
    isPremium: true,
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'CID Episode 1200',
    description: 'Daya breaks the door once again!',
    thumbnail: 'https://picsum.photos/seed/cid/800/600',
    link: 'https://t.me/example',
    category: 'CID',
    isPremium: false,
    createdAt: new Date()
  }
];
