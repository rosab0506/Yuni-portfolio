import type { Handler } from '@netlify/functions';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Temporary storage for Netlify function (in-memory, resets on cold start)
const temporaryMessages: Array<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}> = [];

export const handler: Handler = async (event) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing env vars - SUPABASE_URL:', !!SUPABASE_URL, 'SUPABASE_SERVICE_KEY:', !!SUPABASE_SERVICE_KEY);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error. Please contact administrator.' }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body || '{}');

    // Validate input
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Please enter a valid email address' }),
      };
    }

    // First, try to save to Supabase database
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
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            data,
            storage: 'supabase_database'
          }),
        };
      }
      
      // If we get here, Supabase returned an error
      const errorMessage = data.message || data.error || 'Failed to save message';
      
      if (errorMessage.includes('contact_messages') && errorMessage.includes('not found')) {
        console.log('Supabase table not found, using temporary storage');
        // Fall through to temporary storage
      } else {
        throw new Error(errorMessage);
      }
    } catch (supabaseError) {
      console.log('Supabase error, using temporary storage:', supabaseError);
      // Fall through to temporary storage
    }

    // TEMPORARY SOLUTION: Store message in memory
    // This is a fallback when the database table doesn't exist
    const tempMessage = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      subject,
      message,
      status: 'new',
      created_at: new Date().toISOString()
    };
    
    temporaryMessages.push(tempMessage);
    
    // Log the message so you can see it in Netlify logs
    console.log('📨 CONTACT FORM MESSAGE (Temporary Storage - Netlify):');
    console.log('From:', name, `<${email}>`);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Total messages in temporary storage:', temporaryMessages.length);
    console.log('---');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: tempMessage,
        storage: 'temporary_memory',
        note: 'Message saved temporarily. Database table "contact_messages" needs to be created in Supabase for permanent storage.',
        instructions: 'Run the SQL script at scripts/create-contact-messages-simple.sql in Supabase SQL Editor to create the table.'
      }),
    };
    
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to send message',
        suggestion: 'Please try again later or email directly at rosarbaker8@gmail.com'
      }),
    };
  }
};
