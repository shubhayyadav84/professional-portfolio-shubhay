import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

dotenv.config();

console.log("----------------------------------------");
console.log("BACKEND CURRENT WORKING DIRECTORY:", process.cwd());
console.log("SMTP USERNAME LOADED:", process.env.SMTP_USER || "NOT FOUND");
console.log("SMTP PASSWORD LOADED:", process.env.SMTP_PASS ? "EXISTS (SUCCESS)" : "NOT FOUND (MISSING)");
console.log("----------------------------------------");

const { Pool } = pg;

// Initialize PostgreSQL pool using Neon connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon cloud hosting
  }
});

// Configure Nodemailer SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper function to dispatch emails to shubhayyadav64@gmail.com
const sendNotificationEmail = async (name, email, message) => {
  // If SMTP credentials are not configured, skip email sending
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not fully configured in backend/.env. Skipping email dispatch.");
    return false;
  }

  const mailOptions = {
    from: `"Portfolio Shubhay" <${process.env.SMTP_USER}>`, // Sender Name requested by user
    to: 'shubhayyadav64@gmail.com', // Destination requested by user
    replyTo: email,
    subject: `📬 Portfolio Contact: New message from ${name}`,
    text: `New contact form submission:\n\nSender: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 25px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #38bdf8; padding-bottom: 10px; margin-top: 0; font-family: 'Orbitron', Arial, sans-serif; letter-spacing: 1px;">PORTFOLIO UPLINK ESTABLISHED</h2>
        <p style="font-size: 14px;">You have received a new message from the contact terminal of your portfolio site.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 120px; font-size: 13px; color: #64748b;">SENDER NAME:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; font-size: 13px; color: #64748b;">SENDER EMAIL:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0066ff;"><a href="mailto:${email}" style="color: #0066ff; text-decoration: none;">${email}</a></td>
          </tr>
        </table>
        
        <div style="background-color: #f8fafc; padding: 18px; border-left: 4px solid #bc00dd; margin-top: 25px; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: bold; margin-bottom: 6px;">TXT_PAYLOAD_BODY:</p>
          <p style="margin: 0; font-size: 14px; font-style: italic; line-height: 1.5; color: #334155;">"${message}"</p>
        </div>
        
        <p style="margin-top: 35px; font-size: 11px; color: #94a3b8; border-t: 1px solid #f1f5f9; padding-top: 15px;">
          System broadcast: generated automatically from Portfolio Shubhay.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log("📬 Notification email successfully dispatched to shubhayyadav64@gmail.com.");
  return true;
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Table
const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(queryText);
    client.release();
    console.log("Database initialized: 'contacts' table is ready.");
  } catch (err) {
    console.error("Failed to initialize database table:", err);
  }
};

// Route to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const queryText = 'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(queryText, [name, email, message]);
    
    console.log("New contact saved to database:", result.rows[0]);

    // Dispatch email notification asynchronously
    let emailDispatched = false;
    try {
      emailDispatched = await sendNotificationEmail(name, email, message);
    } catch (mailErr) {
      console.error("⚠️ Failed to dispatch notification email:", mailErr);
    }

    res.status(201).json({ 
      success: true, 
      message: "Message saved to Neon database successfully.",
      emailSent: emailDispatched,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Database write error:", err);
    res.status(500).json({ error: "Failed to store message in database." });
  }
});

// AI Chat Route - Portfolio Assistant
app.post('/api/chat', async (req, res) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (!GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY not set.");
    return res.json({
      reply: "I'm currently offline — the AI service isn't configured yet. Please try again later!",
      section: null,
      buttonText: null,
    });
  }

  const systemPrompt = `You are the AI assistant embedded in Shubhay Yadav's portfolio website. You are helpful, friendly, concise, and smart.

You can answer ANY question the user asks — whether it's about the portfolio, technology, general knowledge, current affairs, science, history, coding, or anything else. You are a general-purpose AI assistant that also happens to know everything about this portfolio.

PORTFOLIO KNOWLEDGE (use when relevant):

ABOUT SHUBHAY YADAV:
- Full Stack Developer, CSE Undergrad, AI Enthusiast, MERN Stack Specialist
- Skills: React.js, JavaScript, Node.js, Python, Java, MongoDB, Express.js, REST APIs, Git/GitHub
- Email: shubhayyadav84@gmail.com
- GitHub: shubhayyadav84
- LinkedIn: shubhay-yadav-b66519309
- Phone: +91-8355006651

PROJECTS:
1. VOICEMED — Voice Biomarker Diagnostics: AI-driven diagnostics analyzing audio signals (pitch, jitter, shimmer, 12+ biomarkers) for health scores. Tech: Next.js, FastAPI, MongoDB, Python, Scikit-Learn. Demo: voicemed.vercel.app
2. WEBSHIELD — OWASP Vulnerability Scanner: Automated pen-testing engine detecting SQLi and XSS threats, aligned with OWASP Top 10. Tech: React.js, Node.js, Express.js, Cheerio. Demo: webshield-frontend-amber.vercel.app

INTERNSHIPS:
- MERN Full-Stack Intern: Built responsive full-stack apps with MongoDB, Express.js, React.js, Node.js
- Key accomplishments: Secure REST API Pipelines, Debugging & Performance Optimization, Collaborative Git Workflows

CERTIFICATIONS:
1. Apna College Delta 6.0 — Full Stack Development (Dec 2024)
2. Infosys Python Programming — Core Concepts & Algorithms (Feb 2025)
3. JPMorgan Chase & Co. — Software Engineering Virtual Experience (Aug 2025)

NAVIGABLE PORTFOLIO SECTIONS:
- About Me, Projects, Internships, Certificates, Contact Me

RULES:
1. Keep responses concise (2-5 sentences). Be conversational and engaging.
2. You CAN and SHOULD answer ANY question — general knowledge, tech, science, history, etc.
3. If the user asks about the portfolio (skills, projects, internships, certs, contact), answer using the info above.
4. If the user says "predict my future" or asks for a prediction, generate a unique, inspiring, tech/career-focused prediction (2-4 sentences). No astrology, zodiac, magic, or religion.
5. When a portfolio section is relevant to your answer, include "section" and "buttonText". Otherwise set both to null.
6. Be witty and personable. Use emojis occasionally.

RESPONSE FORMAT — respond with ONLY valid JSON, no markdown fences, no extra text:
{
  "reply": "Your response text here.",
  "section": "Projects",
  "buttonText": "🚀 Explore Projects"
}

If no portfolio section is relevant:
{
  "reply": "Your response text here.",
  "section": null,
  "buttonText": null
}

Section → buttonText mapping:
- About Me → "🧠 Discover My Story"
- Projects → "🚀 Explore Projects"
- Internships → "💼 View Internships"
- Certificates → "🏆 View Certificates"
- Contact Me → "📡 Connect With Me"`;

  // Build conversation history
  const contents = [];
  if (history && Array.isArray(history)) {
    for (const msg of history.slice(-10)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }
  }
  contents.push({ role: 'user', parts: [{ text: message }] });

  // Try multiple models in case one is rate-limited
  const modelsToTry = ['gemini-2.0-flash', 'gemini-2.0-flash-lite'];
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  for (const modelName of modelsToTry) {
    try {
      console.log(`💬 Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      });

      const rawText = result.response.text().trim();
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        console.error("⚠️ Gemini response was not valid JSON:", rawText);
        return res.json({ reply: rawText, section: null, buttonText: null });
      }

      console.log(`✅ AI response generated via ${modelName}`);
      return res.json({
        reply: parsed.reply || parsed.message || rawText,
        section: parsed.section || null,
        buttonText: parsed.buttonText || null,
      });

    } catch (err) {
      console.warn(`⚠️ Model ${modelName} failed:`, err.message?.substring(0, 150));
      // If it's a rate limit error and we have more models, try the next one
      if (err.message?.includes('429') && modelName !== modelsToTry[modelsToTry.length - 1]) {
        await new Promise(r => setTimeout(r, 1000)); // brief pause before next attempt
        continue;
      }
      // If it's the last model or a non-rate-limit error, fall through
    }
  }

  // All Gemini models failed — try Groq as fallback
  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (GROK_API_KEY) {
    try {
      console.log('🔄 Falling back to Groq...');
      const groq = new OpenAI({
        apiKey: GROK_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      });

      // Build messages for OpenAI-compatible format
      const groqMessages = [{ role: 'system', content: systemPrompt }];
      if (history && Array.isArray(history)) {
        for (const msg of history.slice(-10)) {
          groqMessages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          });
        }
      }
      groqMessages.push({ role: 'user', content: message });

      const groqResult = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
      });

      const groqRaw = groqResult.choices[0]?.message?.content?.trim() || '';
      // Remove code fences and try to extract the JSON object
      let groqCleaned = groqRaw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      // If response has text before JSON, extract just the JSON object
      const jsonMatch = groqCleaned.match(/\{[\s\S]*"reply"[\s\S]*\}/);
      if (jsonMatch) groqCleaned = jsonMatch[0];

      let groqParsed;
      try {
        groqParsed = JSON.parse(groqCleaned);
      } catch {
        console.error('⚠️ Groq response was not valid JSON:', groqRaw);
        // Extract plain text (strip any JSON parts)
        const plainText = groqRaw.replace(/\{[\s\S]*\}/g, '').trim();
        return res.json({ reply: plainText || groqRaw, section: null, buttonText: null });
      }

      console.log('✅ AI response generated via Groq fallback');
      return res.json({
        reply: groqParsed.reply || groqParsed.message || groqRaw,
        section: groqParsed.section || null,
        buttonText: groqParsed.buttonText || null,
      });

    } catch (groqErr) {
      console.error('❌ Groq fallback also failed:', groqErr.message?.substring(0, 200));
    }
  }

  // Everything failed
  console.error('❌ All AI providers failed.');
  return res.json({
    reply: '⏳ I\'m currently rate-limited. Please wait a minute and try again — I\'ll be back shortly!',
    section: null,
    buttonText: null,
  });
});

// Initialize database immediately on startup / cold start
initDb().catch(err => console.error("Database initialization failed:", err));

// Start Server locally (skip in production Vercel serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
