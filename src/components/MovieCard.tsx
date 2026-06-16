import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl bg-zinc-900 shadow-xl"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
      </div>

      <button className="absolute top-3 right-3 rounded-full bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-red-500">
        <Heart className="h-4 w-4 text-white" />
      </button>

      {movie.isPremium && (
        <div className="absolute top-3 left-3 rounded-md bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-black uppercase">
          Premium
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/10 text-[10px] font-bold text-red-500">
            {movie.category.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="line-clamp-1 text-sm font-semibold text-white">
              {movie.title}
            </h3>
            <p className="text-[10px] text-zinc-400">
              {movie.category}
            </p>
          </div>
        </div>
        
        <a
          href={movie.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full rounded-xl bg-zinc-800 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-red-600"
        >
          Watch Now
        </a>
      </div>
    </motion.div>
  );
};

export default MovieCard;
