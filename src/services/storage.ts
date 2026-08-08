import { 
  Opportunity, 
  Organization, 
  CandidateProfile, 
  ApplicationTrackerItem, 
  OpportunityReport, 
  UserNotification, 
  VerificationRequest,
  OpportunityFilter,
  PlatformStats,
  CategoryId
} from '../types';
import { SEED_OPPORTUNITIES, SEED_ORGANIZATIONS, INITIAL_CANDIDATE_PROFILE, DEMO_CANDIDATE_PROFILES, INITIAL_NOTIFICATIONS, INITIAL_REPORTS } from '../data/seedData';
import { saveToFirestore, deleteFromFirestore, fetchCollectionFromFirestore } from '../lib/firestoreService';

const STORAGE_KEYS = {
  OPPORTUNITIES: 'forsati_opportunities_v1',
  ORGANIZATIONS: 'forsati_organizations_v1',
  CANDIDATE_PROFILE: 'forsati_candidate_profile_v1',
  SAVED_OPPS: 'forsati_saved_opportunities_v1',
  FOLLOWED_ORGS: 'forsati_followed_orgs_v1',
  APPLICATION_TRACKING: 'forsati_app_tracking_v1',
  REPORTS: 'forsati_reports_v1',
  NOTIFICATIONS: 'forsati_notifications_v1',
  VERIFICATIONS: 'forsati_verifications_v1',
  FEATURED_IDS: 'forsati_featured_ids_v1',
  USERS: 'forsati_users_v1',
  SETTINGS: 'forsati_settings_v1',
  CUSTOM_CATEGORIES: 'forsati_custom_categories_v1'
};

// Async sync with Firestore on startup
let isFirestoreSynced = false;
export async function syncFromFirestore() {
  if (isFirestoreSynced || typeof window === 'undefined') return;
  isFirestoreSynced = true;
  try {
    const firestoreOpps = await fetchCollectionFromFirestore('opportunities');
    if (firestoreOpps && firestoreOpps.length > 0 && !localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(firestoreOpps));
    }

    const firestoreOrgs = await fetchCollectionFromFirestore('organizations');
    if (firestoreOrgs && firestoreOrgs.length > 0 && !localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS)) {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(firestoreOrgs));
    }

    const firestoreUsers = await fetchCollectionFromFirestore('userAccounts');
    if (firestoreUsers && firestoreUsers.length > 0 && !localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(firestoreUsers));
    }

    const firestoreApps = await fetchCollectionFromFirestore('applications');
    if (firestoreApps && firestoreApps.length > 0 && !localStorage.getItem(STORAGE_KEYS.APPLICATION_TRACKING)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATION_TRACKING, JSON.stringify(firestoreApps));
    }

    const firestoreReports = await fetchCollectionFromFirestore('reports');
    if (firestoreReports && firestoreReports.length > 0 && !localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(firestoreReports));
    }
  } catch (e) {
    console.warn('Initial Firestore sync notice:', e);
  }
}

