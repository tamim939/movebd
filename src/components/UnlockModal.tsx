import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, Timer, ExternalLink, Download, AlertTriangle, Film, CheckCircle2, ChevronLeft, Bot } from 'lucide-react';
import { Movie } from '../types';

interface UnlockModalProps {
  movie: Movie;
  onClose: () => void;
  t: any;
  theme?: string;
  user?: any;
}

export default function UnlockModal({ movie, onClose, t, theme, user }: UnlockModalProps) {
  const [step, setStep] = useState<'intro' | 'adbox' | 'success'>('intro');
  const [timeLeft, setTimeLeft] = useState(10);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    let timer: any;
    if (step === 'adbox' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'adbox') {
      setStep('success');
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleReturnToBot = async () => {
    const chatId = user?.id; 
    
    if (!chatId) {
       console.error("Missing chatId. User object:", user);
       alert("Telegram User ID not found. Please open this app inside Telegram through the Bot.");
       return;
    }

    setSendingMessage(true);
    try {
      console.log(`[API Call] /api/send-vbox | Chat ID: ${chatId} | Movie: ${movie.title}`);
      
      const response = await fetch('/api/send-vbox', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          chat_id: String(chatId),
          title: movie.title,
          links: movie.downloadLinks
        })
      });
      
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Failed to parse API response:", responseText);
        throw new Error("Server returned an invalid response. Please try again.");
      }
      
      if (!response.ok || !result.ok) {
        console.error("API Delivery failure:", result);
        throw new Error(result.error || "Bot could not deliver the message. Ensure you have started @movebd_bot.");
      }

      console.log("Bot delivery confirmed:", result);
      
      // Redirect to Bot
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      } else {
        // Fallback for browsers
        window.open('https://t.me/movebd_bot', '_blank');
        onClose();
      }

    } catch (e: any) {
      console.error("Bot delivery catch block error:", e);
      alert(`Oops! ${e.message}\n\nTechnical Details: Check the console logs if you are the developer.`);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
    >
      <AnimatePresence mode="wait">
        {step === 'adbox' ? (
          <motion.div 
            key="adbox"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex h-full w-full max-w-lg flex-col overflow-hidden rounded-[32px] ${theme === 'dark' ? 'bg-zinc-950 shadow-2xl shadow-black/50' : 'bg-white shadow-2xl'}`}
          >
             <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                   <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white">Ad</div>
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{timeLeft > 0 ? t.waitLabel : 'Finished'}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[11px] font-black text-white">
                      <Timer className="h-3 w-3" /> {timeLeft}s
                   </div>
                </div>
             </div>

             <div className="flex-1 bg-black relative">
                <iframe 
                  src={movie.adLink}
                  className="h-full w-full border-none"
                  title="Sponsored Content"
                />
             </div>

             <div className="p-4 bg-zinc-900 border-t border-white/5 text-center">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                   Do not close this window until the timer ends
                </p>
             </div>
          </motion.div>
        ) : step === 'success' ? (
          <motion.div 
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative w-full max-w-sm rounded-[44px] p-10 text-center shadow-3xl transition-colors duration-500 overflow-y-auto no-scrollbar max-h-[90vh] ${theme === 'dark' ? 'bg-zinc-950 border border-white/5 shadow-black' : 'bg-white shadow-2xl shadow-slate-200'}`}
          >
             <div className="mb-6 flex justify-center">
                <div className="relative">
                   <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
                   >
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                   </motion.div>
                </div>
             </div>

             <h2 className={`text-2xl font-black uppercase tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {t.success}
             </h2>

             <div className="mb-6 space-y-4">
                <div className={`flex items-center gap-2 rounded-2xl p-4 transition-colors ${theme === 'dark' ? 'bg-green-500/5' : 'bg-green-50'}`}>
                   <span className="text-xs font-bold text-green-500">✅ {t.sentToInbox}</span>
                </div>
                
                <div className="space-y-2 mt-4 text-left">
                  {movie.downloadLinks.map((link, idx) => (
                    <button
                      key={idx}
                      onClick={() => window.open(link.url, '_blank')}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 border transition-all active:scale-95 ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-red-500" />
                        <span className={`text-[10px] font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{link.label}</span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-zinc-500" />
                    </button>
                  ))}
                </div>

                <p className={`text-[10px] font-medium leading-relaxed px-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                   {t.returnMsg} 🎬
                </p>
             </div>

             <button 
               onClick={handleReturnToBot}
               disabled={sendingMessage}
               className="group flex w-full items-center justify-center gap-3 rounded-[24px] bg-[#00c853] py-4 text-sm font-black text-white shadow-xl shadow-green-500/30 active:scale-95 transition-all hover:bg-[#00e676]"
             >
                {sendingMessage ? (
                   <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span className="text-xl">🤖</span> {t.returnToBot}
                  </>
                )}
             </button>
          </motion.div>
        ) : (
          <motion.div
            key="intro"
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
                   <Lock className={`h-12 w-12 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
                </div>
              </div>

              <h2 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {t.unlockTitle}
              </h2>
              <p className={`mt-2 text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                {t.language === 'bn' ? 'মুভি ব্রাউজ' : 'Video Unlock Platform'}
              </p>

              <div className="mt-8 w-full space-y-6">
                <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 border transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <Timer className="h-5 w-5 text-red-500" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold leading-snug">
                       <span className="text-red-500">{t.timerMsg}</span>
                    </p>
                    <p className={`text-[10px] font-medium leading-snug ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                       {t.timerMsgSub}
                    </p>
                  </div>
                </div>

                <div className={`text-[10px] leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                  {t.timerNote}
                </div>

                <button
                  onClick={() => setStep('adbox')}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-red-400 py-5 text-xs font-black text-white shadow-xl shadow-red-900/40 active:scale-95 transition-all"
                >
                  <Film className="h-5 w-5" />
                  {t.adBtn}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
