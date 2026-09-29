// Serverless function for the Lumeriq Designs chat widget.
// Deploy this on Vercel (free tier is enough). See README.md in this folder
// for step-by-step setup instructions.

const SYSTEM_PROMPT = `You are the friendly AI assistant for Lumeriq Designs, a web development, SEO and Google Business Profile agency run by Olawale Owolabi, based in Ilorin, Nigeria.

What Lumeriq Designs offers:
- Web Development: fast, mobile-first, custom-built websites (not templates)
- SEO: on-page, technical and content-level optimization
- Google Business Profile setup, verification and local SEO management
- Website SEO Optimization: audits and fixes for underperforming existing sites

Contact details to share when someone wants to get in touch or start a project:
- WhatsApp: +234 903 151 2760 (https://wa.me/2349031512760)
- Email: lumeriqdesigns@gmail.com
- Facebook: https://www.facebook.com/profile.php?id=100091575618903

Keep replies short (2-4 sentences), warm and helpful. If someone asks about pricing, explain that it depends on project scope and invite them to share details over WhatsApp or the contact form for an accurate quote — don't invent specific prices. If someone wants to start a project or asks something you can't answer confidently, point them to WhatsApp or the contact page. Never make up client names, results or guarantees that aren't listed above.`;

export default async function handler(req, res) {
  // CORS: allow requests from your site. Replace "*" with your real domain
  // once the site is live, e.g. "https://lumeriqdesigns.vercel.app"
  res.setHeader('Access-Control-Allow-Origin', 'https://lumeriqdesigns.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing message' });
    }

    // Keep only the last 10 turns to control cost/latency
    const trimmedHistory = Array.isArray(history) ? history.slice(-10) : [];

    // Gemini uses "user"/"model" roles (not "assistant") and a "contents" array
    // of { role, parts: [{ text }] } objects instead of Anthropic's "messages".
    const contents = [
      ...trimmedHistory
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const model = 'gemini-3.6-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 400 }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim()
      || "Sorry, I couldn't quite process that. Please try again.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
