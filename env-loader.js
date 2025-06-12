(async () => {
  try {
    const res = await fetch('.env');
    let env = {};
    if (res.ok) {
      const text = await res.text();
      env = Object.fromEntries(
        text.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'))
          .map(line => line.split('='))
      );
    }
    window.ADMIN_PASS = env.ADMIN_PASS || 's00r1';

    try {
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
      const url = env.SUPABASE_URL || 'https://dexbvustuzzghzdpetjr.supabase.co';
      const key = env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleGJ2dXN0dXp6Z2h6ZHBldGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjQ4NTEsImV4cCI6MjA2NTE0MDg1MX0.h3PbDOoiLj9gQmaGJkRWZL7vN_M52Qboik4EFjqpavA';
      const supabase = createClient(url, key);
      const { data } = await supabase
        .from('admin_configs')
        .select('admin_pass')
        .order('id')
        .limit(1)
        .single();
      if (data && data.admin_pass) {
        window.ADMIN_PASS = data.admin_pass;
      }
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    window.ADMIN_PASS = 's00r1';
  }
})();
