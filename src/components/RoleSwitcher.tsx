import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { User, LogIn, LogOut, Shield, Building2, UserCheck, ChevronDown, Sparkles, Globe } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, currentRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'organization': return { label: 'جهة ناشرة', bg: 'bg-blue-100 text-blue-800' };
      case 'moderator': return { label: 'مشرف محتوى', bg: 'bg-amber-100 text-amber-800' };
      case 'admin': return { label: 'مدير المنصة', bg: 'bg-purple-100 text-purple-800' };
      case 'candidate': return { label: 'باحث عن فرصة', bg: 'bg-emerald-100 text-emerald-800' };
      default: return { label: 'زائر', bg: 'bg-slate-100 text-slate-700' };
    }
  };

  const roleInfo = getRoleBadge(currentRole);

  return (
    <>
      {currentUser ? (
        <div className="relative inline-block text-right">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              {currentUser.name ? currentUser.name[0] : 'U'}
            </div>
            <span className="max-w-[120px] truncate font-bold">{currentUser.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${roleInfo.bg}`}>
              {roleInfo.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 z-50 p-2 space-y-1.5 text-right animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="font-black text-xs text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${roleInfo.bg}`}>
                    {roleInfo.label}
                  </span>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <span>تسجيل الخروج</span>
                    <LogOut className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setAuthModalTab('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            onClick={() => {
              setAuthModalTab('register');
              setIsAuthModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-2xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-200 cursor-pointer"
          >
            <span>حساب جديد</span>
          </button>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
};
