import { Router } from 'express';
import Party from '../models/Party';
import JoinRequest from '../models/JoinRequest';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /parties
router.get('/', async (req, res) => {
  const { lat, lng, radiusKm = 10, category, q } = req.query as any;
  const filter: any = {};
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };
  if (lat && lng) {
    filter['location.geo'] = {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseFloat(radiusKm) * 1000,
      }
    };
  }
  const parties = await Party.find(filter).sort({ date: 1 }).limit(50);
  res.json({ parties });
});

// GET /parties/:id
router.get('/:id', async (req, res) => {
  const party = await Party.findById(req.params.id);
  if (!party) return res.status(404).json({ error: 'Not found' });
  res.json({ party });
});

// POST /parties
router.post('/', requireAuth, async (req, res) => {
  const {
    title, description, category, visibility = 'public', date, startTime, endTime,
    location, capacity, price = 0, images = [], tags = []
  } = req.body;

  const party = await Party.create({
    title, description, category, visibility,
    date, startTime, endTime,
    location, capacity, price, images, tags,
    hostId: (req as any).userId
  });
  res.status(201).json({ party });
});

// POST /parties/:id/join
router.post('/:id/join', requireAuth, async (req, res) => {
  const party = await Party.findById(req.params.id);
  if (!party) return res.status(404).json({ error: 'Not found' });

  if (party.visibility === 'public') {
    const jr = await JoinRequest.findOneAndUpdate(
      { partyId: party._id, userId: (req as any).userId },
      { status: 'approved' },
      { new: true, upsert: true }
    );
    await Party.updateOne({ _id: party._id }, { $inc: { attendeesCount: 1 } });
    return res.json({ request: jr, autoApproved: true });
  }

  const jr = await JoinRequest.findOneAndUpdate(
    { partyId: party._id, userId: (req as any).userId },
    { status: 'pending', message: req.body?.message },
    { new: true, upsert: true }
  );
  res.json({ request: jr, autoApproved: false });
});

// GET /parties/me/list
router.get('/me/list', requireAuth, async (req, res) => {
  const { role = 'host' } = req.query as any;
  const userId = (req as any).userId;
  if (role === 'host') {
    const parties = await Party.find({ hostId: userId }).sort({ createdAt: -1 });
    return res.json({ parties });
  }
  const approved = await JoinRequest.find({ userId, status: 'approved' }).select('partyId');
  const partyIds = approved.map(p => p.partyId);
  const parties = await Party.find({ _id: { $in: partyIds } });
  res.json({ parties });
});

export default router;
