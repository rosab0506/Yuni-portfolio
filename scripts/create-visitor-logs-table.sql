-- ============================================
-- CREATE VISITOR_LOGS TABLE FOR SUPABASE
-- ============================================
-- Copy and paste this entire SQL into Supabase SQL Editor and click Run

-- Create visitor_logs table
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  page TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries (ordered by most recent visits)
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visited_at ON public.visitor_logs(visited_at DESC);

-- Enable Row Level Security (RLS) for security
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous access (for API to insert/read)
CREATE POLICY "Allow anonymous insert and select" ON public.visitor_logs
  FOR ALL USING (true);

-- ============================================
-- OPTIONAL: Also create contact_messages table if needed
-- ============================================
/*
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  handled_by TEXT,
  handled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
*/

-- ============================================
-- VERIFICATION QUERY (run after creating table)
-- ============================================
-- After running the above, run this to verify:
-- SELECT * FROM public.visitor_logs LIMIT 5;