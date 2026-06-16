import { Bell } from 'lucide-react';
import { useState } from 'react';
import CategoryBar from './CategoryBar';
import Carousel from './Carousel';
import MovieCard from './MovieCard';
import { Category } from '../types';
import { MOCK_MOVIES } from '../data';

export default function HomeView() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredMovies = activeCategory === 'All' 
    ? MOCK_MOVIES 
    : MOCK_MOVIES.filter(m => m.category === activeCategory);

  return (
    <div className="pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            Moviee <span className="rounded bg-red-600 px-1.5 py-0.5 not-italic tracking-normal text-sm align-middle">Link</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5 border border-white/5">
             <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-orange-400 to-red-600" />
             <span className="text-[10px] font-bold text-white uppercase italic">Trader Tami...</span>
          </div>
          <button className="relative rounded-full bg-zinc-900 p-2 border border-white/5">
            <Bell className="h-5 w-5 text-zinc-400" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 border-2 border-zinc-950" />
          </button>
        </div>
      </header>

      {/* Categories */}
      <CategoryBar activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* Banner */}
      <div className="px-4">
        <Carousel />
      </div>

      {/* Movie List */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-lg font-bold text-white">Recommended for you</h2>
          <button className="text-xs font-semibold text-red-500">See all</button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