// Helper to initialize local storage with seed data
export function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(SEED_OPPORTUNITIES));
    SEED_OPPORTUNITIES.forEach(opp => saveToFirestore('opportunities', opp.id, opp));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS)) {
    localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(SEED_ORGANIZATIONS));
    SEED_ORGANIZATIONS.forEach(org => saveToFirestore('organizations', org.id, org));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CANDIDATE_PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.CANDIDATE_PROFILE, JSON.stringify(INITIAL_CANDIDATE_PROFILE));
    saveToFirestore('candidateProfiles', INITIAL_CANDIDATE_PROFILE.userId, INITIAL_CANDIDATE_PROFILE);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_OPPS)) {
    localStorage.setItem(STORAGE_KEYS.SAVED_OPPS, JSON.stringify(['opp-101', 'opp-103']));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FOLLOWED_ORGS)) {
    localStorage.setItem(STORAGE_KEYS.FOLLOWED_ORGS, JSON.stringify(['org-yemen-tech']));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATION_TRACKING)) {
    const initialTracking: ApplicationTrackerItem[] = [
      {
        id: 'track-1',
        candidateId: 'usr-cand-1',
        opportunityId: 'opp-101',
        opportunityTitle: 'مطور واجهات أمامية Full-stack React & Node.js',
        organizationName: 'شركة اليمن للحلول الرقمية (YemenTech)',
        status: 'applied',
        notes: 'تم إرسال طلب التقديم عبر الموقع الرسمي برقم مرجعي #9082',
        appliedDate: '2026-08-02',
        updatedAt: '2026-08-02'
      },
      {
        id: 'track-2',
        candidateId: 'usr-cand-1',
        opportunityId: 'opp-104',
        opportunityTitle: 'دورة مكثفة في تحليل البيانات باستخدام Python & Power BI',
        organizationName: 'مركز الحضارة للتدريب والاستشارات',
        status: 'saved',
        notes: 'بانتظار تجهيز مشروع المعرض قبل التقديم النهائي',
        updatedAt: '2026-08-05'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.APPLICATION_TRACKING, JSON.stringify(initialTracking));
    initialTracking.forEach(app => saveToFirestore('applications', app.id, app));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    INITIAL_REPORTS.forEach(rep => saveToFirestore('reports', rep.id, rep));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VERIFICATIONS)) {
    const initialVerifications: VerificationRequest[] = [
      {
        id: 'ver-1',
        organizationId: 'org-hadhramout-center',
        organizationName: 'مركز الحضارة للتدريب والاستشارات',
        documentName: 'السجل_التجاري_المعتمد.pdf',
        contactPerson: 'عمر بن طالب',
        contactEmail: 'training@hadhramout-center.com',
        status: 'approved',
        submittedAt: '2025-01-10',
        notes: 'تمت مطابقة البيانات بالسجل الرسمي وتم منح الشارة.'
      },
      {
        id: 'ver-2',
        organizationId: 'org-taiz-innov',
        organizationName: 'حاضنة تعز للابتكار وريادة الأعمال',
        documentName: 'ترخيص_وزارة_الشؤون_الاجتماعية_والعمل.pdf',
        contactPerson: 'سامي عبدالجليل',
        contactEmail: 'contact@taizhub.org',
        status: 'pending',
        submittedAt: '2026-08-01',
        notes: 'بانتظار مراجعة الوثيقة الرسمية من قبل إدارة المنصة.'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(initialVerifications));
    initialVerifications.forEach(ver => saveToFirestore('verifications', ver.id, ver));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const initialUsers = [
      { id: 'usr-cand-1', name: 'أحمد علي السعدي', email: 'ahmed.saadi@gmail.com', password: 'password123', role: 'candidate', governorate: 'أمانة العاصمة', createdAt: '2025-02-10', isBlocked: false },
      { id: 'usr-cand-2', name: 'سارة خالد باوزير', email: 'sara.bawazir@outlook.com', password: 'password123', role: 'candidate', governorate: 'عدن', createdAt: '2025-03-01', isBlocked: false },
      { id: 'usr-cand-3', name: 'محمد عبد الله الشرفي', email: 'm.sharafy@gmail.com', password: 'password123', role: 'candidate', governorate: 'تعز', createdAt: '2025-04-12', isBlocked: false },
      { id: 'usr-org-1', name: 'مسؤول توظيف شركة اليمن للحلول الرقمية', email: 'hr@yementech-demo.ye', password: 'password123', role: 'organization', governorate: 'أمانة العاصمة', createdAt: '2024-06-10', isBlocked: false },
      { id: 'usr-org-2', name: 'إدارة مؤسسة الرواد للتنمية', email: 'info@alruwad-yemen.org', password: 'password123', role: 'organization', governorate: 'عدن', createdAt: '2024-03-01', isBlocked: false },
      { id: 'usr-mod-1', name: 'أيمن المشرف الميداني', email: 'mod@forsati.ye', password: 'password123', role: 'moderator', governorate: 'حضرموت', createdAt: '2024-01-01', isBlocked: false },
      { id: 'usr-adm-1', name: 'مدير منصة فرصتي (Admin)', email: 'am1075022@gmail.com', password: 'adminpassword123', role: 'admin', governorate: 'أمانة العاصمة', createdAt: '2024-01-01', isBlocked: false }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    initialUsers.forEach(u => saveToFirestore('userAccounts', u.id, u));
  }

  // Trigger background sync
  syncFromFirestore();
}

// Ensure auto init
initializeStorage();

// OPPORTUNITY STORAGE HELPERS
export function getOpportunities(): Opportunity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    const opps: Opportunity[] = data ? JSON.parse(data) : SEED_OPPORTUNITIES;
    
    // Auto mark expired if deadline passed
    const todayISO = new Date().toISOString().split('T')[0];
    let updated = false;
    opps.forEach(opp => {
      if (opp.status === 'published' && opp.deadline && opp.deadline < todayISO) {
        opp.status = 'expired';
        updated = true;
        saveToFirestore('opportunities', opp.id, { status: 'expired' });
      }
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
    }

    return opps;
  } catch (e) {
    return SEED_OPPORTUNITIES;
  }
}

