import React, { useState } from 'react';
import { Opportunity, OpportunityReport } from '../types';
import { getReports, updateOpportunityStatus, verifyOrganization, resolveReport } from '../services/storage';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Building2, 
  Clock,
  Filter
} from 'lucide-react';

interface ModerationDashboardPageProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onRefreshData: () => void;
}

export const ModerationDashboardPage: React.FC<ModerationDashboardPageProps> = ({
  opportunities,
  onSelectOpportunity,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'pending_opps' | 'reports'>('pending_opps');
  const [reports, setReports] = useState<OpportunityReport[]>(getReports());

  const pendingOpps = opportunities.filter(o => o.status === 'pending');

  const handleApproveOpp = (oppId: string) => {
    updateOpportunityStatus(oppId, 'published');
    onRefreshData();
  };

  const handleRejectOpp = (oppId: string) => {
    updateOpportunityStatus(oppId, 'rejected');
    onRefreshData();
  };

  const handleResolveReport = (reportId: string) => {
    resolveReport(reportId);
    setReports(getReports());
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-600" />
            <span>لوحة الإشراف والمراجعة الموثوقة</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            مراجعة الفرص المعلقة قبل النشر والتعامل مع البلاغات لضمان أقصى درجات الموثوقية
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('pending_opps')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'pending_opps' ? 'bg-amber-600 text-white shadow-xs' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          الفرص المعلقة للمراجعة ({pendingOpps.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'reports' ? 'bg-amber-600 text-white shadow-xs' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          بلاغات المستخدمين ({reports.filter(r => r.status === 'pending').length})
        </button>
      </div>

      {/* Pending Opportunities Queue */}
      {activeTab === 'pending_opps' && (
        <div className="space-y-4">
          {pendingOpps.length > 0 ? (
            pendingOpps.map(opp => (
              <div 
                key={opp.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200">
                      بانتظار الموافقة
                    </span>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 mt-1">{opp.title}</h3>
                    <p className="text-xs text-neutral-500">{opp.organizationName} • {opp.governorate}</p>
                  </div>

                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>معاينة كاملة</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 bg-neutral-50 dark:bg-neutral-850 p-3 rounded-xl">
                  {opp.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-neutral-400">رابط التقديم: <a href={opp.applicationUrl} target="_blank" rel="noreferrer" className="text-emerald-600 underline font-semibold">{opp.applicationUrl}</a></span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRejectOpp(opp.id)}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رفض</span>
                    </button>
                    <button
                      onClick={() => handleApproveOpp(opp.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>موافقة ونشر</span>
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 text-center space-y-2 border border-neutral-200 dark:border-neutral-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">لا توجد فرص معلقة للمراجعة حالياً</h3>
              <p className="text-xs text-neutral-400">جميع الفرص المرسلة تمت مراجعتها ونشرها.</p>
            </div>
          )}
        </div>
      )}

      {/* Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map(rep => (
              <div 
                key={rep.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>سبب البلاغ: {rep.reason}</span>
                  </span>
                  <span className="text-neutral-400">{rep.createdAt}</span>
                </div>

                <p className="font-bold text-neutral-900 dark:text-neutral-100">الفرصة المبلغ عنها: {rep.opportunityTitle}</p>
                <p className="text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-850 p-2.5 rounded-xl">التفاصيل: {rep.details}</p>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleResolveReport(rep.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
                  >
                    معالجة البلاغ وإغلاقه
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-xs text-neutral-400">لا توجد بلاغات قائمة</p>
          )}
        </div>
      )}

    </div>
  );
};
