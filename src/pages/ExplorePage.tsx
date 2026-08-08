import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityFilter } from '../types';
import { filterOpportunities } from '../services/storage';
import { OpportunityCard } from '../components/OpportunityCard';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { MobileFilterDrawer } from '../components/MobileFilterDrawer';
import { useLanguage } from '../context/LanguageContext';
import { Compass, RotateCcw, AlertCircle } from 'lucide-react';

interface ExplorePageProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  initialFilter?: Partial<OpportunityFilter>;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  opportunities,
  onSelectOpportunity,
  initialFilter
}) => {
  const { language } = useLanguage();

  const [filter, setFilter] = useState<OpportunityFilter>({
    searchQuery: '',
    category: 'all',
    governorate: 'all',
    opportunityType: 'all',
    educationLevel: 'all',
    experienceLevel: 'all',
    isRemoteOnly: false,
    isVerifiedOnly: false,
    isPaidOnly: false,
    sortBy: 'recent',
    ...initialFilter
  });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialFilter) {
      setFilter(prev => ({ ...prev, ...initialFilter }));
    }
  }, [initialFilter]);

  const filteredOpportunities = filterOpportunities(filter);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <span>استكشاف جميع الفرص</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
            ابحث وتصفح الوظائف والمنح والتدريبات المتاحة في اليمن وخارجها
          </p>
        </div>
        <div className="text-xs font-black text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-2xl shadow-2xs">
          {filteredOpportunities.length} فرصة متاحة
        </div>
      </div>

      {/* Search & Filter Control Bar */}
      <SearchFilterBar
        filter={filter}
        onFilterChange={setFilter}
        onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
      />

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      ) : (
        /* Empty Search Results State */
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 text-center space-y-4 my-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">لم نجد فرصاً تطابق خيارات البحث الحالية</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            جرب توسيع نطاق البحث أو اختيار "كل المحافظات" أو إعادة ضبط الفلاتر للحصول على نتائج أوسع.
          </p>
          <button
            onClick={() => setFilter({
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
            })}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filter={filter}
        onFilterChange={setFilter}
      />

    </div>
  );
};