export function saveOpportunity(opp: Opportunity): Opportunity {
  const opps = getOpportunities();
  const existingIdx = opps.findIndex(o => o.id === opp.id);
  if (existingIdx >= 0) {
    opps[existingIdx] = opp;
  } else {
    opps.unshift(opp);
  }
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  saveToFirestore('opportunities', opp.id, opp);
  return opp;
}

export function updateOpportunityStatus(id: string, status: 'published' | 'pending' | 'draft' | 'rejected' | 'expired') {
  const opps = getOpportunities();
  const opp = opps.find(o => o.id === id);
  if (opp) {
    opp.status = status;
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
    saveToFirestore('opportunities', id, { status });
  }
}

export function deleteOpportunity(id: string) {
  const opps = getOpportunities().filter(o => o.id !== id);
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  deleteFromFirestore('opportunities', id);
}

export function incrementOpportunityViews(id: string) {
  const opps = getOpportunities();
  const opp = opps.find(o => o.id === id);
  if (opp) {
    opp.viewsCount = (opp.viewsCount || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  }
}

// FILTER & SEARCH ENGINE
export function filterOpportunities(filter: OpportunityFilter, currentProfile?: CandidateProfile | null): Opportunity[] {
  let list = getOpportunities();

  // Search Query
  if (filter.searchQuery.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    list = list.filter(o => 
      o.title.toLowerCase().includes(q) ||
      (o.englishTitle && o.englishTitle.toLowerCase().includes(q)) ||
      o.organizationName.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q) ||
      o.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
      o.governorate.toLowerCase().includes(q)
    );
  }

  // Category
  if (filter.category && filter.category !== 'all') {
    list = list.filter(o => o.category === filter.category);
  }

  // Governorate
  if (filter.governorate && filter.governorate !== 'all') {
    list = list.filter(o => o.governorate === filter.governorate);
  }

  // Opportunity Type
  if (filter.opportunityType && filter.opportunityType !== 'all') {
    list = list.filter(o => o.type === filter.opportunityType);
  }

  // Education Level
  if (filter.educationLevel && filter.educationLevel !== 'all') {
    list = list.filter(o => o.educationLevel === filter.educationLevel || o.educationLevel === 'any');
  }

  // Experience Level
  if (filter.experienceLevel && filter.experienceLevel !== 'all') {
    list = list.filter(o => o.experienceLevel === filter.experienceLevel || o.experienceLevel === 'not_required');
  }

  // Remote only
  if (filter.isRemoteOnly) {
    list = list.filter(o => o.isRemote);
  }

  // Verified only
  if (filter.isVerifiedOnly) {
    list = list.filter(o => o.organizationVerified);
  }

  // Paid only
  if (filter.isPaidOnly) {
    list = list.filter(o => o.isPaid);
  }

  // Sorting
  switch (filter.sortBy) {
    case 'recent':
      list.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      break;
    case 'deadline_soon':
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      break;
    case 'most_viewed':
      list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
      break;
    case 'best_match':
      if (currentProfile) {
        // Sort by skills match count
        const profileSkills = (currentProfile.skills || []).map(s => (typeof s === 'string' ? s : s?.name || '').toLowerCase());
        list.sort((a, b) => {
          const matchA = a.requiredSkills.filter(s => profileSkills.includes(s.toLowerCase())).length;
          const matchB = b.requiredSkills.filter(s => profileSkills.includes(s.toLowerCase())).length;
          return matchB - matchA;
        });
      }
      break;
  }

  return list;
}

