/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Splash from './components/Splash';
import HomeView from './components/HomeView';
import AdminPanel from './components/AdminPanel';
import BottomNav, { TabId } from './components/BottomNav';
import { getTelegramUser, expandTelegramWebApp } from './lib/telegram';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize Telegram
    expandTelegramWebApp();
    const tgUser = getTelegramUser();
    if (tgUser) {
      setUser(tgUser);
      console.log('Telegram User:', tgUser);
      // Hardcoded admin check for demo or check against a list later
      // For now, let's treat everyone as admin in preview if no real user data
      if (!tgUser.id || tgUser.username === 'admin' || tgUser.id === 123456789) { 
        setIsAdmin(true);
      }
    } else {
      // Preview mode development fallback
      setIsAdmin(true);
    }
  }, []);

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
          className="relative mx-auto max-w-md pb-24"
        >
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'search' && (
            isAdmin ? <AdminPanel /> : (
              <div className="flex h-[80vh] items-center justify-center text-zinc-500">
                Search coming soon...
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
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
              {user?.photo_url ? (
                <img src={user.photo_url} alt="Profile" className="h-24 w-24 rounded-full border-4 border-red-600 shadow-xl shadow-red-900/20" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900 text-3xl font-bold text-red-500 border-4 border-zinc-800">
                  {user?.first_name?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{user?.first_name || 'Anonymous'} {user?.last_name || ''}</h2>
                <p className="text-zinc-500">@{user?.username || 'no_username'}</p>
              </div>
              <div className="rounded-2xl bg-zinc-900 px-6 py-4 border border-white/5">
                <p className="text-xs text-zinc-400">Subscription Status</p>
                <p className="mt-1 text-lg font-bold text-red-500 uppercase">Not Active</p>
                <button className="mt-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-2.5 text-sm font-bold shadow-lg shadow-red-900/20">
                  Subscribe Now
                </button>
              </div>
            </div>
          )}

          <BottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userPhoto={user?.photo_url}
          />
        </motion.div>
      )}
    </div>
  );
}
