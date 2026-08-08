import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Settings, 
  Compass, 
  Bookmark, 
  FileText, 
  PlusCircle, 
  LayoutDashboard
} from 'lucide-react';

interface RoleWorkspaceBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const RoleWorkspaceBar: React.FC<RoleWorkspaceBarProps> = ({ currentView, onNavigate }) => {
  const { currentRole } = useAuth();

  if (currentRole === 'guest') {
    return null;
  }

  // Only render prominent role bar when in a workspace/dashboard page, not cluttering the home page
  if (currentRole === 'candidate') {
    return null; // Candidate options are already cleanly present in Navbar and MobileBottomBar!
  }

  const renderOrganizationBar = () => {
    const tabs = [
      { id: 'org_dashboard', label: 'لوحة إدارة المنظمة', icon: LayoutDashboard },
      { id: 'post_opportunity', label: 'إضافة فرصة جديد +', icon: PlusCircle },
      { id: 'home', label: 'معاينة الواجهة الرئيسية', icon: Compass },
    ];

    return (
      <div className="bg-emerald-900 text-white border-b border-emerald-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Building2 className="w-4 h-4 text-emerald-300" />
            <span>حساب مؤسسة ناشرة</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 font-black' 
                      : 'text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAdminBar = () => {
    const tabs = [
      { id: 'admin', label: 'لوحة التحكم العامة', icon: Settings },
      { id: 'moderation', label: 'الإشراف والبلاغات', icon: ShieldCheck },
      { id: 'home', label: 'معاينة المنصة', icon: Compass },
    ];

    return (
      <div className="bg-slate-900 text-white border-b border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Settings className="w-4 h-4 text-amber-400" />
            <span>وضع الإدارة العامة</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-600 text-white font-black' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (currentRole === 'organization') return renderOrganizationBar();
  if (currentRole === 'admin' || currentRole === 'moderator') return renderAdminBar();

  return null;
};

