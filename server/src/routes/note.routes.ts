import { Router } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { Note } from '../models/Note';

const r = Router();
r.use(requireAuth);

/**
 * ✅ GET notes
 * - pinned first
 * - then order (for trello-like sorting)
 * - fallback updatedAt
 */
r.get('/', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const q = String(req.query.q ?? '').trim();

  const filter: any = { userId };
  if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { body: { $regex: q, $options: 'i' } }];

  const notes = await Note.find(filter).sort({ pinned: -1, order: 1, updatedAt: -1 }).limit(500);
  res.json({ notes });
});

/**
 * ✅ Reorder notes (drag & drop)
 * Body: { orderIds: string[] }
 */
r.patch('/reorder', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const orderIds: string[] = Array.isArray(req.body?.orderIds) ? req.body.orderIds : [];

  if (!orderIds.length) return res.status(400).json({ message: 'orderIds required' });

  const ops = orderIds.map((id, idx) => ({
    updateOne: {
      filter: { _id: id, userId },
      update: { $set: { order: idx } },
    },
  }));

  await Note.bulkWrite(ops);
  res.json({ ok: true });
});

/**
 * ✅ Create note
 */
r.post('/', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const title = String(req.body?.title ?? '').trim();
  const body = String(req.body?.body ?? '');
  const priority = (req.body?.priority ?? 'medium') as 'low' | 'medium' | 'high';
  const dueAt = req.body?.dueAt ? new Date(req.body.dueAt) : null;

  const color = (req.body?.color ?? 'yellow') as 'yellow' | 'purple' | 'mint' | 'blue' | 'peach';
  const tags = Array.isArray(req.body?.tags) ? req.body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [];
  const pinned = !!req.body?.pinned;

  // default order to last
  const order = typeof req.body?.order === 'number' ? req.body.order : Date.now();

  if (!title) return res.status(400).json({ message: 'Title required' });

  const note = await Note.create({
    userId,
    title,
    body,
    priority,
    dueAt,
    completed: false,

    color,
    tags,
    pinned,
    order,
  });

  res.status(201).json({ note });
});

/**
 * ✅ Update note
 */
r.patch('/:id', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;

  const update: any = {};
  if (req.body?.title !== undefined) update.title = String(req.body.title).trim();
  if (req.body?.body !== undefined) update.body = String(req.body.body);
  if (req.body?.priority !== undefined) update.priority = req.body.priority;
  if (req.body?.completed !== undefined) update.completed = !!req.body.completed;
  if (req.body?.dueAt !== undefined) update.dueAt = req.body.dueAt ? new Date(req.body.dueAt) : null;

  if (req.body?.color !== undefined) update.color = req.body.color;
  if (req.body?.pinned !== undefined) update.pinned = !!req.body.pinned;
  if (req.body?.order !== undefined && typeof req.body.order === 'number') update.order = req.body.order;

  if (req.body?.tags !== undefined) {
    update.tags = Array.isArray(req.body.tags) ? req.body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [];
  }

  const note = await Note.findOneAndUpdate({ _id: id, userId }, update, { new: true });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  res.json({ note });
});

/**
 * ✅ Delete note
 */
r.delete('/:id', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;

  const out = await Note.findOneAndDelete({ _id: id, userId });
  if (!out) return res.status(404).json({ message: 'Note not found' });

  res.json({ ok: true });
});

export default r;
