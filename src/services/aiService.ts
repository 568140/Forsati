export async function fetchAiAssistantReply(prompt: string, context?: any): Promise<string> {
  try {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });

    if (!res.ok) {
      throw new Error('API server returned error');
    }

    const data = await res.json();
    return data.reply || 'عذراً، لم أستطع الإجابة في الوقت الحالي.';
  } catch (error) {
    console.warn('Fallback to client assistant response:', error);
    return 'أهلاً بك! أنا مساعد فرصتي الذكي. يسعدني مساعدتك في صياغة السيرة الذاتية، فهم الشروط والمهارات المطلوبة للوظائف والمنح، وتوجيهك نحو الفرص الأكثر ملاءمة لمهاراتك في اليمن وخارجها.';
  }
}

export async function fetchAiOpportunitySummary(title: string, description: string, requirements?: string[], responsibilities?: string[]): Promise<string[]> {
  try {
    const res = await fetch('/api/ai/summarize-opportunity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, requirements: requirements?.join('\n'), responsibilities: responsibilities?.join('\n') }),
    });

    if (!res.ok) {
      throw new Error('API server returned error');
    }

    const data = await res.json();
    return data.summary || [description.slice(0, 150) + '...'];
  } catch (error) {
    console.warn('Fallback to client summary:', error);
    return [
      `الفرصة: ${title}`,
      'نظرة عامة: يرجى استيفاء الشروط والمهارات المرفقة في الإعلان.',
      'التقديم: اضغط على زر التقديم الرسمي للانتقال لموقع الجهة الناشرة.'
    ];
  }
}

export async function fetchAiProfileImprovement(currentSummary: string, fieldOfStudy?: string, skills?: string[], experience?: any): Promise<string[]> {
  try {
    const res = await fetch('/api/ai/improve-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentSummary, fieldOfStudy, skills, experience }),
    });

    if (!res.ok) {
      throw new Error('API server returned error');
    }

    const data = await res.json();
    if (Array.isArray(data.suggestions)) {
      return data.suggestions;
    }
    if (Array.isArray(data.improvedSummary)) {
      return data.improvedSummary;
    }
    if (typeof data.improvedSummary === 'string' && data.improvedSummary) {
      return [data.improvedSummary];
    }
    return [currentSummary || 'يرجى استكمال البيانات في الملف الشخصي.'];
  } catch (error) {
    console.warn('Fallback profile improvement:', error);
    return [
      `أضف ملخصاً مهنياً واضحاً يبرز شغفك وخبراتك في مجال ${fieldOfStudy || 'تخصصك'}.`,
      'تأكد من رفع سيرتك الذاتية بصيغة PDF لسهولة وصول مسؤولي التوظيف إليها.',
      'قم بإضافة المهارات التقنية واللغات لزيادة نسبة التوافق مع الفرص المتاحة.'
    ];
  }
}
