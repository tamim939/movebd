import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { Movie, Category, CATEGORIES } from '../types';
import { MOCK_MOVIES } from '../data';

export default function AdminPanel() {
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
  const [isAdding, setIsAdding] = useState(false);
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({
    category: 'Movie',
    isPremium: false
  });

  const handleAdd = () => {
    if (newMovie.title && newMovie.link && newMovie.thumbnail) {
      const movie: Movie = {
        ...newMovie as Movie,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date()
      };
      setMovies([movie, ...movies]);
      setIsAdding(false);
      setNewMovie({ category: 'Movie', isPremium: false });
    }
  };

  const handleDelete = (id: string) => {
    setMovies(movies.filter(m => m.id !== id));
  };

  return (
    <div className="p-6 pb-32">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold shadow-lg shadow-red-900/20"
        >
          {isAdding ? 'Cancel' : <><Plus className="h-4 w-4" /> Add Movie</>}
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 space-y-4 rounded-3xl bg-zinc-900 p-6 border border-white/5 shadow-xl">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Title</label>
            <input 
              type="text" 
              placeholder="Movie Title"
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 test-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={newMovie.title || ''}
              onChange={e => setNewMovie({...newMovie, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Thumbnail URL</label>
            <input 
              type="text" 
              placeholder="https://..."
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 test-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={newMovie.thumbnail || ''}
              onChange={e => setNewMovie({...newMovie, thumbnail: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Telegram Link</label>
            <input 
              type="text" 
              placeholder="https://t.me/..."
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 test-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={newMovie.link || ''}
              onChange={e => setNewMovie({...newMovie, link: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 mb-1">Category</label>
              <select 
                className="w-full rounded-xl bg-zinc-800 px-4 py-2 test-sm text-white focus:outline-none"
                value={newMovie.category}
                onChange={e => setNewMovie({...newMovie, category: e.target.value as Category})}
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input 
                type="checkbox" 
                id="isPremium"
                checked={newMovie.isPremium}
                onChange={e => setNewMovie({...newMovie, isPremium: e.target.checked})}
                className="h-4 w-4 rounded bg-zinc-800 text-red-600"
              />
              <label htmlFor="isPremium" className="text-xs font-medium text-white">Premium Content</label>
            </div>
          </div>
          <button 
            onClick={handleAdd}
            className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold shadow-lg shadow-red-900/30"
          >
            Save Content
          </button>
        </div>
      )}

      <div className="space-y-4">
        {movies.map(movie => (
          <div key={movie.id} className="flex items-center gap-4 rounded-2xl bg-zinc-900 p-3 border border-white/5">
            <img src={movie.thumbnail} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1 overflow-hidden">
              <h3 className="line-clamp-1 font-bold text-white">{movie.title}</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-black">{movie.category}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-zinc-800 p-2 text-zinc-400 hover:text-white hover:bg-zinc-700">
                <Edit2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDelete(movie.id)}
                className="rounded-full bg-red-600/10 p-2 text-red-500 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
