-- Create contact_messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    handled_by TEXT,
    handled_at TIMESTAMPTZ,
    
    -- Add indexes for better query performance
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to insert new messages (for contact form)
CREATE POLICY "Allow anonymous insert" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all messages (for admin panel)
CREATE POLICY "Allow authenticated read" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update messages (for admin panel)
CREATE POLICY "Allow authenticated update" ON public.contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete messages (for admin panel)
CREATE POLICY "Allow authenticated delete" ON public.contact_messages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add comment for documentation
COMMENT ON TABLE public.contact_messages IS 'Stores contact form submissions from the public website';
COMMENT ON COLUMN public.contact_messages.status IS 'Message status: new, read, or archived';
COMMENT ON COLUMN public.contact_messages.handled_by IS 'Admin user who handled the message';
COMMENT ON COLUMN public.contact_messages.handled_at IS 'Timestamp when message was handled';