// Deployment Environment Check Script
// Run this to check if environment variables are set correctly

console.log('=== DEPLOYMENT ENVIRONMENT CHECK ===\n');

// Check Supabase environment variables
const envVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY,
  'SUPABASE_SERVICE_KEY': process.env.SUPABASE_SERVICE_KEY,
  'CONTACT_FORM_EMAIL_TO': process.env.CONTACT_FORM_EMAIL_TO,
  'CONTACT_FORM_EMAIL_FROM': process.env.CONTACT_FORM_EMAIL_FROM,
};

let allSet = true;

console.log('Environment Variables Status:');
console.log('----------------------------');

for (const [key, value] of Object.entries(envVars)) {
  const isSet = !!value;
  const status = isSet ? '✅ SET' : '❌ MISSING';
  
  if (!isSet) allSet = false;
  
  if (isSet && (key.includes('URL') || key.includes('KEY'))) {
    // Show partial values for sensitive keys
    const displayValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
    console.log(`${status} ${key}: ${displayValue}`);
  } else if (isSet) {
    console.log(`${status} ${key}: ${value}`);
  } else {
    console.log(`${status} ${key}`);
  }
}

console.log('\n=== SUMMARY ===');
if (allSet) {
  console.log('✅ All required environment variables are set!');
} else {
  console.log('❌ Some environment variables are missing.');
  console.log('\n=== NEXT STEPS ===');
  console.log('1. Go to Netlify Dashboard: https://app.netlify.com');
  console.log('2. Select your site');
  console.log('3. Go to Site configuration → Environment variables');
  console.log('4. Add the missing variables from your .env.local file');
  console.log('5. Redeploy your site');
}

// Test Supabase connection if variables are set
if (envVars.NEXT_PUBLIC_SUPABASE_URL && envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('\n=== SUPABASE CONNECTION TEST ===');
  console.log('Testing Supabase connection...');
  
  // Simple fetch test
  const testUrl = `${envVars.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/visitor_logs?limit=1`;
  const headers = {
    'apikey': envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  };
  
  fetch(testUrl, { headers })
    .then(response => {
      if (response.ok) {
        console.log('✅ Supabase connection successful');
        return response.json();
      } else {
        console.log(`❌ Supabase connection failed: ${response.status} ${response.statusText}`);
        return response.text().then(text => {
          console.log(`Error details: ${text.substring(0, 200)}...`);
          if (text.includes('visitor_logs') && text.includes('not found')) {
            console.log('\n⚠️  Table "visitor_logs" not found in Supabase database.');
            console.log('   Run the SQL in ONE_LINE_VISITOR_LOGS_FIX.sql to create the table.');
          }
        });
      }
    })
    .then(data => {
      if (data) {
        console.log(`✅ Table exists, found ${Array.isArray(data) ? data.length : '?'} records`);
      }
    })
    .catch(error => {
      console.log(`❌ Fetch error: ${error.message}`);
    });
}