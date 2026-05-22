import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/visitor_logs?order=visited_at.desc&limit=200`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error('[visitor-logs] Supabase error:', err);
      throw new Error(err.message || 'Failed to fetch logs');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch visitor logs' },
      { status: 500 }
    );
  }
}
