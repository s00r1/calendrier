const fetch = require('node-fetch');

// Default bin used for local testing. Replace with your own bin ID or
// set the JSONBIN_ID environment variable when deploying.
const BIN_ID = process.env.JSONBIN_ID || '6844456c8561e97a5020ae90';
const API_KEY = process.env.JSONBIN_KEY || 'votre_cle_test';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const apiKey = API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'JSONBIN_KEY not set' });
  }

  const path = req.url.replace(/^\/api\/jsonbin-proxy/, '');
  const url = BASE_URL + path + (req.originalUrl && req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '');

  const raw = await new Promise(resolve => {
    let data = '';
    req.on('data', c => data += c);
    req.on('end', () => resolve(data));
  });
  const body = raw ? JSON.parse(raw) : undefined;

  try {
    const forward = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(body)
    });

    const text = await forward.text();
    res.status(forward.status);
    if (forward.headers.get('content-type')) {
      res.setHeader('Content-Type', forward.headers.get('content-type'));
    }
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error' });
  }
};