// ORGANIZATIONS & ORGANIZATION PROFILES
export function getOrganizations(): Organization[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
    return data ? JSON.parse(data) : SEED_ORGANIZATIONS;
  } catch (e) {
    return SEED_ORGANIZATIONS;
  }
}

export function getOrganizationProfile(targetId?: string): Organization {
  const orgs = getOrganizations();
  if (!targetId) return orgs[0];

  const found = orgs.find(o => o.userId === targetId || o.id === targetId || o.email === targetId);
  if (found) return found;

  if (targetId === 'usr-org-1') return orgs.find(o => o.id === 'org-yemen-tech') || orgs[0];
  if (targetId === 'usr-org-2') return orgs.find(o => o.id === 'org-yemen-dev-found') || orgs[1] || orgs[0];

  const users = getUserAccounts();
  const userAcc = users.find((u: any) => u.id === targetId || u.email === targetId);
  const newOrg: Organization = {
    id: `org-${targetId}`,
    userId: targetId,
    name: userAcc?.name || 'جهة ناشرة',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    description: 'جهة مسجلة لنشر وتتبع الفرص في منصة فرصتي.',
    email: userAcc?.email || 'org@forsati.ye',
    governorate: userAcc?.governorate || 'أمانة العاصمة',
    city: userAcc?.governorate || 'صنعاء',
    industry: 'خدمات وأعمال',
    isVerified: false,
    createdAt: new Date().toISOString().split('T')[0]
  };
  return newOrg;
}

export function saveOrganization(org: Organization): Organization {
  const orgs = getOrganizations();
  const idx = orgs.findIndex(o => o.id === org.id || (o.userId && o.userId === org.userId));
  if (idx >= 0) {
    orgs[idx] = { ...orgs[idx], ...org };
  } else {
    orgs.unshift(org);
  }
  localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
  saveToFirestore('organizations', org.id, org);
  return org;
}

