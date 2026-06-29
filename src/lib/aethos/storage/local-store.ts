export function readLocalJson<T>(key: string, fallback: T): T { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; }
export function writeLocalJson<T>(key: string, value: T): void { window.localStorage.setItem(key, JSON.stringify(value)); }
