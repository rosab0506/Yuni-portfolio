import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Email configuration - YOU NEED TO SET THESE IN .env.local
const EMAIL_TO = process.env.CONTACT_FORM_EMAIL_TO || 'rosarbaker8@gmail.com'; // Your email address
const EMAIL_FROM = process.env.CONTACT_FORM_EMAIL_FROM || 'noreply@yourdomain.com';
const EMAIL_SUBJECT_PREFIX = 'Portfolio Contact: ';

// Resend.com configuration (modern email service)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || EMAIL_FROM;

// For Gmail SMTP (if you want to use your Gmail)
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS; // Use App Password, not regular password

// Webhook for IFTTT/Zapier
const EMAIL_WEBHOOK_URL = process.env.EMAIL_WEBHOOK_URL;

// Temporary storage for messages (in-memory, will reset on server restart)
const temporaryMessages: Array<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}> = [];

// Function to send email using Resend.com
async function sendEmailWithResend(name: string, fromEmail: string, subject: string, message: string) {
  if (!RESEND_API_KEY) {
    return { success: false, error: 'Resend API key not configured' };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_API_KEY);
    
    const emailSubject = `${EMAIL_SUBJECT_PREFIX}${subject}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>From:</strong> ${name} &lt;${fromEmail}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #555;">Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
          <p>This message was sent from your portfolio website contact form.</p>
        </div>
      </div>
    `;
    
    const emailText = `
New Contact Form Submission

From: ${name} <${fromEmail}>
Subject: ${subject}
Time: ${new Date().toLocaleString()}

Message:
${message}

---
This message was sent from your portfolio website contact form.
`;
    
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: EMAIL_TO,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    });
    
    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Email sent via Resend:', data);
    return { success: true, method: 'resend', data };
    
  } catch (error) {
    console.error('Failed to send email with Resend:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Function to send email using webhook (IFTTT/Zapier)
async function sendEmailWithWebhook(name: string, fromEmail: string, subject: string, message: string) {
  if (!EMAIL_WEBHOOK_URL) {
    return { success: false, error: 'Webhook URL not configured' };
  }

  try {
    const webhookResponse = await fetch(EMAIL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value1: subject,  // IFTTT expects value1, value2, value3
        value2: name,
        value3: fromEmail,
        value4: message,
        to: EMAIL_TO,
        from: fromEmail,
        subject: `${EMAIL_SUBJECT_PREFIX}${subject}`,
        name: name,
        message: message,
        timestamp: new Date().toISOString()
      }),
    });
    
    if (webhookResponse.ok) {
      console.log('✅ Email webhook sent successfully');
      return { success: true, method: 'webhook' };
    } else {
      const errorText = await webhookResponse.text();
      console.error('Webhook error:', errorText);
      return { success: false, error: `Webhook failed: ${webhookResponse.status}` };
    }
  } catch (webhookError) {
    console.error('Webhook failed:', webhookError);
    return { success: false, error: webhookError instanceof Error ? webhookError.message : 'Unknown error' };
  }
}

// Main email sending function (tries multiple methods)
async function sendEmail(name: string, fromEmail: string, subject: string, message: string) {
  // Log email details (always do this)
  const emailContent = `
New Contact Form Submission

From: ${name} <${fromEmail}>
Subject: ${subject}
Time: ${new Date().toLocaleString()}

Message:
${message}

---
This message was sent from your portfolio website contact form.
`;
  
  console.log('📧 ===== EMAIL NOTIFICATION =====');
  console.log('TO:', EMAIL_TO);
  console.log('FROM:', fromEmail);
  console.log('SUBJECT:', EMAIL_SUBJECT_PREFIX + subject);
  console.log('CONTENT:');
  console.log(emailContent);
  console.log('=================================');
  
  // Try Resend first (if configured)
  if (RESEND_API_KEY) {
    const resendResult = await sendEmailWithResend(name, fromEmail, subject, message);
    if (resendResult.success) {
      return resendResult;
    }
    console.log('Resend failed, trying webhook...');
  }
  
  // Try webhook second (if configured)
  if (EMAIL_WEBHOOK_URL) {
    const webhookResult = await sendEmailWithWebhook(name, fromEmail, subject, message);
    if (webhookResult.success) {
      return webhookResult;
    }
    console.log('Webhook failed, using log only...');
  }
  
  // If neither configured or both failed, just log
  console.log('ℹ️ No email service configured. Messages are logged to console only.');
  console.log('To receive real emails, set up Resend.com or IFTTT webhook.');
  console.log('See SETUP_EMAIL_NOTIFICATIONS.md for instructions.');
  
  return { success: true, simulated: true, method: 'console_log_only' };
}

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // STEP 1: Try to send email notification
    const emailResult = await sendEmail(name, email, subject, message);
    
    // STEP 2: Try to save to Supabase database
    let databaseSaved = false;
    let databaseError = null;
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          subject, 
          message, 
          status: 'new',
          created_at: new Date().toISOString()
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Message saved to Supabase database:', data);
        databaseSaved = true;
      } else {
        const errorMessage = data.message || data.error || 'Failed to save message';
        databaseError = errorMessage;
        
        if (errorMessage.includes('contact_messages') && errorMessage.includes('not found')) {
          console.log('Supabase table not found, using temporary storage');
        } else {
          throw new Error(errorMessage);
        }
      }
    } catch (supabaseError) {
      console.log('Supabase error, using temporary storage:', supabaseError);
      databaseError = supabaseError instanceof Error ? supabaseError.message : 'Unknown error';
    }

    // STEP 3: If database save failed, use temporary storage
    let tempMessage = null;
    if (!databaseSaved) {
      tempMessage = {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        subject,
        message,
        status: 'new',
        created_at: new Date().toISOString()
      };
      
      temporaryMessages.push(tempMessage);
      
      console.log('📨 CONTACT FORM MESSAGE (Temporary Storage):');
      console.log('From:', name, `<${email}>`);
      console.log('Subject:', subject);
      console.log('Message:', message);
      console.log('Total messages in temporary storage:', temporaryMessages.length);
      console.log('---');
    }

    // Prepare response
    const responseData: any = {
      success: true,
      email_sent: emailResult.success,
      database_saved: databaseSaved,
      storage: databaseSaved ? 'supabase_database' : 'temporary_memory'
    };

    if (databaseSaved) {
      responseData.data = { name, email, subject, message };
    } else {
      responseData.data = tempMessage;
      responseData.note = 'Message saved temporarily. Database table "contact_messages" needs to be created in Supabase for permanent storage.';
      responseData.instructions = 'Run the SQL script at scripts/create-contact-messages-simple.sql in Supabase SQL Editor to create the table.';
    }

    // Add email setup instructions if email wasn't really sent
    if ('simulated' in emailResult && emailResult.simulated) {
      responseData.email_note = 'Email notification simulated. Set up real email service to receive messages in inbox.';
      responseData.email_instructions = 'Configure email service (SendGrid, Mailgun, SMTP) in API route.';
    } else if (!emailResult.success && 'error' in emailResult) {
      responseData.email_note = 'Email notification failed. Check server logs.';
      responseData.email_error = emailResult.error;
    }

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send message',
        suggestion: 'Please try again later or email directly at rosarbaker8@gmail.com'
      },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to view temporary messages (for debugging)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  
  // Simple security check - in production, use proper authentication
  if (secret !== 'debug123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({
    count: temporaryMessages.length,
    messages: temporaryMessages,
    note: 'These are temporarily stored messages. Create the Supabase table to store them permanently.'
  });
}
