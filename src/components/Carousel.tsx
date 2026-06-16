import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Movie } from '../types';

export default function Carousel({ movies, theme, t }: { movies: Movie[], theme?: string, t: any }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) return <div className={`h-40 w-full rounded-3xl flex items-center justify-center text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'bg-zinc-900 text-zinc-700' : 'bg-slate-100 text-slate-400'}`}>No Featured Content</div>;

  return (
    <div className="relative w-full mt-2">
      <div className="relative h-44 w-full overflow-hidden px-4">
        <motion.div 
          animate={{ x: `-${index * 85}%` }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="flex gap-4 h-full"
        >
          {movies.map((movie, i) => (
            <motion.div
              key={movie.id}
              className={`relative h-full min-w-[85%] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-black/5 transition-colors duration-300 ${theme === 'dark' ? 'shadow-black/50' : 'shadow-slate-200'}`}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4">
                 <h2 className="text-sm font-black text-white mb-1 line-clamp-1">{movie.title}</h2>
                 <div className="flex gap-2">
                   <span className="text-[9px] font-black text-white px-2 py-1 bg-orange-600 rounded-lg uppercase">
                     {t.comingSoon}
                   </span>
                 </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pagination Dots like screenshot */}
      <div className="mt-3 flex justify-center gap-1.5">
        {movies.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-orange-600" : "w-1.5 bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
