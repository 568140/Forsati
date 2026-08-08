import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, CandidateProfile, Organization, UserAccount, UserNotification, YemenGovernorate } from '../types';
import { 
  getCandidateProfile, 
  saveCandidateProfile, 
  getOrganizationProfile, 
  saveOrganization,
  getSavedOpportunityIds,
  toggleSaveOpportunity,
  getFollowedOrgIds,
  toggleFollowOrg,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUserAccounts,
  saveUserAccount
} from '../services/storage';

interface AuthContextType {
  currentUser: UserAccount | null;
  currentRole: UserRole;
  candidateProfile: CandidateProfile | null;
  organization: Organization | null;
  savedOppIds: string[];
  followedOrgIds: string[];
  notifications: UserNotification[];
  unreadNotificationCount: number;
  
  // Actions
  updateCandidateProfile: (profile: CandidateProfile) => void;
  updateOrganizationProfile: (org: Organization) => void;
  toggleSaveOpp: (oppId: string) => void;
  toggleFollowOrganization: (orgId: string) => void;
  readNotification: (id: string) => void;
  readAllNotifications: () => void;
  login: (email: string, password?: string) => { success: boolean; message?: string; user?: UserAccount };
  registerAccount: (data: { name: string; email: string; password?: string; role: UserRole; governorate?: YemenGovernorate }) => { success: boolean; message?: string; user?: UserAccount };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACTIVE_USER_KEY = 'forsati_active_user_id_v2';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [candidateProfile, setCandidateProfileState] = useState<CandidateProfile | null>(null);
  const [organization, setOrganizationState] = useState<Organization | null>(null);
  const [savedOppIds, setSavedOppIds] = useState<string[]>([]);
  const [followedOrgIds, setFollowedOrgIds] = useState<string[]>([]);
  const [notifications, setNotificationsState] = useState<UserNotification[]>([]);

  // Function to load all isolated state for a specific user ID
  const loadUserData = (user: UserAccount | null) => {
    if (!user || user.role === 'guest') {
      setCurrentUser(null);
      setCurrentRole('guest');
      setCandidateProfileState(null);
      setOrganizationState(null);
      setSavedOppIds([]);
      setFollowedOrgIds([]);
      setNotificationsState([]);
      localStorage.setItem(ACTIVE_USER_KEY, 'guest');
      return;
    }

    setCurrentUser(user);
    setCurrentRole(user.role);
    localStorage.setItem(ACTIVE_USER_KEY, user.id);

    if (user.role === 'candidate') {
      const cand = getCandidateProfile(user.id);
      setCandidateProfileState(cand);
      setOrganizationState(null);
    } else if (user.role === 'organization') {
      const org = getOrganizationProfile(user.id);
      setOrganizationState(org);
      setCandidateProfileState(null);
    } else {
      setCandidateProfileState(null);
      setOrganizationState(null);
    }

    setSavedOppIds(getSavedOpportunityIds(user.id));
    setFollowedOrgIds(getFollowedOrgIds(user.id));
    setNotificationsState(getNotifications(user.id));
  };

  useEffect(() => {
    const users = getUserAccounts();
    const savedActiveId = localStorage.getItem(ACTIVE_USER_KEY);

    if (!savedActiveId || savedActiveId === 'guest') {
      loadUserData(null);
      return;
    }

    const foundUser = users.find((u: UserAccount) => u.id === savedActiveId);
    if (foundUser) {
      loadUserData(foundUser);
    } else {
      loadUserData(null);
    }
  }, []);

