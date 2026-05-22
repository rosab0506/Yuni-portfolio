
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env variables.');
    console.error('Usage: node --env-file=.env scripts/fix-logos.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixLogos() {
    console.log('Fetching tech stack categories...');
    const { data: categories, error } = await supabase
        .from('tech_stack_categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    for (const category of categories) {
        let hasChanges = false;
        const tools = category.tools || [];

        for (const tool of tools) {
            let newLogo = tool.logoUrl;

            // Explicit fixes based on user screenshots and "same" feedback
            if (tool.name === 'Agile Software Development') newLogo = 'https://cdn.simpleicons.org/jira';
            if (tool.name === 'REST API Development') newLogo = 'https://cdn.simpleicons.org/postman';
            if (tool.name === 'Full-Stack Development') newLogo = 'https://cdn.simpleicons.org/codeigniter';
            if (tool.name === 'Web Development') newLogo = 'https://cdn.simpleicons.org/w3c';
            if (tool.name === 'Research Skills') newLogo = 'https://cdn.simpleicons.org/googlescholar';
            if (tool.name === 'Artificial Intelligence (AI)') newLogo = 'https://cdn.simpleicons.org/openai';
            if (tool.name === 'REST APIs') newLogo = 'https://cdn.simpleicons.org/fastapi';
            if (tool.name === 'Git & GitHub') newLogo = 'https://cdn.simpleicons.org/github';

            if (newLogo !== tool.logoUrl) {
                console.log(`[Fixing] ${tool.name}: ${tool.logoUrl} -> ${newLogo}`);
                tool.logoUrl = newLogo;
                hasChanges = true;
            }
        }

        if (hasChanges) {
            console.log(`Updating category ${category.category_name}...`);
            const { error: updateError } = await supabase
                .from('tech_stack_categories')
                .update({ tools: tools })
                .eq('id', category.id);

            if (updateError) {
                console.error(`Failed to update ${category.category_name}:`, updateError);
            } else {
                console.log(`Success! Updated ${category.category_name}.`);
            }
        }
    }
}

fixLogos();
