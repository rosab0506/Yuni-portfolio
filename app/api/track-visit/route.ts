import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
// Fall back to anon key if service key is not set
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('[track-visit] Missing env vars:', {
      SUPABASE_URL: !!SUPABASE_URL,
      SUPABASE_KEY: !!SUPABASE_KEY,
    });
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    // Extract IP from headers (works on Vercel, Netlify, and proxies)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const userAgent = request.headers.get('user-agent') || null;
    const { page } = await request.json().catch(() => ({ page: '/' }));

    const response = await fetch(`${SUPABASE_URL}/rest/v1/visitor_logs`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ ip_address: ip, user_agent: userAgent, page }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('[track-visit] Supabase insert failed:', err);
      throw new Error(err.message || 'Failed to log visitor');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to track visit' },
      { status: 500 }
    );
  }
}
