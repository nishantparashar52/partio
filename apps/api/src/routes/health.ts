// apps/api/src/routes/health.ts
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();
router.get('/health/db', async (_req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ db: 'ok' });
  } catch (e:any) {
    res.status(500).json({ db: 'down', error: e?.message });
  }
});
export default router;
