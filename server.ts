import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHmac, timingSafeEqual } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent data store with pre-seeded realistic enterprise records
interface OrderRecord {
  orderId: string;
  customerEmail: string;
  customerName: string;
  plan: 'starter' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  amount: number;
  status: 'completed' | 'processing' | 'refunded';
  licenseKey: string;
  paymentMethod: string;
  createdAt: string;
}

interface LicenseRecord {
  key: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  plan: 'starter' | 'pro' | 'enterprise';
  seats: number;
  active: boolean;
  createdAt: string;
  lastActivatedAt?: string;
}

const orders: OrderRecord[] = [
  {
    orderId: 'GW-ORD-K89X-421A',
    customerEmail: 'alex.chen@linear.app',
    customerName: 'Alex Chen',
    plan: 'pro',
    billingCycle: 'annual',
    amount: 348,
    status: 'completed',
    licenseKey: 'GW-PRO-98AF-C12B-774E',
    paymentMethod: 'card (•••• 4242)',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    orderId: 'GW-ORD-M41P-998C',
    customerEmail: 'sasha.kim@vercel.com',
    customerName: 'Sasha Kim',
    plan: 'enterprise',
    billingCycle: 'annual',
    amount: 1788,
    status: 'completed',
    licenseKey: 'GW-ENT-72DE-8891-B041',
    paymentMethod: 'card (•••• 8812)',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    orderId: 'GW-ORD-B17T-552Z',
    customerEmail: 'marcus@notion.so',
    customerName: 'Marcus Reed',
    plan: 'pro',
    billingCycle: 'monthly',
    amount: 41,
    status: 'completed',
    licenseKey: 'GW-PRO-331B-662C-091A',
    paymentMethod: 'card (•••• 1004)',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const licenses: LicenseRecord[] = [
  {
    key: 'GW-PRO-98AF-C12B-774E',
    orderId: 'GW-ORD-K89X-421A',
    customerEmail: 'alex.chen@linear.app',
    customerName: 'Alex Chen',
    plan: 'pro',
    seats: 5,
    active: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastActivatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    key: 'GW-ENT-72DE-8891-B041',
    orderId: 'GW-ORD-M41P-998C',
    customerEmail: 'sasha.kim@vercel.com',
    customerName: 'Sasha Kim',
    plan: 'enterprise',
    seats: 50,
    active: true,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastActivatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    key: 'GW-PRO-331B-662C-091A',
    orderId: 'GW-ORD-B17T-552Z',
    customerEmail: 'marcus@notion.so',
    customerName: 'Marcus Reed',
    plan: 'pro',
    seats: 5,
    active: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    lastActivatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

// Admin Credentials
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

// Admin tokens are signed, expiring sessions. Configure AUTH_TOKEN_SECRET (32+ chars).
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || '';
const issueAdminToken = (email: string) => {
  if (AUTH_TOKEN_SECRET.length < 32) throw new Error('AUTH_TOKEN_SECRET must be at least 32 characters');
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + 28800 })).toString('base64url');
  return payload + '.' + createHmac('sha256', AUTH_TOKEN_SECRET).update(payload).digest('base64url');
};
const readAdminToken = (token: string): any => {
  if (AUTH_TOKEN_SECRET.length < 32 || !token || token.length > 4096) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const expected = createHmac('sha256', AUTH_TOKEN_SECRET).update(parts[0]).digest();
  let actual: Buffer;
  try { actual = Buffer.from(parts[1], 'base64url'); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const emails = (process.env.ADMIN_EMAILS || '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
    if (!emails.includes(String(data.email).toLowerCase()) || !Number.isFinite(data.exp) || data.exp <= Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch { return null; }
};
const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization || '';
  const admin = header.startsWith('Bearer ') ? readAdminToken(header.slice(7)) : null;
  if (!admin) return res.status(401).json({ error: 'Valid administrator session required' });
  (req as any).adminUser = admin;
  return next();
};

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    engine: 'Glass Wing v2.4.0',
    renderer: 'DirectComposition + Acrylic Engine',
    timestamp: new Date().toISOString()
  });
});

