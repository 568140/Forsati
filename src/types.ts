export type UserRole = 
  | 'guest' 
  | 'candidate' 
  | 'organization' 
  | 'moderator' 
  | 'admin';

export type CategoryId = 
  | 'jobs' 
  | 'internships' 
  | 'scholarships' 
  | 'training' 
  | 'courses' 
  | 'volunteering' 
  | 'competitions' 
  | 'entrepreneurship' 
  | 'fellowships' 
  | 'grants' 
  | 'remote' 
  | 'freelance' 
  | 'youth_programs' 
  | 'student_opportunities';

export interface CategoryInfo {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
  iconName: string;
  color: string;
  description: string;
}

export type YemenGovernorate = 
  | 'أمانة العاصمة'
  | 'عدن'
  | 'تعز'
  | 'حضرموت'
  | 'إب'
  | 'الحديدة'
  | 'مأرب'
  | 'شبوة'
  | 'المهرة'
  | 'سقطرى'
  | 'ذمار'
  | 'حجة'
  | 'صعدة'
  | 'عمران'
  | 'البيضاء'
  | 'أبين'
  | 'لحج'
  | 'الضالع'
  | 'ريمة'
  | 'الجوف'
  | 'المحويت'
  | 'عن بُعد'
  | 'دولية';

export type OpportunityStatus = 
  | 'draft' 
  | 'pending' 
  | 'approved' 
  | 'published' 
  | 'rejected' 
  | 'expired';

export type OpportunityType = 
  | 'full_time' 
  | 'part_time' 
  | 'contract' 
  | 'temporary' 
  | 'remote' 
  | 'hybrid' 
  | 'onsite';

export type LocationType = 'on_site' | 'remote' | 'hybrid';

export type EducationLevel = 
  | 'high_school' 
  | 'diploma' 
  | 'bachelor' 
  | 'master' 
  | 'phd' 
  | 'any';

export type ExperienceLevel = 
  | 'fresh' 
  | 'junior' 
  | 'mid' 
  | 'senior' 
  | 'expert' 
  | 'not_required';

export interface SkillItem {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface LanguageItem {
  name: string;
  fluency: 'basic' | 'intermediate' | 'fluent' | 'native';
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface CandidateProfile {
  userId: string;
  fullName: string;
  photo?: string;
  governorate: YemenGovernorate;
  city: string;
  district?: string;
  bio?: string;
  fieldOfStudy?: string;
  educationLevel: EducationLevel;
  graduationYear?: string;
  skills: SkillItem[];
  languages: LanguageItem[];
  workExperience: WorkExperienceItem[];
  certifications: CertificationItem[];
  interests: CategoryId[];
  preferredLocations: YemenGovernorate[];
  remotePreference: boolean;
  cvUrl?: string;
  cvFileName?: string;
  cvUploadedAt?: string;
  isCvPublic: boolean;
  completenessPercentage: number;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  linkedin?: string;
  x?: string;
  telegram?: string;
  instagram?: string;
}

export interface Organization {
  id: string;
  userId?: string;
  name: string;
  englishName?: string;
  logo: string;
  coverImage?: string;
  description: string;
  website?: string;
  email: string;
  phone?: string;
  governorate: YemenGovernorate;
  city: string;
  industry: string;
  isVerified: boolean;
  verificationBadgeDate?: string;
  isPremium?: boolean;
  socialLinks?: SocialLinks;
  createdAt: string;
  opportunitiesCount?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  englishTitle?: string;
  organizationId: string;
  organizationName: string;
  organizationLogo: string;
  organizationVerified: boolean;
  category: CategoryId;
  type: OpportunityType;
  status: OpportunityStatus;
  governorate: YemenGovernorate;
  city: string;
  district?: string;
  isRemote: boolean;
  isInternational: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  educationLevel: EducationLevel;
  experienceLevel: ExperienceLevel;
  benefits?: string[];
  salaryOrStipend?: string; // Optional real amount
  isPaid?: boolean;
  applicationMethod: 'external_link' | 'email' | 'custom_instructions';
  applicationUrl: string;
  contactEmail?: string;
  contactPhone?: string;
  deadline: string; // ISO date string YYYY-MM-DD
  postedAt: string; // ISO date string
  viewsCount: number;
  savesCount: number;
  isFeatured?: boolean;
  isSample?: boolean;
  rejectionReason?: string;
}

export type TrackingStatus = 
  | 'interested' 
  | 'saved' 
  | 'applied' 
  | 'interview' 
  | 'accepted' 
  | 'rejected'
  | 'withdrawn';

export interface ApplicationTrackerItem {
  id: string;
  candidateId: string;
  opportunityId: string;
  opportunityTitle: string;
  organizationName: string;
  status: TrackingStatus;
  notes?: string;
  appliedDate?: string;
  updatedAt: string;
}

export type ReportReason = 
  | 'scam' 
  | 'fake_org' 
  | 'incorrect_info' 
  | 'expired' 
  | 'duplicate' 
  | 'inappropriate';

export interface OpportunityReport {
  id: string;
  reporterId: string;
  reporterName: string;
  opportunityId: string;
  opportunityTitle: string;
  reason: ReportReason;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'deadline' | 'status_change' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  documentName: string;
  documentUrl?: string;
  taxId?: string;
  contactPerson: string;
  contactEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  governorate?: YemenGovernorate;
  createdAt: string;
  isBlocked?: boolean;
}

export interface MatchResult {
  compatibilityPercentage: number;
  reasons: string[];
  matchingSkills: string[];
  missingSkills: string[];
}

export interface OpportunityFilter {
  searchQuery: string;
  category: CategoryId | 'all';
  governorate: YemenGovernorate | 'all';
  opportunityType: OpportunityType | 'all';
  educationLevel: EducationLevel | 'all';
  experienceLevel: ExperienceLevel | 'all';
  isRemoteOnly: boolean;
  isVerifiedOnly: boolean;
  isPaidOnly: boolean;
  deadlineBefore?: string;
  sortBy: 'recent' | 'deadline_soon' | 'best_match' | 'most_viewed';
}

export interface PlatformStats {
  totalUsers: number;
  activeCandidates: number;
  totalOrganizations: number;
  verifiedOrganizations: number;
  totalOpportunities: number;
  publishedOpportunities: number;
  pendingOpportunities: number;
  expiredOpportunities: number;
  totalReports: number;
  pendingReports: number;
}
