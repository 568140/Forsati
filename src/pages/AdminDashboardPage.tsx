import React, { useState, useEffect } from 'react';
import { Opportunity, Organization, VerificationRequest, OpportunityReport, YemenGovernorate, CategoryId } from '../types';
import { CATEGORIES as INITIAL_CATEGORIES, GOVERNORATES_LIST as INITIAL_GOVERNORATES } from '../data/categories';
import { EditOpportunityModal } from '../components/EditOpportunityModal';
import { useAuth } from '../context/AuthContext';
import { 
  getPlatformStats, 
  getOrganizations, 
  getVerificationRequests, 
  updateVerificationRequestStatus, 
  toggleOrganizationVerification, 
  getReports, 
  resolveReport, 
  updateReportStatus, 
  getUserAccounts, 
  toggleUserBlockStatus, 
  deleteUserAccount, 
  saveUserAccount, 
  getPlatformSettings, 
  savePlatformSettings, 
  deleteOpportunity, 
  toggleFeaturedOpportunity, 
  updateOpportunityStatus,
  getStoredCategories,
  saveStoredCategories,
  getStoredGovernorates,
  saveStoredGovernorates
} from '../services/storage';

import { 
  Settings, 
  Users, 
  Building2, 
  Briefcase, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  BarChart3, 
  Globe, 
  Search, 
  Filter, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Trash2, 
  Edit3, 
  Star, 
  AlertTriangle, 
  Bell, 
  FileText, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  Eye, 
  Megaphone,
  BadgeCheck,
  Save,
  MapPin,
  Shield,
  UserPlus,
  ArrowRight,
  EyeOff,
  PhoneCall
} from 'lucide-react';

