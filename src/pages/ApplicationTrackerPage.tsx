import React, { useState } from 'react';
import { Opportunity, ApplicationTrackerItem, TrackingStatus as ApplicationStatus } from '../types';
import { getApplicationTrackerItems, updateApplicationTrackerItem, removeApplicationTrackerItem } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Edit3, 
  Trash2, 
  Plus, 
  FileText,
  Building2,
  ArrowRight
} from 'lucide-react';

interface ApplicationTrackerPageProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const ApplicationTrackerPage: React.FC<ApplicationTrackerPageProps> = ({
  opportunities,
  onSelectOpportunity
}) => {
  const [items, setItems] = useState<ApplicationTrackerItem[]>(getApplicationTrackerItems());
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');

  const statusConfig: Record<ApplicationStatus, { label: string; color: string; badge: string }> = {
    interested: { label: 'مهتم بها', color: 'border-blue-300 bg-blue-50 text-blue-800', badge: 'bg-blue-600' },
    saved: { label: 'محفوظة', color: 'border-indigo-300 bg-indigo-50 text-indigo-800', badge: 'bg-indigo-600' },
    applied: { label: 'تم التقديم', color: 'border-amber-300 bg-amber-50 text-amber-800', badge: 'bg-amber-600' },
    interview: { label: 'المقابلة الشخصية', color: 'border-purple-300 bg-purple-50 text-purple-800', badge: 'bg-purple-600' },
    accepted: { label: 'مقبول 🎉', color: 'border-emerald-300 bg-emerald-50 text-emerald-800', badge: 'bg-emerald-600' },
    rejected: { label: 'غير متوافق', color: 'border-rose-300 bg-rose-50 text-rose-800', badge: 'bg-rose-600' },
    withdrawn: { label: 'تم السحب', color: 'border-neutral-300 bg-neutral-50 text-neutral-800', badge: 'bg-neutral-600' }
  };

  const handleStatusChange = (itemId: string, newStatus: ApplicationStatus) => {
    updateApplicationTrackerItem(itemId, { status: newStatus });
    setItems(getApplicationTrackerItems());
  };

  const handleRemove = (itemId: string) => {
    removeApplicationTrackerItem(itemId);
    setItems(getApplicationTrackerItems());
  };

  const filteredItems = selectedStatus === 'all' 
    ? items 
    : items.filter(i => i.status === selectedStatus);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <span>لوحة متابعة طلباتي واستماراتي</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
            سجل وتتبع حالة تقدمك في الوظائف والمنح والتدريبات التي قدمت عليها
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedStatus === 'all' 
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-black shadow-2xs' 
              : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          الكل ({items.length})
        </button>
        {(Object.keys(statusConfig) as ApplicationStatus[]).map((st) => {
          const cfg = statusConfig[st];
          const count = items.filter(i => i.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-4 py-2 rounded-xl transition-all border cursor-pointer ${
                selectedStatus === st 
                  ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-2xs' 
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Tracker List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3.5">
          {filteredItems.map((item) => {
            const opp = opportunities.find(o => o.id === item.opportunityId);
            const cfg = statusConfig[item.status];

            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <img 
                    src={item.organizationLogo || opp?.organizationLogo} 
                    alt={item.organizationName} 
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] text-slate-500 font-black block">{item.organizationName}</span>
                    <h3 
                      onClick={() => opp && onSelectOpportunity(opp)}
                      className="font-black text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {item.opportunityTitle}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span>قدمت بتاريخ: {item.appliedAt}</span>
                      {item.notes && <span className="truncate max-w-xs">• {item.notes}</span>}
                    </div>
                  </div>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as ApplicationStatus)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl border cursor-pointer ${cfg.color}`}
                  >
                    {(Object.keys(statusConfig) as ApplicationStatus[]).map((st) => (
                      <option key={st} value={st}>{statusConfig[st].label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="حذف من السجل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">لا توجد طلبات في هذه الحالة حالياً</h3>
          <p className="text-xs text-slate-400 font-medium">يمكنك حفظ أي فرصة أو تسجيل التقديم عليها لمتابعتها هنا بسهولة.</p>
        </div>
      )}

    </div>
  );
};
