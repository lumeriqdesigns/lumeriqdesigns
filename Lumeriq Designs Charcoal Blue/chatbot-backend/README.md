# Lumeriq Designs Chat Backend

## Current status
The production URL `https://chatbot-backend-seven-rosy.vercel.app/api/chat` currently returns **404 Deployment not found**.

Until that backend is redeployed, the website chat widget uses a **smart local fallback** (answers about services, SEO, GBP, pricing, and contact) so visitors still get useful replies.

## Fix production AI chat (about 5 minutes)

### 1. Deploy this folder on Vercel
1. Go to https://vercel.com → New Project
2. Upload / import the `chatbot-backend` folder (or connect a Git repo that contains it)
3. Framework: Other
4. Deploy

### 2. Add environment variable
In the Vercel project → Settings → Environment Variables:

| Name | Value |
|------|--------|
| `GEMINI_API_KEY` | Your key from https://aistudio.google.com/apikey |
| `GEMINI_MODEL` (optional) | `gemini-2.0-flash` |

Redeploy after saving the variable.

### 3. Point the website at the new URL
In the website `script.js` (site root), set:

```js
const CHAT_API_ENDPOINT = "https://YOUR-BACKEND.vercel.app/api/chat";
```

Then redeploy / re-upload the website.

### 4. Test
Open the site → open chat → send “What services do you offer?”

## API contract
- `POST /api/chat`
- Body: `{ "message": "string", "history": [{ "role": "user"|"assistant", "content": "string" }] }`
- Response: `{ "reply": "string" }`

## Website
https://lumeriqdesigns.vercel.app/
