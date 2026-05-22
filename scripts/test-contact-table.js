// Test script to check if contact_messages table exists
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tpkbibwfnmdflvqdbmjg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function testTable() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing environment variables');
    console.log('SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Not set');
    console.log('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? 'Set' : 'Not set');
    return;
  }

  try {
    console.log('Testing Supabase connection...');
    
    // Try to query the table
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages?select=count`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      console.error('❌ Table not found (404)');
      console.log('The contact_messages table does not exist in the database.');
      console.log('Please run the SQL script to create the table.');
    } else if (response.ok) {
      const data = await response.json();
      console.log('✅ Table exists!');
      console.log('Response:', data);
    } else {
      const error = await response.text();
      console.error('❌ Error:', response.status, response.statusText);
      console.log('Error details:', error);
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

// Run the test
testTable();