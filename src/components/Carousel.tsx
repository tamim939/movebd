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
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 max-w-[60%]">
            <h2 className="text-xl font-bold text-white line-clamp-1">{MOCK_MOVIES[index].title}</h2>
            <p className="mt-1 text-xs text-zinc-300 line-clamp-1">{MOCK_MOVIES[index].description}</p>
            <button className="mt-3 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-900/40">
              Join Now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 right-6 flex gap-1.5">
        {MOCK_MOVIES.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-4 bg-red-600" : "w-1.5 bg-zinc-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
