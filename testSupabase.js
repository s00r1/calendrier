const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://dexbvustuzzghzdpetjr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleGJ2dXN0dXp6Z2h6ZHBldGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjQ4NTEsImV4cCI6MjA2NTE0MDg1MX0.h3PbDOoiLj9gQmaGJkRWZL7vN_M52Qboik4EFjqpavA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Erreur Supabase :', error);
  } else {
    console.log('Données reçues :', data);
  }
}

main().catch(err => console.error('Erreur inattendue :', err));
