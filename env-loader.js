(async () => {
  try {
    const res = await fetch('.env');
    if (res.ok) {
      const text = await res.text();
      const env = Object.fromEntries(
        text.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'))
          .map(line => line.split('='))
      );
      window.ADMIN_PASS = env.ADMIN_PASS || 's00r1';
    } else {
      window.ADMIN_PASS = 's00r1';
    }
  } catch (e) {
    window.ADMIN_PASS = 's00r1';
  }
})();
