const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 4173);
const ROOT = path.join(__dirname);
const SNAP_HOST = process.env.MIDTRANS_SNAP_HOST || 'app.sandbox.midtrans.com';
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || '';

const offers = {
  ai_starter: {
    id: 'ai_starter',
    name: 'Pixforme Kredit AI Starter',
    price: 29000,
    quantity: 1,
  },
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.pdf': 'application/pdf',
};

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        req.destroy();
        reject(new Error('Request terlalu besar.'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('JSON request tidak valid.'));
      }
    });
    req.on('error', reject);
  });
}

function createOrderId(prefix) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
}

function createSnapTransaction(payload) {
  const body = JSON.stringify(payload);
  const auth = Buffer.from(`${SERVER_KEY}:`).toString('base64');

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: SNAP_HOST,
      path: '/snap/v1/transactions',
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, response => {
      let responseBody = '';
      response.on('data', chunk => { responseBody += chunk; });
      response.on('end', () => {
        let parsed = {};
        try { parsed = responseBody ? JSON.parse(responseBody) : {}; } catch (_) {}
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(parsed);
          return;
        }
        const message = parsed.error_messages ? parsed.error_messages.join(' ') : responseBody;
        reject(new Error(`Midtrans ${response.statusCode}: ${message || 'request gagal'}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function handleSnapToken(req, res) {
  if (!SERVER_KEY) {
    json(res, 500, { error: 'MIDTRANS_SERVER_KEY belum diisi.' });
    return;
  }

  const body = await readBody(req);
  const offer = offers[body.sku] || offers.ai_starter;
  const orderId = createOrderId('PXF-AI');
  const grossAmount = offer.price * offer.quantity;

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    item_details: [{
      id: offer.id,
      price: offer.price,
      quantity: offer.quantity,
      name: offer.name,
    }],
    customer_details: {
      first_name: 'Pixforme',
      last_name: 'Tester',
      email: 'tester@pixforme.local',
      phone: '081234567890',
    },
    enabled_payments: [
      'gopay',
      'qris',
      'bca_va',
      'bni_va',
      'bri_va',
      'permata_va',
      'echannel',
    ],
    expiry: {
      unit: 'minutes',
      duration: 30,
    },
    callbacks: {
      finish: `http://localhost:${PORT}/pricing.html?payment=finish&order_id=${orderId}`,
    },
  };

  const transaction = await createSnapTransaction(payload);
  json(res, 200, {
    orderId,
    amount: grossAmount,
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
  });
}

async function handleNotification(req, res) {
  const body = await readBody(req);
  console.log('[midtrans-notification]', JSON.stringify(body));
  json(res, 200, { ok: true });
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const requested = decodeURIComponent(url.pathname === '/' ? '/pricing.html' : url.pathname);
  const filePath = path.normalize(path.join(ROOT, requested));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url.startsWith('/api/midtrans/config')) {
      json(res, 200, { clientKey: CLIENT_KEY, sandbox: SNAP_HOST.includes('sandbox') });
      return;
    }
    if (req.method === 'POST' && req.url.startsWith('/api/midtrans/snap-token')) {
      await handleSnapToken(req, res);
      return;
    }
    if (req.method === 'POST' && req.url.startsWith('/api/midtrans/notification')) {
      await handleNotification(req, res);
      return;
    }
    if (req.method === 'GET') {
      serveStatic(req, res);
      return;
    }
    json(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    json(res, 500, { error: error.message || 'Server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`Pixforme Snap test: http://localhost:${PORT}/pricing.html`);
  console.log('Set env MIDTRANS_SERVER_KEY and MIDTRANS_CLIENT_KEY before testing payment.');
});
