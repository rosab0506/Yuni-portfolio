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
      
      // Check if error is about missing table
      const errorMessage = err.message || err.error || 'Failed to fetch logs';
      if (errorMessage.includes('visitor_logs') && errorMessage.includes('not found')) {
        return NextResponse.json(
          { 
            error: 'Database table not found',
            message: 'The visitor_logs table does not exist in the database.',
            solution: 'Run the SQL script at scripts/create-visitor-logs-table.sql in Supabase SQL Editor to create the table.'
          }, 
          { status: 404 }
        );
      }
      
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch visitor logs';
    
    // Check for table not found error in the message
    if (errorMessage.includes('visitor_logs') && errorMessage.includes('not found')) {
      return NextResponse.json(
        { 
          error: 'Database table not found',
          message: 'The visitor_logs table does not exist in the database.',
          solution: 'Run the SQL script at scripts/create-visitor-logs-table.sql in Supabase SQL Editor to create the table.'
        }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
