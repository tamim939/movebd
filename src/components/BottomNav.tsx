import { Home, Search, Calendar, Heart, User } from 'lucide-react';
import { motion } from 'motion/react';

export type TabId = 'home' | 'search' | 'upcoming' | 'favorite' | 'profile';

interface BottomNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  userPhoto?: string;
}

export default function BottomNav({ activeTab, setActiveTab, userPhoto }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'upcoming', icon: Calendar, label: 'Upcoming' },
    { id: 'favorite', icon: Heart, label: 'Favorite' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 overflow-hidden rounded-[28px] border border-slate-100 bg-white/95 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className="relative flex flex-col items-center gap-1 px-4 py-2 transition-all active:scale-90"
            >
              <div className="relative">
                {tab.id === 'profile' && userPhoto ? (
                  <img src={userPhoto} alt="User" className={`h-6 w-6 rounded-full border-2 transition-all ${isActive ? 'border-red-600 scale-110' : 'border-slate-200'}`} referrerPolicy="no-referrer" />
                ) : (
                  <Icon className={`h-5 w-5 transition-all ${isActive ? 'text-red-500 scale-110' : 'text-slate-400'}`} />
                )}
              </div>
              
              <span className={`text-[9px] font-bold transition-colors ${isActive ? 'text-red-500' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-1 h-1 w-4 rounded-full bg-red-600"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
