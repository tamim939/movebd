import React from 'react';
import { 
  Crown, 
  Film, 
  Trophy, 
  GraduationCap, 
  Facebook, 
  Send, 
  MessageSquare, 
  Settings, 
  Moon, 
  Info, 
  ChevronRight, 
  Home,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: any;
  onGoHome: () => void;
  onLogout?: () => void;
  isAdmin?: boolean;
  onTriggerAdminLogin?: () => void;
}

export default function ProfileView({ user, onGoHome, onLogout, isAdmin, onTriggerAdminLogin }: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 pb-32 overflow-y-auto">
      {/* Header Profile */}
      <div className="relative bg-white pt-12 pb-6 px-6 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative">
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="Profile" 
                className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 text-3xl font-bold text-zinc-400 border-4 border-white shadow-lg">
                {user?.first_name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-md">
               <div className="rounded-full bg-slate-200 p-1">
                  <ChevronRight className="h-3 w-3 text-slate-500 rotate-90" />
               </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="flex items-center justify-center gap-1 text-xl font-bold text-slate-800">
               <span className="text-2xl font-black italic">⟨</span>
               {user?.first_name || 'TRADER TAMIM'} —✈︎ 
               <span className="text-pink-400">🌸</span>
            </h2>
            <p className="text-sm font-medium text-slate-400">@{user?.username || 'TRADER_TAMIM_3'}</p>
            <div className="mt-2 inline-block rounded-full bg-blue-50 px-4 py-1 text-[10px] font-bold text-blue-600 border border-blue-100">
              Moviee Link Member
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-3 rounded-[32px] bg-[#1a1c2c] p-6 text-white shadow-xl">
          <div className="flex flex-col items-center border-r border-white/10 px-2">
            <span className="text-2xl font-bold text-yellow-400">0</span>
            <div className="flex items-center gap-1 mt-1">
              <div className="h-4 w-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-yellow-400" />
              </div>
              <span className="text-[10px] text-zinc-400 font-bold">Coins</span>
            </div>
          </div>
          <div className="flex flex-col items-center border-r border-white/10 px-2">
            <span className="text-2xl font-bold text-yellow-400">0</span>
            <div className="flex items-center gap-1 mt-1">
              <div className="h-4 w-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
              </div>
              <span className="text-[10px] text-zinc-400 font-bold">Referrals</span>
            </div>
          </div>
          <div className="flex flex-col items-center px-2">
            <span className="text-lg font-bold">Normal</span>
            <div className="flex items-center gap-1 mt-1 text-zinc-400">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-[10px] font-bold">VIP Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 mt-6">
        <button className="flex h-16 items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 text-white shadow-lg transition-transform active:scale-95">
          <div className="rounded-xl bg-white/20 p-2">
            <Crown className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold leading-tight text-left">VIP Membership</span>
        </button>
        <button className="flex h-16 items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-4 text-white shadow-lg transition-transform active:scale-95">
          <div className="rounded-xl bg-white/20 p-2">
            <Film className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold leading-tight text-left">Movie Request</span>
        </button>
        <button className="flex h-16 items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-400 px-4 text-white shadow-lg transition-transform active:scale-95">
          <div className="rounded-xl bg-white/20 p-2">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold leading-tight text-left">Leaderboard</span>
        </button>
        <button className="flex h-16 items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 text-white shadow-lg transition-transform active:scale-95">
          <div className="rounded-xl bg-white/20 p-2">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold leading-tight text-left">Training</span>
        </button>
      </div>

      {/* Community Links */}
      <div className="mt-8 px-4">
        <div className="flex items-center gap-2 mb-4 text-slate-400">
           <div className="h-4 w-4 rounded-full border-2 border-slate-300 flex items-center justify-center">
             <div className="h-1 w-1 bg-slate-300 rounded-full" />
           </div>
           <span className="text-xs font-bold uppercase tracking-wider">Join My Community</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <LinkButton icon={<Facebook className="h-4 w-4" />} label="Facebo..." subLabel="আমাদের গ্রুপে ..." color="bg-blue-600" />
          <LinkButton icon={<Send className="h-4 w-4" />} label="Main Cha..." subLabel="অফিসিয়াল ..." color="bg-cyan-500" />
          <LinkButton icon={<Send className="h-4 w-4" />} label="Join Noti..." subLabel="মুভি রিকোয়ায়ে..." color="bg-blue-800" />
          <LinkButton icon={<Send className="h-4 w-4" />} label="Chat Gro..." subLabel="গ্রুপে চ্যাট ক..." color="bg-sky-500" />
          <LinkButton icon={<Send className="h-4 w-4" />} label="🔞 18+ C..." subLabel="শুধুমাত্র ১৮+ ..." color="bg-red-600" />
          <LinkButton icon={<Send className="h-4 w-4" />} label="🔞 Sax ..." subLabel="শুধুমাত্র ১৮+ ..." color="bg-red-500" />
          <div className="col-span-2">
            <LinkButton icon={<MessageSquare className="h-4 w-4" />} label="🔴 All C..." subLabel="সকল চ্যানেলে..." color="bg-cyan-600" fullWidth />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-8 px-4">
         <div className="flex items-center gap-2 mb-4 text-slate-400">
           <Settings className="h-4 w-4" />
           <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
        </div>

        <div className="rounded-3xl bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
               <div className="rounded-full bg-yellow-50 p-2 text-yellow-600">
                 <Moon className="h-5 w-5" />
               </div>
               <span className="text-sm font-semibold text-slate-800">Dark Mode</span>
            </div>
            <div className="relative h-7 w-14 rounded-full bg-yellow-400 p-1 flex items-center">
               <div className="h-5 w-5 rounded-full bg-white ml-auto shadow-sm" />
            </div>
          </div>

          <div className="h-px bg-slate-100 mx-4" />

          <button className="flex w-full items-center justify-between p-4 group">
            <div className="flex items-center gap-3">
               <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                 <Info className="h-5 w-5" />
               </div>
               <span className="text-sm font-semibold text-slate-800">About Us</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
          </button>
          
          <div className="h-px bg-slate-100 mx-4" />

          <div className="p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-tighter mb-2">
                 <div className="h-3 w-3 bg-blue-500 rounded-full" /> Language / ভাষা
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                 <div className="flex items-center gap-2">
                    <span className="text-lg">🇬🇧</span>
                    <span className="text-sm font-medium">English</span>
                 </div>
                 <ChevronRight className="h-4 w-4 rotate-90 text-slate-400" />
              </div>
          </div>

          {onTriggerAdminLogin && !isAdmin && (
            <>
              <div className="h-px bg-slate-100 mx-4" />
              <button 
                onClick={onTriggerAdminLogin}
                className="flex w-full items-center justify-between p-4 text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                   <div className="rounded-full bg-red-50 p-2">
                     <ShieldCheck className="h-5 w-5" />
                   </div>
                   <span className="text-sm font-semibold italic">Admin Internal Login</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 px-4">
         <button 
           onClick={onGoHome}
           className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-200/50 py-4 text-sm font-bold text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
         >
           <Home className="h-4 w-4" /> 🏠 Go Home
         </button>
         
         {isAdmin && (
           <button 
             onClick={onLogout}
             className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-100/50 py-4 text-sm font-bold text-red-600 hover:bg-red-100 active:scale-95 transition-all border border-red-100"
           >
             <LogOut className="h-4 w-4" /> Admin Logout
           </button>
         )}
      </div>
    </div>
  );
}

import { ShieldCheck } from 'lucide-react';

function LinkButton({ icon, label, subLabel, color, fullWidth }: { icon: any, label: string, subLabel: string, color: string, fullWidth?: boolean }) {
  return (
    <button className={`flex items-center gap-3 rounded-2xl ${color} p-2 text-white shadow-md active:scale-95 transition-transform ${fullWidth ? 'w-full' : ''}`}>
       <div className="rounded-xl bg-white/20 p-2 shrink-0">
          {icon}
       </div>
       <div className="flex flex-col items-start overflow-hidden">
          <span className="text-[11px] font-black leading-tight truncate w-full">{label}</span>
          <span className="text-[8px] font-medium opacity-70 truncate w-full">{subLabel}</span>
       </div>
    </button>
  );
}
