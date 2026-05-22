#!/usr/bin/env node

console.log('📧 Portfolio Contact Form Email Setup');
console.log('=====================================\n');

console.log('You want to receive contact form messages at: rosarbaker8@gmail.com');
console.log('\nChoose an option:\n');

console.log('1. QUICKEST: Use Resend.com (free tier)');
console.log('   - Sign up at https://resend.com');
console.log('   - Get API key from dashboard');
console.log('   - Add to .env.local:');
console.log('     RESEND_API_KEY=re_123456789');
console.log('     RESEND_FROM_EMAIL=onboarding@resend.dev\n');

console.log('2. EASIEST: Use IFTTT Webhook (free)');
console.log('   - Create IFTTT account at https://ifttt.com');
console.log('   - Create webhook applet (see SETUP_EMAIL_NOTIFICATIONS.md)');
console.log('   - Add to .env.local:');
console.log('     EMAIL_WEBHOOK_URL=https://maker.ifttt.com/trigger/...\n');

console.log('3. DIRECT: Use Gmail SMTP');
console.log('   - Enable 2FA on Google account');
console.log('   - Generate App Password');
console.log('   - Add to .env.local:');
console.log('     GMAIL_USER=rosarbaker8@gmail.com');
console.log('     GMAIL_PASS=your-app-password\n');

console.log('Current .env.local email settings:');
console.log('----------------------------------');

const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const emailLines = envContent.split('\n').filter(line => 
      line.includes('EMAIL') || line.includes('GMAIL') || line.includes('RESEND')
    );
    
    if (emailLines.length > 0) {
      emailLines.forEach(line => console.log(line));
    } else {
      console.log('No email configuration found in .env.local');
      console.log('Add your preferred email service configuration.');
    }
  } else {
    console.log('.env.local file not found');
    console.log('Copy .env.local.example to .env.local and configure email.');
  }
} catch (error) {
  console.log('Error reading .env.local:', error.message);
}

console.log('\n=====================================');
console.log('After configuring email:');
console.log('1. Restart your server: npm run dev');
console.log('2. Test contact form at /contact');
console.log('3. Check your email inbox!');
console.log('\nFor detailed instructions, see SETUP_EMAIL_NOTIFICATIONS.md');