// CANDIDATE PROFILE
export function getCandidateProfile(userId?: string): CandidateProfile {
  const targetId = userId || 'usr-cand-1';
  try {
    const key = `${STORAGE_KEYS.CANDIDATE_PROFILE}_${targetId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    if (DEMO_CANDIDATE_PROFILES[targetId]) {
      localStorage.setItem(key, JSON.stringify(DEMO_CANDIDATE_PROFILES[targetId]));
      return DEMO_CANDIDATE_PROFILES[targetId];
    }

    const users = getUserAccounts();
    const userAcc = users.find((u: any) => u.id === targetId || u.email === targetId);
    const newProfile: CandidateProfile = {
      userId: targetId,
      fullName: userAcc?.name || 'مستخدم جديد',
      photo: userAcc?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      governorate: userAcc?.governorate || 'أمانة العاصمة',
      city: userAcc?.governorate || 'صنعاء',
      educationLevel: 'bachelor',
      skills: [],
      languages: [{ name: 'اللغة العربية', fluency: 'native' }],
      workExperience: [],
      certifications: [],
      interests: ['jobs'],
      preferredLocations: [userAcc?.governorate || 'أمانة العاصمة'],
      remotePreference: true,
      isCvPublic: false,
      completenessPercentage: 25
    };
    localStorage.setItem(key, JSON.stringify(newProfile));
    return newProfile;
  } catch (e) {
    return DEMO_CANDIDATE_PROFILES[targetId] || DEMO_CANDIDATE_PROFILES['usr-cand-1'];
  }
}

export function saveCandidateProfile(profile: CandidateProfile, userId?: string): CandidateProfile {
  const targetId = userId || profile.userId || 'usr-cand-1';
  profile.userId = targetId;

  // Calculate completeness percentage
  let score = 20; // Base profile creation
  if (profile.fullName) score += 10;
  if (profile.bio) score += 10;
  if (profile.fieldOfStudy) score += 10;
  if (profile.skills && profile.skills.length > 0) score += 15;
  if (profile.languages && profile.languages.length > 0) score += 10;
  if (profile.workExperience && profile.workExperience.length > 0) score += 10;
  if (profile.certifications && profile.certifications.length > 0) score += 5;
  if (profile.cvUrl) score += 10;

  profile.completenessPercentage = Math.min(100, score);
  
  const key = `${STORAGE_KEYS.CANDIDATE_PROFILE}_${targetId}`;
  localStorage.setItem(key, JSON.stringify(profile));
  localStorage.setItem(STORAGE_KEYS.CANDIDATE_PROFILE, JSON.stringify(profile));

  // Sync user account in users table if needed
  try {
    const users = getUserAccounts();
    const idx = users.findIndex((u: any) => u.id === targetId);
    if (idx >= 0) {
      users[idx].name = profile.fullName;
      if (profile.governorate) users[idx].governorate = profile.governorate;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      saveToFirestore('userAccounts', targetId, users[idx]);
    }
  } catch (e) {
    // ignore
  }

  saveToFirestore('candidateProfiles', targetId, profile);
  return profile;
}

// SAVED OPPORTUNITIES & FOLLOWED ORGS
export function getSavedOpportunityIds(userId?: string): string[] {
  const targetId = userId || 'usr-cand-1';
  try {
    const key = `${STORAGE_KEYS.SAVED_OPPS}_${targetId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    let initial: string[] = [];
    if (targetId === 'usr-cand-1') initial = ['opp-101', 'opp-103'];
    if (targetId === 'usr-cand-2') initial = ['opp-102'];
    if (targetId === 'usr-cand-3') initial = ['opp-105'];

    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  } catch (e) {
    return [];
  }
}

export function toggleSaveOpportunity(oppId: string, userId?: string): boolean {
  const targetId = userId || 'usr-cand-1';
  const saved = getSavedOpportunityIds(targetId);
  const index = saved.indexOf(oppId);
  let isSaved = false;
  if (index >= 0) {
    saved.splice(index, 1);
  } else {
    saved.push(oppId);
    isSaved = true;
  }
  
  const key = `${STORAGE_KEYS.SAVED_OPPS}_${targetId}`;
  localStorage.setItem(key, JSON.stringify(saved));
  
  // Update opp saves count
  const opps = getOpportunities();
  const opp = opps.find(o => o.id === oppId);
  if (opp) {
    opp.savesCount = Math.max(0, (opp.savesCount || 0) + (isSaved ? 1 : -1));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  }
  
  return isSaved;
}

export function getFollowedOrgIds(userId?: string): string[] {
  const targetId = userId || 'usr-cand-1';
  try {
    const key = `${STORAGE_KEYS.FOLLOWED_ORGS}_${targetId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    let initial: string[] = [];
    if (targetId === 'usr-cand-1') initial = ['org-yemen-tech'];
    if (targetId === 'usr-cand-2') initial = ['org-yemen-dev-found'];

    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  } catch (e) {
    return [];
  }
}

export function toggleFollowOrg(orgId: string, userId?: string): boolean {
  const targetId = userId || 'usr-cand-1';
  const followed = getFollowedOrgIds(targetId);
  const index = followed.indexOf(orgId);
  let isFollowed = false;
  if (index >= 0) {
    followed.splice(index, 1);
  } else {
    followed.push(orgId);
    isFollowed = true;
  }
  const key = `${STORAGE_KEYS.FOLLOWED_ORGS}_${targetId}`;
  localStorage.setItem(key, JSON.stringify(followed));
  return isFollowed;
}

// APPLICATION TRACKER
export function getApplicationTrackerItems(): ApplicationTrackerItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATION_TRACKING);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveApplicationTrackerItem(item: ApplicationTrackerItem): ApplicationTrackerItem {
  const list = getApplicationTrackerItems();
  const idx = list.findIndex(i => i.id === item.id || (i.opportunityId === item.opportunityId && i.candidateId === item.candidateId));
  item.updatedAt = new Date().toISOString().split('T')[0];
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...item };
  } else {
    list.unshift(item);
  }
  localStorage.setItem(STORAGE_KEYS.APPLICATION_TRACKING, JSON.stringify(list));
  saveToFirestore('applications', item.id, item);
  return item;
}

export function updateApplicationTrackerItem(id: string, updates: Partial<ApplicationTrackerItem>) {
  const list = getApplicationTrackerItems();
  const item = list.find(i => i.id === id);
  if (item) {
    Object.assign(item, updates, { updatedAt: new Date().toISOString().split('T')[0] });
    localStorage.setItem(STORAGE_KEYS.APPLICATION_TRACKING, JSON.stringify(list));
    saveToFirestore('applications', id, item);
  }
}

export function removeApplicationTrackerItem(id: string) {
  const list = getApplicationTrackerItems().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.APPLICATION_TRACKING, JSON.stringify(list));
  deleteFromFirestore('applications', id);
}

// REPORTS
export function getReports(): OpportunityReport[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : INITIAL_REPORTS;
  } catch (e) {
    return INITIAL_REPORTS;
  }
}

export function submitReport(report: Omit<OpportunityReport, 'id' | 'createdAt' | 'status'>): OpportunityReport {
  const list = getReports();
  const newReport: OpportunityReport = {
    ...report,
    id: `rep-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  list.unshift(newReport);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
  saveToFirestore('reports', newReport.id, newReport);
  return newReport;
}

export function updateReportStatus(id: string, status: 'resolved' | 'dismissed') {
  const list = getReports();
  const rep = list.find(r => r.id === id);
  if (rep) {
    rep.status = status;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
    saveToFirestore('reports', id, { status });
  }
}

export function deleteReport(id: string) {
  const list = getReports().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
  deleteFromFirestore('reports', id);
}

export function resolveReport(id: string) {
  updateReportStatus(id, 'resolved');
}

export function verifyOrganization(orgId: string) {
  const orgs = getOrganizations();
  const org = orgs.find(o => o.id === orgId);
  if (org) {
    org.isVerified = true;
    localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
    saveToFirestore('organizations', org.id, { isVerified: true });
  }
}

// NOTIFICATIONS
export function getNotifications(userId?: string): UserNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: UserNotification[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    if (userId) {
      return list.filter(n => n.userId === userId || n.userId === 'all');
    }
    return list;
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function markNotificationRead(id: string) {
  const list = getNotifications();
  const notif = list.find(n => n.id === id);
  if (notif) {
    notif.isRead = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }
}

export function markAllNotificationsRead() {
  const list = getNotifications();
  list.forEach(n => n.isRead = true);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
}

// USER MANAGEMENT HELPERS
export function getUserAccounts(): any[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    let rawUsers: any[] = data ? JSON.parse(data) : [];

    // Ensure am1075022@gmail.com is present as Admin
    let adminUser = rawUsers.find((u: any) => u.email?.toLowerCase() === 'am1075022@gmail.com');
    if (!adminUser) {
      adminUser = {
        id: 'usr-adm-1',
        name: 'مدير المنصة الرئيسي (Admin)',
        email: 'am1075022@gmail.com',
        role: 'admin',
        governorate: 'أمانة العاصمة',
        createdAt: '2024-01-01',
        isBlocked: false
      };
      // Filter out any stale account with id 'usr-adm-1' or old email 'admin@forsati.ye'
      rawUsers = rawUsers.filter((u: any) => u.id !== 'usr-adm-1' && u.email?.toLowerCase() !== 'admin@forsati.ye');
      rawUsers.unshift(adminUser);
    } else {
      adminUser.role = 'admin';
      adminUser.id = 'usr-adm-1';
      // Remove any duplicate account with id 'usr-adm-1'
      rawUsers = rawUsers.filter((u: any) => u === adminUser || u.id !== 'usr-adm-1');
    }

    // Strict deduplication by ID and Email
    const seenIds = new Set<string>();
    const seenEmails = new Set<string>();
    const cleanUsers: any[] = [];

    for (const u of rawUsers) {
      if (!u || !u.id || !u.email) continue;
      const lowerEmail = u.email.toLowerCase();
      if (!seenIds.has(u.id) && !seenEmails.has(lowerEmail)) {
        seenIds.add(u.id);
        seenEmails.add(lowerEmail);
        cleanUsers.push(u);
      }
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cleanUsers));
    return cleanUsers;
  } catch (e) {
    return [];
  }
}

export function saveUserAccount(user: any): any {
  const users = getUserAccounts();
  const idx = users.findIndex(u => u.id === user.id || u.email?.toLowerCase() === user.email?.toLowerCase());
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.unshift(user);
  }

  // Deduplicate
  const seenIds = new Set<string>();
  const cleanUsers: any[] = [];
  for (const u of users) {
    if (u && u.id && !seenIds.has(u.id)) {
      seenIds.add(u.id);
      cleanUsers.push(u);
    }
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cleanUsers));
  saveToFirestore('userAccounts', user.id, user);
  return user;
}

