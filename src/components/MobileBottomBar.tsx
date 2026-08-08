import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Compass, Bookmark, User, Briefcase } from 'lucide-react';

interface MobileBottomBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAiAssistant: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentView,
  onNavigate,
}) => {
  const { currentRole } = useAuth();

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'explore', label: 'استكشف', icon: Compass },
    { id: 'saved', label: 'المحفوظة', icon: Bookmark },
    { id: 'profile', label: 'حسابي', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-4 flex items-center justify-around shadow-xl">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={`${item.id}-${index}`}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 p-1.5 transition-all cursor-pointer min-w-[64px] ${
              isActive 
                ? 'text-emerald-600 font-black' 
                : 'text-slate-500 hover:text-slate-800 font-bold'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-50 scale-110' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-none">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

