import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Forsati API", hasAi: !!ai });
});

// AI Assistant Route "مساعد فرصتي"
app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!ai) {
      // Fallback response if API Key is not set or initialized
      return res.json({
        reply: "أهلاً بك! أنا مساعد منصة فرصتي الذكي. يسعدني مساعدتك في تطوير سيرتك الذاتية، وتحليل متطلبات الوظائف والفرص، وتوجيهك نحو المهارات المطلوبة في سوق العمل اليمني والعالمي."
      });
    }

    const systemInstruction = `
أنت "مساعد فرصتي" (Forsati AI Assistant)، المساعد الذكي الخاص بـ منصة "فرصتي" للأعمال والفرص في اليمن.
تحدث بأسلوب مهني، مشجع، واضح، وبنائ باللغة العربية الفصحى البسيطة.
مهامك:
1. تقديم النصائح المهنية وتطوير السيرة الذاتية بدون اختلاق خبرات غير حقيقية.
2. شرح وتوضيح متطلبات الوظائف والمنح والتدريبات بأسلوب مبسط.
3. اقتراح المهارات والدورات المناسبة لسد الفجوات المهنية.
4. الإجابة عن التساؤلات الخاصة بالتقديم على الفرص في اليمن وخارجها.
قواعد صارمة:
- لا تضمن الحصول على الوظيفة أو القبول.
- لا تخترع فرصاً أو مواعيد أو أسماء مؤسسات غير موجودة في السياق.
- لا تتخذ قرارات توظيف أو رفض تلقائي.
- حافظ على النبرة المحفزة والإيجابية والمهنية.
    `.trim();

    const userMessage = context 
      ? `السياق الحالي للمستخدم أو الفرصة:\n${JSON.stringify(context, null, 2)}\n\nسؤال المستخدم:\n${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "عذراً، لم أستطع معالجة الإجابة في الوقت الحالي.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in AI Assistant API:", error);
    return res.status(500).json({ 
      error: "حدث خطأ أثناء الاتصال بمساعد فرصتي الذكي.",
      details: error?.message || "Unknown error"
    });
  }
});

// AI Opportunity Summarizer
app.post("/api/ai/summarize-opportunity", async (req, res) => {
  try {
    const { title, description, requirements, responsibilities } = req.body;

    if (!ai) {
      return res.json({
        summary: [
          `الفرصة: ${title || "فرصة متاحة"}`,
          "نظرة عامة: فرصة ممتازة متاحة للمتقدمين المستوفين للمهارات والشروط الموضحة.",
          "التقديم: يرجى مراجعة رابط التقديم الرسمي واتباع التعليمات المرفقة."
        ]
      });
    }

    const prompt = `
قم بتلخيص هذه الفرصة بشكل نقاط مختصرة وواضحة جداً باللغة العربية:
العنوان: ${title}
الوصف: ${description}
المهام والمسؤوليات: ${responsibilities || "غير محددة"}
المتطلبات: ${requirements || "غير محددة"}

المطلوب:
إرجاع ملخص في 3 إلى 5 نقاط أساسية تشمل (طبيعة الفرصة، أبرز شرطين، والفائدة الرئيسية).
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت ملخص فرص ذكي وسريع باللغة العربية. اجعل الإجابة في نقاط واضحة ومباشرة.",
      },
    });

    const rawText = response.text || "";
    const points = rawText
      .split("\n")
      .map(p => p.replace(/^[-*•\d.]+\s*/, "").trim())
      .filter(p => p.length > 0);

    return res.json({ summary: points });
  } catch (error: any) {
    console.error("Error summarizing opportunity:", error);
    return res.status(500).json({ error: "تعذر تلخيص الفرصة حالياً." });
  }
});

// AI Profile Assistant (Enhance bio/summary)
app.post("/api/ai/improve-profile", async (req, res) => {
  try {
    const { currentSummary, skills, experience, fieldOfStudy } = req.body;

    if (!ai) {
      return res.json({
        improvedSummary: currentSummary 
          ? `${currentSummary} - خريج/مختص طموح يسعى للنمو المهني وتطوير المهارات العملية.`
          : `مختص طموح في مجال ${fieldOfStudy || "التنمية والمهارات"}، يمتلك مهارات متنوعة ويسعى للانضمام إلى فرص واعدة لتطبيق خبراته وتطوير قدراته المهنية.`
      });
    }

    const prompt = `
ساعد المستخدم في تحسين وصياغة نبذته الشخصية (Profile Bio) باللغة العربية الفصحى بشكل احترافي وجذاب لأصحاب العمل والمنظمات.
المعلومات المتوفرة:
- النبذة الحالية: ${currentSummary || "لا يوجد"}
- المجال الدراسي/التخصص: ${fieldOfStudy || "غير مححدد"}
- المهارات: ${Array.isArray(skills) ? skills.join(", ") : skills || "غير محددة"}
- الخبرات: ${Array.isArray(experience) ? JSON.stringify(experience) : experience || "غير محددة"}

تنبيه هام: لا تخترع أي شهادات أو سنوات خبرة أو مؤهلات غير مذكورة. فقط حسّن أسلوب الصياغة واللغة.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت خبير صياغة سير ذاتية وملفات شخصية باللغة العربية. قدم نبذة محسنة موجزة واحترافية.",
      },
    });

    return res.json({ improvedSummary: response.text?.trim() || currentSummary });
  } catch (error: any) {
    console.error("Error improving profile:", error);
    return res.status(500).json({ error: "تعذر تحسين النبذة حالياً." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Forsati Server running on http://localhost:${PORT}`);
  });
}

startServer();