  const login = (email: string, password?: string): { success: boolean; message?: string; user?: UserAccount } => {
    const users = getUserAccounts();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, message: 'يرجى إدخال البريد الإلكتروني' };
    }

    if (!password || !password.trim()) {
      return { success: false, message: 'يرجى إدخال كلمة المرور' };
    }

    let existing = users.find((u: any) => u.email?.toLowerCase() === cleanEmail);
    
    if (cleanEmail === 'am1075022@gmail.com') {
      if (!existing) {
        existing = {
          id: 'usr-adm-1',
          name: 'مدير المنصة الرئيسي (Admin)',
          email: 'am1075022@gmail.com',
          password: password,
          role: 'admin',
          governorate: 'أمانة العاصمة',
          createdAt: new Date().toISOString().split('T')[0]
        };
      } else {
        existing.role = 'admin';
        existing.name = existing.name || 'مدير المنصة الرئيسي (Admin)';
      }
      if (existing.password && existing.password !== password) {
        return { success: false, message: 'كلمة المرور غير صحيحة! يرجى التأكد من كلمة المرور الخاصة بحساب المدير.' };
      }
      saveUserAccount(existing);
      loadUserData(existing);
      return { success: true, user: existing };
    }

    if (!existing) {
      return { 
        success: false, 
        message: 'عذراً، هذا البريد غير مسجل بالنظام. يرجى الضغط على تبويب "حساب جديد" للتسجيل.' 
      };
    }

    if (existing.isBlocked) {
      return {
        success: false,
        message: 'عذراً، تم حظر هذا الحساب من قبل إدارة المنصة.'
      };
    }

    if (existing.password && existing.password !== password) {
      return {
        success: false,
        message: 'كلمة المرور غير صحيحة! يرجى إعادة المحاولة.'
      };
    }

    loadUserData(existing);
    return { success: true, user: existing };
  };

  const registerAccount = (data: { name: string; email: string; password?: string; role: UserRole; governorate?: YemenGovernorate }): { success: boolean; message?: string; user?: UserAccount } => {
    const users = getUserAccounts();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanEmail || !data.name.trim()) {
      return { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, message: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' };
    }

    const existing = users.find((u: any) => u.email?.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل! يرجى الانتقال لتبويب تسجيل الدخول.' };
    }

    const assignedRole = cleanEmail === 'am1075022@gmail.com' ? 'admin' : data.role;

    const newAcc: any = {
      id: assignedRole === 'admin' ? 'usr-adm-1' : `usr-${assignedRole.slice(0, 4)}-${Date.now()}`,
      name: data.name,
      email: cleanEmail,
      password: data.password,
      role: assignedRole,
      governorate: data.governorate || 'أمانة العاصمة',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    saveUserAccount(newAcc);

    // Create fresh initial profile for this new user
    if (assignedRole === 'candidate') {
      saveCandidateProfile({
        userId: newAcc.id,
        fullName: data.name,
        photo: newAcc.avatar,
        governorate: newAcc.governorate || 'أمانة العاصمة',
        city: newAcc.governorate || 'صنعاء',
        educationLevel: 'bachelor',
        skills: [],
        languages: [{ name: 'اللغة العربية', fluency: 'native' }],
        workExperience: [],
        certifications: [],
        interests: ['jobs'],
        preferredLocations: [newAcc.governorate || 'أمانة العاصمة'],
        remotePreference: true,
        isCvPublic: false,
        completenessPercentage: 25
      }, newAcc.id);
    }

    loadUserData(newAcc);
    return { success: true, user: newAcc };
  };

  const updateCandidateProfile = (updated: CandidateProfile) => {
    if (!currentUser) return;
    const saved = saveCandidateProfile(updated, currentUser.id);
    setCandidateProfileState(saved);
    
    // Also update currentUser state name & avatar
    const updatedUser = { ...currentUser, name: saved.fullName, governorate: saved.governorate, avatar: saved.photo };
    setCurrentUser(updatedUser);
    saveUserAccount(updatedUser);
  };

  const updateOrganizationProfile = (updated: Organization) => {
    if (!currentUser) return;
    const saved = saveOrganization(updated);
    setOrganizationState(saved);

    const updatedUser = { ...currentUser, name: saved.name, governorate: saved.governorate, avatar: saved.logo };
    setCurrentUser(updatedUser);
    saveUserAccount(updatedUser);
  };

  const toggleSaveOpp = (oppId: string) => {
    if (!currentUser) return;
    toggleSaveOpportunity(oppId, currentUser.id);
    setSavedOppIds(getSavedOpportunityIds(currentUser.id));
  };

  const toggleFollowOrganization = (orgId: string) => {
    if (!currentUser) return;
    toggleFollowOrg(orgId, currentUser.id);
    setFollowedOrgIds(getFollowedOrgIds(currentUser.id));
  };

  const readNotification = (id: string) => {
    markNotificationRead(id);
    if (currentUser) {
      setNotificationsState(getNotifications(currentUser.id));
    }
  };

  const readAllNotifications = () => {
    markAllNotificationsRead();
    if (currentUser) {
      setNotificationsState(getNotifications(currentUser.id));
    }
  };

  const logout = () => {
    loadUserData(null);
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole,
      candidateProfile,
      organization,
      savedOppIds,
      followedOrgIds,
      notifications,
      unreadNotificationCount,
      updateCandidateProfile,
      updateOrganizationProfile,
      toggleSaveOpp,
      toggleFollowOrganization,
      readNotification,
      readAllNotifications,
      login,
      registerAccount,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
