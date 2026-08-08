import React, { useState } from 'react';
import { Opportunity, CategoryId, OpportunityType, LocationType, YemenGovernorate } from '../types';
import { CATEGORIES, GOVERNORATES_LIST } from '../data/categories';
import { saveOpportunity, deleteOpportunity } from '../services/storage';
import { X, Save, Trash2, Edit3, AlertTriangle, Briefcase, Calendar, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';

interface EditOpportunityModalProps {
  opportunity: Opportunity;
  onClose: () => void;
  onSaveSuccess: () => void;
  onDeleteSuccess?: () => void;
}

export const EditOpportunityModal: React.FC<EditOpportunityModalProps> = ({
  opportunity,
  onClose,
  onSaveSuccess,
  onDeleteSuccess
}) => {
  const [formData, setFormData] = useState({
    title: opportunity.title,
    category: opportunity.category,
    opportunityType: opportunity.opportunityType,
    locationType: opportunity.locationType,
    governorate: opportunity.governorate,
    city: opportunity.city || '',
    salaryOrStipend: opportunity.salaryOrStipend || '',
    deadline: opportunity.deadline,
    description: opportunity.description,
    requirements: opportunity.requirements.join('\n'),
    responsibilities: (opportunity.responsibilities || []).join('\n'),
    status: opportunity.status,
    isFeatured: opportunity.isFeatured || false,
    externalApplyUrl: opportunity.externalApplyUrl || '',
    contactEmail: opportunity.contactEmail || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedOpp: Opportunity = {
      ...opportunity,
      title: formData.title,
      category: formData.category as CategoryId,
      opportunityType: formData.opportunityType as OpportunityType,
      locationType: formData.locationType as LocationType,
      governorate: formData.governorate as YemenGovernorate,
      city: formData.city,
      salaryOrStipend: formData.salaryOrStipend,
      deadline: formData.deadline,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(r => r.trim().length > 0),
      responsibilities: formData.responsibilities.split('\n').filter(r => r.trim().length > 0),
      status: formData.status as any,
      isFeatured: formData.isFeatured,
      externalApplyUrl: formData.externalApplyUrl,
      contactEmail: formData.contactEmail
    };

    saveOpportunity(updatedOpp);
    onSaveSuccess();
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد تماماً من حذف هذه الفرصة نهائياً؟ لن يمكن استرجاع البيانات بعد الحذف.')) {
      deleteOpportunity(opportunity.id);
      if (onDeleteSuccess) onDeleteSuccess();
      onSaveSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header - Modern Slate Indigo */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-5 rounded-t-3xl border-b border-indigo-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Edit3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-black text-base text-slate-50">تعديل وإدارة تفاصيل الفرصة</h2>
              <p className="text-xs text-slate-300/80">تحديث المعلومات، تغيير حالة النشر، أو حذف الفرصة نهائياً</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">عنوان الفرصة / الوظيفة:</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">التصنيف:</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">نوع الفرصة:</label>
              <select
                value={formData.opportunityType}
                onChange={e => setFormData({ ...formData, opportunityType: e.target.value as any })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                <option value="full_time">دوام كامل</option>
                <option value="part_time">دوام جزئي</option>
                <option value="contract">عقد / مشروع</option>
                <option value="internship">تدريب عملي</option>
                <option value="training">برنامج تدريبي</option>
                <option value="scholarship">منحة دراسية</option>
                <option value="grant">تمويل / منحة دعم</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">المحافظة اليمنية:</label>
              <select
                value={formData.governorate}
                onChange={e => setFormData({ ...formData, governorate: e.target.value as any })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                {GOVERNORATES_LIST.map(g => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">طبيعة الحضور:</label>
              <select
                value={formData.locationType}
                onChange={e => setFormData({ ...formData, locationType: e.target.value as any })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                <option value="on_site">حضوري في المقر</option>
                <option value="remote">عن بُعد (أونلاين)</option>
                <option value="hybrid">مختلط (حضوري وعن بُعد)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">تاريخ الموعد النهائي:</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">الراتب / المكافأة (اختیاري):</label>
              <input
                type="text"
                placeholder="مثال: 500$ - 800$ أو راتب مجزٍ"
                value={formData.salaryOrStipend}
                onChange={e => setFormData({ ...formData, salaryOrStipend: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">حالة النشر بالموقع:</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                <option value="published">منشورة ونشطة ✓</option>
                <option value="pending">معلقة قيد المراجعة ⏳</option>
                <option value="draft">مسودة 📝</option>
                <option value="expired">منتهية الصلاحية ⛔</option>
                <option value="rejected">مرفوضة ❌</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">وصف الفرصة الشامل:</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">الشروط والأنشطة المطلوب توفرها (كل شرط في سطر جديد):</label>
            <textarea
              rows={3}
              value={formData.requirements}
              onChange={e => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">المهام والمسؤوليات (كل مهمة في سطر جديد):</label>
            <textarea
              rows={3}
              value={formData.responsibilities}
              onChange={e => setFormData({ ...formData, responsibilities: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200 block text-xs">تمييز هذه الفرصة في الواجهة الرئيسية ⭐</span>
              <span className="text-[11px] text-amber-700 dark:text-amber-300">ستظهر الفرصة في قسم "الفرص الذهبية والمميزة" بأعلى الصفحة</span>
            </div>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-5 h-5 accent-amber-600 rounded-md cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف الفرصة نهائياً</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
