import jwt, { type SignOptions } from 'jsonwebtoken';
import 'dotenv/config';

export type JwtPayload = {
  userId: string;
};

// ✅ Ensure secret is always a string (not undefined)
function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || !s.trim()) {
    throw new Error('JWT_SECRET missing');
  }
  return s;
}

const secret: string = getJwtSecret();

export function signJwt(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, secret, options);
}

export function verifyJwt(token: string): JwtPayload {
  const decoded = jwt.verify(token, secret);

  // jwt.verify can return string | JwtPayload
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  // decoded is jwt.JwtPayload here
  const userId = (decoded as jwt.JwtPayload).userId;

  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Invalid token payload: missing userId');
  }

  return { userId };
}
