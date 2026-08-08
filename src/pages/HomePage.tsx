import React, { useState, useMemo } from 'react';
import { Opportunity, CategoryId, YemenGovernorate, OpportunityType } from '../types';
import { CATEGORIES, GOVERNORATES_LIST } from '../data/categories';
import { OpportunityCard } from '../components/OpportunityCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Sparkles, 
  ArrowLeft, 
  MapPin, 
  Globe, 
  UserPlus, 
  Briefcase, 
  GraduationCap, 
  Award, 
  BookOpen, 
  HeartHandshake, 
  Trophy,
  Rocket,
  Clock,
  CheckCircle2,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';

interface HomePageProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onNavigate: (view: string, filterState?: any) => void;
  onOpenAiAssistant: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  opportunities,
  onSelectOpportunity,
  onNavigate,
  onOpenAiAssistant
}) => {
  const { currentRole } = useAuth();
  const { language } = useLanguage();

  const [heroSearch, setHeroSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Smart Finder Interactive State
  const [finderStatus, setFinderStatus] = useState<string>('all');
  const [finderField, setFinderField] = useState<string>('all');
  const [finderLocation, setFinderLocation] = useState<string>('all');
  const [finderSubmitted, setFinderSubmitted] = useState<boolean>(false);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('explore', { 
      searchQuery: heroSearch,
      opportunityType: selectedType as any,
      governorate: selectedGovernorate as any,
      category: selectedCategory as any
    });
  };

  const handleCategoryClick = (catId: CategoryId) => {
    onNavigate('explore', { category: catId });
  };

  const handleGovClick = (govName: YemenGovernorate) => {
    onNavigate('explore', { governorate: govName });
  };

  // Fresh Opportunities (فرص جديدة)
  const freshOpportunities = useMemo(() => {
    return opportunities
      .filter(o => o.status === 'published')
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      .slice(0, 6);
  }, [opportunities]);

  // Expiring Soon Opportunities (⏰ فرص ينتهي التقديم عليها قريبًا)
  const expiringSoonOpportunities = useMemo(() => {
    const now = new Date().getTime();
    return opportunities
      .filter(o => o.status === 'published')
      .map(o => {
        const diffDays = Math.ceil((new Date(o.deadline).getTime() - now) / (1000 * 3600 * 24));
        return { opp: o, daysRemaining: diffDays };
      })
      .filter(item => item.daysRemaining >= 0 && item.daysRemaining <= 30)
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 4);
  }, [opportunities]);

  // Dynamic Governorate Opportunity Counts
  const governorateCounts = useMemo(() => {
    return opportunities.reduce((acc, opp) => {
      if (opp.status === 'published') {
        acc[opp.governorate] = (acc[opp.governorate] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [opportunities]);

  // Smart Finder Results Calculation
  const finderMatchedOpportunities = useMemo(() => {
    if (!finderSubmitted) return [];
    return opportunities.filter(o => {
      if (o.status !== 'published') return false;

      // Filter by field
      if (finderField !== 'all' && o.category !== finderField) return false;

      // Filter by location
      if (finderLocation !== 'all') {
        if (finderLocation === 'عن بُعد' && !o.isRemote) return false;
        if (finderLocation !== 'عن بُعد' && o.governorate !== finderLocation) return false;
      }

      // Filter by status (education / experience)
      if (finderStatus === 'student' && o.category === 'jobs' && o.experienceLevel === 'senior') return false;
      if (finderStatus === 'fresh' && o.experienceLevel === 'senior') return false;

      return true;
    }).slice(0, 6);
  }, [opportunities, finderStatus, finderField, finderLocation, finderSubmitted]);

  // Main 8 Category Icons
  const main8Categories = [
    { id: 'jobs', nameAr: 'وظائف', nameEn: 'Jobs', icon: Briefcase },
    { id: 'scholarships', nameAr: 'منح دراسية', nameEn: 'Scholarships', icon: Award },
    { id: 'internships', nameAr: 'تدريب عملي', nameEn: 'Internships', icon: GraduationCap },
    { id: 'training', nameAr: 'دورات تأهيلية', nameEn: 'Courses', icon: BookOpen },
    { id: 'volunteering', nameAr: 'فرص تطوع', nameEn: 'Volunteering', icon: HeartHandshake },
    { id: 'competitions', nameAr: 'مسابقات', nameEn: 'Competitions', icon: Trophy },
    { id: 'entrepreneurship', nameAr: 'ريادة أعمال', nameEn: 'Entrepreneurship', icon: Rocket },
    { id: 'remote', nameAr: 'عمل عن بُعد', nameEn: 'Remote Work', icon: Globe },
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Section - Light-First Responsive Design */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xs text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>منصة الفرص الأولى الموثوقة في اليمن 🇾🇪</span>
          </span>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            اكتشف فرصتك القادمة
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 font-bold max-w-2xl mx-auto leading-relaxed">
            وظائف، منح، تدريب، دورات، تطوع، مسابقات وريادة أعمال في مكان واحد.
          </p>

          {/* Prominent Search & Quick Filters Box */}
          <form onSubmit={handleHeroSearchSubmit} className="pt-2 space-y-3 max-w-2xl mx-auto">
            
            {/* Main Search Input Box */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2 shadow-2xs focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="ابحث عن وظيفة، منحة، تدريب، دورة..."
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-bold focus:outline-none px-2"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black transition-all shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>بحث</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filters Row: [نوع الفرصة] [المحافظة] [المجال] */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                <option value="all">نوع الفرصة: الكل</option>
                <option value="full_time">دوام كامل</option>
                <option value="part_time">دوام جزئي</option>
                <option value="contract">عقد موقت</option>
                <option value="freelance">عمل حر</option>
              </select>

              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                <option value="all">المحافظة: الكل</option>
                {GOVERNORATES_LIST.map(g => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                <option value="all">المجال: الكل</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{language === 'ar' ? c.nameAr : c.nameEn}</option>
                ))}
              </select>
            </div>

          </form>

        </div>
      </section>

      {/* 2. Opportunity Categories Section (أقسام الفرص) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              أقسام الفرص
            </h2>
            <p className="text-xs text-slate-500 font-bold">تصفح الفرص حسب الفئة المناسبة لمجالك</p>
          </div>
          <button 
            onClick={() => onNavigate('categories')} 
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {main8Categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id as CategoryId)}
                className="group p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-2"
              >
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {cat.nameAr}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Expiring Soon Opportunities Section (⏰ فرص ينتهي التقديم عليها قريبًا) */}
      {expiringSoonOpportunities.length > 0 && (
        <section className="space-y-4 bg-amber-50/60 p-6 sm:p-8 rounded-3xl border border-amber-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-white font-black text-xs">
                ⏰
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  فرص ينتهي التقديم عليها قريبًا
                </h2>
                <p className="text-xs text-slate-600 font-bold">لا تفوت فرصة التقديم قبل إغلاق الاستمارة</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('explore', { sortBy: 'deadline_soon' })}
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer hidden sm:flex"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {expiringSoonOpportunities.map(({ opp, daysRemaining }) => (
              <div 
                key={opp.id} 
                onClick={() => onSelectOpportunity(opp)}
                className="bg-white p-4 rounded-2xl border border-amber-200/90 hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-2xs group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-600" />
                      <span>{daysRemaining === 0 ? 'ينتهي اليوم' : daysRemaining === 1 ? 'متبقي يوم واحد' : `متبقي ${daysRemaining} أيام`}</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500">{opp.governorate}</span>
                  </div>

                  <h3 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 line-clamp-2 leading-snug">
                    {opp.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold truncate">
                    {opp.organizationName}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>آخر موعد: {opp.deadline}</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. New Opportunities Section ("أحدث الفرص") */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              أحدث الفرص المضافة 🌟
            </h2>
            <p className="text-xs text-slate-500 font-bold">تصفح أحدث الفرص الموثوقة المنشورة حديثًا</p>
          </div>
          <button 
            onClick={() => onNavigate('explore', { sortBy: 'recent' })}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>جميع الفرص الجديدة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freshOpportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      </section>

      {/* 5. Interactive Smart Opportunity Finder ("محدد الفرص الذكي - لا تعرف أي فرصة تناسبك؟") */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-200/90 shadow-2xs relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-200/60 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-xs font-black text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>محدد الفرص الذكي السريع</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              لا تعرف أي فرصة تناسبك؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              حدد خياراتك البسيطة لتظهر لك الفرص الأكثر ملاءمة لمؤهلاتك واهتماماتك فوراً:
            </p>
          </div>

          <button
            onClick={onOpenAiAssistant}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-2xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>مساعد AI التفاعلي الشامل</span>
          </button>
        </div>

        {/* Questionnaire Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Question 1: Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 block">1. وضعك الحالي:</label>
            <select
              value={finderStatus}
              onChange={(e) => { setFinderStatus(e.target.value); setFinderSubmitted(true); }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              <option value="all">الكل (جميع المؤهلات)</option>
              <option value="student">طالب جامعي / ثانوي</option>
              <option value="fresh">خريج حديث (0-2 سنة خبرة)</option>
              <option value="jobseeker">باحث عن عمل</option>
              <option value="employee">موظف / ذو خبرة</option>
            </select>
          </div>

          {/* Question 2: Field / Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 block">2. نوع الفرصة المطلوبة:</label>
            <select
              value={finderField}
              onChange={(e) => { setFinderField(e.target.value); setFinderSubmitted(true); }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              <option value="all">الكل (وظائف، منح، تدريب...)</option>
              <option value="jobs">وظائف برواتب ثابتة</option>
              <option value="scholarships">منح دراسية وأكاديمية</option>
              <option value="internships">تدريب عملي (Internships)</option>
              <option value="training">دورات وتأهيل مهني</option>
              <option value="volunteering">فرص تطوع ومبادرات</option>
              <option value="entrepreneurship">دعم مشاريع وريادة أعمال</option>
            </select>
          </div>

          {/* Question 3: Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 block">3. المكان أو النطاق:</label>
            <select
              value={finderLocation}
              onChange={(e) => { setFinderLocation(e.target.value); setFinderSubmitted(true); }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              <option value="all">جميع المحافظات + عن بُعد</option>
              <option value="عن بُعد">عمل / منحة عن بُعد</option>
              <option value="أمانة العاصمة">صنعاء (أمانة العاصمة)</option>
              <option value="عدن">عدن</option>
              <option value="تعز">تعز</option>
              <option value="حضرموت">حضرموت</option>
            </select>
          </div>

        </div>

        {/* Finder Action & Results Display */}
        {!finderSubmitted ? (
          <div className="pt-2 text-center">
            <button
              onClick={() => setFinderSubmitted(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>عرض الفرص المقترحة لي</span>
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-emerald-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900">
                نتائج التفضيلات المختارة ({finderMatchedOpportunities.length} فرصة مطابقة):
              </span>
              <button
                onClick={() => {
                  setFinderStatus('all');
                  setFinderField('all');
                  setFinderLocation('all');
                  setFinderSubmitted(false);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة اختيار</span>
              </button>
            </div>

            {finderMatchedOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {finderMatchedOpportunities.map(opp => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onSelect={onSelectOpportunity}
                    compact={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl text-center border border-emerald-100 text-xs space-y-2">
                <p className="font-extrabold text-slate-800">لم نجد فرصًا مباشرة بهذه التركيبة المحددة حاليًا.</p>
                <p className="text-slate-500">جرب اختيار "الكل" في أحد الخيارات أو تصفح جميع الفرص عبر زر البحث الرئيسي.</p>
              </div>
            )}
          </div>
        )}

      </section>

      {/* 6. Browse by Governorate (تصفح الفرص حسب المحافظة) with Dynamic Count */}
      <section className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              تصفح الفرص حسب المحافظة
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {GOVERNORATES_LIST.map((gov) => {
            const count = governorateCounts[gov.name] || 0;
            return (
              <button
                key={gov.name}
                onClick={() => handleGovClick(gov.name as YemenGovernorate)}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs text-right cursor-pointer flex flex-col justify-between group"
              >
                <span className="font-black text-slate-900 group-hover:text-emerald-700">{gov.name}</span>
                <span className="text-[10px] font-bold text-slate-500 mt-1">
                  {count > 0 ? `${count} ${count === 1 ? 'فرصة متاحة' : 'فرص متاحة'}` : 'تصفح الفرص'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. Guest Call to Action */}
      {currentRole === 'guest' && (
        <section className="bg-emerald-600 text-white rounded-3xl p-8 text-center space-y-4 shadow-md">
          <UserPlus className="w-10 h-10 text-emerald-100 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-black">جاهز لبدء رحلتك مع فرصتي؟</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto font-medium leading-relaxed">
            أنشئ حسابك مجانًا لحفظ الفرص المفضلة، متابعة طلبات التقديم، والحصول على تنبيهات الفرص الجديدة فور نشرها.
          </p>
          <button
            onClick={() => onNavigate('profile')}
            className="px-7 py-3 rounded-xl bg-white text-emerald-900 font-black text-xs sm:text-sm hover:bg-emerald-50 shadow-sm transition-all cursor-pointer"
          >
            أنشئ حسابك مجاناً
          </button>
        </section>
      )}

    </div>
  );
};
