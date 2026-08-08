import { Organization, Opportunity, CandidateProfile, OpportunityReport, UserNotification } from '../types';

export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-yemen-tech',
    name: 'شركة اليمن للحلول الرقمية (YemenTech)',
    englishName: 'YemenTech Digital Solutions',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    description: 'شركة يمنية رائدة في مجالات تطوير البرمجيات وحلول الذكاء الاصطناعي وبناء المنصات الرقمية المؤسسية.',
    website: 'https://yementech-demo.ye',
    email: 'hr@yementech-demo.ye',
    phone: '+967 770 000 111',
    governorate: 'أمانة العاصمة',
    city: 'صنعاء - حدة',
    industry: 'تكنولوجيا المعلومات والبرمجيات',
    isVerified: true,
    verificationBadgeDate: '2025-01-15',
    isPremium: true,
    socialLinks: {
      website: 'https://yementech-demo.ye',
      linkedin: 'https://linkedin.com/company/yementech-demo',
      x: 'https://x.com/yementech_demo',
      facebook: 'https://facebook.com/yementech.demo'
    },
    createdAt: '2024-06-10'
  },
  {
    id: 'org-yemen-dev-found',
    name: 'مؤسسة الرواد للتنمية المستدامة',
    englishName: 'Pioneers Foundation for Sustainable Dev',
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1200&auto=format&fit=crop&q=80',
    description: 'منظمة أهلية يمنية تعنى بتمكين الشباب وتدريبهم وبناء قدراتهم للالتحاق بسوق العمل الحديث.',
    website: 'https://alruwad-yemen.org',
    email: 'info@alruwad-yemen.org',
    phone: '+967 733 111 222',
    governorate: 'عدن',
    city: 'عدن - خور مكسر',
    industry: 'المنظمات غير الحكومية والتنمية',
    isVerified: true,
    verificationBadgeDate: '2024-11-20',
    isPremium: false,
    socialLinks: {
      website: 'https://alruwad-yemen.org',
      facebook: 'https://facebook.com/alruwad.yemen'
    },
    createdAt: '2024-03-01'
  },
  {
    id: 'org-taiz-innov',
    name: 'حاضنة تعز للابتكار وريادة الأعمال',
    englishName: 'Taiz Innovation Hub',
    logo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80',
    description: 'مركز تعزيز الابتكار واحتضان المشاريع الناشئة والشبابية في محافظة تعز والمحافظات المجاورة.',
    website: 'https://taizhub.org',
    email: 'contact@taizhub.org',
    governorate: 'تعز',
    city: 'تعز - شارع جمال',
    industry: 'ريادة الأعمال والحاضنات',
    isVerified: true,
    verificationBadgeDate: '2025-02-01',
    createdAt: '2024-08-12'
  },
  {
    id: 'org-hadhramout-center',
    name: 'مركز الحضارة للتدريب والاستشارات',
    englishName: 'Hadhramout Capacity Building Center',
    logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=150&auto=format&fit=crop&q=80',
    description: 'مركز متخصص في تقديم الدورات المهنية واللغوية وتأهيل كوادر المستقبل في حضرموت.',
    website: 'https://hadhramout-center.com',
    email: 'training@hadhramout-center.com',
    governorate: 'حضرموت',
    city: 'المكلا - فوه',
    industry: 'التعليم والتدريب المهني',
    isVerified: true,
    createdAt: '2024-09-05'
  },
  {
    id: 'org-global-scholarship',
    name: 'برنامج شبكة المنح الأكاديمية لليمنيين',
    englishName: 'Yemen Academic Scholarships Network',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    description: 'مبادرة غير ربحية تقوم بتجميع وتيسير التقديم على المنح الدراسية العالمية المخصصة للطلاب اليمنيين.',
    website: 'https://yemenscholars.org',
    email: 'apply@yemenscholars.org',
    governorate: 'عن بُعد',
    city: 'دولية / عبر الإنترنت',
    industry: 'التعليم والمنح الدراسية',
    isVerified: true,
    createdAt: '2024-01-10'
  }
];

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-101',
    title: 'مطور واجهات أمامية Full-stack React & Node.js',
    englishTitle: 'Senior Full-stack Developer (React/Node.js)',
    organizationId: 'org-yemen-tech',
    organizationName: 'شركة اليمن للحلول الرقمية (YemenTech)',
    organizationLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    organizationVerified: true,
    category: 'jobs',
    type: 'full_time',
    status: 'published',
    governorate: 'أمانة العاصمة',
    city: 'صنعاء',
    district: 'حدة',
    isRemote: true,
    isInternational: false,
    description: 'نبحث عن مطور برمجيات متمرس للانضمام إلى فريقنا الهندسي لبناء تطبيقات ويب عالية الأداء وتوسيع منصات شبكية للشركات المؤسسية.',
    responsibilities: [
      'تطوير واجهات المستخدم التفاعلية باستخدام React وTypeScript وTailwind CSS.',
      'تصميم وبناء خدمات برمجية خلفية موثوقة باستخدام Express.js وRESTful APIs.',
      'تحسين كفاءة استعلامات قواعد البيانات والسرعة والاستجابة الهيكلية للتطبيق.',
      'المشاركة في مراجعة الكود البرمجي البرمجي وضمان جودة الاختبارات.'
    ],
    requirements: [
      'درجة البكالوريوس في علوم الحاسوب أو تكنولوجيا المعلومات أو مجال مرتبط.',
      'خبرة لا تقل عن سنتين إلى 3 سنوات في React وNode.js.',
      'إتقان التعامل مع Git ومفاهيم RESTful APIs وقواعد البيانات.',
      'مهارات جيدة في حل المشكلات والتواصل الفعال.'
    ],
    requiredSkills: ['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Git', 'REST API'],
    educationLevel: 'bachelor',
    experienceLevel: 'mid',
    benefits: ['راتب مجزٍ بحسب الكفاءة', 'إمكانية العمل الهجين (مكتبي / عن بُعد)', 'فرص ترقية وتأهيل مستمر'],
    salaryOrStipend: '600$ - 900$ / شهرياً',
    isPaid: true,
    applicationMethod: 'external_link',
    applicationUrl: 'https://yementech-demo.ye/careers/apply-101',
    contactEmail: 'careers@yementech-demo.ye',
    deadline: '2026-09-30',
    postedAt: '2026-08-01',
    viewsCount: 342,
    savesCount: 89,
    isFeatured: true,
    isSample: true
  },
  {
    id: 'opp-102',
    title: 'برنامج التدريب العملي في إدارة المشاريع والتسويق الرقمي',
    englishTitle: 'Management & Digital Marketing Internship',
    organizationId: 'org-yemen-dev-found',
    organizationName: 'مؤسسة الرواد للتنمية المستدامة',
    organizationLogo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
    organizationVerified: true,
    category: 'internships',
    type: 'temporary',
    status: 'published',
    governorate: 'عدن',
    city: 'عدن',
    district: 'خور مكسر',
    isRemote: false,
    isInternational: false,
    description: 'برنامج تدريبي مدفوع الأجر لمدة 3 أشهر يستهدف الخريجين الجدد الراغبين في اكتساب خبرة عمل ملموسة في إدارة المشاريع والتسويق والإعلام التنموي.',
    responsibilities: [
      'المساعدة في تنظيم وإدارة الفعاليات والورش التدريبية.',
      'إعداد المحتوى الرقمي لمنصات التواصل الاجتماعي الخاصة بالمؤسسة.',
      'جمع البيانات وإعداد التقارير الدورية للمبادرات الميدانية.'
    ],
    requirements: [
      'خريج حديث بكالوريوس إدارة أعمال، تسويق، إعلام أو تخصصات ذات صلة.',
      'مهارات كتابية ممتازة باللغة العربية وإلمام جيد بالإنجليزية.',
      'مهارات تنظيمية والتزام بالمواعيد النهائي.'
    ],
    requiredSkills: ['التسويق الرقمي', 'كتابة المحتوى', 'إدارة الوقت', 'إدخال البيانات', 'اللغة الإنجليزية'],
    educationLevel: 'bachelor',
    experienceLevel: 'fresh',
    benefits: ['مكافأة شهرية رمزية 150$', 'شهادة تدريب معتمدة', 'أولوية التوظيف في المشاريع القادمة'],
    salaryOrStipend: '150$ / مكافأة تدريب شهرياً',
    isPaid: true,
    applicationMethod: 'external_link',
    applicationUrl: 'https://alruwad-yemen.org/internships/apply',
    deadline: '2026-08-28',
    postedAt: '2026-08-03',
    viewsCount: 512,
    savesCount: 140,
    isFeatured: true,
    isSample: true
  },
  {
    id: 'opp-103',
    title: 'منحة أكسفورد والشرق الأوسط للدراسات العليا 2026/2027',
    englishTitle: 'Oxford Middle East Graduate Scholarship for Yemenis',
    organizationId: 'org-global-scholarship',
    organizationName: 'برنامج شبكة المنح الأكاديمية لليمنيين',
    organizationLogo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    organizationVerified: true,
    category: 'scholarships',
    type: 'full_time',
    status: 'published',
    governorate: 'دولية',
    city: 'المملكة المتحدة / أكسفورد',
    isRemote: false,
    isInternational: true,
    description: 'منحة دراسية ممولة بالكامل تشمل التكاليف الدراسية ورسوم المعيشة والتأمين الصحي وتذاكر السفر لشهادة الماجستير للطلاب اليمنيين المتميزين أكاديمياً.',
    responsibilities: [
      'الالتزام بالدراسة الأكاديمية وتحقيق التفوق الأكاديمي.',
      'المشاركة في الملتقيات الثقافية والأكاديمية بجامعة أكسفورد.'
    ],
    requirements: [
      'معدل ممتازا في درجة البكالوريوس من جامعة معترف بها.',
      'درجة IELTS لا تقل عن 7.0 أو ما يعادلها في TOEFL.',
      'تقديم خطاب دافع ورسالتي توصية أكاديميتين.'
    ],
    requiredSkills: ['البحث الأكاديمي', 'اللغة الإنجليزية المتقدمة', 'التفكير النقدي', 'الكتابة العلمية'],
    educationLevel: 'bachelor',
    experienceLevel: 'fresh',
    benefits: ['تغطية رسوم الدراسة 100%', 'راتب معيشي سنوي ممتاز', 'تذاكر طيران ذهاب وإياد'],
    salaryOrStipend: 'منحة كاملة التمويل (تغطية شاملة)',
    isPaid: true,
    applicationMethod: 'external_link',
    applicationUrl: 'https://yemenscholars.org/scholarships/oxford-2026',
    deadline: '2026-11-15',
    postedAt: '2026-07-20',
    viewsCount: 1240,
    savesCount: 430,
    isFeatured: true,
    isSample: true
  },
  {
    id: 'opp-104',
    title: 'دورة مكثفة في تحليل البيانات باستخدام Python & Power BI',
    englishTitle: 'Data Analysis Intensive Course (Python & PowerBI)',
    organizationId: 'org-hadhramout-center',
    organizationName: 'مركز الحضارة للتدريب والاستشارات',
    organizationLogo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=150&auto=format&fit=crop&q=80',
    organizationVerified: true,
    category: 'training',
    type: 'hybrid',
    status: 'published',
    governorate: 'حضرموت',
    city: 'المكلا',
    district: 'فوه',
    isRemote: true,
    isInternational: false,
    description: 'دورة تدريبية عملية مدتها 6 أسابيع تغطي أساسيات تحليل البيانات واستخراج التقارير وتصميم لوحات التحكم التفاعلية للمؤسسات والشركات.',
    responsibilities: [
      'حضور الجلسات التفاعلية وحل التكليفات التطبيقية الأسبوعية.',
      'إنشاء مشروع تخرج عملي يعتمد على بيانات حقيقية.'
    ],
    requirements: [
      'المعرفة الأساسية باستخدام الحاسوب والرياضيات البسيطة.',
      'امتلاك حاسوب شخصي يتوفر فيه اتصال بالإنترنت.'
    ],
    requiredSkills: ['أساسيات Python', 'Power BI', 'Excel المتقدم', 'مبادئ الإحصاء'],
    educationLevel: 'high_school',
    experienceLevel: 'not_required',
    benefits: ['شهادة حضور معتمدة', 'مشاريع تطبيقية في محفظة الأعمال (Portfolio)', 'تسجيلات الجلسات للوصول الدائم'],
    salaryOrStipend: 'مجانية بدعم من المبادرة الرقمية',
    isPaid: false,
    applicationMethod: 'external_link',
    applicationUrl: 'https://hadhramout-center.com/courses/data-analysis',
    deadline: '2026-08-25',
    postedAt: '2026-08-05',
    viewsCount: 480,
    savesCount: 195,
    isFeatured: false,
    isSample: true
  },
  {
    id: 'opp-105',
    title: 'مسابقة مبتكري اليمن للحلول المناخية والطاقة البديلة',
    englishTitle: 'Yemen Green Innovators Hackathon 2026',
    organizationId: 'org-taiz-innov',
    organizationName: 'حاضنة تعز للابتكار وريادة الأعمال',
    organizationLogo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80',
    organizationVerified: true,
    category: 'competitions',
    type: 'temporary',
    status: 'published',
    governorate: 'تعز',
    city: 'تعز',
    isRemote: true,
    isInternational: false,
    description: 'مسابقة هكثون تنافسية للشباب والفرق والمبتكرين لتقديم أفكار ومشاريع حلول الطاقة الشمسية وتنقية المياه والزراعة المستدامة في اليمن.',
    responsibilities: [
      'تقديم الفكرة أو النماذج الأولية مع دراسة جدوى مبسطة.',
      'عرض المشروع أمام لجنة التحكيم في اليوم الختامي.'
    ],
    requirements: [
      'التقديم كأفراد أو فرق من 2 إلى 4 أعضاء.',
      'أن يحل المشروع مشكلة واقعية في البيئة اليمنية.'
    ],
    requiredSkills: ['الابتكار والتفكير التصميمي', 'إعداد نماذج العمل', 'العرض والتقديم'],
    educationLevel: 'any',
    experienceLevel: 'not_required',
    benefits: ['جوائز مالية للفائزين الثلاثة الأوائل (تصل إلى 3,000$)', 'احتضان الفكرة في الحاضنة وتوفير موجهين'],
    salaryOrStipend: 'جوائز مالية بقيمة 5,000$ إجمالي',
    isPaid: false,
    applicationMethod: 'external_link',
    applicationUrl: 'https://taizhub.org/hackathon-2026',
    deadline: '2026-09-10',
    postedAt: '2026-08-02',
    viewsCount: 620,
    savesCount: 210,
    isFeatured: true,
    isSample: true
  },
  {
    id: 'opp-106',
    title: 'فرصة عمل حر: ترجمة فورية وتحرير مقالات (عربي - إنجليزي)',
    englishTitle: 'Freelance Translator & Content Editor (Arabic-English)',
    organizationId: 'org-yemen-tech',
    organizationName: 'شركة اليمن للحلول الرقمية (YemenTech)',
    organizationLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    organizationVerified: true,
    category: 'freelance',
    type: 'remote',
    status: 'published',
    governorate: 'عن بُعد',
    city: 'عن بُعد',
    isRemote: true,
    isInternational: false,
    description: 'فرصة عمل حر بنظام المشروع لترجمة وصياغة الوثائق التقنية والدلائل الإرشادية من العربية للإنجليزية والعكس.',
    responsibilities: [
      'ترجمة النصوص التقنية بدقة عالية ومراعاة المصطلحات البرمجية.',
      'تدقيق وإعادة صياغة المقالات التخصصية.'
    ],
    requirements: [
      'إتقان ممتاز للغتين العربية والإنجليزية.',
      'خبرة سابقة في ترجمة المحتوى التقني أو التنموي.'
    ],
    requiredSkills: ['الترجمة التحريرية', 'التدقيق اللغوي', 'اللغة الإنجليزية المتقدمة', 'التواصل السريع'],
    educationLevel: 'bachelor',
    experienceLevel: 'junior',
    benefits: ['دفع مقابل الكلمة / أو المشروع', 'العمل في أوقات مرنة كلياً'],
    salaryOrStipend: '0.04$ / للكلمة أو بالاتفاق المباشر',
    isPaid: true,
    applicationMethod: 'email',
    applicationUrl: 'mailto:freelance@yementech-demo.ye',
    contactEmail: 'freelance@yementech-demo.ye',
    deadline: '2026-09-05',
    postedAt: '2026-08-06',
    viewsCount: 290,
    savesCount: 115,
    isFeatured: false,
    isSample: true
  },
  {
    id: 'opp-107',
    title: 'برنامج التطوع الميداني للتعليم والمبادرات المجتمعية في مأرب',
    englishTitle: 'Field Volunteer for Community Education in Marib',
    organizationId: 'org-yemen-dev-found',
    organizationName: 'مؤسسة الرواد للتنمية المستدامة',
    organizationLogo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
    organizationVerified: true,
    category: 'volunteering',
    type: 'temporary',
    status: 'published',
    governorate: 'مأرب',
    city: 'مأرب',
    isRemote: false,
    isInternational: false,
    description: 'مبادرة تطوعية تستهدف تنظيم حملات توعية وتقوية تعليمية للأطفال والشباب في مخيمات ومناطق المحافظة.',
    responsibilities: [
      'المشاركة في تقديم الأنشطة التعليمية والترفيهية للأطفال.',
      'تنسيق اللقاءات مع الأهالي وتوزيع الحقائب المدرسية.'
    ],
    requirements: [
      'الرغبة الصادقة والالتزام بالعمل التطوعي المجتمعي.',
      'الإقامة أو القدرة على التواجد في محافظة مأرب.'
    ],
    requiredSkills: ['العمل الجماعي', 'القدرة على التكيف', 'التواصل المجتمعي'],
    educationLevel: 'high_school',
    experienceLevel: 'not_required',
    benefits: ['شهادة تطوع رسمية من المؤسسة', 'تغطية مواصلات الميدان والوجبات'],
    isPaid: false,
    applicationMethod: 'external_link',
    applicationUrl: 'https://alruwad-yemen.org/volunteer-marib',
    deadline: '2026-08-31',
    postedAt: '2026-08-04',
    viewsCount: 380,
    savesCount: 95,
    isFeatured: false,
    isSample: true
  }
];

