# Setup Email Notifications for Contact Form

Currently, contact form messages are logged to console but not sent to your email. Here are 3 easy ways to get messages in your inbox:

## Option 1: IFTTT Webhook (Easiest, Free)

1. **Create IFTTT account** at https://ifttt.com
2. **Create a new Applet**: "If This Then That"
3. **For "This"**: Choose "Webhooks" service
   - Select "Receive a web request"
   - Event name: `contact_form_submission`
4. **For "That"**: Choose "Email" service
   - Select "Send me an email"
   - Configure email subject: `Portfolio Contact: {{Value1}}`
   - Configure email body:
     ```
     From: {{Value2}} <{{Value3}}>
     Message: {{Value4}}
     
     Time: {{OccurredAt}}
     ```
5. **Get your webhook URL**:
   - Go to https://ifttt.com/maker_webhooks
   - Click "Documentation"
   - Your URL looks like: `https://maker.ifttt.com/trigger/contact_form_submission/with/key/YOUR_KEY`
6. **Add to .env.local**:
   ```
   EMAIL_WEBHOOK_URL=https://maker.ifttt.com/trigger/contact_form_submission/with/key/YOUR_KEY
   ```

## Option 2: Gmail SMTP (Direct)

1. **Enable 2FA on Google Account** (if not already)
2. **Generate App Password**:
   - Go to https://myaccount.google.com/security
   - Under "Signing in to Google", click "App passwords"
   - Select "Mail" and "Other" (name it "Portfolio Site")
   - Copy the 16-character password
3. **Add to .env.local**:
   ```
   GMAIL_USER=rosarbaker8@gmail.com
   GMAIL_PASS=your-16-character-app-password
   ```
4. **Update API code** to use Nodemailer with Gmail SMTP

## Option 3: Resend.com (Modern, Recommended)

1. **Sign up at Resend.com** (free tier available)
2. **Verify your domain** or use their test domain
3. **Get API key** from dashboard
4. **Add to .env.local**:
   ```
   RESEND_API_KEY=re_123456789
   RESEND_FROM_EMAIL=onboarding@resend.dev  # or your verified email
   ```
5. **Install Resend**: `npm install resend`
6. **Update API code** to use Resend

## Option 4: Netlify Functions + Email Service

Since you're on Netlify:
1. Use Netlify's built-in form handling (simplest)
2. Or use a Netlify Function with SendGrid/Mailgun

## Quick Test (Right Now)

For now, messages are logged to console. To see a message:

1. Submit contact form
2. Check server console logs
3. You'll see the full message details

## Immediate Solution

I've updated the code to:
1. **Log messages clearly** in console with 📧 emoji
2. **Support webhooks** (add EMAIL_WEBHOOK_URL to .env.local)
3. **Ready for Gmail/Resend** (just uncomment and configure)

## To Get Emails TODAY:

**Use Option 1 (IFTTT)** - it takes 5 minutes:
1. Sign up at IFTTT
2. Create webhook applet
3. Add webhook URL to .env.local
4. Restart server

Your contact form will then send real emails to rosarbaker8@gmail.com!