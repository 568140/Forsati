import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'jobs',
    nameAr: 'وظائف',
    nameEn: 'Jobs',
    iconName: 'Briefcase',
    color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200',
    description: 'وظائف دوام كامل وجزئي في مختلف القطاعات في اليمن والمنطقة'
  },
  {
    id: 'internships',
    nameAr: 'تدريب عملي',
    nameEn: 'Internships',
    iconName: 'GraduationCap',
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200',
    description: 'برامج تدريب خريجين وطلاب اكتساب الخبرة الميدانية'
  },
  {
    id: 'scholarships',
    nameAr: 'منح دراسية',
    nameEn: 'Scholarships',
    iconName: 'Award',
    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200',
    description: 'منح دراسية بكالوريوس وماجستير ودكتوراه لليمنيين'
  },
  {
    id: 'training',
    nameAr: 'دورات تدريبية',
    nameEn: 'Training',
    iconName: 'BookOpen',
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200',
    description: 'برامج بناء المهارات الفنية والإدارية الحشورية والافتراضية'
  },
  {
    id: 'courses',
    nameAr: 'مساقات تعليمية',
    nameEn: 'Courses',
    iconName: 'Laptop',
    color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200',
    description: 'مساقات الكترونية وشهادات معتمدة عبر الإنترنت'
  },
  {
    id: 'volunteering',
    nameAr: 'تطوع',
    nameEn: 'Volunteering',
    iconName: 'HeartHandshake',
    color: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200',
    description: 'فرص عمل تطوعي ومبادرات مجتمعية وإنسانية'
  },
  {
    id: 'competitions',
    nameAr: 'مسابقات وشعارات',
    nameEn: 'Competitions',
    iconName: 'Trophy',
    color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200',
    description: 'مسابقات ابتكار وتصميم وهكثونات وجوائز نقدية'
  },
  {
    id: 'entrepreneurship',
    nameAr: 'برامج ريادة الأعمال',
    nameEn: 'Entrepreneurship',
    iconName: 'Rocket',
    color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200',
    description: 'حاضنات ومسرعات أعمال وتمويل للمشاريع الناشئة'
  },
  {
    id: 'fellowships',
    nameAr: 'زمالات',
    nameEn: 'Fellowships',
    iconName: 'Medal',
    color: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200',
    description: 'برامج زمالة بحثية وقيادية للمحترفين والأكاديميين'
  },
  {
    id: 'grants',
    nameAr: 'منح تمويلية',
    nameEn: 'Grants',
    iconName: 'Coins',
    color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200',
    description: 'منح مالية لدعم المبادرات والبحوث والمشاريع'
  },
  {
    id: 'remote',
    nameAr: 'عمل عن بُعد',
    nameEn: 'Remote Work',
    iconName: 'Globe',
    color: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200',
    description: 'وظائف وفرص من المنزل مع شركات عربية وعالمية'
  },
  {
    id: 'freelance',
    nameAr: 'عمل حر',
    nameEn: 'Freelance',
    iconName: 'Clock',
    color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200',
    description: 'مشاريع ومهام مستقلة في البرمجة والتصميم والترجمة'
  },
  {
    id: 'youth_programs',
    nameAr: 'برامج الشباب',
    nameEn: 'Youth Programs',
    iconName: 'Users',
    color: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-200',
    description: 'منتديات وقمم ومخيمات بناء القيادات الشبابية'
  },
  {
    id: 'student_opportunities',
    nameAr: 'فرص الطلاب',
    nameEn: 'Student Opps',
    iconName: 'Sparkles',
    color: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200',
    description: 'أنشطة وتبادلات ثقافية وخصومات ودعم الأبحاث الطلابية'
  }
];

export const GOVERNORATES_LIST: { name: string; isRemoteOrIntl?: boolean }[] = [
  { name: 'أمانة العاصمة' },
  { name: 'عدن' },
  { name: 'تعز' },
  { name: 'حضرموت' },
  { name: 'إب' },
  { name: 'الحديدة' },
  { name: 'مأرب' },
  { name: 'شبوة' },
  { name: 'المهرة' },
  { name: 'سقطرى' },
  { name: 'ذمار' },
  { name: 'حجة' },
  { name: 'صعدة' },
  { name: 'عمران' },
  { name: 'البيضاء' },
  { name: 'أبين' },
  { name: 'لحج' },
  { name: 'الضالع' },
  { name: 'ريمة' },
  { name: 'الجوف' },
  { name: 'المحويت' },
  { name: 'عن بُعد', isRemoteOrIntl: true },
  { name: 'دولية', isRemoteOrIntl: true }
];