export function toggleUserBlockStatus(id: string): boolean {
  const users = getUserAccounts();
  const user = users.find(u => u.id === id);
  let isBlocked = false;
  if (user) {
    user.isBlocked = !user.isBlocked;
    isBlocked = user.isBlocked;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    saveToFirestore('userAccounts', id, { isBlocked });
  }
  return isBlocked;
}

export function deleteUserAccount(id: string) {
  const users = getUserAccounts().filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  deleteFromFirestore('userAccounts', id);
}

// VERIFICATION REQUESTS
export function getVerificationRequests(): VerificationRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function updateVerificationRequestStatus(id: string, status: 'approved' | 'rejected', notes?: string) {
  const requests = getVerificationRequests();
  const req = requests.find(r => r.id === id);
  if (req) {
    req.status = status;
    if (notes) req.notes = notes;
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(requests));
    saveToFirestore('verifications', id, { status, notes });
    
    if (status === 'approved') {
      verifyOrganization(req.organizationId);
    }
  }
}

export function toggleOrganizationVerification(orgId: string): boolean {
  const orgs = getOrganizations();
  const org = orgs.find(o => o.id === orgId);
  let isVerified = false;
  if (org) {
    org.isVerified = !org.isVerified;
    isVerified = org.isVerified;
    if (isVerified) {
      org.verificationBadgeDate = new Date().toISOString().split('T')[0];
    }
    localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
    saveToFirestore('organizations', orgId, { isVerified: org.isVerified, verificationBadgeDate: org.verificationBadgeDate });
  }
  return isVerified;
}

