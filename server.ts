import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

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
const ADMIN_EMAILS = ['damonward38@gmail.com', 'damoneward38@gmail.com'];
const ADMIN_PASSWORD = '313damon';

// Middleware for admin verification
const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing admin bearer token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, secret] = decoded.split(':::');
    if (ADMIN_EMAILS.includes(email.toLowerCase()) && secret === ADMIN_PASSWORD) {
      (req as any).adminUser = { email, role: 'admin' };
      return next();
    }
  } catch {
    // decode error
  }
  return res.status(403).json({ error: 'Forbidden: invalid admin authorization' });
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

// Admin login
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (ADMIN_EMAILS.includes(normalizedEmail) && password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${normalizedEmail}:::${password}`).toString('base64');
    return res.json({
      success: true,
      token,
      user: {
        email: normalizedEmail,
        role: 'admin',
        displayName: 'Damon Ward (Administrator)',
        permissions: ['all', 'manage_orders', 'manage_licenses', 'system_metrics']
      }
    });
  }

  return res.status(401).json({
    error: 'Invalid admin credentials. Please verify your email and password.'
  });
});

// Verify current session
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, secret] = decoded.split(':::');
    if (ADMIN_EMAILS.includes(email.toLowerCase()) && secret === ADMIN_PASSWORD) {
      return res.json({
        authenticated: true,
        user: {
          email: email.toLowerCase(),
          role: 'admin',
          displayName: 'Damon Ward (Administrator)'
        }
      });
    }
  } catch {
    // invalid
  }
  return res.status(401).json({ authenticated: false });
});

// Checkout submission
app.post('/api/checkout', (req, res) => {
  try {
    const { plan, billingCycle, customerName, customerEmail, paymentMethod, cardLast4, couponCode } = req.body;

    if (!customerEmail || !customerName || !plan) {
      return res.status(400).json({ error: 'Missing required checkout fields: customerEmail, customerName, and plan are mandatory.' });
    }

    let basePrice = 0;
    if (plan === 'starter') {
      basePrice = 0;
    } else if (plan === 'pro') {
      basePrice = billingCycle === 'annual' ? 348 : 41;
    } else if (plan === 'enterprise') {
      basePrice = billingCycle === 'annual' ? 1788 : 199;
    }

    let discount = 0;
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === 'GLASS30') {
        discount = Math.round(basePrice * 0.3);
      } else if (code === 'VIPADMIN') {
        discount = basePrice;
      }
    }

    const finalAmount = Math.max(0, basePrice - discount);
    const orderId = `GW-ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const licenseKey = `GW-${plan.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newOrder: OrderRecord = {
      orderId,
      customerEmail: customerEmail.trim().toLowerCase(),
      customerName: customerName.trim(),
      plan,
      billingCycle: billingCycle || 'annual',
      amount: finalAmount,
      status: 'completed',
      licenseKey,
      paymentMethod: paymentMethod === 'card' ? `Credit Card (•••• ${cardLast4 || '4242'})` : (paymentMethod || 'Credit Card'),
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    const seatsMap = { starter: 1, pro: 5, enterprise: 50 };
    const newLicense: LicenseRecord = {
      key: licenseKey,
      orderId,
      customerEmail: newOrder.customerEmail,
      customerName: newOrder.customerName,
      plan,
      seats: seatsMap[plan as 'starter' | 'pro' | 'enterprise'] || 1,
      active: true,
      createdAt: newOrder.createdAt
    };

    licenses.unshift(newLicense);

    return res.status(201).json({
      success: true,
      order: newOrder,
      license: newLicense,
      message: 'Checkout completed successfully. License key issued.'
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Failed to process checkout transaction' });
  }
});

// Orders retrieval (public with email filter, or all if admin)
app.get('/api/orders', (req, res) => {
  const { email } = req.query;
  const authHeader = req.headers.authorization;
  let isAdmin = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [tokenEmail, secret] = decoded.split(':::');
      if (ADMIN_EMAILS.includes(tokenEmail.toLowerCase()) && secret === ADMIN_PASSWORD) {
        isAdmin = true;
      }
    } catch {
      // not admin
    }
  }

  if (isAdmin) {
    return res.json({ orders });
  }

  if (email) {
    const filtered = orders.filter(o => o.customerEmail === String(email).toLowerCase());
    return res.json({ orders: filtered });
  }

  return res.status(401).json({ error: 'Provide email query parameter or authenticate as admin' });
});

// Licenses retrieval
app.get('/api/licenses', (req, res) => {
  const { email } = req.query;
  const authHeader = req.headers.authorization;
  let isAdmin = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [tokenEmail, secret] = decoded.split(':::');
      if (ADMIN_EMAILS.includes(tokenEmail.toLowerCase()) && secret === ADMIN_PASSWORD) {
        isAdmin = true;
      }
    } catch {
      // not admin
    }
  }

  if (isAdmin) {
    return res.json({ licenses });
  }

  if (email) {
    const filtered = licenses.filter(l => l.customerEmail === String(email).toLowerCase());
    return res.json({ licenses: filtered });
  }

  return res.status(401).json({ error: 'Provide email query parameter or authenticate as admin' });
});

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
app.get('/api/system/stats', (_req, res) => {
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
      adminAccounts: ADMIN_EMAILS
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
