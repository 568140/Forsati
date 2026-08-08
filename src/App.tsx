import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Opportunity, OpportunityFilter } from './types';
import { getOpportunities, getPlatformSettings } from './services/storage';

// Components
import { Navbar } from './components/Navbar';
import { RoleWorkspaceBar } from './components/RoleWorkspaceBar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';
import { OrganizationDashboardPage } from './pages/OrganizationDashboardPage';
import { ModerationDashboardPage } from './pages/ModerationDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage, ContactPage, OrganizationsDirectoryPage } from './pages/StaticPages';

// Icons
import { Briefcase, Heart, Globe, ShieldCheck, Mail, MapPin } from 'lucide-react';

const MainApp: React.FC = () => {
  const { language } = useLanguage();
  const { savedOppIds, candidateProfile } = useAuth();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [exploreFilter, setExploreFilter] = useState<Partial<OpportunityFilter>>({});
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  useEffect(() => {
    setOpportunities(getOpportunities());
  }, []);

  const refreshOpportunities = () => {
    setOpportunities(getOpportunities());
  };

  const handleNavigate = (view: string, filterState?: Partial<OpportunityFilter>) => {
    if (filterState) {
      setExploreFilter(filterState);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savedOpportunities = opportunities.filter(o => savedOppIds.includes(o.id));

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-slate-900 flex flex-col font-sans transition-colors selection:bg-emerald-600 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Role Workspace Context & Tabs Bar */}
      <RoleWorkspaceBar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentView === 'home' && (
          <HomePage
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onNavigate={handleNavigate}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          />
        )}

        {currentView === 'explore' && (
          <ExplorePage
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            initialFilter={exploreFilter}
          />
        )}

        {currentView === 'categories' && (
          <ExplorePage
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            initialFilter={exploreFilter}
          />
        )}

        {currentView === 'organizations' && (
          <OrganizationsDirectoryPage opportunities={opportunities} />
        )}

        {currentView === 'matches' && (
          <ExplorePage
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            initialFilter={{ sortBy: 'best_match' }}
          />
        )}

        {currentView === 'saved' && (
          <div className="space-y-6 pb-12">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">الفرص المحفوظة 📌</h1>
              <p className="text-xs text-neutral-500 mt-1">الفرص التي قمت بحفظها للرجوع إليها لاحقاً والتقديم عليها</p>
            </div>
            {savedOpportunities.length > 0 ? (
              <ExplorePage
                opportunities={savedOpportunities}
                onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
              />
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center space-y-2 border border-neutral-200">
                <Heart className="w-10 h-10 text-neutral-300 mx-auto" />
                <h3 className="font-bold text-sm text-neutral-800">لم تقم بحفظ أي فرص بعد</h3>
                <p className="text-xs text-neutral-400">تصفح الفرص المتاحة وانقر على أيقونة المحفوظات للرجوع إليها وقتما تشاء.</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'tracker' && (
          <ApplicationTrackerPage
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
          />
        )}

        {currentView === 'profile' && (
          <CandidateProfilePage />
        )}

        {currentView === 'org_dashboard' && (
          <OrganizationDashboardPage
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onRefreshData={refreshOpportunities}
          />
        )}

        {currentView === 'post_opportunity' && (
          <OrganizationDashboardPage
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onRefreshData={refreshOpportunities}
          />
        )}

        {currentView === 'moderation' && (
          <ModerationDashboardPage
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onRefreshData={refreshOpportunities}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage
            opportunities={opportunities}
            onRefreshData={refreshOpportunities}
          />
        )}

        {currentView === 'about' && (
          <AboutPage />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 pt-10 pb-20 lg:pb-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Col */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="font-black text-base text-neutral-900">فرصتي | Forsati</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                منصة الفرص الأولى للشباب والكفاءات في اليمن. وظائف، منح دراسية، تدريب، ومسابقات موثوقة.
              </p>
            </div>

            {/* Links Col 1 */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-neutral-900">تصفح الفرص</h4>
              <ul className="space-y-1.5 text-neutral-500 font-medium">
                <li><button onClick={() => handleNavigate('explore', { category: 'jobs' })} className="hover:text-emerald-600 cursor-pointer">وظائف في اليمن</button></li>
                <li><button onClick={() => handleNavigate('explore', { category: 'scholarships' })} className="hover:text-emerald-600 cursor-pointer">منح دراسية خارجية</button></li>
                <li><button onClick={() => handleNavigate('explore', { category: 'internships' })} className="hover:text-emerald-600 cursor-pointer">فرص تدريب عملي</button></li>
                <li><button onClick={() => handleNavigate('explore', { isRemoteOnly: true })} className="hover:text-emerald-600 cursor-pointer">عمل عن بُعد</button></li>
              </ul>
            </div>

            {/* Links Col 2 */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-neutral-900">عن المنصة</h4>
              <ul className="space-y-1.5 text-neutral-500 font-medium">
                <li><button onClick={() => handleNavigate('about')} className="hover:text-emerald-600 cursor-pointer">من نحن (عن منصة فرصتي)</button></li>
                <li><button onClick={() => handleNavigate('contact')} className="hover:text-emerald-600 cursor-pointer">تواصل معنا والشكاوى</button></li>
                <li><button onClick={() => handleNavigate('organizations')} className="hover:text-emerald-600 cursor-pointer">دليل الجهات الناشرة</button></li>
              </ul>
            </div>

            {/* Contact Col (Dynamic Settings) */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-neutral-900">تواصل معنا</h4>
              <p className="text-neutral-500">للاستفسارات ونشر الفرص للمؤسسات:</p>
              <div className="space-y-1 text-emerald-600 font-bold">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a href={`mailto:${getPlatformSettings().contactEmail}`} className="hover:underline">{getPlatformSettings().contactEmail}</a>
                </div>
                {getPlatformSettings().contactPhone && (
                  <div className="flex items-center gap-2 text-neutral-700">
                    <span className="text-[11px] font-mono" dir="ltr">{getPlatformSettings().contactPhone}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div>
              © {new Date().getFullYear()} فرصتي (Forsati Yemen) — جميع الحقوق محفوظة. "فرصتك تبدأ هنا"
            </div>
            
            {/* Social Links Icons */}
            <div className="flex items-center gap-3">
              {(getPlatformSettings().socialLinks || []).filter((s: any) => s.isActive).map((s: any) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-600 text-neutral-600 text-[11px] font-bold transition-all"
                  title={s.platform}
                >
                  {s.platform.split(' ')[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* AI Assistant Drawer Modal */}
      <AIAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        contextData={selectedOpportunity}
      />

      {/* Opportunity Detail View Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onSelectRelated={(opp) => setSelectedOpportunity(opp)}
        allOpportunities={opportunities}
        onRefreshData={refreshOpportunities}
      />

    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
