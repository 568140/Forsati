import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// UI Dictionary
const DICTIONARY: Record<string, Record<Language, string>> = {
  // Brand
  'brand.name': { ar: 'فرصتي', en: 'Forsati' },
  'brand.tagline': { ar: 'فرصتك تبدأ هنا', en: 'Your Opportunity Starts Here' },
  
  // Nav
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.explore': { ar: 'استكشف الفرص', en: 'Explore Opportunities' },
  'nav.categories': { ar: 'التصنيفات', en: 'Categories' },
  'nav.organizations': { ar: 'الجهات والمنظمات', en: 'Organizations' },
  'nav.recommendations': { ar: 'فرص توصياتي', en: 'My Matches' },
  'nav.saved': { ar: 'الفرص المحفوظة', en: 'Saved' },
  'nav.tracker': { ar: 'متابعة الطلبات', en: 'Application Tracker' },
  'nav.profile': { ar: 'الملف الشخصي', en: 'My Profile' },
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.org_dashboard': { ar: 'لوحة المنظمة', en: 'Org Dashboard' },
  'nav.moderation': { ar: 'الإشراف والمراجعة', en: 'Moderation' },
  'nav.admin': { ar: 'الإدارة العامة', en: 'Admin' },
  'nav.ai_assistant': { ar: 'مساعد فرصتي', en: 'Forsati AI' },
  'nav.post_opportunity': { ar: 'أضف فرصة جديدة', en: 'Post Opportunity' },
  'nav.about': { ar: 'عن المنصة', en: 'About Us' },
  'nav.help': { ar: 'المساعدة', en: 'Help' },
  'nav.terms': { ar: 'الشروط والأحكام', en: 'Terms' },
  'nav.privacy': { ar: 'سياسة الخصوصية', en: 'Privacy' },
  
  // Actions
  'action.search': { ar: 'بحث', en: 'Search' },
  'action.filter': { ar: 'تصفية', en: 'Filter' },
  'action.reset': { ar: 'إعادة ضبط', en: 'Reset' },
  'action.save': { ar: 'حفظ', en: 'Save' },
  'action.unsave': { ar: 'إلغاء الحفظ', en: 'Unsave' },
  'action.share': { ar: 'مشاركة', en: 'Share' },
  'action.report': { ar: 'إبلاغ', en: 'Report' },
  'action.apply_now': { ar: 'التقديم الرسمي', en: 'Apply Officially' },
  'action.view_details': { ar: 'عرض التفاصيل', en: 'View Details' },
  'action.edit': { ar: 'تعديل', en: 'Edit' },
  'action.delete': { ar: 'حذف', en: 'Delete' },
  'action.approve': { ar: 'اعتماد ونشر', en: 'Approve & Publish' },
  'action.reject': { ar: 'رفض', en: 'Reject' },
  'action.request_changes': { ar: 'طلب تعديل', en: 'Request Changes' },
  'action.mark_verified': { ar: 'توثيق الجهة ✓', en: 'Mark Verified ✓' },

  // Hero & Labels
  'hero.title': { ar: 'اكتشف فرصتك القادمة', en: 'Discover Your Next Opportunity' },
  'hero.subtitle': { ar: 'وظائف، تدريب، منح، دورات وبرامج تساعدك على بناء مستقبلك في اليمن ودولياً.', en: 'Jobs, internships, scholarships, courses & programs to build your future.' },
  'hero.search_placeholder': { ar: 'ابحث عن وظيفة، تدريب، منحة، أو دورة...', en: 'Search for jobs, internships, scholarships...' },
  'hero.cta_create': { ar: 'أنشئ ملفك مجاناً', en: 'Create Profile Free' },

  // Match
  'match.compatibility': { ar: 'مدى التوافق', en: 'Match Compatibility' },
  'match.why_fits': { ar: 'لماذا تناسبك؟', en: 'Why it matches you?' },

  // Roles
  'role.guest': { ar: 'زائر', en: 'Guest' },
  'role.candidate': { ar: 'متقدم / باحث عن فرص', en: 'Candidate' },
  'role.organization': { ar: 'ناشر فرص / جهة', en: 'Organization' },
  'role.moderator': { ar: 'مشرف محتوى', en: 'Moderator' },
  'role.admin': { ar: 'مدير المنصة', en: 'Admin' },

  // Common
  'common.governorate': { ar: 'المحافظة', en: 'Governorate' },
  'common.category': { ar: 'التصنيف', en: 'Category' },
  'common.deadline': { ar: 'الموعد النهائي', en: 'Deadline' },
  'common.posted': { ar: 'تاريخ النشر', en: 'Posted Date' },
  'common.remote': { ar: 'عن بُعد', en: 'Remote' },
  'common.verified': { ar: 'جهة موثوقة ✓', en: 'Verified Org ✓' },
  'common.paid': { ar: 'فرصة مدفوعة / بمكافأة', en: 'Paid Opportunity' },
  'common.free': { ar: 'مجانية', en: 'Free' }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('forsati_lang') as Language;
      return saved || 'ar';
    }
    return 'ar';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('forsati_lang', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, defaultText?: string): string => {
    if (DICTIONARY[key] && DICTIONARY[key][language]) {
      return DICTIONARY[key][language];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
