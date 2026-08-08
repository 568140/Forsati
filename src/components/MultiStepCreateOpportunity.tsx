import React, { useState } from 'react';
import { Opportunity, CategoryId, YemenGovernorate, OpportunityType, EducationLevel, ExperienceLevel } from '../types';
import { CATEGORIES, GOVERNORATES_LIST } from '../data/categories';
import { saveOpportunity } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Globe, 
  MapPin, 
  Calendar, 
  Plus, 
  Trash2, 
  Eye, 
  Send,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface MultiStepCreateOpportunityProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const MultiStepCreateOpportunity: React.FC<MultiStepCreateOpportunityProps> = ({ onSuccess, onCancel }) => {
  const { organization } = useAuth();
  const { language } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('jobs');
  const [type, setType] = useState<OpportunityType>('full_time');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [requiredSkills, setRequiredSkills] = useState<string>('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('bachelor');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('junior');
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [salaryOrStipend, setSalaryOrStipend] = useState('');
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [governorate, setGovernorate] = useState<YemenGovernorate>('أمانة العاصمة');
  const [city, setCity] = useState('');
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<string>('2026-10-30');
  const [applicationMethod, setApplicationMethod] = useState<'external_link' | 'email' | 'custom_instructions'>('external_link');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Helper Array mutators
  const handleListChange = (list: string[], setList: (l: string[]) => void, idx: number, val: string) => {
    const next = [...list];
    next[idx] = val;
    setList(next);
  };

  const handleListAdd = (list: string[], setList: (l: string[]) => void) => {
    setList([...list, '']);
  };

  const handleListRemove = (list: string[], setList: (l: string[]) => void, idx: number) => {
    if (list.length === 1) return;
    setList(list.filter((_, i) => i !== idx));
  };

  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!title.trim() || title.length < 5) {
        setErrorMsg('يرجى إدخال عنوان واضح للفرصة (لا يقل عن 5 أحرف)');
        return false;
      }
    } else if (step === 2) {
      if (!description.trim() || description.length < 20) {
        setErrorMsg('يرجى كتابة وصف وافٍ للفرصة (لا يقل عن 20 حرفاً)');
        return false;
      }
    } else if (step === 4) {
      if (!deadline) {
        setErrorMsg('يرجى تحديد الموعد النهائي للتقديم');
        return false;
      }
    } else if (step === 5) {
      if (applicationMethod === 'external_link' && (!applicationUrl.trim() || !applicationUrl.startsWith('http'))) {
        setErrorMsg('يرجى إدخال رابط تقديم رسمي صحيح يبدأ بـ http:// أو https://');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep(prev => prev - 1);
  };

  const handleSubmitForModeration = () => {
    const skillsArray = requiredSkills
      .split(/[,،]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: title.trim(),
      organizationId: organization?.id || 'org-demo',
      organizationName: organization?.name || 'مؤسسة يمنية محلية',
      organizationLogo: organization?.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
      organizationVerified: organization?.isVerified || false,
      category,
      type,
      status: 'pending', // Pending moderation
      governorate,
      city: city.trim() || governorate,
      isRemote,
      isInternational: governorate === 'دولية',
      description: description.trim(),
      responsibilities: responsibilities.filter(r => r.trim().length > 0),
      requirements: requirements.filter(r => r.trim().length > 0),
      requiredSkills: skillsArray,
      educationLevel,
      experienceLevel,
      benefits: benefits.filter(b => b.trim().length > 0),
      salaryOrStipend: isPaid ? salaryOrStipend.trim() : 'مجانية / بدون مقابل',
      isPaid,
      applicationMethod,
      applicationUrl: applicationUrl.trim() || 'https://example.com/apply',
      contactEmail: contactEmail.trim(),
      deadline,
      postedAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      savesCount: 0,
      isFeatured: false
    };

    saveOpportunity(newOpp);
    onSuccess();
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-5 sm:p-8 max-w-3xl mx-auto space-y-6">
      
      {/* Wizard Header Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            الخطوة {step} من 7
          </span>
          <span className="text-xs font-semibold text-neutral-400">
            {step === 1 && 'المعلومات الأساسية'}
            {step === 2 && 'الوصف والمسؤوليات'}
            {step === 3 && 'الشروط والمهارات'}
            {step === 4 && 'الموقع والموعد النهائي'}
            {step === 5 && 'طريقة التقديم الرسمية'}
            {step === 6 && 'معاينة الفرصة'}
            {step === 7 && 'إرسال للمراجعة'}
          </span>
        </div>
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">المعلومات الأساسية للفرصة</h2>
          
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              عنوان الفرصة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مهندس برمجيات واجهات أمامية React"
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                تصنيف الفرصة <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{language === 'ar' ? c.nameAr : c.nameEn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                نوع الدوام والالتزام
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              >
                <option value="full_time">دوام كامل (Full-time)</option>
                <option value="part_time">دوام جزئي (Part-time)</option>
                <option value="contract">عقد موقت (Contract)</option>
                <option value="remote">عمل عن بُعد (Remote)</option>
                <option value="temporary">مؤقت / مشروع (Temporary)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Description & Responsibilities */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">الوصف والمهام الرئيسية</h2>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              وصف عام للفرصة <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة شاملة عن طبيعة الفرصة وأهدافها والمخرجات المتوقعة..."
              rows={4}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">المهام والمسؤوليات:</label>
              <button
                type="button"
                onClick={() => handleListAdd(responsibilities, setResponsibilities)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة مهمة</span>
              </button>
            </div>
            {responsibilities.map((resp, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleListChange(responsibilities, setResponsibilities, i, e.target.value)}
                  placeholder={`مهمة ${i + 1}`}
                  className="flex-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-neutral-100"
                />
                {responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleListRemove(responsibilities, setResponsibilities, i)}
                    className="p-2 text-neutral-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Requirements & Skills */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">المؤهلات والشروط والمهارات</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">المستوى التعليمي المطلوبة</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              >
                <option value="any">جميع المستويات / لا يشترط</option>
                <option value="high_school">ثانوية عامة</option>
                <option value="diploma">دبلوم فني/مهني</option>
                <option value="bachelor">بكالوريوس</option>
                <option value="master">ماجستير</option>
                <option value="phd">دكتوراه</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">مستوى الخبرة المطلوب</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              >
                <option value="not_required">غير مطلوب / مبتدئ</option>
                <option value="fresh">حديث تخرج (0 - 1 سنة)</option>
                <option value="junior">مبتدئ (1 - 2 سنوات)</option>
                <option value="mid">متوسط (2 - 5 سنوات)</option>
                <option value="senior">متقدم (أكثر من 5 سنوات)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              المهارات المطلوبة (مفصولة بفواصل):
            </label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="مثال: React.js, TypeScript, Tailwind CSS, Git"
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-xs"
              />
              <span>تتضمن الفرصة مقابلاً مالياً / راتباً / مكافأة شهرية</span>
            </label>

            {isPaid && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">تفاصيل المقابل / الراتب (اختياري حقيقي):</label>
                <input
                  type="text"
                  value={salaryOrStipend}
                  onChange={(e) => setSalaryOrStipend(e.target.value)}
                  placeholder="مثال: 500$ - 700$ شهرياً بحسب الكفاءة"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-neutral-100"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Location & Deadline */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">الموقع والموعد النهائي للتقديم</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">المحافظة</label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value as YemenGovernorate)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {GOVERNORATES_LIST.map(g => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">المدينة / المديرية</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: صنعاء - حدة"
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-xs"
            />
            <span>تتيح الفرصة خيار العمل أو التدريب عن بُعد (Remote)</span>
          </label>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              الموعد النهائي لتلقي الطلبات <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-bold text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      )}

      {/* Step 5: Application Method */}
      {step === 5 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100">طريقة التقديم الرسمية</h2>
          <p className="text-xs text-neutral-500">
            تأكيداً لمبدأ المصداقية في "فرصتي"، يلزم توفير رابط التقديم الرسمي الخاص بمؤسستك مباشرة.
          </p>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">وسيلة التقديم المتاحة:</label>
            <select
              value={applicationMethod}
              onChange={(e) => setApplicationMethod(e.target.value as any)}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
            >
              <option value="external_link">رابط تقديم رسمي عبر موقع المؤسسة</option>
              <option value="email">إرسال البريد الإلكتروني مباشرة</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              رابط التقديم الرسمي (URL) <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              placeholder="https://your-org.com/apply-link"
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">بريد الاستفسارات المباشر (اختياري):</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="careers@your-org.com"
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      )}

      {/* Step 6: Preview */}
      {step === 6 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            <span>معاينة إعلان الفرصة قبل الإرسال</span>
          </h2>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <img src={organization?.logo} alt={organization?.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm block">{title}</span>
                <span className="text-neutral-500">{organization?.name} • {governorate}</span>
              </div>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 line-clamp-3">{description}</p>
            <div className="text-neutral-500">الموعد النهائي: <span className="font-bold text-neutral-800 dark:text-neutral-200">{deadline}</span></div>
          </div>
        </div>
      )}

      {/* Step 7: Submit for Moderation */}
      {step === 7 && (
        <div className="space-y-4 text-center py-6 animate-in fade-in duration-200">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
          <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-100">جاهز للإرسال لمراجعة الإشراف</h2>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
            سيتم إرسال إعلانك إلى فريق الإشراف في "فرصتي" للتحقق من المصداقية والروابط قبل النشر النهائي للمستخدمين.
          </p>
        </div>
      )}

      {/* Controls Footer */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        {step > 1 && step < 7 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-500 hover:text-neutral-800"
          >
            إلغاء
          </button>
        )}

        {step < 6 && (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-md"
          >
            <span>التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {step === 6 && (
          <button
            type="button"
            onClick={() => setStep(7)}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-md"
          >
            <span>تأكيد ومعاينة نهائية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {step === 7 && (
          <button
            type="button"
            onClick={handleSubmitForModeration}
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-lg mx-auto"
          >
            <Send className="w-4 h-4" />
            <span>إرسال للإشراف والمراجعة</span>
          </button>
        )}
      </div>

    </div>
  );
};
