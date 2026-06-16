import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { MOCK_MOVIES } from '../data';

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MOCK_MOVIES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-3xl mt-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          <img
            src={MOCK_MOVIES[index].thumbnail}
            alt={MOCK_MOVIES[index].title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4">
             <div className="h-6 w-12 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Bongo_BD_Logo.png" alt="logo" className="max-h-full brightness-0 invert" />
             </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-sm font-bold text-white mb-1">{MOCK_MOVIES[index].title}</h2>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold text-white uppercase tracking-tighter opacity-90">Coming Soon</span>
               <button className="rounded-lg bg-red-600 px-4 py-1.5 text-[10px] font-black text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-900/40 uppercase">
                Join Now
               </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {MOCK_MOVIES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-red-600" : "w-1.5 bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