// Admin login uses deployment secrets; no default password is shipped in source.
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body || {};
  const emails = (process.env.ADMIN_EMAILS || '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
  const configuredPassword = process.env.ADMIN_PASSWORD || '';
  if (!configuredPassword || AUTH_TOKEN_SECRET.length < 32 || emails.length === 0) return res.status(503).json({ error: 'Admin authentication is not configured' });
  if (typeof email !== 'string' || typeof password !== 'string' || password.length > 1024) return res.status(400).json({ error: 'Email and password are required' });
  const normalizedEmail = email.trim().toLowerCase();
  if (!emails.includes(normalizedEmail) || password !== configuredPassword) return res.status(401).json({ error: 'Invalid admin credentials' });
  return res.json({ success: true, token: issueAdminToken(normalizedEmail), user: { email: normalizedEmail, role: 'admin', displayName: 'Administrator', permissions: ['manage_orders', 'manage_licenses', 'system_metrics'] } });
});

// Verify current session
app.get('/api/auth/me', (req, res) => {
  const header = req.headers.authorization || '';
  const admin = header.startsWith('Bearer ') ? readAdminToken(header.slice(7)) : null;
  if (!admin) return res.status(401).json({ authenticated: false });
  return res.json({ authenticated: true, user: { email: admin.email, role: 'admin', displayName: 'Administrator' } });
});

// Fail closed until checkout is connected to verified payment processing.
app.post('/api/checkout', (_req, res) => res.status(503).json({ success: false, error: 'Checkout is unavailable until verified payment processing is configured. No order or license was created.' }));

// Order and license records are private; email query parameters are not authentication.
app.get('/api/orders', verifyAdminToken, (_req, res) => res.json({ orders }));
app.get('/api/licenses', verifyAdminToken, (_req, res) => res.json({ licenses }));

// Admin actions: Revoke license
app.post('/api/admin/licenses/revoke', verifyAdminToken, (req, res) => {
  const { licenseKey } = req.body;
  const license = licenses.find(l => l.key === licenseKey);
  if (!license) {
    return res.status(404).json({ error: 'License key not found' });
  }
  license.active = !license.active;
  return res.json({ success: true, license });
});

// Admin actions: Issue new complimentary license
app.post('/api/admin/licenses/create', verifyAdminToken, (req, res) => {
  const { customerEmail, customerName, plan, seats } = req.body;
  if (!customerEmail || !plan) {
    return res.status(400).json({ error: 'customerEmail and plan are required' });
  }

  const licenseKey = `GW-${String(plan).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const newLicense: LicenseRecord = {
    key: licenseKey,
    orderId: `GW-COMP-${Date.now().toString(36).toUpperCase()}`,
    customerEmail: customerEmail.trim().toLowerCase(),
    customerName: customerName || 'VIP Customer',
    plan: plan as any,
    seats: Number(seats) || 5,
    active: true,
    createdAt: new Date().toISOString()
  };

  licenses.unshift(newLicense);
  return res.status(201).json({ success: true, license: newLicense });
});

// System telemetry and engine stats
app.get('/api/system/stats', verifyAdminToken, (_req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const activeLicensesCount = licenses.filter(l => l.active).length;

  res.json({
    metrics: {
      activeWindows: 12480,
      renderFps: 144,
      frameP99LatencyMs: 1.84,
      gpuVramAllocatedMb: 64.2,
      blurEngineState: 'Hardware Accelerated (D3D11 / Metal / Vulkan)',
      acrylicMaterialShaders: 'Active (v2.4.0)',
      totalRevenue,
      totalOrders: orders.length,
      activeLicenses: activeLicensesCount,
      adminAccounts: (process.env.ADMIN_EMAILS || '').split(',').map(v => v.trim()).filter(Boolean)
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Project Glass Wing Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
