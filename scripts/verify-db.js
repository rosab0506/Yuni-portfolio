
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env variables.');
    console.error('Usage: node --env-file=.env scripts/verify-db.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyLogos() {
    console.log('Verifying DB state...');
    const { data: categories, error } = await supabase
        .from('tech_stack_categories')
        .select('*');

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    const targets = [
        'Agile Software Development',
        'REST API Development',
        'Full-Stack Development',
        'Artificial Intelligence (AI)'
    ];

    let correctCount = 0;

    for (const category of categories) {
        const tools = category.tools || [];
        for (const tool of tools) {
            if (targets.includes(tool.name)) {
                console.log(`[CHECK] "${tool.name}": ${tool.logoUrl.substring(0, 40)}...`);
                if (!tool.logoUrl.includes('data:image')) correctCount++;
            }
        }
    }
}

verifyLogos();
