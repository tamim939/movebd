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
    <div className="fixed bottom-6 left-4 right-4 z-40 overflow-hidden rounded-3xl bg-zinc-900/80 p-2 backdrop-blur-2xl border border-white/5 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className="relative flex flex-col items-center gap-1 p-2"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute -top-1 h-1 w-8 rounded-full bg-red-600"
                />
              )}
              
              <div className="relative">
                {tab.id === 'profile' && userPhoto ? (
                  <img src={userPhoto} alt="User" className={`h-6 w-6 rounded-full border-2 transition-all ${isActive ? 'border-red-600 scale-110' : 'border-zinc-700'}`} />
                ) : (
                  <Icon className={`h-6 w-6 transition-all ${isActive ? 'text-red-500 scale-110' : 'text-zinc-500'}`} />
                )}
              </div>
              
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                {isActive ? tab.label : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
