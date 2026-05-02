import { apiUrl } from './base'
import type { FutureUsResponse, Person } from '../types/person'

function parseErrorDetail(text: string): string {
  let msg = text
  try {
    const j = JSON.parse(text) as { detail?: string | Array<{ msg?: string } | string> }
    if (typeof j.detail === 'string') msg = j.detail
    else if (Array.isArray(j.detail)) {
      msg = j.detail.map((d) => (typeof d === 'string' ? d : d.msg ?? JSON.stringify(d))).join(' ')
    }
  } catch {
    /* keep raw */
  }
  return msg
}

export async function postFutureUsSimulation(body: {
  userBio: string
  match: Person
}): Promise<FutureUsResponse> {
  const res = await fetch(apiUrl('/api/future-us/simulate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_bio: body.userBio,
      match: body.match,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    const msg = parseErrorDetail(text) || res.statusText
    throw new Error(msg)
  }
  return res.json() as Promise<FutureUsResponse>
}
