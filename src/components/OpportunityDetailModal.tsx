import React, { useState } from 'react';
import { Opportunity } from '../types';
import { CATEGORIES } from '../data/categories';
import { calculateMatch } from '../services/matchingEngine';
import { fetchAiOpportunitySummary } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ReportModal } from './ReportModal';
import { EditOpportunityModal } from './EditOpportunityModal';
import { 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Globe, 
  ExternalLink, 
  Sparkles, 
  AlertTriangle, 
  X, 
  Check, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  GraduationCap, 
  Send,
  Loader2,
  FileText,
  Edit3
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onSelectRelated?: (opp: Opportunity) => void;
  allOpportunities?: Opportunity[];
  onRefreshData?: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose,
  onSelectRelated,
  allOpportunities = [],
  onRefreshData
}) => {
  const { candidateProfile, savedOppIds, toggleSaveOpp, currentRole, organization } = useAuth();
  const { language } = useLanguage();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<string[] | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);

  if (!opportunity) return null;

  const canManage = currentRole === 'admin' || currentRole === 'moderator' || (currentRole === 'organization' && opportunity.organizationId === organization?.id);

  const categoryObj = CATEGORIES.find(c => c.id === opportunity.category) || CATEGORIES[0];
  const isSaved = savedOppIds.includes(opportunity.id);
  const matchResult = calculateMatch(opportunity, candidateProfile);

  const daysRemaining = Math.ceil(
    (new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );
  const isExpired = daysRemaining < 0 || opportunity.status === 'expired';

  const related = allOpportunities
    .filter(o => o.id !== opportunity.id && (o.category === opportunity.category || o.governorate === opportunity.governorate))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: `${opportunity.title} على منصة فرصتي`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط الفرصة إلى الحافظة!');
    }
  };

  const handleGenerateAiSummary = async () => {
    setIsSummarizing(true);
    try {
      const summaryPoints = await fetchAiOpportunitySummary(
        opportunity.title,
        opportunity.description,
        opportunity.requirements,
        opportunity.responsibilities
      );
      setAiSummary(summaryPoints);
    } catch (e) {
      console.error('Summary error', e);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header Bar - Dark Slate Indigo */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-slate-100 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-black px-3.5 py-1 rounded-full border ${categoryObj.color}`}>
              {language === 'ar' ? categoryObj.nameAr : categoryObj.nameEn}
            </span>
            {opportunity.isRemote && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                عمل عن بُعد
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={() => setIsEditingModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="تعديل أو حذف هذه الفرصة"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>إدارة الفرصة</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="مشاركة"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveOpp(opportunity.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title={isSaved ? 'حفظت' : 'حفظ'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-emerald-400' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Title & Org Info */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-4 min-w-0">
              <img 
                src={opportunity.organizationLogo} 
                alt={opportunity.organizationName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-800 shadow-2xs"
              />
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {opportunity.organizationName}
                  </span>
                  {opportunity.organizationVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>جهة موثوقة</span>
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                  {opportunity.title}
                </h1>
              </div>
            </div>

            {/* Match Box */}
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-2xl shrink-0 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-2 mb-1.5">
                <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>نسبة التوافق مع ملفك</span>
                </span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                  {matchResult.compatibilityPercentage}%
                </span>
              </div>
              <div className="w-full bg-emerald-200 dark:bg-emerald-800/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${matchResult.compatibilityPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-1 font-bold">الموقع:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>{opportunity.governorate} {opportunity.city ? `(${opportunity.city})` : ''}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1 font-bold">الموعد النهائي:</span>
              <span className={`font-extrabold flex items-center gap-1 ${isExpired ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{opportunity.deadline}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1 font-bold">المستوى التعليمي:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span>{opportunity.educationLevel === 'bachelor' ? 'بكالوريوس' : opportunity.educationLevel === 'master' ? 'ماجستير' : 'جميع المستويات'}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1 font-bold">المقابل / الراتب:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>{opportunity.salaryOrStipend || 'غير محدد / مجاني'}</span>
              </span>
            </div>
          </div>

          {/* AI Opportunity Summarizer Section */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>ملخص الذكاء الاصطناعي السريع (AI Summary)</span>
              </div>
              {!aiSummary && (
                <button
                  onClick={handleGenerateAiSummary}
                  disabled={isSummarizing}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>توليد الملخص</span>
                </button>
              )}
            </div>

            {aiSummary ? (
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pr-4 list-disc font-medium">
                {aiSummary.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                انقر على "توليد الملخص" للحصول على أهم النقاط والشروط باختصار عبر "مساعد فرصتي الذكي".
              </p>
            )}
          </div>

          {/* Recommendation Reasons "لماذا تناسبك؟" */}
          {matchResult.reasons.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>لماذا تتوافق هذه الفرصة مع ملفك الشخصي؟</span>
              </h3>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                {matchResult.reasons.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-2">
            <h2 className="font-black text-sm text-slate-900 dark:text-slate-100 border-r-4 border-emerald-600 pr-2.5">
              وصف الفرصة
            </h2>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-medium">
              {opportunity.description}
            </p>
          </div>

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-black text-sm text-slate-900 dark:text-slate-100 border-r-4 border-emerald-600 pr-2.5">
                المهام والمسؤوليات
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-black text-sm text-slate-900 dark:text-slate-100 border-r-4 border-emerald-600 pr-2.5">
                الشروط والمتطلبات
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {opportunity.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-black text-sm text-slate-900 dark:text-slate-100 border-r-4 border-emerald-600 pr-2.5">
                المهارات المطلوبة
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.requiredSkills.map((skill, i) => {
                  const isMatch = matchResult.matchingSkills.includes(skill);
                  return (
                    <span 
                      key={i} 
                      className={`text-xs px-3 py-1 rounded-xl font-bold border ${
                        isMatch 
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {skill} {isMatch ? '✓' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Benefits */}
          {opportunity.benefits && opportunity.benefits.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-black text-sm text-slate-900 dark:text-slate-100 border-r-4 border-emerald-600 pr-2.5">
                المزايا والفوائد
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {opportunity.benefits.map((b, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 border border-slate-200/80 dark:border-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Application & Action Callout */}
          <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-indigo-900/40">
            <div>
              <h3 className="font-black text-sm mb-1 text-slate-50">تعليمات التقديم الرسمي</h3>
              <p className="text-xs text-slate-300/90 font-medium">
                منصة "فرصتي" توجهك مباشرة إلى رابط التقديم الرسمي الخاص بالمؤسسة الناشرة.
              </p>
            </div>
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <span>الانتقال لرابط التقديم الرسمي</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Related Opportunities */}
          {related.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="font-extrabold text-xs text-slate-500 dark:text-slate-400">فرص مشابهة قد تهمك:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map(rel => (
                  <div 
                    key={rel.id}
                    onClick={() => onSelectRelated && onSelectRelated(rel)}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-850 text-xs space-y-1.5 transition-all shadow-2xs"
                  >
                    <p className="font-black text-slate-900 dark:text-slate-100 line-clamp-1">{rel.title}</p>
                    <p className="text-[11px] text-slate-500 font-bold line-clamp-1">{rel.organizationName}</p>
                    <span className="inline-block text-[10px] text-indigo-600 dark:text-indigo-400 font-black">{rel.governorate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Report Button */}
          <div className="pt-2 flex justify-between items-center text-xs text-slate-400 font-bold">
            <span>تاريخ النشر: {opportunity.postedAt}</span>
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-1 text-rose-500 hover:text-rose-600 hover:underline font-bold cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>الإبلاغ عن محتوى الفرصة</span>
            </button>
          </div>

        </div>
      </div>

      <ReportModal
        opportunity={opportunity}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {isEditingModalOpen && (
        <EditOpportunityModal
          opportunity={opportunity}
          onClose={() => setIsEditingModalOpen(false)}
          onSaveSuccess={() => {
            if (onRefreshData) onRefreshData();
            setIsEditingModalOpen(false);
            onClose();
          }}
          onDeleteSuccess={() => {
            if (onRefreshData) onRefreshData();
            setIsEditingModalOpen(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};
