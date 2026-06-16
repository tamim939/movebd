import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, Timer, ExternalLink, Download, AlertTriangle, Film } from 'lucide-react';
import { Movie } from '../types';

interface UnlockModalProps {
  movie: Movie;
  onClose: () => void;
  t: any;
  theme?: string;
}

export default function UnlockModal({ movie, onClose, t, theme }: UnlockModalProps) {
  const [step, setStep] = useState<'intro' | 'timer'>('intro');
  const [timeLeft, setTimeLeft] = useState(10);
  const [unlocked, setUnlocked] = useState(false);
  const [adOpened, setAdOpened] = useState(false);

  useEffect(() => {
    let timer: any;
    if (step === 'timer' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setUnlocked(true);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleOpenAd = () => {
    window.open(movie.adLink, '_blank');
    setAdOpened(true);
    setStep('timer');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`relative w-full max-w-sm rounded-[40px] p-8 shadow-2xl ring-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 ring-white/10' : 'bg-white ring-black/5'}`}
      >
        <button 
          onClick={onClose}
          className={`absolute right-6 top-6 rounded-full p-2 transition-colors ${theme === 'dark' ? 'bg-zinc-900 text-zinc-500 hover:text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-900'}`}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <div className={`absolute -inset-4 animate-pulse rounded-full blur-xl ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-500/20'}`} />
            <div className={`relative rounded-3xl p-6 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-red-50'}`}>
               <Lock className={`h-12 w-12 ${unlocked ? 'text-green-500' : theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
            </div>
          </div>

          <h2 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            {unlocked ? t.unlocked : t.unlockTitle}
          </h2>
          <p className={`mt-2 text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
            {t.language === 'bn' ? 'মুভি ব্রাউজ' : 'Video Unlock Platform'}
          </p>

          {!unlocked ? (
            <div className="mt-8 w-full space-y-6">
              <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 border transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <Timer className="h-5 w-5 text-red-500" />
                <p className="text-[11px] font-bold text-left leading-snug">
                  <span className="text-red-500">{t.timerMsg}</span>
                  <br />
                  <span className={theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}>{t.timerMsgSub}</span>
                </p>
              </div>

              <div className={`text-[10px] leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                {t.timerNote}
              </div>

              {step === 'timer' && (
                <div className="flex flex-col items-center gap-2">
                   <div className="relative h-16 w-16">
                      <svg className="h-16 w-16 rotate-[-90deg]">
                        <circle
                          cx="32"
                          cy="32"
                          r="30"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="4"
                          className={theme === 'dark' ? 'text-zinc-800' : 'text-slate-100'}
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="30"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray={188.4}
                          strokeDashoffset={188.4 * (timeLeft / 10)}
                          className="text-red-600 transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {timeLeft}
                      </span>
                   </div>
                   <p className="flex items-center gap-1.5 text-[10px] font-black text-yellow-500 uppercase">
                      <AlertTriangle className="h-3 w-3" /> {t.timerWarn}
                   </p>
                </div>
              )}

              <button
                disabled={step === 'timer' && timeLeft > 0}
                onClick={handleOpenAd}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-red-400 py-5 text-xs font-black text-white shadow-xl shadow-red-900/40 active:scale-95 transition-all"
              >
                <Film className="h-5 w-5" />
                {step === 'intro' ? t.adBtn : timeLeft > 0 ? t.waitLabel : t.tryAgain}
              </button>
            </div>
          ) : (
            <div className="mt-8 w-full space-y-4 text-left">
              <div className={`rounded-2xl p-4 border mb-6 ${theme === 'dark' ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                <p className={`text-xs font-bold tracking-tight leading-relaxed ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                  {t.congrats}
                </p>
              </div>
              
              {movie.downloadLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => window.open(link.url, '_blank')}
                  className={`flex w-full items-center justify-between rounded-2xl px-6 py-4 border transition-all group active:scale-95 ${theme === 'dark' ? 'bg-zinc-900 border-white/5 hover:bg-zinc-800' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-red-500" />
                    <span className={`text-xs font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{link.label}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 group-hover:text-red-500 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
