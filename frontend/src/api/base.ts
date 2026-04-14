/**
 * Dev: unset → relative `/api/...` (Vite proxy).
 * Production: `VITE_API_BASE_URL=https://your-api.onrender.com` (no trailing slash).
 */
export function apiUrl(path: string): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  const base = typeof raw === 'string' ? raw.replace(/\/$/, '') : ''
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
