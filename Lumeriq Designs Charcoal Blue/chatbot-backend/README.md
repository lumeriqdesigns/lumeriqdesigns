# Lumeriq Designs — Chat Backend Setup

Your website's chat widget is already built and live on every page. Right now it politely tells
visitors to use WhatsApp or email, because it isn't connected to an AI yet. Follow these steps to
turn on real AI replies. It takes about 10 minutes and the free tiers below are enough to run this.

## What you'll need
1. A Google AI Studio account (for the AI) — https://aistudio.google.com
2. A Vercel account (free hosting for this small backend) — https://vercel.com

## Step 1: Get a Gemini API key
1. Go to https://aistudio.google.com/apikey and sign in with a Google account.
2. Click **Create API Key**. Google AI Studio's free tier includes a generous monthly quota, so
   most small business chat widgets won't need to add billing at all.
3. Copy the key somewhere safe.

## Step 2: Deploy this folder to Vercel
1. Go to https://vercel.com and sign up / log in (you can use GitHub, GitLab, or email).
2. Click **Add New → Project**.
3. Choose **"Deploy without Git"** / drag-and-drop, or upload this whole `chatbot-backend` folder
   (whichever option Vercel shows you — the interface changes occasionally).
   - If you're comfortable with GitHub: create a new repository, upload this `chatbot-backend`
     folder to it, then import that repository into Vercel instead. Either way works.
4. When Vercel asks for environment variables, add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** (paste the key from Step 1)
5. Click **Deploy**. After a minute, Vercel will give you a URL like:
   `https://lumeriq-chat-backend.vercel.app`

## Step 3: Connect your website to the backend
1. Open `script.js` in your website files (the one at the root of your site, not this folder).
2. Near the very top, find this line:
   ```js
   const CHAT_API_ENDPOINT = ""; // e.g. "https://your-backend.vercel.app/api/chat"
   ```
3. Change it to your real Vercel URL, adding `/api/chat` at the end:
   ```js
   const CHAT_API_ENDPOINT = "https://lumeriq-chat-backend.vercel.app/api/chat";
   ```
4. Save the file and re-upload it to wherever your website is hosted.

That's it — the chat bubble on your site will now give real AI answers about your services,
pricing approach, and how to get in touch.

## Optional but recommended: lock the backend to your domain
Right now `chat.js` allows requests from any website (`Access-Control-Allow-Origin: '*'`), which is
fine to get started but means someone else could technically copy your backend URL and use up your
API credit. Once your site has a permanent domain, open `api/chat.js` in this folder and change:
```js
res.setHeader('Access-Control-Allow-Origin', '*');
```
to:
```js
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
```
then redeploy on Vercel (push the change if using GitHub, or re-upload otherwise).

## Costs to expect
- Vercel's free tier comfortably covers a small business chat widget.
- Gemini's free tier (via Google AI Studio) covers a generous number of requests per day for a
  model like `gemini-3.6-flash`; a small business chat widget is unlikely to exceed it. Keep an
  eye on usage at https://aistudio.google.com if traffic grows.

## If something goes wrong
- Chat widget still shows the fallback WhatsApp message → double check `CHAT_API_ENDPOINT` in
  `script.js` is set and saved, and that the site files were re-uploaded.
- Getting an error in the chat window → check the Vercel project's "Logs" tab for the real error
  (usually a missing or incorrect `GEMINI_API_KEY`).


## Lumeriq Designs production connection

Website:
https://lumeriqdesigns.vercel.app/

Chat API:
https://chatbot-backend-seven-rosy.vercel.app/api/chat

The website's `script.js` is already configured to call the production Chat API above.

### Required Vercel environment variable

In the **chatbot-backend-seven-rosy** Vercel project, add:

`GEMINI_API_KEY`

Set its value to your Google Gemini API key, then redeploy the backend. Do not put the key in the website's JavaScript.

### Quick verification

After redeploying the backend with `GEMINI_API_KEY`, open the website and send a message in Lumeriq Assistant. A successful response confirms the full connection.
