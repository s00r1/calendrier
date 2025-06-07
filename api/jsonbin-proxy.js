const fetch = require('node-fetch');

const BIN_ID = '6844456c8561e97a5020ae90';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

module.exports = async function(req, res) {
  const apiKey = process.env.JSONBIN_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'JSONBIN_KEY not set' });
  }

  const path = req.url.replace(/^\/api\/jsonbin-proxy/, '');
  const url = BASE_URL + path + (req.originalUrl && req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '');

  try {
    const forward = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
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
