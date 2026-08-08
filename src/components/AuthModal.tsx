import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, YemenGovernorate } from '../types';
import { GOVERNORATES_LIST } from '../data/categories';
import { 
  X, 
  UserCheck, 
  UserPlus, 
  LogIn, 
  User, 
  Mail, 
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { currentUser, login, registerAccount, logout } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('candidate');
  const [regGov, setRegGov] = useState<YemenGovernorate>('أمانة العاصمة');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim()) {
      setLoginError('يرجى كتابة البريد الإلكتروني');
      return;
    }

    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message || 'فشل تسجيل الدخول، يرجى التأكد من البريد الإلكتروني');
      return;
    }

    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim()) {
      setRegError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const res = registerAccount({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      governorate: regGov
    });

    if (!res.success) {
      setRegError(res.message || 'حدث خطأ أثناء إنشاء الحساب');
      return;
    }

    setRegSuccessMsg('تم إنشاء الحساب وتسجيل الدخول بنجاح! مرحباً بك في منصة فرصتي.');
    setTimeout(() => {
      setRegSuccessMsg(null);
      onClose();
    }, 1000);
  };

  const handleContinueAsGuest = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-right">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">تسجيل الدخول / إنشاء حساب</h3>
              <p className="text-[11px] font-bold text-slate-500">منصة فرصتي للوظائف والفرص في اليمن</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 p-2 gap-1 bg-slate-100/50">
          <button
            onClick={() => { setTab('login'); setLoginError(null); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'login' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            onClick={() => { setTab('register'); setRegError(null); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>حساب جديد +</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {/* LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 font-bold text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 font-bold text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </button>

              <div className="relative py-2 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative bg-white px-3 text-[11px] text-slate-400 font-bold">أو</span>
              </div>

              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>الاستمرار كزائر (Guest)</span>
              </button>
            </form>
          )}

          {/* REGISTER TAB */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{regSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل / اسم المنظمة *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد الرؤوف العبسي"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحساب *</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:border-emerald-500 outline-none"
                  >
                    <option value="candidate">باحث عن فرص (شخصي)</option>
                    <option value="organization">جهة ناشرة (شركة/مؤسسة)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة *</label>
                  <select
                    value={regGov}
                    onChange={(e) => setRegGov(e.target.value as YemenGovernorate)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:border-emerald-500 outline-none"
                  >
                    {GOVERNORATES_LIST.map(g => (
                      <option key={g.name} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>إنشاء الحساب والتسجيل 🚀</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 underline cursor-pointer"
                >
                  أو تصفح المنصة كزائر فقط
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
