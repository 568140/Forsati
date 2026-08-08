import React from 'react';
import { Opportunity } from '../types';
import { CATEGORIES } from '../data/categories';
import { calculateMatch } from '../services/matchingEngine';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Globe, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
  compact?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect, compact = false }) => {
  const { candidateProfile, savedOppIds, toggleSaveOpp } = useAuth();
  const { language } = useLanguage();

  const categoryObj = CATEGORIES.find(c => c.id === opportunity.category) || CATEGORIES[0];
  const isSaved = savedOppIds.includes(opportunity.id);
  const matchResult = calculateMatch(opportunity, candidateProfile);

  // Calculate days remaining
  const daysRemaining = Math.ceil(
    (new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );
  const isExpired = daysRemaining < 0 || opportunity.status === 'expired';

  const getDeadlineText = () => {
    if (isExpired) return 'منتهية';
    if (daysRemaining === 0) return 'ينتهي اليوم';
    if (daysRemaining === 1) return 'ينتهي غداً';
    if (daysRemaining <= 3) return `ينتهي خلال ${daysRemaining} أيام`;
    return `متبقي ${daysRemaining} يومًا`;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: `${opportunity.title} - ${opportunity.organizationName} على منصة فرصتي`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${opportunity.title}\n${window.location.href}`);
      alert('تم نسخ رابط الفرصة بنجاح!');
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveOpp(opportunity.id);
  };

  // Priority Flags
  const isFeatured = !!opportunity.isFeatured;
  const isNew = Math.ceil((new Date().getTime() - new Date(opportunity.postedAt).getTime()) / (1000 * 3600 * 24)) <= 7;
  const isMostViewed = (opportunity.viewsCount || 0) >= 400;
  const isExpiringSoon = !isExpired && daysRemaining > 0 && daysRemaining <= 5;

  return (
    <div 
      onClick={() => onSelect(opportunity)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-emerald-500/60 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Category, Badges & Save Action */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Category Tag */}
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md border ${categoryObj.color}`}>
              {language === 'ar' ? categoryObj.nameAr : categoryObj.nameEn}
            </span>

            {/* Priority Badges */}
            {isFeatured && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                <span>مميزة</span>
                <span>⭐</span>
              </span>
            )}
            {isNew && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-0.5">
                <span>جديدة</span>
                <span>🆕</span>
              </span>
            )}
            {isMostViewed && !isFeatured && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 flex items-center gap-0.5">
                <span>شائعة</span>
                <span>🔥</span>
              </span>
            )}
            {isExpiringSoon && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-0.5">
                <span>ينتهي قريبًا</span>
                <span>⏰</span>
              </span>
            )}

            {/* Remote Badge */}
            {opportunity.isRemote && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>عن بُعد</span>
              </span>
            )}

            {/* Paid / Free Badge */}
            {opportunity.isPaid ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                {opportunity.salaryOrStipend || 'مدفوعة'}
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                مجانية
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="مشاركة الفرصة"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleSaveToggle}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                  : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
              }`}
              title={isSaved ? 'حفظت الفرصة' : 'حفظ الفرصة'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Organization Info & Title */}
        <div className="flex gap-3 items-start mb-3">
          <img 
            src={opportunity.organizationLogo} 
            alt={opportunity.organizationName}
            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50 shadow-2xs"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
              <span className="font-bold text-slate-700 truncate">
                {opportunity.organizationName}
              </span>
              {opportunity.organizationVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="جهة موثوقة" />
              )}
            </div>
            <h3 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
              {opportunity.title}
            </h3>
          </div>
        </div>

        {/* Short Description */}
        {!compact && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed font-medium">
            {opportunity.description}
          </p>
        )}

        {/* Location & Deadline Row */}
        <div className="flex items-center justify-between text-xs text-slate-500 my-2 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1 font-bold">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{opportunity.governorate}</span>
          </span>

          <span className="flex items-center gap-1 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className={isExpired ? 'text-rose-600 font-extrabold' : daysRemaining <= 3 ? 'text-amber-600 font-extrabold' : 'text-slate-600'}>
              {getDeadlineText()}
            </span>
          </span>
        </div>
      </div>

      {/* Card Footer Action Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>توافق {matchResult.compatibilityPercentage}%</span>
        </div>

        <button
          onClick={() => onSelect(opportunity)}
          className="flex items-center gap-1 text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors cursor-pointer"
        >
          <span>عرض التفاصيل</span>
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
        </button>
      </div>
    </div>
  );
};

