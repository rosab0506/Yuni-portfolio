import type { Handler } from '@netlify/functions';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const handler: Handler = async () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables',
      }),
    };
  }

  const url = `${SUPABASE_URL}/rest/v1/cms_hero?select=id&limit=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();

    return {
      statusCode: response.ok ? 200 : response.status,
      body: JSON.stringify({
        ok: response.ok,
        status: response.status,
        body: text,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
