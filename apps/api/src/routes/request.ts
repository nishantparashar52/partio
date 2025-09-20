import { Router } from 'express';
import JoinRequest from '../models/JoinRequest';
import Party from '../models/Party';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const hostId = (req as any).userId;
  const hostParties = await Party.find({ hostId }).select('_id');
  const ids = hostParties.map(p => p._id);
  const requests = await JoinRequest.find({ partyId: { $in: ids }, status: 'pending' })
    .populate('userId', 'name email')
    .populate('partyId', 'title date');
  res.json({ requests });
});

router.post('/:id/approve', requireAuth, async (req, res) => {
  const jr = await JoinRequest.findById(req.params.id).populate('partyId');
  if (!jr) return res.status(404).json({ error: 'Not found' });
  const party = jr.partyId as any;
  if (!party || party.hostId.toString() !== (req as any).userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  jr.status = 'approved';
  await jr.save();
  await Party.updateOne({ _id: party._id }, { $inc: { attendeesCount: 1 } });
  res.json({ request: jr });
});

router.post('/:id/reject', requireAuth, async (req, res) => {
  const jr = await JoinRequest.findById(req.params.id).populate('partyId');
  if (!jr) return res.status(404).json({ error: 'Not found' });
  const party = jr.partyId as any;
  if (!party || party.hostId.toString() !== (req as any).userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  jr.status = 'rejected';
  await jr.save();
  res.json({ request: jr });
});

export default router;
