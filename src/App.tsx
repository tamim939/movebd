/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Splash from './components/Splash';
import HomeView from './components/HomeView';
import AdminPanel from './components/AdminPanel';
import ProfileView from './components/ProfileView';
import AdminLogin from './components/AdminLogin';
import BottomNav, { TabId } from './components/BottomNav';
import { getTelegramUser, expandTelegramWebApp } from './lib/telegram';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { MOCK_MOVIES } from './data';
import MovieCard from './components/MovieCard';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    // Load local favorites if any
    const savedFavorites = localStorage.getItem('movie_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
    
    // Initialize Telegram
    expandTelegramWebApp();
    const tgUser = getTelegramUser();
    if (tgUser) {
      setUser(tgUser);
      console.log('Telegram User:', tgUser);
    }

    // Monitor Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleFavorite = (movieId: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId];
      
      localStorage.setItem('movie_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setActiveTab('search'); // Go to admin panel
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    setActiveTab('home');
  };

  const isSpecialUser = user?.username === 'TRADER_TAMIM_3' || !user?.id; // Allow in preview for dev

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-600/30">
      <AnimatePresence>
        {showSplash && (
          <Splash onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mx-auto max-w-md bg-white min-h-screen"
        >
          {showAdminLogin ? (
            <AdminLogin 
              onSuccess={handleAdminSuccess} 
              onCancel={() => setShowAdminLogin(false)} 
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView 
                  user={user} 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              )}
              {activeTab === 'search' && (
                isAdmin ? <AdminPanel /> : (
                  <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center px-6">
                    <div className="rounded-full bg-zinc-900 p-6">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                         🔍
                      </motion.div>
                    </div>
                    <h2 className="text-xl font-bold">Search coming soon</h2>
                    <p className="text-sm text-zinc-500">We are working on bringing the best search experience for you.</p>
                  </div>
                )
              )}
              {activeTab === 'upcoming' && (
                <div className="flex h-[80vh] items-center justify-center text-zinc-500">
                  Upcoming movies coming soon...
                </div>
              )}
              {activeTab === 'favorite' && (
                <div className="pb-32 overflow-y-auto px-4 pt-8">
                  <h2 className="text-2xl font-black text-slate-800 mb-6">Favorites ❤️</h2>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                      {MOCK_MOVIES.filter(m => favorites.includes(m.id)).map(movie => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie} 
                          isFavorited={true}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-50">
                       <div className="text-6xl">❤️</div>
                       <p className="font-bold text-slate-400 uppercase tracking-tighter">Your list is empty</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'profile' && (
                <ProfileView 
                  user={user} 
                  onGoHome={() => setActiveTab('home')}
                  onLogout={handleLogout}
                  isAdmin={isAdmin}
                  onTriggerAdminLogin={isSpecialUser ? () => setShowAdminLogin(true) : undefined}
                />
              )}

              <BottomNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userPhoto={user?.photo_url}
              />
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
