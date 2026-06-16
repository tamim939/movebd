import { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashProps {
  onFinish: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  useEffect(() => {
    // Safety exit in case motion events don't fire
    const timer = setTimeout(onFinish, 5000); 
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 3 }}
      onAnimationComplete={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute -inset-8 animate-pulse rounded-full bg-red-600/20 blur-3xl" />
        <img
          src="/src/assets/images/moviee_link_logo_1781599756129.jpg"
          alt="Moviee Link Logo"
          className="relative h-48 w-48 rounded-3xl object-cover shadow-2xl shadow-red-900/50"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h1 className="text-4xl font-bold tracking-[0.2em] text-white">
          MOVIEE <span className="text-red-500">LINK</span>
        </h1>
        <p className="mt-2 text-sm tracking-widest text-zinc-500">
          OFFICIAL · LIKON
        </p>
      </motion.div>

      {/* Loading Bar */}
      <div className="absolute bottom-20 left-1/2 w-64 -translate-x-1/2 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
        />
      </div>
    </motion.div>
  );
}
