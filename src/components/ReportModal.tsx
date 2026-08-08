import React, { useState } from 'react';
import { Opportunity, ReportReason } from '../types';
import { submitReport } from '../services/storage';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ opportunity, isOpen, onClose }) => {
  const [reason, setReason] = useState<ReportReason>('scam');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      reporterId: 'usr-guest-report',
      reporterName: 'مستخدم منصة فرصتي',
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      reason,
      details: details.trim() || 'لا تتوفر تفاصيل إضافية'
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  const reasonLabels: { value: ReportReason; label: string }[] = [
    { value: 'scam', label: 'فرصة مشبوهة / احتيالية' },
    { value: 'fake_org', label: 'جهة غير حقيقية أو ينتحل صفة' },
    { value: 'incorrect_info', label: 'معلومات غير دقيقة أو رابط تالف' },
    { value: 'expired', label: 'فرصة منتهية الموعد' },
    { value: 'duplicate', label: 'فرصة مكررة' },
    { value: 'inappropriate', label: 'محتوى غير لائق أو مخالف' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-850">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>الإبلاغ عن الفرصة</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">تم استلام بلاغك بنجاح</h3>
            <p className="text-xs text-neutral-500">شكراً لمساعدتنا في الحفاظ على بيئة موثوقة وآمنة في منصة فرصتي.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">الفرصة المحددة:</p>
              <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded-xl line-clamp-1">
                {opportunity.title}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">سبب الإبلاغ:</label>
              <div className="space-y-1.5">
                {reasonLabels.map((item) => (
                  <label 
                    key={item.value} 
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      reason === item.value 
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300' 
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="reportReason" 
                      value={item.value}
                      checked={reason === item.value}
                      onChange={() => setReason(item.value)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">تفاصيل إضافية (اختياري):</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="اكتب توضيحاً مختصراً لمساعدة مشرفي المحتوى..."
                rows={3}
                className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                إرسال البلاغ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
