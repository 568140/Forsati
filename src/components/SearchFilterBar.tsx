import React, { useState } from 'react';
import { OpportunityFilter, CategoryId, YemenGovernorate } from '../types';
import { CATEGORIES, GOVERNORATES_LIST } from '../data/categories';
import { useLanguage } from '../context/LanguageContext';
import { Search, SlidersHorizontal, X, Globe, Check, RotateCcw } from 'lucide-react';

interface SearchFilterBarProps {
  filter: OpportunityFilter;
  onFilterChange: (newFilter: OpportunityFilter) => void;
  onOpenMobileFilters: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filter,
  onFilterChange,
  onOpenMobileFilters,
}) => {
  const { language } = useLanguage();

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, searchQuery: e.target.value });
  };

  const handleCategorySelect = (catId: CategoryId | 'all') => {
    onFilterChange({ ...filter, category: catId });
  };

  const handleGovSelect = (gov: YemenGovernorate | 'all') => {
    onFilterChange({ ...filter, governorate: gov });
  };

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, sortBy: e.target.value as any });
  };

  const handleToggleRemote = () => {
    onFilterChange({ ...filter, isRemoteOnly: !filter.isRemoteOnly });
  };

  const handleTogglePaid = () => {
    onFilterChange({ ...filter, isPaidOnly: !filter.isPaidOnly });
  };

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

  const hasActiveFilters = filter.searchQuery || filter.category !== 'all' || filter.governorate !== 'all' || filter.isRemoteOnly || filter.isPaidOnly;

  return (
    <div className="space-y-3">
      {/* Search Bar + Controls Row */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center">
        {/* Search Input Box */}
        <div className="relative w-full flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={handleSearchInput}
            placeholder={language === 'ar' ? 'ابحث عن وظيفة، تدريب، منحة، أو مهارة...' : 'Search jobs, scholarships, training...'}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-11 pl-9 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 shadow-2xs transition-all font-medium"
          />
          {filter.searchQuery && (
            <button 
              onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Governorates Dropdown */}
        <div className="hidden sm:block w-48 shrink-0">
          <select
            value={filter.governorate}
            onChange={(e) => handleGovSelect(e.target.value as any)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-bold cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <option value="all">كل محافظات اليمن</option>
            {GOVERNORATES_LIST.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="hidden sm:block w-40 shrink-0">
          <select
            value={filter.sortBy}
            onChange={handleSortSelect}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-bold cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <option value="recent">الأحدث أولاً</option>
            <option value="deadline_soon">الأقرب انتهاءً</option>
            <option value="best_match">الأعلى توافقاً</option>
            <option value="most_viewed">الأكثر مشاهدة</option>
          </select>
        </div>

        {/* Mobile Filter Sheet Trigger Button */}
        <button
          onClick={onOpenMobileFilters}
          className="sm:hidden w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>تصفية وتبويب الفرص</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>

      {/* Quick Filter Badges Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {/* Remote Only Toggle */}
        <button
          onClick={handleToggleRemote}
          className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 border cursor-pointer ${
            filter.isRemoteOnly 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' 
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>عن بُعد فقط</span>
        </button>

        {/* Paid Only Toggle */}
        <button
          onClick={handleTogglePaid}
          className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 border cursor-pointer ${
            filter.isPaidOnly 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' 
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <span>فرص مدفوعة</span>
        </button>

        {/* All Categories Chip */}
        <button
          onClick={() => handleCategorySelect('all')}
          className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all border cursor-pointer ${
            filter.category === 'all' 
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-2xs font-extrabold' 
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          الكل
        </button>

        {/* Category Chips */}
        {CATEGORIES.slice(0, 8).map((cat) => {
          const isSelected = filter.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all border cursor-pointer ${
                isSelected 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' 
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {language === 'ar' ? cat.nameAr : cat.nameEn}
            </button>
          );
        })}

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-rose-600 dark:text-rose-400 hover:underline font-bold text-[11px] shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة ضبط</span>
          </button>
        )}
      </div>
    </div>
  );
};
