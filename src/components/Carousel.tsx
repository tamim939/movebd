import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Movie } from '../types';

export default function Carousel({ movies, theme, t }: { movies: Movie[], theme?: string, t: any }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) return <div className={`h-48 w-full rounded-3xl flex items-center justify-center text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'bg-zinc-900 text-zinc-700' : 'bg-slate-100 text-slate-400'}`}>No Featured Content</div>;

  const currentMovie = movies[index];

  return (
    <div className={`relative h-52 w-full overflow-hidden rounded-[32px] mt-2 shadow-2xl transition-colors duration-300 ring-1 ring-black/5 ${theme === 'dark' ? 'shadow-black/50' : 'shadow-slate-200'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-full w-full"
        >
          <img
            src={currentMovie.thumbnail}
            alt={currentMovie.title}
            className="h-full w-full object-cover transition-transform duration-10000 ease-linear"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4">
             <div className="h-7 w-14 flex items-center justify-center rounded-lg bg-black/20 backdrop-blur-md px-2 py-1 shadow-sm">
                <span className="text-[10px] font-black text-white italic tracking-tighter">MOVIEE <span className="text-red-500">L</span></span>
             </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-center gap-2 mb-1">
               <span className="rounded-full bg-red-600/90 px-3 py-1 text-[8px] font-black text-white uppercase tracking-wider shadow-lg shadow-red-900/20">{t.featured}</span>
               <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{currentMovie.category}</span>
            </div>
            <h2 className="text-base font-black text-white mb-2 leading-tight line-clamp-2">{currentMovie.title}</h2>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">{t.comingSoon}</span>
               <button className="rounded-xl bg-white px-5 py-2 text-[10px] font-black text-slate-900 hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-black/20 uppercase">
                 {t.watchNow}
               </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {movies.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-red-600" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
