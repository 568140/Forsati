import React, { useState, useEffect } from 'react';
import { Opportunity, Organization } from '../types';
import { MultiStepCreateOpportunity } from '../components/MultiStepCreateOpportunity';
import { EditOpportunityModal } from '../components/EditOpportunityModal';
import { useAuth } from '../context/AuthContext';
import { deleteOpportunity, updateOpportunityStatus } from '../services/storage';
import { 
  Building2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Bookmark, 
  ShieldCheck, 
  AlertCircle, 
  Edit3, 
  ExternalLink,
  Layers,
  Trash2,
  Check,
  Star,
  Sparkles,
  Briefcase,
  Calendar,
  MapPin,
  X
} from 'lucide-react';

interface OrganizationDashboardPageProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onRefreshData: () => void;
}

export const OrganizationDashboardPage: React.FC<OrganizationDashboardPageProps> = ({
  opportunities,
  onSelectOpportunity,
  onRefreshData
}) => {
  const { organization, updateOrganizationProfile } = useAuth();

  const [isPosting, setIsPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'pending' | 'draft' | 'expired'>('all');
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Edit Org Form State
  const [orgName, setOrgName] = useState(organization?.name || '');
  const [orgDesc, setOrgDesc] = useState(organization?.description || '');
  const [orgGov, setOrgGov] = useState(organization?.governorate || 'أمانة العاصمة');
  const [orgWebsite, setOrgWebsite] = useState(organization?.website || '');

  useEffect(() => {
    if (organization) {
      setOrgName(organization.name || '');
      setOrgDesc(organization.description || '');
      setOrgGov(organization.governorate || 'أمانة العاصمة');
      setOrgWebsite(organization.website || '');
    }
  }, [organization]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const myOpportunities = opportunities.filter(o => o.organizationId === (organization?.id || 'org-1'));

  const totalViews = myOpportunities.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalSaves = myOpportunities.reduce((acc, curr) => acc + (curr.savesCount || 0), 0);

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (organization) {
      updateOrganizationProfile({
        ...organization,
        name: orgName,
        description: orgDesc,
        governorate: orgGov as any,
        website: orgWebsite
      });
      showToast('تم تحديث ملف المنظمة بنجاح ✓');
    }
    setIsEditingOrg(false);
  };

  const handleDeleteOpportunity = (oppId: string, oppTitle: string) => {
    if (window.confirm(`هل أنت متأكد من حذف فرصة "${oppTitle}" نهائياً من قاعدة البيانات؟`)) {
      deleteOpportunity(oppId);
      onRefreshData();
      showToast('تم حذف الفرصة وتحديث قاعدة البيانات بنجاح 🗑️');
    }
  };

  const handleStatusChange = (oppId: string, newStatus: any) => {
    updateOpportunityStatus(oppId, newStatus);
    onRefreshData();
    showToast(`تم تحديث حالة الفرصة إلى: ${
      newStatus === 'published' ? 'منشورة ونشطة' :
      newStatus === 'pending' ? 'قيد المراجعة' :
      newStatus === 'draft' ? 'مسودة' : 'منتهية الصلاحية'
    }`);
  };

  if (isPosting) {
    return (
      <MultiStepCreateOpportunity
        onSuccess={() => {
          setIsPosting(false);
          onRefreshData();
          showToast('تم إضافة الفرصة الجديدة ونشرها بنجاح! ✨');
        }}
        onCancel={() => setIsPosting(false)}
      />
    );
  }

  const tabOpportunities = myOpportunities.filter(o => {
    if (activeTab === 'published') return o.status === 'published';
    if (activeTab === 'pending') return o.status === 'pending';
    if (activeTab === 'draft') return o.status === 'draft';
    if (activeTab === 'expired') return o.status === 'expired';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 dark:border-slate-300 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar - Eye-Comfortable Modern Slate Indigo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-6 rounded-3xl border border-indigo-900/40 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <img 
            src={organization?.logo} 
            alt={organization?.name} 
            className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0 bg-slate-800 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-50 tracking-tight">{organization?.name}</h1>
              {organization?.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>جهة موثوقة</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300/80 mt-1 flex items-center gap-2">
              <span>{organization?.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" /> {organization?.governorate}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto relative z-10">
          <button
            onClick={() => setIsEditingOrg(!isEditingOrg)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
            <span>تعديل ملف الجهة</span>
          </button>
          <button
            onClick={() => setIsPosting(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فرصة جديدة</span>
          </button>
        </div>
      </div>

      {/* Edit Org Modal / Accordion */}
      {isEditingOrg && (
        <form onSubmit={handleSaveOrg} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-indigo-200/60 dark:border-slate-800 space-y-4 text-xs shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>تحديث بيانات ملف المنظمة</span>
            </h2>
            <button type="button" onClick={() => setIsEditingOrg(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">اسم الجهة / الشركة:</label>
              <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">الموقع الإلكتروني الرسمي:</label>
              <input type="text" value={orgWebsite} onChange={e => setOrgWebsite(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">نبذة عن الجهة:</label>
            <textarea value={orgDesc} onChange={e => setOrgDesc(e.target.value)} rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsEditingOrg(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">إلغاء</button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs">حفظ التغييرات</button>
          </div>
        </form>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">إجمالي الفرص المضافة</span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{myOpportunities.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">الفرص النشطة حالياً</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{myOpportunities.filter(o => o.status === 'published').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">إجمالي المشاهدات</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalViews}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">مرات الحفظ في المفضلة</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{totalSaves}</p>
        </div>
      </div>

      {/* Verification Callout if not verified */}
      {!organization?.isVerified && (
        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 p-4 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 text-indigo-950 dark:text-indigo-200 font-bold">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>طلب شارة "جهة موثوقة ✓" للحصول على ثقة أعلى وإبراز الفرص في مقدمة النتائج</span>
          </div>
          <button 
            onClick={() => {
              showToast('تم رفع طلب توثيق علامتك التجارية بنجاح للمراجعة ✓');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
          >
            طلب التوثيق
          </button>
        </div>
      )}

      {/* Opportunities Management Table & Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="font-black text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>إدارة الفرص وميزات التعديل والحذف</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              يمكنك تعديل بيانات أي فرصة، تغيير حالة النشر في قاعدة البيانات، أو حذفها نهائياً
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'all' ? 'bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 font-black' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              الكل ({myOpportunities.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'published' ? 'bg-emerald-600 text-white font-black' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              منشورة ({myOpportunities.filter(o => o.status === 'published').length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'pending' ? 'bg-amber-600 text-white font-black' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              قيد المراجعة ({myOpportunities.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'draft' ? 'bg-slate-600 text-white font-black' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              مسودة ({myOpportunities.filter(o => o.status === 'draft').length})
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'expired' ? 'bg-rose-600 text-white font-black' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              منتهية ({myOpportunities.filter(o => o.status === 'expired').length})
            </button>
          </div>
        </div>

        {tabOpportunities.length > 0 ? (
          <div className="space-y-3">
            {tabOpportunities.map(opp => (
              <div 
                key={opp.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                {/* Info Block */}
                <div 
                  onClick={() => onSelectOpportunity(opp)}
                  className="cursor-pointer flex-1 space-y-1.5"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{opp.title}</h3>
                    {opp.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                        مميزة ⭐
                      </span>
                    )}
                    
                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      opp.status === 'published' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                      opp.status === 'pending' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      opp.status === 'draft' ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}>
                      {opp.status === 'published' ? 'منشورة ونشطة ✓' :
                       opp.status === 'pending' ? 'قيد المراجعة ⏳' :
                       opp.status === 'draft' ? 'مسودة 📝' : 'منتهية الصلاحية ⛔'}
                    </span>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-3 text-[11px] flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-500" /> {opp.governorate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-amber-500" /> الموعد النهائي: {opp.deadline}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-indigo-500" /> {opp.viewsCount || 0} مشاهدة</span>
                  </p>
                </div>

                {/* Quick Status Control & Action Buttons (Edit / Delete / View) */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
                  
                  {/* Quick Status Selector */}
                  <select
                    value={opp.status}
                    onChange={(e) => handleStatusChange(opp.id, e.target.value)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px] outline-none cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                    <option value="published">تغيير إلى: منشورة ✓</option>
                    <option value="pending">تغيير إلى: قيد المراجعة ⏳</option>
                    <option value="draft">تغيير إلى: مسودة 📝</option>
                    <option value="expired">تغيير إلى: منتهية ⛔</option>
                  </select>

                  {/* Edit Button */}
                  <button
                    onClick={() => setEditingOpp(opp)}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/80 font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                    title="تعديل كافة بيانات الفرصة"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>تعديل (Edit)</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteOpportunity(opp.id, opp.title)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/80 font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                    title="حذف الفرصة نهائياً من قاعدة البيانات"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>حذف (Delete)</span>
                  </button>

                  {/* View Preview Button */}
                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-300" />
                    <span>معاينة</span>
                  </button>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-600 dark:text-slate-400">لا توجد فرص في القائمة المحددة حالياً</p>
            <p className="text-[11px] text-slate-400">يمكنك إضافة فرصة جديدة بالضغط على زر "إضافة فرصة جديدة" أعلاه.</p>
          </div>
        )}
      </div>

      {/* Edit Opportunity Modal for Publisher */}
      {editingOpp && (
        <EditOpportunityModal
          opportunity={editingOpp}
          onClose={() => setEditingOpp(null)}
          onSaveSuccess={() => {
            onRefreshData();
            setEditingOpp(null);
            showToast('تم حفظ التعديلات وتحديث الفرصة بنجاح ✓');
          }}
          onDeleteSuccess={() => {
            onRefreshData();
            setEditingOpp(null);
            showToast('تم حذف الفرصة من قاعدة البيانات 🗑️');
          }}
        />
      )}

    </div>
  );
};
