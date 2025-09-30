import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import EmailToken from '../models/EmailToken';

const router = Router();
const COOKIE = 'token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const isProd = process.env.NODE_ENV === 'production';

function setAuthCookie(res: any, userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: isProd ? 'none': 'lax', secure: isProd, maxAge: 7*24*60*60*1000, domain: process.env.COOKIE_DOMAIN || undefined });
}

router.get('/me', async (req, res) => {
  try {
    const token = (req as any).cookies?.token;
    if (!token) return res.json({ user: null });
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(payload.userId).select('email name');
    return res.json({ user });
  } catch {
    return res.json({ user: null });
  }
});


router.post("/send-otp", (req, res) => {
  const { phone } = req.body;
  console.log(`Sending OTP to ${phone}...`);
  // Mock send
  res.json({ success: true, otp: "1111" });
});

// Request OTP (magic code)
router.post('/request-otp', async (req, res) => {
  const { email, name } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name });
  }
  // generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await EmailToken.create({ email, code, expiresAt });
  // DEV: log to console
  console.log(`[OTP] ${email} -> ${code}`);
  res.json({ ok: true });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body || {};

  // Basic validation
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP required' });
  }

  // ✅ Temporary mock check for OTP (1111)
  if (otp !== '1111') {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  // Try to find existing user by phone; if not found, create a new user
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }

  // Set auth cookie
  setAuthCookie(res, user._id.toString());

  res.json({
    user: { id: user._id, phone: user.phone }
  });
});

// Dev Inbox (list recent codes) – DO NOT use in prod
router.get('/dev/inbox', async (_req, res) => {
  const latest = await EmailToken.find().sort({ createdAt: -1 }).limit(20).select('email code createdAt');
  res.json({ latest });
});

router.post('/logout', async (_req, res) => {
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

export default router;