interface AdminDashboardPageProps {
  opportunities: Opportunity[];
  onRefreshData: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  opportunities,
  onRefreshData
}) => {
  const { currentRole, currentUser, login } = useAuth();

  const isAdminAuthorized = currentUser?.email?.toLowerCase() === 'am1075022@gmail.com';

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'verifications' | 'opportunities' | 'reports' | 'categories' | 'settings'>('overview');

  // Stats & Data state
  const [stats, setStats] = useState(getPlatformStats());
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [reports, setReports] = useState<OpportunityReport[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(getPlatformSettings());

  // Filter & Search states for Users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [userGovernorateFilter, setUserGovernorateFilter] = useState<string>('all');

  // Filter & Search states for Opportunities
  const [oppSearch, setOppSearch] = useState('');
  const [oppStatusFilter, setOppStatusFilter] = useState<string>('all');
  const [oppCategoryFilter, setOppCategoryFilter] = useState<string>('all');

  // Modals & Form states
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'candidate', governorate: 'أمانة العاصمة' });

  // Categories & Governorates Settings
  const [categoryList, setCategoryList] = useState<any[]>(() => {
    const stored = getStoredCategories();
    return stored && stored.length > 0 ? stored : INITIAL_CATEGORIES.map(c => ({ ...c, isHidden: false }));
  });

  const [governorateList, setGovernorateList] = useState<any[]>(() => {
    const stored = getStoredGovernorates();
    return stored && stored.length > 0 ? stored : INITIAL_GOVERNORATES.map(g => ({ ...g, isActive: true }));
  });

  const [newCatNameAr, setNewCatNameAr] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [newGovName, setNewGovName] = useState('');

  // Sub-tab selection for Settings
  const [settingsSubTab, setSettingsSubTab] = useState<'about' | 'contact' | 'social' | 'general'>('about');

  // Form states for About Us
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [newFeatureIcon, setNewFeatureIcon] = useState('ShieldCheck');

  // Form states for Contact Channels
  const [newChanTitle, setNewChanTitle] = useState('');
  const [newChanValue, setNewChanValue] = useState('');
  const [newChanType, setNewChanType] = useState('phone');

  // Form states for Social Media
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialIcon, setNewSocialIcon] = useState('Facebook');

  // Toast Alert message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, [opportunities]);

  const loadAllData = () => {
    setStats(getPlatformStats());
    setOrganizations(getOrganizations());
    setVerifications(getVerificationRequests());
    setReports(getReports());
    setUsers(getUserAccounts());
    setSettings(getPlatformSettings());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // SECURITY CHECK: Protecting Admin Panel strictly for am1075022@gmail.com
  // -------------------------------------------------------------
  if (!isAdminAuthorized) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-red-200 dark:border-red-900/60 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center shadow-lg">
          <Lock className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800">
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>وصول محمِي ومحصور بقادة المنصة (Restricted Admin Access)</span>
          </div>

          <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
            واجهة إدارة المنصة محصورة للمدير المعتمد فقط
          </h1>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            عذراً، وفقاً لسياسة الأمان الصارمة الخاصة بالمنصة، لا يمكن الوصول إلى لوحة تحكم وإدارة المنصة إلا بعد تسجيل الدخول بالبريد الإلكتروني المعتمد الخاص بمدير النظام:
          </p>

          <div className="inline-block p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-mono font-bold text-sm">
            am1075022@gmail.com
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 text-xs text-right space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>كيفية تسجيل الدخول كمدير للنظام؟</span>
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
            يرجى تسجيل الدخول أو اختيار حساب المدير بريد <code className="bg-slate-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400">am1075022@gmail.com</code> من أعلى شريط الأدوات بالمنصة لتتمكن من الوصول لكافة أدوات الإدارة.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => login('am1075022@gmail.com')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-500"
          >
            <Unlock className="w-4 h-4" />
            <span>تسجيل الدخول كمدير المنصة (am1075022@gmail.com)</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // HANDLERS FOR USERS, OPPS, REPORTS, CATEGORIES & GOVERNORATES
  // -------------------------------------------------------------
  
  // USER MANAGEMENT HANDLERS
  const handleToggleUserBlock = (userId: string) => {
    const isBlocked = toggleUserBlockStatus(userId);
    loadAllData();
    showToast(isBlocked ? 'تم حظر حساب المستخدم بنجاح' : 'تم إلغاء حظر المستخدم وفتح الحساب');
  };

  const handleChangeUserRole = (userId: string, newRole: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      saveUserAccount({ ...targetUser, role: newRole });
      loadAllData();
      showToast(`تم تغيير صلاحية المستخدم ${targetUser.name} إلى: ${
        newRole === 'admin' ? 'مدير منصة' :
        newRole === 'moderator' ? 'مشرف محتوى' :
        newRole === 'organization' ? 'جهة ناشرة' : 'باحث عن فرصة'
      }`);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('هل أنت تأكد تماماً من حذف حساب هذا المستخدم نهائياً؟ لن يمكن استرجاع البيانات.')) {
      deleteUserAccount(userId);
      loadAllData();
      showToast('تم حذف حساب المستخدم نهائياً من قاعدة البيانات');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    saveUserAccount({
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      governorate: newUser.governorate,
      createdAt: new Date().toISOString().split('T')[0],
      isBlocked: false
    });
    setNewUser({ name: '', email: '', role: 'candidate', governorate: 'أمانة العاصمة' });
    setIsAddUserModalOpen(false);
    loadAllData();
    showToast('تم إضافة المستخدم الجديد ومنحه الصلاحيات بنجاح');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    saveUserAccount(editingUser);
    setEditingUser(null);
    loadAllData();
    showToast('تم تحديث بيانات المستخدم بنجاح');
  };

  // VERIFICATION HANDLERS
  const handleApproveVerification = (id: string) => {
    updateVerificationRequestStatus(id, 'approved', 'تمت المراجعة والموافقة من الإدارة');
    loadAllData();
    onRefreshData();
    showToast('تمت الموافقة ومنح شارة التوثيق الرسمية للجهة ✓');
  };

  const handleRejectVerification = (id: string) => {
    updateVerificationRequestStatus(id, 'rejected', 'الوثيقة غير واضحة أو منتهية الصلاحية');
    loadAllData();
    showToast('تم رفض طلب التوثيق');
  };

  const handleToggleOrgBadge = (orgId: string) => {
    const isVerified = toggleOrganizationVerification(orgId);
    loadAllData();
    onRefreshData();
    showToast(isVerified ? 'تم منح شارة التوثيق للجهة' : 'تم سحب شارة التوثيق من الجهة');
  };

  // OPPORTUNITY MODERATION HANDLERS
  const handleToggleFeatured = (oppId: string) => {
    const isFeatured = toggleFeaturedOpportunity(oppId);
    onRefreshData();
    loadAllData();
    showToast(isFeatured ? 'تم تمييز الفرصة في الواجهة الرئيسية ⭐' : 'تم إلغاء تمييز الفرصة');
  };

  const handleUpdateOppStatus = (oppId: string, newStatus: any) => {
    updateOpportunityStatus(oppId, newStatus);
    onRefreshData();
    loadAllData();
    showToast(`تم تغيير حالة الفرصة إلى: ${newStatus}`);
  };

  const handleDeleteOpp = (oppId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفرصة نهائياً من المنصة لتنظيف المحتوى المخالف؟')) {
      deleteOpportunity(oppId);
      onRefreshData();
      loadAllData();
      showToast('تم حذف الفرصة والمحتوى المخالف بنجاح');
    }
  };

  // REPORTS & INAPPROPRIATE CONTENT HANDLERS
  const handleResolveReportAction = (reportId: string, actionType: 'dismiss' | 'resolve' | 'delete_opp' | 'block_publisher', oppId?: string, orgName?: string) => {
    if (actionType === 'dismiss') {
      updateReportStatus(reportId, 'dismissed');
      showToast('تم تجاهل البلاغ');
    } else if (actionType === 'delete_opp' && oppId) {
      if (window.confirm('هل أنت متأكد من حذف الفرصة المبلغ عنها نهائياً لوجود محتوى مخالف أو غير لائق؟')) {
        deleteOpportunity(oppId);
        resolveReport(reportId);
        onRefreshData();
        loadAllData();
        showToast('تم حذف الفرصة المخالفة وحل البلاغ نهائياً ✓');
      }
    } else if (actionType === 'block_publisher') {
      if (window.confirm(`هل تريد حظر الناشر (${orgName || 'الجهة'}) لحماية المستخدمين من المحتوى المخالف؟`)) {
        // Find organization user and block
        const targetOrgUser = users.find(u => u.name.includes(orgName || '') || u.role === 'organization');
        if (targetOrgUser) {
          toggleUserBlockStatus(targetOrgUser.id);
        }
        resolveReport(reportId);
        loadAllData();
        showToast('تم حظر الناشر وحل البلاغ');
      }
    } else {
      resolveReport(reportId);
      showToast('تم حل البلاغ واعتماده');
    }
    loadAllData();
  };

  // PLATFORM SETTINGS & CATEGORIES / GOVERNORATES HANDLERS
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    savePlatformSettings(settings);
    showToast('تم حفظ التغييرات وإعدادات المنصة بنجاح ✓');
  };

  // ABOUT US HANDLERS
  const handleAddAboutFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureTitle || !newFeatureDesc) return;
    const newFeat = {
      id: `f-${Date.now()}`,
      title: newFeatureTitle,
      description: newFeatureDesc,
      icon: newFeatureIcon
    };
    const updatedFeatures = [...(settings.aboutUsFeatures || []), newFeat];
    const updatedSettings = { ...settings, aboutUsFeatures: updatedFeatures };
    setSettings(updatedSettings);
    savePlatformSettings(updatedSettings);
    setNewFeatureTitle('');
    setNewFeatureDesc('');
    showToast('تمت إضافة بطاقة مميزات جديدة لقسم "من نحن" بنجاح ✓');
  };

  const handleDeleteAboutFeature = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه البطاقة من قسم "من نحن"؟')) {
      const updatedFeatures = (settings.aboutUsFeatures || []).filter((f: any) => f.id !== id);
      const updatedSettings = { ...settings, aboutUsFeatures: updatedFeatures };
      setSettings(updatedSettings);
      savePlatformSettings(updatedSettings);
      showToast('تم حذف البطاقة من قسم "من نحن"');
    }
  };

  // CONTACT CHANNELS HANDLERS
  const handleAddContactChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanTitle || !newChanValue) return;
    const newChan = {
      id: `c-${Date.now()}`,
      title: newChanTitle,
      value: newChanValue,
      type: newChanType,
      icon: newChanType === 'email' ? 'Mail' : newChanType === 'whatsapp' ? 'MessageCircle' : 'Phone'
    };
    const updatedChannels = [...(settings.contactChannels || []), newChan];
    const updatedSettings = { ...settings, contactChannels: updatedChannels };
    setSettings(updatedSettings);
    savePlatformSettings(updatedSettings);
    setNewChanTitle('');
    setNewChanValue('');
    showToast('تمت إضافة قناة تواصل جديدة بنجاح ✓');
  };

  const handleDeleteContactChannel = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف قناة التواصل هذه؟')) {
      const updatedChannels = (settings.contactChannels || []).filter((c: any) => c.id !== id);
      const updatedSettings = { ...settings, contactChannels: updatedChannels };
      setSettings(updatedSettings);
      savePlatformSettings(updatedSettings);
      showToast('تم حذف قناة التواصل');
    }
  };

  // SOCIAL MEDIA HANDLERS
  const handleAddSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialPlatform || !newSocialUrl) return;
    const newSocial = {
      id: `s-${Date.now()}`,
      platform: newSocialPlatform,
      url: newSocialUrl,
      icon: newSocialIcon,
      isActive: true
    };
    const updatedSocial = [...(settings.socialLinks || []), newSocial];
    const updatedSettings = { ...settings, socialLinks: updatedSocial };
    setSettings(updatedSettings);
    savePlatformSettings(updatedSettings);
    setNewSocialPlatform('');
    setNewSocialUrl('');
    showToast('تمت إضافة رابط منصة التواصل الاجتماعي بنجاح ✓');
  };

  const handleToggleSocialActive = (id: string) => {
    const updatedSocial = (settings.socialLinks || []).map((s: any) => {
      if (s.id === id) return { ...s, isActive: !s.isActive };
      return s;
    });
    const updatedSettings = { ...settings, socialLinks: updatedSocial };
    setSettings(updatedSettings);
    savePlatformSettings(updatedSettings);
    showToast('تم تحديث حالة تفعيل رابط التواصل');
  };

  const handleDeleteSocialLink = (id: string) => {
    if (window.confirm('هل تريد حذف هذا الرابط من قائمة مواقع التواصل؟')) {
      const updatedSocial = (settings.socialLinks || []).filter((s: any) => s.id !== id);
      const updatedSettings = { ...settings, socialLinks: updatedSocial };
      setSettings(updatedSettings);
      savePlatformSettings(updatedSettings);
      showToast('تم حذف رابط منصة التواصل الاجتماعي');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameAr) return;
    const newCatItem = {
      id: `cat-${Date.now()}`,
      nameAr: newCatNameAr,
      nameEn: newCatNameEn || newCatNameAr,
      iconName: 'Briefcase',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200',
      description: newCatDesc || 'تصنيف مخصص مضاف من الإدارة',
      isHidden: false
    };
    const updated = [...categoryList, newCatItem];
    setCategoryList(updated);
    saveStoredCategories(updated);
    setNewCatNameAr('');
    setNewCatNameEn('');
    setNewCatDesc('');
    showToast('تمت إضافة التصنيف الجديد بنجاح');
  };

  const handleToggleCategoryVisibility = (catId: string) => {
    const updated = categoryList.map(c => {
      if (c.id === catId) {
        return { ...c, isHidden: !c.isHidden };
      }
      return c;
    });
    setCategoryList(updated);
    saveStoredCategories(updated);
    showToast('تم تحديث حالة ظهور التصنيف بالموقع');
  };

  const handleDeleteCategory = (catId: string) => {
    if (window.confirm('هل تريد حذف هذا التصنيف؟')) {
      const updated = categoryList.filter(c => c.id !== catId);
      setCategoryList(updated);
      saveStoredCategories(updated);
      showToast('تم حذف التصنيف');
    }
  };

  const handleAddGovernorate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGovName) return;
    const updated = [...governorateList, { name: newGovName, isActive: true }];
    setGovernorateList(updated);
    saveStoredGovernorates(updated);
    setNewGovName('');
    showToast('تم إضافة المحافظة/المنطقة بنجاح');
  };

  const handleToggleGovActive = (govName: string) => {
    const updated = governorateList.map(g => {
      if (g.name === govName) {
        return { ...g, isActive: !g.isActive };
      }
      return g;
    });
    setGovernorateList(updated);
    saveStoredGovernorates(updated);
    showToast('تم تحديث حالة تفعيل المحافظة');
  };

  // FILTERED USERS COMPUTATION
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || 
                          (userStatusFilter === 'active' && !u.isBlocked) || 
                          (userStatusFilter === 'blocked' && u.isBlocked);
    const matchesGov = userGovernorateFilter === 'all' || u.governorate === userGovernorateFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesGov;
  });

  // FILTERED OPPS COMPUTATION
  const filteredOpps = opportunities.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(oppSearch.toLowerCase()) || 
                          o.organizationName.toLowerCase().includes(oppSearch.toLowerCase());
    const matchesStatus = oppStatusFilter === 'all' || o.status === oppStatusFilter;
    const matchesCat = oppCategoryFilter === 'all' || o.category === oppCategoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 border border-neutral-700 dark:border-neutral-300 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Eye-Comfortable Modern Slate Indigo */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-6 rounded-3xl shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-xs">
                <Shield className="w-6 h-6 text-indigo-300" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-50">
                  لوحة التحكم والسيطرة الكاملة (Super Admin Panel) 🇾🇪
                </h1>
                <p className="text-xs text-slate-300/80">
                  إدارة كافة المستخدمين، مراجعة وتنظيف المحتوى المخالف، التحكم بالتصنيفات والمحافظات، وتوثيق المؤسسات
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 font-bold flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>صلاحيات المسؤول الأخصائي (Admin Mode)</span>
            </span>
          </div>
        </div>
      </div>

      {/* System Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400">إجمالي المستخدمين</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100">{users.length}</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400">الجهات المعتمدة</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100">{stats.verifiedOrganizations}</p>
            <span className="text-[10px] text-neutral-400">من أصل {stats.totalOrganizations}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400">الفرص النشطة</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100">{stats.publishedOpportunities}</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400">طلبات التوثيق</span>
            <BadgeCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-600">{verifications.filter(v => v.status === 'pending').length}</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400">البلاغات المعلقة</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">{reports.filter(r => r.status === 'pending').length}</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400">التصنيفات النشطة</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100">{categoryList.filter(c => !c.isHidden).length}</p>
        </div>

      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-bold scrollbar-none">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-red-950 via-amber-900 to-red-900 text-amber-100 shadow-md font-black border border-amber-500/40'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>نظرة عامة وإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-red-950 via-amber-900 to-red-900 text-amber-100 shadow-md font-black border border-amber-500/40'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة المستخدمين ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap relative ${
            activeTab === 'verifications'
              ? 'bg-gradient-to-r from-red-950 via-amber-900 to-red-900 text-amber-100 shadow-md font-black border border-amber-500/40'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <BadgeCheck className="w-4 h-4" />
          <span>التوثيق والمؤسسات</span>
          {verifications.filter(v => v.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'opportunities'
              ? 'bg-gradient-to-r from-red-950 via-amber-900 to-red-900 text-amber-100 shadow-md font-black border border-amber-500/40'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>كافة الفرص والمحتوى ({opportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-gradient-to-r from-red-950 via-amber-900 to-red-900 text-amber-100 shadow-md font-black border border-amber-500/40'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>البلاغات والمحتوى المخالف ({reports.filter(r => r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-gradient-to-r from-red-950 via-amber-900 to-red-900 text-amber-100 shadow-md font-black border border-amber-500/40'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>التصنيفات والمحافظات</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-red-950 via-amber-900 to-red-900 text-amber-100 shadow-md font-black border border-amber-500/40'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>إعدادات النظام والإعلانات</span>
        </button>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & SYSTEM STATS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Regional Heatmap Breakdown */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>توزيع الفرص النشطة حسـب المحافظات اليمنية 🇾🇪</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  رصد مباشر للمحافظات الأكثر نشاطاً وإتاحةً للفرص الوظيفية والتدريبية
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {governorateList.map(g => {
                const count = opportunities.filter(o => o.governorate === g.name).length;
                return (
                  <div key={g.name} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/70 dark:border-neutral-800 space-y-1">
                    <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200 block truncate">{g.name}</span>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-700 dark:text-amber-400 font-black">{count} فرصة</span>
                      <span className="text-neutral-400 text-[10px]">نشط</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>إحصائيات التصنيفات المعتمدة</span>
              </h2>

              <div className="space-y-3">
                {categoryList.slice(0, 7).map(c => {
                  const catCount = opportunities.filter(o => o.category === c.id).length;
                  const pct = opportunities.length ? Math.round((catCount / opportunities.length) * 100) : 0;
                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-neutral-800 dark:text-neutral-200">{c.nameAr}</span>
                        <span className="text-amber-700 dark:text-amber-400">{catCount} فرصة ({pct}%)</span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>سجل الأمان ونشاط الإشراف</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 text-emerald-900 dark:text-emerald-300 space-y-0.5">
                  <p className="font-bold">✓ توثيق شركة اليمن للحلول الرقمية (YemenTech)</p>
                  <p className="text-[11px] opacity-80">تم التحقق من السجل التجاري ومنح الشارة المعتمدة.</p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 text-amber-900 dark:text-amber-300 space-y-0.5">
                  <p className="font-bold">ℹ️ فلترة تلقائية للمحتوى والمحافظات</p>
                  <p className="text-[11px] opacity-80">قام النظام بالتحقق من جودة إعلانات الفرص ورصد البلاغات المعلقة.</p>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/60 text-purple-900 dark:text-purple-300 space-y-0.5">
                  <p className="font-bold">🤖 محرك المطابقة بالذكاء الاصطناعي</p>
                  <p className="text-[11px] opacity-80">توليد التوصيات والسير الذاتية بالذكاء الاصطناعي يعمل بكفاءة عالية.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: USER MANAGEMENT & PERMISSIONS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>أدوات الإدارة الكاملة للمستخدمين والباحثين والناشرين</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                تعديل أدوار الحسابات، الحظر المباشر للحسابات المخالفة، تعديل البيانات، وإضافة مستخدمين جدد
              </p>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-900 via-amber-800 to-red-900 hover:from-red-950 hover:to-amber-900 text-amber-100 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>إضافة مستخدم جديد</span>
            </button>
          </div>

          {/* User Filters Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-neutral-50 dark:bg-neutral-850 p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs">
            
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث باسم المستخدم أو البريد..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none cursor-pointer"
              >
                <option value="all">جميع الصلاحيات والأدوار</option>
                <option value="candidate">باحث عن عمل (Candidate)</option>
                <option value="organization">جهة ناشرة (Organization)</option>
                <option value="moderator">مشرف محتوى (Moderator)</option>
                <option value="admin">مدير منصة (Admin)</option>
              </select>
            </div>

            <div>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none cursor-pointer"
              >
                <option value="all">جميع حالات الحساب</option>
                <option value="active">الحسابات النشطة ✓</option>
                <option value="blocked">الحسابات المحظورة ⛔</option>
              </select>
            </div>

            <div>
              <select
                value={userGovernorateFilter}
                onChange={(e) => setUserGovernorateFilter(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none cursor-pointer"
              >
                <option value="all">جميع المحافظات</option>
                {governorateList.map(g => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* User Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold">
                  <th className="py-3 px-3">المستخدم</th>
                  <th className="py-3 px-3">البريد الإلكتروني</th>
                  <th className="py-3 px-3">تعديل الدور والصلاحية</th>
                  <th className="py-3 px-3">المحافظة</th>
                  <th className="py-3 px-3">التسجيل</th>
                  <th className="py-3 px-3">الحالة</th>
                  <th className="py-3 px-3 text-center">الإجراءات والتحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-400">
                      لا يوجد مستخدمون مطابقون لمعايير البحث المحددة.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-850/50">
                      <td className="py-3 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 text-amber-100 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            {u.name ? u.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <span className="block font-bold">{u.name}</span>
                            <span className="text-[10px] text-neutral-400">#ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">{u.email}</td>
                      
                      {/* Direct Role Change Selector */}
                      <td className="py-3 px-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold outline-none border cursor-pointer ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                            u.role === 'organization' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                            u.role === 'moderator' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          <option value="candidate">باحث عن عمل</option>
                          <option value="organization">جهة ناشرة</option>
                          <option value="moderator">مشرف محتوى</option>
                          <option value="admin">مدير منصة (Admin)</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 font-medium">{u.governorate || 'أمانة العاصمة'}</td>
                      <td className="py-3 px-3 text-neutral-400 text-[11px]">{u.createdAt}</td>
                      <td className="py-3 px-3">
                        {u.isBlocked ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-300">محظور ⛔</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">نشط ✓</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                            title="تعديل تفاصيل المستخدم"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleUserBlock(u.id)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              u.isBlocked 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                            }`}
                            title={u.isBlocked ? 'إلغاء حظر الحساب' : 'حظر الحساب'}
                          >
                            {u.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 text-neutral-600 hover:text-rose-700 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
                            title="حذف حساب المستخدم نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: ORGANIZATIONS & VERIFICATION REQUESTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-purple-600" />
                  <span>طلبات توثيق المؤسسات والشركات المعتمدة</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  مراجعة الوثائق الرسمية والتراخيص المقدمة لمنح شارة التوثيق المعتمدة (✓)
                </p>
              </div>
            </div>

            {verifications.filter(v => v.status === 'pending').length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-850 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                لا توجد طلبات توثيق معلقة حالياً. جميع الجهات معالجة.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verifications.filter(v => v.status === 'pending').map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl border border-purple-200/80 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-950/30 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{req.organizationName}</h3>
                        <p className="text-[11px] text-neutral-500 mt-0.5">مسؤول التواصل: {req.contactPerson} ({req.contactEmail})</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">بانتظار المراجعة</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex items-center justify-between">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">{req.documentName}</span>
                      <span className="text-[10px] text-emerald-600 font-bold underline cursor-pointer">معاينة المستند 📄</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleRejectVerification(req.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
                      >
                        رفض الطلب
                      </button>
                      <button
                        onClick={() => handleApproveVerification(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-900 to-amber-800 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>موافقة ومنح التوثيق ✓</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>دليل كافة الجهات والمؤسسات والشركات الناشرة بالمنصة</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {organizations.map(org => (
                <div key={org.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={org.logo} alt={org.name} className="w-9 h-9 rounded-xl object-cover border border-neutral-200" />
                      <div>
                        <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{org.name}</h3>
                        <span className="text-[10px] text-neutral-500">{org.governorate} • {org.industry}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleOrgBadge(org.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        org.isVerified 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                      }`}
                    >
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>{org.isVerified ? 'موثقة ✓' : 'منح التوثيق'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: ALL OPPORTUNITIES CONTENT MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'opportunities' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>إدارة وتنظيف كافة المحتوى والفرص الوظيفية بالموقع</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                تعديل أي فرصة بالكامل، تغيير حالة النشر، تمييز الفرص الذهبية، أو حذف الفرص غير اللائقة
              </p>
            </div>
          </div>

          {/* Filters Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-50 dark:bg-neutral-850 p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث بعنوان الفرصة أو اسم الجهة..."
                value={oppSearch}
                onChange={(e) => setOppSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <select
                value={oppStatusFilter}
                onChange={(e) => setOppStatusFilter(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none cursor-pointer"
              >
                <option value="all">جميع الحالات (منشورة، معلقة، منتهية، مرفوضة)</option>
                <option value="published">منشورة ونشطة ✓</option>
                <option value="pending">معلقة قيد المراجعة ⏳</option>
                <option value="expired">منتهية الصلاحية ⛔</option>
                <option value="rejected">مرفوضة ❌</option>
              </select>
            </div>

            <div>
              <select
                value={oppCategoryFilter}
                onChange={(e) => setOppCategoryFilter(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none cursor-pointer"
              >
                <option value="all">جميع التصنيفات</option>
                {categoryList.map(c => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table of Opportunities */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold">
                  <th className="py-3 px-3">عنوان الفرصة والجهة</th>
                  <th className="py-3 px-3">المحافظة</th>
                  <th className="py-3 px-3">الموعد النهائي</th>
                  <th className="py-3 px-3">حالة النشر</th>
                  <th className="py-3 px-3">مميزة ⭐</th>
                  <th className="py-3 px-3 text-center">الإجراءات وتعديل المحتوى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {filteredOpps.map(opp => (
                  <tr key={opp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-850/50">
                    <td className="py-3 px-3">
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">{opp.title}</h3>
                        <span className="text-[10px] text-neutral-500">{opp.organizationName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-600 dark:text-neutral-400">{opp.governorate}</td>
                    <td className="py-3 px-3 text-neutral-500 font-mono text-[11px]">{opp.deadline}</td>
                    <td className="py-3 px-3">
                      <select
                        value={opp.status}
                        onChange={(e) => handleUpdateOppStatus(opp.id, e.target.value)}
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] cursor-pointer outline-none ${
                          opp.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                          opp.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          opp.status === 'expired' ? 'bg-neutral-200 text-neutral-700' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <option value="published">نشطة ✓</option>
                        <option value="pending">معلقة ⏳</option>
                        <option value="expired">منتهية ⛔</option>
                        <option value="rejected">مرفوضة ❌</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleFeatured(opp.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          opp.isFeatured 
                            ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold' 
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                        }`}
                        title="تغيير التمييز بالأعلى"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingOpp(opp)}
                          className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 transition-colors cursor-pointer"
                          title="تعديل كافة تفاصيل الفرصة"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل المحتوى</span>
                        </button>

                        <button
                          onClick={() => handleDeleteOpp(opp.id)}
                          className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                          title="حذف الفرصة والمحتوى المخالف نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: REPORTS & INAPPROPRIATE CONTENT MODERATION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-5">
          <div>
            <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>أدوات معالجة البلاغات وحذف أو تعديل المحتوى غير اللائق</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              مراجعة البلاغات الواردة من المستخدمين حول الفرص الوهمية أو المحتوى المخالف واتخاذ الإجراء الفوري
            </p>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8 bg-neutral-50 dark:bg-neutral-850 rounded-2xl border border-dashed border-neutral-200">
                لا توجد بلاغات مسجلة حالياً. كافة الفرص مطابقة للمعايير.
              </p>
            ) : (
              reports.map((rep) => {
                const targetOpp = opportunities.find(o => o.id === rep.opportunityId || o.title === rep.opportunityTitle);

                return (
                  <div key={rep.id} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-850/70 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{rep.opportunityTitle}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200">
                            {rep.reason === 'scam' ? 'احتيال فرصة وهمية ⛔' : 'محتوى غير لائق ومخالف ⚠️'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">تفاصيل الشكوى: "{rep.details}"</p>
                        <p className="text-[10px] text-neutral-400">مُقدم البلاغ: {rep.reporterName} • {rep.createdAt}</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                        rep.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rep.status === 'pending' ? 'قيد المعالجة' : 'تم التعامل ✓'}
                      </span>
                    </div>

                    {/* Direct Action Bar for Content Moderation */}
                    <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center justify-end gap-2 text-xs">
                      
                      {targetOpp && (
                        <button
                          onClick={() => setEditingOpp(targetOpp)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1 cursor-pointer border border-amber-200 dark:border-amber-800"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل المحتوى تنظيفاً للمحتوى</span>
                        </button>
                      )}

                      {targetOpp && (
                        <button
                          onClick={() => handleResolveReportAction(rep.id, 'delete_opp', targetOpp.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف الفرصة المخالفة نهائياً</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleResolveReportAction(rep.id, 'block_publisher', targetOpp?.id, targetOpp?.organizationName)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>حظر الناشر</span>
                      </button>

                      <button
                        onClick={() => handleResolveReportAction(rep.id, 'dismiss')}
                        className="px-3 py-1.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold cursor-pointer"
                      >
                        تجاهل البلاغ
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: CATEGORIES & GOVERNORATES CONFIGURATION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          
          {/* Section A: Categories Control */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-5">
            <div>
              <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>التحكم في إعدادات تصنيفات الفرص بالمنصة</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                إضافة تصنيفات جديدة، إخفاء/إظهار التصنيفات الحالية، وتعديل المسميات
              </p>
            </div>

            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-50 dark:bg-neutral-850 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <input
                type="text"
                placeholder="اسم التصنيف بالعربية (مثال: ذكاء اصطناعي)"
                value={newCatNameAr}
                onChange={(e) => setNewCatNameAr(e.target.value)}
                className="p-2.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
              <input
                type="text"
                placeholder="اسم التصنيف بالإنجليزية (AI & Tech)"
                value={newCatNameEn}
                onChange={(e) => setNewCatNameEn(e.target.value)}
                className="p-2.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none focus:ring-2 focus:ring-amber-600"
              />
              <input
                type="text"
                placeholder="وصف مختصر للتصنيف..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="p-2.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none focus:ring-2 focus:ring-amber-600"
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-900 to-amber-800 text-amber-100 text-xs font-bold cursor-pointer hover:from-red-950 hover:to-amber-900 shadow-xs flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" />
                <span>إضافة التصنيف</span>
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categoryList.map(c => (
                <div key={c.id} className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 ${
                  c.isHidden ? 'bg-neutral-100 dark:bg-neutral-850 opacity-60 border-neutral-300' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                }`}>
                  <div>
                    <span className="font-bold text-xs block text-neutral-900 dark:text-neutral-100">{c.nameAr}</span>
                    <span className="text-[10px] text-neutral-400 block">{c.nameEn}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleCategoryVisibility(c.id)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        c.isHidden ? 'bg-neutral-200 text-neutral-700' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                      title={c.isHidden ? 'إظهار التصنيف بالموقع' : 'إخفاء التصنيف'}
                    >
                      {c.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-700 border border-neutral-200 transition-colors cursor-pointer"
                      title="حذف التصنيف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Governorates Control */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-5">
            <div>
              <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>التحكم في إعدادات المحافظات والتقسيم الجغرافي باليمن 🇾🇪</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                تفعيل أو تعطيل المحافظات المتاحة في القوائم المنسدلة، أو إضافة أقاليم ومناطق جديدة
              </p>
            </div>

            <form onSubmit={handleAddGovernorate} className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="اسم المحافظة أو الأقليم الجديد..."
                value={newGovName}
                onChange={(e) => setNewGovName(e.target.value)}
                className="flex-1 p-2.5 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer shadow-xs">
                + إضافة
              </button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {governorateList.map(g => (
                <div key={g.name} className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                  g.isActive === false ? 'bg-neutral-100 dark:bg-neutral-850 opacity-50 border-neutral-300' : 'bg-neutral-50 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-800'
                }`}>
                  <span className="truncate">{g.name}</span>
                  <button
                    onClick={() => handleToggleGovActive(g.name)}
                    className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-colors ${
                      g.isActive === false ? 'bg-neutral-400' : 'bg-emerald-500'
                    }`}
                    title={g.isActive === false ? 'تفعيل المحافظة' : 'تعطيل المحافظة'}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: PLATFORM CONFIG, ABOUT US, CONTACT US & SOCIAL MEDIA */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-6">
          
          {/* Settings Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <span>إدارة المحتوى الثابت، "من نحن"، "تواصل بنا"، ومواقف التواصل الاجتماعي</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                تعديل، إضافة، وحذف بيانات الأقسام الرئيسية والروابط المعروضة لكافة الزوار بالمنصة
              </p>
            </div>

            {/* Sub Tabs Bar */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-850 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setSettingsSubTab('about')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  settingsSubTab === 'about'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                📖 قسم من نحن
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab('contact')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  settingsSubTab === 'contact'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                📞 قسم تواصل بنا
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab('social')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  settingsSubTab === 'social'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                🌐 مواقع التواصل الاجتماعي
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab('general')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  settingsSubTab === 'general'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                ⚙️ إعدادات عامة
              </button>
            </div>
          </div>

          {/* --------------------------------------------------------- */}
          {/* SUB-TAB 1: ABOUT US MANAGEMENT */}
          {/* --------------------------------------------------------- */}
          {settingsSubTab === 'about' && (
            <div className="space-y-6 text-xs">
              
              {/* Main About Text Form */}
              <form onSubmit={handleSaveSettings} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
                <h3 className="font-black text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>تعديل العنوان والوصف الرئيسي لقسم "من نحن"</span>
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">العنوان الرئيسي للقسم:</label>
                    <input
                      type="text"
                      value={settings.aboutUsTitle || ''}
                      onChange={(e) => setSettings({ ...settings, aboutUsTitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-black text-sm outline-none focus:ring-2 focus:ring-amber-600 shadow-2xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">الوصف التوضيحي للرسالة والهدف:</label>
                    <textarea
                      rows={3}
                      value={settings.aboutUsDescription || ''}
                      onChange={(e) => setSettings({ ...settings, aboutUsDescription: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-600 shadow-2xs"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ النصوص الرئيسية</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Add New Feature Card Form */}
              <form onSubmit={handleAddAboutFeature} className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                <h3 className="font-black text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>إضافة بطاقة مميزات جديدة لقسم "من نحن"</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">عنوان المميزة / البطاقة:</label>
                    <input
                      type="text"
                      placeholder="مثال: المصداقية الموثقة"
                      value={newFeatureTitle}
                      onChange={(e) => setNewFeatureTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-bold outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">شرح وتفاصيل المميزة:</label>
                    <input
                      type="text"
                      placeholder="مثال: نتحقق يدويًا من الروابط والشركات الناشرة لمنع الاحتيال..."
                      value={newFeatureDesc}
                      onChange={(e) => setNewFeatureDesc(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">الأيقونة:</span>
                    <select
                      value={newFeatureIcon}
                      onChange={(e) => setNewFeatureIcon(e.target.value)}
                      className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="ShieldCheck">ShieldCheck (مصداقية وحماية)</option>
                      <option value="Globe">Globe (تغطية جغرافية)</option>
                      <option value="Heart">Heart (مجانية ودعم)</option>
                      <option value="Award">Award (جودة وتفوق)</option>
                      <option value="Sparkles">Sparkles (ذكاء وتميز)</option>
                      <option value="Briefcase">Briefcase (فرص ووظائف)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-900 to-amber-800 text-amber-100 font-bold cursor-pointer shadow-xs"
                  >
                    + إضافة البطاقة الآن
                  </button>
                </div>
              </form>

              {/* Existing Features List */}
              <div className="space-y-3">
                <h3 className="font-black text-xs text-neutral-900 dark:text-neutral-100">البطاقات الحالية المعروضة بالموقع ({settings.aboutUsFeatures?.length || 0}):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(settings.aboutUsFeatures || []).map((feat: any) => (
                    <div key={feat.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-2 relative group shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-[10px]">
                          {feat.icon}
                        </span>
                        <button
                          onClick={() => handleDeleteAboutFeature(feat.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
                          title="حذف البطاقة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-black text-neutral-900 dark:text-neutral-100">{feat.title}</h4>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">{feat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* SUB-TAB 2: CONTACT US MANAGEMENT */}
          {/* --------------------------------------------------------- */}
          {settingsSubTab === 'contact' && (
            <div className="space-y-6 text-xs">
              
              {/* Main Contact Details Form */}
              <form onSubmit={handleSaveSettings} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
                <h3 className="font-black text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-600" />
                  <span>تعديل معلومات الاتصال والمقر الرئيسي</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">البريد الإلكتروني للاتصال الرسمي:</label>
                    <input
                      type="email"
                      value={settings.contactEmail || ''}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">رقم الهاتف وخط الاستفسارات:</label>
                    <input
                      type="text"
                      value={settings.contactPhone || ''}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">العنوان الجغرافي / المقر:</label>
                    <input
                      type="text"
                      value={settings.contactAddress || ''}
                      onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">أوقات العمل المعتمدة:</label>
                    <input
                      type="text"
                      value={settings.contactHours || ''}
                      onChange={(e) => setSettings({ ...settings, contactHours: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ بيانات الاتصال الرئيسية</span>
                  </button>
                </div>
              </form>

              {/* Add New Contact Channel Form */}
              <form onSubmit={handleAddContactChannel} className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                <h3 className="font-black text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>إضافة قناة تواصل خاصة جديدة (مثال: الواتساب، الخط الساخن، الدعم الفني)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">اسم القناة / الخدمة:</label>
                    <input
                      type="text"
                      placeholder="مثال: خدمة الواتساب المباشرة"
                      value={newChanTitle}
                      onChange={(e) => setNewChanTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">رقم الهاتف / البريد / الرابط:</label>
                    <input
                      type="text"
                      placeholder="مثال: +967 770 000 001"
                      value={newChanValue}
                      onChange={(e) => setNewChanValue(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">نوع القناة:</label>
                    <select
                      value={newChanType}
                      onChange={(e) => setNewChanType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="phone">هاتف / اتصال</option>
                      <option value="whatsapp">واتساب (WhatsApp)</option>
                      <option value="email">بريد إلكتروني</option>
                      <option value="link">رابط موقع / نموذج</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-900 to-amber-800 text-amber-100 font-bold cursor-pointer shadow-xs"
                  >
                    + إضافة قناة التواصل
                  </button>
                </div>
              </form>

              {/* Channels List */}
              <div className="space-y-3">
                <h3 className="font-black text-xs text-neutral-900 dark:text-neutral-100">قنوات الاتصال المتاحة بالمنصة ({settings.contactChannels?.length || 0}):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(settings.contactChannels || []).map((chan: any) => (
                    <div key={chan.id} className="p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1 flex items-center justify-between">
                      <div>
                        <span className="font-black text-neutral-900 dark:text-neutral-100 block">{chan.title}</span>
                        <span className="text-neutral-500 font-mono text-[11px]">{chan.value}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteContactChannel(chan.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
                        title="حذف القناة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* SUB-TAB 3: SOCIAL MEDIA LINKS MANAGEMENT */}
          {/* --------------------------------------------------------- */}
          {settingsSubTab === 'social' && (
            <div className="space-y-6 text-xs">
              
              {/* Add New Social Link Form */}
              <form onSubmit={handleAddSocialLink} className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                <h3 className="font-black text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>إضافة حساب منصة تواصل اجتماعي جديدة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">اسم المنصة:</label>
                    <input
                      type="text"
                      placeholder="مثال: فيسبوك (Facebook) أو قناتنا بالتلجرام"
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">رابط الصفحة / الحساب الرسمي (URL):</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/forsati.ye"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">الأيقونة المرفقة:</span>
                    <select
                      value={newSocialIcon}
                      onChange={(e) => setNewSocialIcon(e.target.value)}
                      className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="Facebook">فيسبوك (Facebook)</option>
                      <option value="Twitter">منصة X (تويتر)</option>
                      <option value="Linkedin">لينكد إن (LinkedIn)</option>
                      <option value="Send">تلجرام (Telegram)</option>
                      <option value="MessageSquare">واتساب (WhatsApp)</option>
                      <option value="Instagram">إنستغرام (Instagram)</option>
                      <option value="Globe">رابط عالمي / عام</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-900 to-amber-800 text-amber-100 font-bold cursor-pointer shadow-xs"
                  >
                    + إضافة الرابط الآن
                  </button>
                </div>
              </form>

              {/* Social Media Table */}
              <div className="space-y-3">
                <h3 className="font-black text-xs text-neutral-900 dark:text-neutral-100">قائمة حسابات ومواقع التواصل المعروضة بالموقع ({settings.socialLinks?.length || 0}):</h3>
                
                <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold">
                        <th className="py-3 px-4">اسم المنصة</th>
                        <th className="py-3 px-4">رابط الحساب الرسمي</th>
                        <th className="py-3 px-4 text-center">حالة الظهور</th>
                        <th className="py-3 px-4 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {(settings.socialLinks || []).map((s: any) => (
                        <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-850/50">
                          <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">{s.platform}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-neutral-500 max-w-xs truncate">
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-emerald-600">
                              {s.url}
                            </a>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSocialActive(s.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                s.isActive 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                  : 'bg-neutral-100 text-neutral-500 border border-neutral-300'
                              }`}
                            >
                              {s.isActive ? 'مفعل بالموقع ✓' : 'معطل ✕'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteSocialLink(s.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
                              title="حذف الرابط"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* SUB-TAB 4: GENERAL & ALERTS SETTINGS */}
          {/* --------------------------------------------------------- */}
          {settingsSubTab === 'general' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block">
                  شريط الإعلانات والتنبيهات العاجلة (يظهر بأعلى الواجهة لجميع الزوار):
                </label>
                <textarea
                  rows={2}
                  value={settings.heroAnnouncement || ''}
                  onChange={(e) => setSettings({ ...settings, heroAnnouncement: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none font-medium outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block">اسم المنصة باللغة العربية:</label>
                  <input
                    type="text"
                    value={settings.siteNameAr || ''}
                    onChange={(e) => setSettings({ ...settings, siteNameAr: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block">اسم المنصة بالإنجليزية:</label>
                  <input
                    type="text"
                    value={settings.siteNameEn || ''}
                    onChange={(e) => setSettings({ ...settings, siteNameEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold">تفعيل تحسين السيرة الذاتية بالذكاء الاصطناعي (Gemini AI):</span>
                  <input
                    type="checkbox"
                    checked={!!settings.enableAiCvOptimizer}
                    onChange={(e) => setSettings({ ...settings, enableAiCvOptimizer: e.target.checked })}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold">الموافقة اليدوية الإلزامية قبل نشر فرص جديدة للمؤسسات:</span>
                  <input
                    type="checkbox"
                    checked={!!settings.requireManualPostApproval}
                    onChange={(e) => setSettings({ ...settings, requireManualPostApproval: e.target.checked })}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التغييرات والإعدادات العامة</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODALS: ADD USER & EDIT USER */}
      {/* ------------------------------------------------------------- */}
      
      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full space-y-4 border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-neutral-200 dark:border-neutral-800">
              <h3 className="font-black text-sm text-neutral-900 dark:text-neutral-100">إضافة مستخدم جديد إلى المنصة</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">الدور والصلاحيات:</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none cursor-pointer"
                >
                  <option value="candidate">باحث عن عمل (Candidate)</option>
                  <option value="organization">جهة / ناشر فرص (Organization)</option>
                  <option value="moderator">مشرف محتوى (Moderator)</option>
                  <option value="admin">مدير منصة (Admin)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">المحافظة اليمنية:</label>
                <select
                  value={newUser.governorate}
                  onChange={(e) => setNewUser({ ...newUser, governorate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none cursor-pointer"
                >
                  {governorateList.map(g => (
                    <option key={g.name} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-600 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-900 to-amber-800 text-white font-bold cursor-pointer shadow-xs"
                >
                  إضافة الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Details Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full space-y-4 border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-neutral-200 dark:border-neutral-800">
              <h3 className="font-black text-sm text-neutral-900 dark:text-neutral-100">تعديل بيانات الحساب والصلاحيات</h3>
              <button onClick={() => setEditingUser(null)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">الدور والصلاحيات:</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none cursor-pointer"
                >
                  <option value="candidate">باحث عن عمل (Candidate)</option>
                  <option value="organization">جهة / ناشر فرص (Organization)</option>
                  <option value="moderator">مشرف محتوى (Moderator)</option>
                  <option value="admin">مدير منصة (Admin)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">المحافظة:</label>
                <select
                  value={editingUser.governorate}
                  onChange={(e) => setEditingUser({ ...editingUser, governorate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold outline-none cursor-pointer"
                >
                  {governorateList.map(g => (
                    <option key={g.name} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-600 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-900 to-amber-800 text-white font-bold cursor-pointer shadow-xs"
                >
                  حفظ التحديثات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal for Admin */}
      {editingOpp && (
        <EditOpportunityModal
          opportunity={editingOpp}
          onClose={() => setEditingOpp(null)}
          onSaveSuccess={() => {
            onRefreshData();
            loadAllData();
            setEditingOpp(null);
          }}
        />
      )}

    </div>
  );
};