export const DEMO_CANDIDATE_PROFILES: Record<string, CandidateProfile> = {
  'usr-cand-1': {
    userId: 'usr-cand-1',
    fullName: 'أحمد علي السعدي',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    governorate: 'أمانة العاصمة',
    city: 'صنعاء',
    district: 'الصافية',
    bio: 'مطور واجهات أمامية وشغوف بالتكنولوجيا والذكاء الاصطناعي. أسعى للانضمام إلى فرق عمل ديناميكية لتطوير منصات تخدم المجتمع اليمني وتفتح آفاقاً جديدة للشباب.',
    fieldOfStudy: 'تقنية المعلومات وعلوم الحاسوب',
    educationLevel: 'bachelor',
    graduationYear: '2024',
    skills: [
      { name: 'React.js', level: 'advanced' },
      { name: 'TypeScript', level: 'intermediate' },
      { name: 'Tailwind CSS', level: 'advanced' },
      { name: 'Git', level: 'intermediate' },
      { name: 'Node.js', level: 'beginner' }
    ],
    languages: [
      { name: 'اللغة العربية', fluency: 'native' },
      { name: 'اللغة الإنجليزية', fluency: 'fluent' }
    ],
    workExperience: [
      {
        id: 'exp-1',
        company: 'حلول الويب المبتكرة - صنعاء',
        title: 'مطور واجهات متدرب',
        startDate: '2023-01',
        endDate: '2024-05',
        current: false,
        description: 'تصميم وتنفيذ مواقع ويب تفاعلية لعدة متجر ومبادرات محلية باستخدام React.'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        title: 'شهادة أساسيات تطوير الويب الحديث',
        issuer: 'أكاديمية حاسوب',
        year: '2023'
      }
    ],
    interests: ['jobs', 'internships', 'remote'],
    preferredLocations: ['أمانة العاصمة', 'عدن', 'عن بُعد'],
    remotePreference: true,
    cvUrl: 'https://example.com/cv-ahmed-demo.pdf',
    cvFileName: 'CV_Ahmed_Ali_IT_2026.pdf',
    cvUploadedAt: '2026-07-28',
    isCvPublic: true,
    completenessPercentage: 85
  },
  'usr-cand-2': {
    userId: 'usr-cand-2',
    fullName: 'سارة خالد باوزير',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    governorate: 'عدن',
    city: 'عدن',
    district: 'خور مكسر',
    bio: 'أخصائية إدارة مشاريع وتسويق رقمي مقيمة في عدن. أمتلك خبرة واسعة في بناء حملات التواصل التنموي وإدارة المبادرات.',
    fieldOfStudy: 'إدارة الأعمال والعلوم المالية',
    educationLevel: 'master',
    graduationYear: '2023',
    skills: [
      { name: 'إدارة المشاريع', level: 'advanced' },
      { name: 'التسويق الرقمي', level: 'advanced' },
      { name: 'صناعة المحتوى', level: 'intermediate' },
      { name: 'تحليل البيانات', level: 'intermediate' }
    ],
    languages: [
      { name: 'اللغة العربية', fluency: 'native' },
      { name: 'اللغة الإنجليزية', fluency: 'fluent' }
    ],
    workExperience: [
      {
        id: 'exp-sara-1',
        company: 'مؤسسة صُنّاع الأمل - عدن',
        title: 'مساعد مدير مشروع',
        startDate: '2023-01',
        endDate: '2025-01',
        current: false,
        description: 'إدارة المبادرات الشبابية والتواصل مع الشركاء المحليين والتنمويين.'
      }
    ],
    certifications: [
      {
        id: 'cert-sara-1',
        title: 'شهادة إدارة المشاريع الاحترافية (PMP)',
        issuer: 'PMI Yemen Chapter',
        year: '2024'
      }
    ],
    interests: ['jobs', 'training', 'volunteering'],
    preferredLocations: ['عدن', 'حضرموت', 'عن بُعد'],
    remotePreference: true,
    cvUrl: 'https://example.com/cv-sara.pdf',
    cvFileName: 'CV_Sara_Bawazir_Aden_2026.pdf',
    cvUploadedAt: '2026-08-01',
    isCvPublic: true,
    completenessPercentage: 95
  },
  'usr-cand-3': {
    userId: 'usr-cand-3',
    fullName: 'محمد عبد الله الشرفي',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    governorate: 'تعز',
    city: 'تعز',
    district: 'المظفر',
    bio: 'مهندس مدني حديث التخرج مهتم بفرص التدريب الميداني والمنح الدراسية للماجستير بالخارج والعمل الإنشائي.',
    fieldOfStudy: 'الهندسة المدنية والإنشاءات',
    educationLevel: 'bachelor',
    graduationYear: '2025',
    skills: [
      { name: 'AutoCAD 2D/3D', level: 'advanced' },
      { name: 'إدارة الموقع الإنشائي', level: 'intermediate' },
      { name: 'كتابة التقارير الفنية', level: 'intermediate' }
    ],
    languages: [
      { name: 'اللغة العربية', fluency: 'native' },
      { name: 'اللغة الإنجليزية', fluency: 'intermediate' }
    ],
    workExperience: [],
    certifications: [
      {
        id: 'cert-m-1',
        title: 'دورة النمذجة الإنشائية SAP2000',
        issuer: 'نقابة المهندسين تعز',
        year: '2025'
      }
    ],
    interests: ['scholarships', 'jobs', 'internships'],
    preferredLocations: ['تعز', 'إب', 'دولية'],
    remotePreference: false,
    cvUrl: 'https://example.com/cv-mohamed.pdf',
    cvFileName: 'CV_Mohamed_Sharafy_CivilEng.pdf',
    cvUploadedAt: '2026-08-03',
    isCvPublic: true,
    completenessPercentage: 80
  }
};

