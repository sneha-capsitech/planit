import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { signJwt } from '../utils/jwt';

const r = Router();

r.post('/signup', async (req, res) => {
  const fullName = String(req.body?.fullName ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (!fullName || fullName.length < 2) return res.status(400).json({ message: 'Full name required' });
  if (!email || !email.includes('@')) return res.status(400).json({ message: 'Valid email required' });
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password min 6 chars' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, passwordHash });

  const token = signJwt({ userId: user._id.toString() });
  res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
});

r.post('/signin', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (!email || !email.includes('@')) return res.status(400).json({ message: 'Valid email required' });
  if (!password) return res.status(400).json({ message: 'Password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No account found' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Incorrect password' });

  const token = signJwt({ userId: user._id.toString() });
  res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
});

export default r;
