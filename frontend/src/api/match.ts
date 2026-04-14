import type { MatchApiResponse, MatchRequestBody } from '../types/person'
import { apiUrl } from './base'

function parseErrorDetail(text: string): string {
  let msg = text
  try {
    const j = JSON.parse(text) as { detail?: string | Array<{ msg?: string } | string> }
    if (typeof j.detail === 'string') msg = j.detail
    else if (Array.isArray(j.detail)) {
      msg = j.detail
        .map((d) => (typeof d === 'string' ? d : d.msg ?? JSON.stringify(d)))
        .join(' ')
    }
  } catch {
    /* keep raw */
  }
  return msg
}

export async function postMatch(body: MatchRequestBody): Promise<MatchApiResponse> {
  const res = await fetch(apiUrl('/api/match'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_bio: body.userBio,
      seeking: body.seeking,
      age_min: body.ageMin,
      age_max: body.ageMax,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    const msg = parseErrorDetail(text) || res.statusText
    throw new Error(msg)
  }
  return res.json() as Promise<MatchApiResponse>
}
