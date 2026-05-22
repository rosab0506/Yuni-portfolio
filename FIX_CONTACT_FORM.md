# Fix Contact Form Issue

## Problem
When clicking the "Send Message" button on the contact page, you get the error:
"Could not find the table 'public.contact_messages' in the schema cache"

## Root Cause
The `contact_messages` table doesn't exist in your Supabase database.

## Solution

### Option 1: Create the table via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/tpkbibwfnmdflvqdbmjg
2. Navigate to the **SQL Editor** section
3. Copy and paste the following SQL script:

```sql
-- Create contact_messages table for storing contact form submissions
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Optional: Add a comment for documentation
COMMENT ON TABLE public.contact_messages IS 'Stores contact form submissions from the public website';
```

4. Click **Run** to execute the SQL

### Option 2: Use the provided SQL file

You can also use the SQL file located at `scripts/create-contact-messages-simple.sql` and run it in the Supabase SQL Editor.

### Option 3: Using Supabase CLI (if installed)

```bash
# Export the SQL file and run it
supabase db execute --file scripts/create-contact-messages-simple.sql
```

## Verification

After creating the table:

1. Go back to your website
2. Navigate to the contact page: `/contact`
3. Fill out the form and click "Send Message"
4. The message should now be sent successfully

## Additional Notes

- The contact form uses the Supabase REST API with the service key for authentication
- Messages will be stored in the `contact_messages` table
- You can view messages in the admin panel at `/mhe-control-center/messages`
- The API has been updated to provide better error messages if the table is missing

## Troubleshooting

If you still encounter issues:

1. **Check environment variables**: Ensure `SUPABASE_SERVICE_KEY` is set in your environment
2. **Verify table creation**: In Supabase dashboard, go to **Table Editor** and check if `contact_messages` table exists
3. **Check permissions**: The service key should have permission to insert into the table
4. **Test API directly**: You can test the API endpoint directly:
   ```
   POST /api/contact
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "subject": "Test Message",
     "message": "This is a test message"
   }
   ```

## Files Modified

1. `app/api/contact/route.ts` - Updated with better error handling
2. `netlify/functions/contact-form.ts` - Updated with better error handling
3. `scripts/create-contact-messages-simple.sql` - SQL script to create the table
4. `scripts/create-contact-messages-table.sql` - Comprehensive SQL script with RLS policies

## Additional Possible Issue: Schema Cache

If you've already created the table but still get the error, Supabase might need to refresh its schema cache:

1. Go to Supabase Dashboard
2. Navigate to **Settings** > **API**
3. Scroll down to **Schema Cache**
4. Click **Clear cache** or **Refresh schema**

This will force Supabase to reload the database schema.

## Fallback Solution

If you cannot create the table, you can modify the contact form to send emails directly instead of storing in the database. This would require:

1. Setting up an email service (like SendGrid, Mailgun, or SMTP)
2. Updating the API route to send emails
3. Configuring environment variables for email credentials

However, the database approach is recommended for better message management through the admin panel.