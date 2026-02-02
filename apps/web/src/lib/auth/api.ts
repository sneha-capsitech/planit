const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('planit_token');
}
export function setToken(t: string) {
  localStorage.setItem('planit_token', t);
}
export function clearToken() {
  localStorage.removeItem('planit_token');
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message ?? 'Request failed');
  return data as T;
}
