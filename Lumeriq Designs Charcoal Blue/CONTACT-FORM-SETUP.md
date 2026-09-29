# Contact Form Setup (Web3Forms)

Your contact form is built and validated, but right now it has no real destination, so
submissions currently go nowhere. Web3Forms sends every submission straight to your email inbox,
for free, with no backend or hosting required (this is separate from the chat widget backend in
the `chatbot-backend` folder, which is a different feature).

## Steps (about 2 minutes)

1. Go to https://web3forms.com
2. Enter the email address you want submissions sent to (lumeriqdesigns@gmail.com) and click
   **Create Access Key**.
3. Check that inbox for an email from Web3Forms containing your **Access Key** (a long string of
   letters and numbers). Copy it.
4. Open `contact.html` in your website files and find this line near the top of the form:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY_HERE">
   ```
5. Replace `YOUR_WEB3FORMS_ACCESS_KEY_HERE` with the key you copied, so it looks like:
   ```html
   <input type="hidden" name="access_key" value="a1b2c3d4-e5f6-...">
   ```
6. Save the file and re-upload it to your hosting.

That's it. From then on, every time someone submits the contact form, you'll get an email with
their name, email, business, service, budget, timeline and project details, sent to
lumeriqdesigns@gmail.com.

## Notes
- Free tier covers up to 250 submissions/month, which is far more than a small business site
  typically needs.
- The form includes a hidden honeypot field (`botcheck`) to help filter out spam bots.
- Until you add the real access key, the form will show a friendly message asking visitors to use
  WhatsApp or email instead, so nothing looks broken in the meantime.
- If you'd rather have submissions land somewhere else (e.g. a shared team inbox, or logged to a
  spreadsheet), Web3Forms also supports Zapier/Google Sheets integrations from their dashboard,
  or I can help you switch to a different form service.
