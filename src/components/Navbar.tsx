import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RoleSwitcher } from './RoleSwitcher';
import { LanguageToggle } from './LanguageToggle';
import { 
  Briefcase, 
  Sparkles, 
  Bell, 
  User, 
  Menu,
  X,
  Compass,
  Bookmark,
  Building2,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAiAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAiAssistant }) => {
  const { currentUser, currentRole, unreadNotificationCount, notifications, readAllNotifications } = useAuth();
  const { language } = useLanguage();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'explore', labelAr: 'استكشف الفرص', labelEn: 'Explore' },
    { id: 'categories', labelAr: 'التصنيفات', labelEn: 'Categories' },
    { id: 'organizations', labelAr: 'الجهات الناشرة', labelEn: 'Organizations' },
    { id: 'about', labelAr: 'من نحن', labelEn: 'About Us' },
    { id: 'contact', labelAr: 'تواصل معنا', labelEn: 'Contact Us' },
  ];

  if (currentRole === 'candidate') {
    mainNavItems.push(
      { id: 'saved', labelAr: 'المحفوظة', labelEn: 'Saved' },
      { id: 'tracker', labelAr: 'متابعة الطلبات', labelEn: 'Tracker' },
      { id: 'profile', labelAr: 'حسابي', labelEn: 'Profile' }
    );
  } else if (currentRole === 'organization') {
    mainNavItems.push(
      { id: 'org_dashboard', labelAr: 'لوحة المنظمة', labelEn: 'Dashboard' },
      { id: 'post_opportunity', labelAr: 'أضف فرصة +', labelEn: 'Post Opportunity' }
    );
  } else if (currentRole === 'moderator' || currentRole === 'admin') {
    mainNavItems.push(
      { id: currentRole === 'admin' ? 'admin' : 'moderation', labelAr: 'لوحة الإدارة', labelEn: 'Admin' }
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
              فرصتي | Forsati
            </span>
            <span className="text-[10px] text-slate-500 font-bold hidden sm:block">
              منصة الفرص الأولى في اليمن 🇾🇪
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNavItems.map((item, index) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={`${item.id}-${index}`}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {language === 'ar' ? item.labelAr : item.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Header Left Actions: Notifications + Menu / Profile */}
        <div className="flex items-center gap-2">
          
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors relative cursor-pointer"
              title="التنبيهات"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-2xs">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-200 z-50 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-800">الإشعارات</span>
                    <button onClick={readAllNotifications} className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer">
                      تعليم الكل كقراءة
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4 font-bold">لا توجد إشعارات جديدة</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-2.5 rounded-xl text-xs space-y-0.5 border ${n.isRead ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50/70 border-emerald-200'}`}>
                          <p className="font-bold text-slate-900">{n.title}</p>
                          <p className="text-slate-600 text-[11px] leading-tight font-medium">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile / Account Control for Desktop */}
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            title="القائمة"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay Dropdown */}
      {isMobileMenuOpen && (
        <div className="bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {mainNavItems.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-right px-4 py-3 rounded-xl text-xs font-black cursor-pointer ${
                  currentView === item.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {language === 'ar' ? item.labelAr : item.labelEn}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-2">
              <span>نوع الحساب / الوضع:</span>
              <RoleSwitcher />
            </div>
            <div className="flex justify-between items-center px-2 pt-1">
              <span className="text-xs font-bold text-slate-600">اللغة:</span>
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

