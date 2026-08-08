import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CandidateProfile, YemenGovernorate, EducationLevel } from '../types';
import { GOVERNORATES_LIST } from '../data/categories';
import { fetchAiProfileImprovement } from '../services/aiService';
import { 
  User, 
  Sparkles, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Save, 
  Lock, 
  FileText,
  Loader2,
  Award,
  Globe
} from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const { candidateProfile, updateCandidateProfile } = useAuth();

  const [formData, setFormData] = useState<CandidateProfile>(candidateProfile || {
    userId: 'usr-cand-1',
    fullName: 'أحمد علي السعدي',
    governorate: 'أمانة العاصمة',
    city: 'صنعاء',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'مطور واجهات ومصمم تجربة مستخدم مع شغف بتقنية المعلومات والتنمية التكنولوجية في اليمن.',
    educationLevel: 'bachelor',
    fieldOfStudy: 'تقنية المعلومات وعلوم الحاسوب',
    graduationYear: '2024',
    skills: [{ name: 'React.js', level: 'advanced' }, { name: 'TypeScript', level: 'intermediate' }],
    languages: [{ name: 'اللغة العربية', fluency: 'native' }],
    workExperience: [],
    certifications: [],
    interests: ['jobs'],
    preferredLocations: ['أمانة العاصمة'],
    remotePreference: true,
    isCvPublic: false,
    completenessPercentage: 80
  });

  useEffect(() => {
    if (candidateProfile) {
      setFormData(candidateProfile);
    }
  }, [candidateProfile]);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Calculate completeness score
  const calculateCompleteness = () => {
    let score = 0;
    if (formData.fullName) score += 15;
    if (formData.email) score += 10;
    if (formData.phone) score += 10;
    if (formData.bio) score += 15;
    if (formData.fieldOfStudy) score += 15;
    if (formData.skills && formData.skills.length > 0) score += 15;
    if (formData.cvUrl) score += 20;
    return Math.min(score, 100);
  };

  const completenessScore = calculateCompleteness();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCandidateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const skillName = newSkill.trim();
    const exists = (formData.skills || []).some(s => {
      const name = typeof s === 'string' ? s : s?.name || '';
      return name.toLowerCase() === skillName.toLowerCase();
    });
    if (!exists) {
      setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), { name: skillName, level: 'intermediate' }] as any }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => {
        const name = typeof s === 'string' ? s : s?.name || '';
        return name.toLowerCase() !== skillToRemove.toLowerCase();
      }) as any
    }));
  };

  const handleSimulateCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cvUrl: 'https://example.com/mock-cv-uploaded.pdf',
        cvName: file.name
      }));
    }
  };

  const handleRemoveCv = () => {
    setFormData(prev => ({ ...prev, cvUrl: undefined, cvName: undefined }));
  };

  const handleGetAiImprovement = async () => {
    setIsAiLoading(true);
    try {
      const skillList = (formData.skills || []).map(s => typeof s === 'string' ? s : s?.name || '');
      const suggestions = await fetchAiProfileImprovement(
        formData.bio || '',
        formData.fieldOfStudy,
        skillList
      );
      setAiSuggestions(suggestions as any);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <span>ملفي الشخصي والسيرة الذاتية</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
            حدث بياناتك ومهاراتك لزيادة نسبة توافقك مع الفرص المتاحة
          </p>
        </div>

        {/* AI Improvement Trigger Button */}
        <button
          type="button"
          onClick={handleGetAiImprovement}
          disabled={isAiLoading}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
          <span>تحسين الملف بالذكاء الاصطناعي</span>
        </button>
      </div>

      {/* Completeness Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
        <div className="flex justify-between items-center text-xs font-black">
          <span className="text-slate-800 dark:text-slate-200">اكتمال السيرة الذاتية والملف:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">{completenessScore}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${completenessScore}%` }}
          />
        </div>
        {completenessScore < 100 && (
          <p className="text-[11px] text-slate-500 font-bold">
            💡 ارفع سيرتك الذاتية وأضف المزيد من المهارات لتصل إلى 100% وتحصل على أولوية التوصية.
          </p>
        )}
      </div>

      {/* AI Suggestions Callout */}
      {aiSuggestions && (
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent p-5 rounded-3xl border border-amber-200/80 dark:border-amber-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>نصائح "مساعد فرصتي" لتطوير ملفك الشخصي:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 pl-4 list-disc">
            {(Array.isArray(aiSuggestions) ? aiSuggestions : [String(aiSuggestions)]).map((sug, i) => (
              <li key={i}>{sug}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Personal Details */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-100 border-r-4 border-emerald-600 pr-2">
            المعلومات الشخصية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">المحافظة</label>
              <select
                value={formData.governorate}
                onChange={(e) => setFormData({ ...formData, governorate: e.target.value as YemenGovernorate })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {GOVERNORATES_LIST.map(g => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">رقم الهاتف التواصل</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">نبذة تعريفية مختصرة (Bio):</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Education Details */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-100 border-r-4 border-emerald-600 pr-2">
            المؤهل التعليمي
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">المستوى التعليمي</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              >
                <option value="high_school">ثانوية عامة</option>
                <option value="diploma">دبلوم</option>
                <option value="bachelor">بكالوريوس</option>
                <option value="master">ماجستير</option>
                <option value="phd">دكتوراه</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">التخصص الأكاديمي</label>
              <input
                type="text"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">الجامعة / المعهد</label>
              <input
                type="text"
                value={formData.university || ''}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">سنة التخرج</label>
              <input
                type="text"
                value={formData.graduationYear || ''}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-100 border-r-4 border-emerald-600 pr-2">
            المهارات والقدرات
          </h2>

          <div className="flex flex-wrap gap-2 mb-2">
            {(formData.skills || []).map((sk, idx) => {
              const name = typeof sk === 'string' ? sk : sk?.name || '';
              const level = typeof sk === 'string' ? '' : sk?.level;
              if (!name) return null;
              return (
                <span key={`${name}-${idx}`} className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 font-bold flex items-center gap-1.5">
                  <span>{name}{level ? ` (${level})` : ''}</span>
                  <button type="button" onClick={() => handleRemoveSkill(name)} className="text-emerald-600 hover:text-rose-600 cursor-pointer font-black">
                    ×
                  </button>
                </span>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="إضافة مهارة جديدة (مثلاً: Python, English, Excel)"
              className="flex-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-neutral-100"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </div>
        </div>

        {/* CV Upload Section with Strict Privacy Notice */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-100 border-r-4 border-emerald-600 pr-2">
              السيرة الذاتية (CV)
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200/60">
              <Lock className="w-3 h-3" />
              <span>خصوصية تامة: ملفك لا يظهر للعموم</span>
            </div>
          </div>

          {formData.cvName ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 block">{formData.cvName}</span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">ملف سيرتك الذاتية جاهز للتقديم</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveCv}
                className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl"
                title="حذف الملف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 text-center space-y-2 hover:border-emerald-500 transition-colors">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">اسحب ملف سيرتك الذاتية هنا أو انقر للاختيار</p>
              <p className="text-[11px] text-neutral-400">يدعم صيغ PDF, DOCX (بحد أقصى 5 ميجابايت)</p>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleSimulateCvUpload}
                className="hidden"
                id="cv-upload-input"
              />
              <label
                htmlFor="cv-upload-input"
                className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:bg-emerald-700 transition-colors"
              >
                رفع الملف
              </label>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ التعديلات بنجاح!</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ بيانات الملف</span>
          </button>
        </div>

      </form>

    </div>
  );
};
