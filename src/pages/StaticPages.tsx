import React, { useState } from 'react';
import { Opportunity } from '../types';
import { getPlatformSettings } from '../services/storage';
import { 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  MessageSquare, 
  Send, 
  Share2, 
  Sparkles,
  ExternalLink,
  Award,
  Check
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  Globe,
  Heart,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  MessageSquare,
  Send,
  Award,
  Briefcase
};

export const AboutPage: React.FC = () => {
  const settings = getPlatformSettings();
  const features = settings.aboutUsFeatures || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-200">
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-900 text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/20">
          <Briefcase className="w-8 h-8 text-amber-300" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">{settings.aboutUsTitle || 'عن منصة "فرصتي | Forsati"'}</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed font-medium">
          {settings.aboutUsDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {features.map((feat: any) => {
          const IconComp = ICON_MAP[feat.icon] || ShieldCheck;
          return (
            <div key={feat.id || feat.title} className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-2xs hover:border-emerald-500 transition-all">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit">
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-neutral-900 dark:text-neutral-100">{feat.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">{feat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const settings = getPlatformSettings();
  const channels = settings.contactChannels || [];
  const socialLinks = (settings.socialLinks || []).filter((s: any) => s.isActive);

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl text-center space-y-3 shadow-xl">
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          دعم فني واستفسارات المتابعين
        </span>
        <h1 className="text-2xl sm:text-3xl font-black">تواصل مع فريق منصة "فرصتي" 🇾🇪</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          يسعدنا استقبال استفساراتك، مقترحاتك، وطلبات شراكة المؤسسات والجهات الناشرة عبر مختلف القنوات التالية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contact Info Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-2xs">
            <h3 className="font-black text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b pb-3 border-neutral-100 dark:border-neutral-800">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>معلومات الاتصال الرسمية</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block font-bold">البريد الإلكتروني:</span>
                  <a href={`mailto:${settings.contactEmail}`} className="font-extrabold text-neutral-800 dark:text-neutral-200 hover:text-emerald-600">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block font-bold">الهاتف والدعم المباشر:</span>
                  <a href={`tel:${settings.contactPhone}`} dir="ltr" className="font-extrabold text-neutral-800 dark:text-neutral-200 hover:text-emerald-600 block text-right">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              {settings.contactAddress && (
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] block font-bold">العنوان والمقر:</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {settings.contactAddress}
                    </span>
                  </div>
                </div>
              )}

              {settings.contactHours && (
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] block font-bold">أوقات العمل المعتمدة:</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {settings.contactHours}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Contact Channels */}
          {channels.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-2xs">
              <h3 className="font-black text-xs text-neutral-900 dark:text-neutral-100">قنوات الاتصال المتاحة</h3>
              <div className="space-y-2 text-xs">
                {channels.map((chan: any) => (
                  <div key={chan.id} className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 block">{chan.title}</span>
                      <span className="text-neutral-500 font-mono text-[11px]">{chan.value}</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                      متاح
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Section */}
          {socialLinks.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-2xs">
              <h3 className="font-black text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>تابعنا على مواقع التواصل الاجتماعي</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {socialLinks.map((s: any) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold transition-all flex items-center justify-between group"
                  >
                    <span className="truncate group-hover:text-emerald-600">{s.platform}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-2xs">
            <div>
              <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-100">أرسل لنا رسالة مباشرة</h2>
              <p className="text-xs text-neutral-500 font-bold mt-1">سنقوم بالرد عليك عبر البريد الإلكتروني في أقرب وقت ممكناً</p>
            </div>

            {formSent ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm text-emerald-900 dark:text-emerald-200">تم إرسال رسالتك بنجاح!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                  شكرًا لتواصلك مع منصة فرصتي. سيقوم فريق الدعم الفني بمراجعة استفسارك والرد عليك قريبًا.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-700 dark:text-neutral-300 block">الاسم الكامل:</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أدخل اسمك هنا..."
                      className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-700 dark:text-neutral-300 block">البريد الإلكتروني للرد:</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 dark:text-neutral-300 block">موضوع الرسالة:</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="استفسار، طلب توثيق جهة، الإبلاغ عن مشكلة..."
                    className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 dark:text-neutral-300 block">نص الرسالة والاستفسار التفصيلي:</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب تفاصيل استفسارك أو طلبك هنا..."
                    className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال الرسالة الآن</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export const OrganizationsDirectoryPage: React.FC<{ opportunities: Opportunity[] }> = ({ opportunities }) => {
  const orgMap = new Map();
  opportunities.forEach(o => {
    if (!orgMap.has(o.organizationName)) {
      orgMap.set(o.organizationName, {
        name: o.organizationName,
        logo: o.organizationLogo,
        verified: o.organizationVerified,
        governorate: o.governorate,
        count: 1
      });
    } else {
      orgMap.get(o.organizationName).count += 1;
    }
  });

  const orgs = Array.from(orgMap.values());

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">دليل الجهات والمؤسسات والشركات الناشرة</h1>
        <p className="text-xs text-neutral-500 mt-1">تصفح الجهات الموثوقة التي تعرض فرصها عبر "فرصتي"</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgs.map((org, i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={org.logo} alt={org.name} className="w-12 h-12 rounded-xl object-cover border" />
              <div>
                <div className="flex items-center gap-1 font-bold text-xs text-neutral-900 dark:text-neutral-100">
                  <span>{org.name}</span>
                  {org.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" title="جهة موثوقة" />}
                </div>
                <span className="text-[11px] text-neutral-400">{org.governorate}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              {org.count} فرص
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
