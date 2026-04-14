import { apiUrl } from './base'

export async function trackHomepageView(): Promise<number> {
  const res = await fetch(apiUrl('/api/metrics/homepage-view'), { method: 'POST' })
  if (!res.ok) throw new Error('Failed to track homepage view')
  const payload = (await res.json()) as { views?: number }
  return Number(payload.views ?? 0)
}
