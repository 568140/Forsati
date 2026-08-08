import React from 'react';
import { OpportunityFilter, CategoryId, YemenGovernorate } from '../types';
import { CATEGORIES, GOVERNORATES_LIST } from '../data/categories';
import { useLanguage } from '../context/LanguageContext';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filter: OpportunityFilter;
  onFilterChange: (newFilter: OpportunityFilter) => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filter,
  onFilterChange,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const resetFilters = () => {
    onFilterChange({
      searchQuery: '',
      category: 'all',
      governorate: 'all',
      opportunityType: 'all',
      educationLevel: 'all',
      experienceLevel: 'all',
      isRemoteOnly: false,
      isVerifiedOnly: false,
      isPaidOnly: false,
      sortBy: 'recent'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:hidden">
      <div className="bg-white dark:bg-neutral-900 rounded-t-3xl border-t border-neutral-200 dark:border-neutral-800 p-5 space-y-5 max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        
        {/* Top Handle & Title */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2 font-black text-sm text-neutral-900 dark:text-neutral-100">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>تصفية وتصنيف الفرص</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Governorates */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">المحافظة / الموقع:</label>
          <select
            value={filter.governorate}
            onChange={(e) => onFilterChange({ ...filter, governorate: e.target.value as any })}
            className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
          >
            <option value="all">كل المحافظات</option>
            {GOVERNORATES_LIST.map((g) => (
              <option key={g.name} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">تصنيف الفرصة:</label>
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <button
              onClick={() => onFilterChange({ ...filter, category: 'all' })}
              className={`p-2 rounded-lg text-xs font-bold text-right transition-colors ${
                filter.category === 'all' ? 'bg-emerald-600 text-white' : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              الكل
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => onFilterChange({ ...filter, category: c.id })}
                className={`p-2 rounded-lg text-xs font-bold text-right transition-colors ${
                  filter.category === c.id ? 'bg-emerald-600 text-white' : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {language === 'ar' ? c.nameAr : c.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.isRemoteOnly}
              onChange={(e) => onFilterChange({ ...filter, isRemoteOnly: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-xs focus:ring-emerald-500"
            />
            <span>عرض الفرص عن بُعد فقط</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.isPaidOnly}
              onChange={(e) => onFilterChange({ ...filter, isPaidOnly: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-xs focus:ring-emerald-500"
            />
            <span>فرص مدفوعة / بمكافأة فقط</span>
          </label>
        </div>

        {/* Sort */}
        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">ترتيب النتائج بحسب:</label>
          <select
            value={filter.sortBy}
            onChange={(e) => onFilterChange({ ...filter, sortBy: e.target.value as any })}
            className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
          >
            <option value="recent">الأحدث أولاً</option>
            <option value="deadline_soon">الأقرب انتهاءً</option>
            <option value="best_match">الأعلى توافقاً مع الملف</option>
            <option value="most_viewed">الأكثر مشاهدة</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="pt-3 flex gap-2">
          <button
            onClick={resetFilters}
            className="w-1/3 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
          <button
            onClick={onClose}
            className="w-2/3 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
          >
            تطبيق النتائج
          </button>
        </div>

      </div>
    </div>
  );
};