// FEATURED OPPORTUNITIES TOGGLE
export function toggleFeaturedOpportunity(id: string): boolean {
  const opps = getOpportunities();
  const opp = opps.find(o => o.id === id);
  let isFeatured = false;
  if (opp) {
    opp.isFeatured = !opp.isFeatured;
    isFeatured = opp.isFeatured;
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
    saveToFirestore('opportunities', id, { isFeatured });
  }
  return isFeatured;
}

// PLATFORM SETTINGS
export function getPlatformSettings(): any {
  const defaults = {
    siteNameAr: 'فرصتي - منصة الوظائف والمنح باليمن',
    siteNameEn: 'Forsati Yemen Opportunities',
    heroAnnouncement: '📢 أكثر من 80 فرصة عمل وتدريب ومنح دراسية حديثة متاحة هذا الأسبوع في جميع المحافظات اليمنية!',
    contactEmail: 'info@forsati.ye',
    contactPhone: '+967 770 000 000',
    contactAddress: 'أمانة العاصمة - صنعاء / عدن - اليمن',
    contactHours: 'الأحد - الخميس: 8:00 صباحاً - 4:00 مساءً',
    requireManualPostApproval: false,
    enableAiCvOptimizer: true,
    autoExpireOpportunities: true,

    // About Us Management
    aboutUsTitle: 'عن منصة "فرصتي | Forsati"',
    aboutUsDescription: 'فرصتي هي منصة يمنية حديثة وموثوقة تسعى لربط الكفاءات والشباب اليمني بالفرص الوظيفية والتدريبية والمنح والمسابقات المتاحة محلياً ودولياً.',
    aboutUsFeatures: [
      { id: 'f-1', title: 'المصداقية الموثقة', description: 'نتحقق يدويًا من الروابط الرسمية والشركات الناشرة لمنع الإعلانات الاحتيالية.', icon: 'ShieldCheck' },
      { id: 'f-2', title: 'تغطية شاملة للمحافظات', description: 'نغطي كافة المحافظات اليمنية وفرص العمل والتدريب عن بُعد بمرونة كاملة.', icon: 'Globe' },
      { id: 'f-3', title: 'مجانية بالكامل للجميع', description: 'المنصة مجانية بالكامل للباحثين عن الفرص بدون أي رسوم مخفية.', icon: 'Heart' }
    ],

    // Additional Contact Channels
    contactChannels: [
      { id: 'c-1', title: 'البريد الإلكتروني للدعم', value: 'info@forsati.ye', icon: 'Mail', type: 'email' },
      { id: 'c-2', title: 'هاتف الاستفسارات والدعم', value: '+967 770 000 000', icon: 'Phone', type: 'phone' },
      { id: 'c-3', title: 'خدمة الواتساب المباشرة', value: '+967 770 000 001', icon: 'MessageCircle', type: 'whatsapp' }
    ],

    // Social Media Links
    socialLinks: [
      { id: 's-1', platform: 'فيسبوك (Facebook)', url: 'https://facebook.com/forsati.ye', icon: 'Facebook', isActive: true },
      { id: 's-2', platform: 'منصة X (تويتر)', url: 'https://x.com/forsati_ye', icon: 'Twitter', isActive: true },
      { id: 's-3', platform: 'لينكد إن (LinkedIn)', url: 'https://linkedin.com/company/forsati-yemen', icon: 'Linkedin', isActive: true },
      { id: 's-4', platform: 'تلجرام (Telegram)', url: 'https://t.me/forsati_yemen', icon: 'Send', isActive: true },
      { id: 's-5', platform: 'واتساب (WhatsApp)', url: 'https://whatsapp.com/channel/forsati', icon: 'MessageSquare', isActive: true },
      { id: 's-6', platform: 'إنستغرام (Instagram)', url: 'https://instagram.com/forsati.ye', icon: 'Instagram', isActive: true }
    ]
  };

  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return defaults;
    const parsed = JSON.parse(data);
    return {
      ...defaults,
      ...parsed,
      aboutUsFeatures: parsed.aboutUsFeatures || defaults.aboutUsFeatures,
      contactChannels: parsed.contactChannels || defaults.contactChannels,
      socialLinks: parsed.socialLinks || defaults.socialLinks
    };
  } catch (e) {
    return defaults;
  }
}

