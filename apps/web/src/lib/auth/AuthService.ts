export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
};

type StoredUser = AuthUser & { passwordHash: string };

const LS_USERS = 'planit_users_v1';
const LS_SESSION = 'planit_session_v1';

function safeParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

// very light hashing (demo only). Replace with backend auth later.
async function hashPassword(pw: string) {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getUsers(): StoredUser[] {
  return safeParse<StoredUser[]>(localStorage.getItem(LS_USERS), []);
}
function setUsers(users: StoredUser[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function setSession(user: AuthUser) {
  localStorage.setItem(LS_SESSION, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(LS_SESSION);
}

export const auth = {
  getCurrentUser(): AuthUser | null {
    return safeParse<AuthUser | null>(localStorage.getItem(LS_SESSION), null);
  },

  logout() {
    clearSession();
  },

  async signUp(fullName: string, email: string, password: string): Promise<AuthUser> {
    const users = getUsers();
    const lower = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === lower)) {
      throw new Error('Email already registered. Please sign in.');
    }

    const passwordHash = await hashPassword(password);
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: lower,
      passwordHash,
    };

    users.push(newUser);
    setUsers(users);

    const sessionUser: AuthUser = { id: newUser.id, fullName: newUser.fullName, email: newUser.email };
    setSession(sessionUser);
    return sessionUser;
  },

  async signIn(email: string, password: string): Promise<AuthUser> {
    const users = getUsers();
    const lower = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === lower);

    if (!found) throw new Error('No account found for this email.');

    const passwordHash = await hashPassword(password);
    if (passwordHash !== found.passwordHash) throw new Error('Incorrect password.');

    const sessionUser: AuthUser = { id: found.id, fullName: found.fullName, email: found.email };
    setSession(sessionUser);
    return sessionUser;
  },
};
