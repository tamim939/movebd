import React from 'react';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import CategoryBar from './CategoryBar';
import Carousel from './Carousel';
import MovieCard from './MovieCard';
import { Category } from '../types';
import { MOCK_MOVIES } from '../data';

export default function HomeView({ user, favorites, onToggleFavorite }: { user: any, favorites: string[], onToggleFavorite: (id: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredMovies = activeCategory === 'All' 
    ? MOCK_MOVIES 
    : MOCK_MOVIES.filter(m => m.category === activeCategory);

  return (
    <div className="pb-32 overflow-y-auto bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-black text-slate-900 flex items-center">
            Moviee <span className="ml-1 rounded-md bg-red-600 px-1.5 py-0.5 font-bold text-sm text-white">Link</span>
          </h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/50 p-1 pr-3 shadow-sm">
             <div className="relative">
               {user?.photo_url ? (
                 <img src={user.photo_url} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm" referrerPolicy="no-referrer" />
               ) : (
                 <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-orange-400 to-red-600 text-[10px] font-bold text-white shadow-sm">
                   {user?.first_name?.charAt(0) || 'T'}
                 </div>
               )}
               <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black italic tracking-tighter text-slate-800 leading-none">
                 ⟨ {user?.first_name || 'TRADER TAMI...'}
               </span>
               {user?.username && <span className="text-[8px] font-medium text-slate-400 leading-none">@{user.username}</span>}
             </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <CategoryBar activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* Banner */}
      <div className="px-4">
        <Carousel />
      </div>

      {/* Movie List */}
      <div className="mt-4 px-4 bg-white">
        <div className="grid grid-cols-1 gap-8">
          {filteredMovies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              isFavorited={favorites.includes(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
