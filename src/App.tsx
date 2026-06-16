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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
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
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600/30">
      <AnimatePresence>
        {showSplash && (
          <Splash onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mx-auto max-w-md"
        >
          {showAdminLogin ? (
            <AdminLogin 
              onSuccess={handleAdminSuccess} 
              onCancel={() => setShowAdminLogin(false)} 
            />
          ) : (
            <>
              {activeTab === 'home' && <HomeView user={user} />}
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
                <div className="flex h-[80vh] items-center justify-center text-zinc-500">
                  Your favorites will appear here.
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