export function savePlatformSettings(settings: any) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  saveToFirestore('platformSettings', 'global', settings);
}

// CATEGORIES & GOVERNORATES CONFIG STORAGE
export function getStoredCategories(): any[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredCategories(categories: any[]) {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(categories));
  saveToFirestore('platformSettings', 'categories', { categories });
}

export function getStoredGovernorates(): any[] | null {
  try {
    const data = localStorage.getItem('forsati_governorates_v1');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredGovernorates(governorates: any[]) {
  localStorage.setItem('forsati_governorates_v1', JSON.stringify(governorates));
  saveToFirestore('platformSettings', 'governorates', { governorates });
}

// STATS FOR ADMIN DASHBOARD
export function getPlatformStats(): PlatformStats {
  const opps = getOpportunities();
  const orgs = getOrganizations();
  const reports = getReports();
  const users = getUserAccounts();

  return {
    totalUsers: users.length > 0 ? users.length : 1420,
    activeCandidates: users.filter(u => u.role === 'candidate').length || 1180,
    totalOrganizations: orgs.length,
    verifiedOrganizations: orgs.filter(o => o.isVerified).length,
    totalOpportunities: opps.length,
    publishedOpportunities: opps.filter(o => o.status === 'published').length,
    pendingOpportunities: opps.filter(o => o.status === 'pending').length,
    expiredOpportunities: opps.filter(o => o.status === 'expired').length,
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length
  };
}