export const INITIAL_CANDIDATE_PROFILE: CandidateProfile = DEMO_CANDIDATE_PROFILES['usr-cand-1'];

export const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-cand-1',
    title: 'فرصة مناسبة لملفك الشخصي! 🎯',
    message: 'تم نشر فرصة "مطور واجهات أمامية" بتوافق قدره 90% مع مهاراتك المضافة.',
    type: 'match',
    link: 'opp-101',
    isRead: false,
    createdAt: '2026-08-07T10:30:00'
  },
  {
    id: 'notif-2',
    userId: 'usr-cand-1',
    title: 'تذكير باقتراب الموعد النهائي ⏳',
    message: 'ينتهي التقديم على "برنامج التدريب العملي في عدن" خلال 20 يوماً.',
    type: 'deadline',
    link: 'opp-102',
    isRead: false,
    createdAt: '2026-08-06T14:00:00'
  }
];

export const INITIAL_REPORTS: OpportunityReport[] = [
  {
    id: 'rep-1',
    reporterId: 'usr-cand-2',
    reporterName: 'سارة خالد',
    opportunityId: 'opp-fake-demo',
    opportunityTitle: 'طلب توظيف غير واضح التفاصيل',
    reason: 'incorrect_info',
    details: 'الرابط المرفق لا يؤدي لصفحة التقديم المباشرة وإنما لموقع إعلانات غير متعلق.',
    status: 'pending',
    createdAt: '2026-08-05T16:20:00'
  }
];
