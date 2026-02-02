import { Router } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { Note } from '../models/Note';

const r = Router();
r.use(requireAuth);

r.get('/', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const q = String(req.query.q ?? '').trim();

  const filter: any = { userId };
  if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { body: { $regex: q, $options: 'i' } }];

  const notes = await Note.find(filter).sort({ updatedAt: -1 }).limit(200);
  res.json({ notes });
});

r.post('/', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const title = String(req.body?.title ?? '').trim();
  const body = String(req.body?.body ?? '');
  const priority = (req.body?.priority ?? 'medium') as 'low' | 'medium' | 'high';
  const dueAt = req.body?.dueAt ? new Date(req.body.dueAt) : null;

  if (!title) return res.status(400).json({ message: 'Title required' });

  const note = await Note.create({
    userId,
    title,
    body,
    priority,
    dueAt,
    completed: false,
  });

  res.status(201).json({ note });
});

r.patch('/:id', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;

  const update: any = {};
  if (req.body?.title !== undefined) update.title = String(req.body.title);
  if (req.body?.body !== undefined) update.body = String(req.body.body);
  if (req.body?.priority !== undefined) update.priority = req.body.priority;
  if (req.body?.completed !== undefined) update.completed = !!req.body.completed;
  if (req.body?.dueAt !== undefined) update.dueAt = req.body.dueAt ? new Date(req.body.dueAt) : null;

  const note = await Note.findOneAndUpdate({ _id: id, userId }, update, { new: true });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  res.json({ note });
});

r.delete('/:id', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;

  const out = await Note.findOneAndDelete({ _id: id, userId });
  if (!out) return res.status(404).json({ message: 'Note not found' });

  res.json({ ok: true });
});

export default r;
