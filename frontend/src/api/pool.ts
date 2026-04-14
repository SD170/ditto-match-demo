import type { Gender, Person } from '../types/person'

export type FetchPoolOpts = {
  gender: Gender
  ageMin?: number
  ageMax?: number
}

export async function fetchPool({ gender, ageMin, ageMax }: FetchPoolOpts): Promise<Person[]> {
  const params = new URLSearchParams({ gender })
  if (ageMin != null) params.set('age_min', String(ageMin))
  if (ageMax != null) params.set('age_max', String(ageMax))

  const res = await fetch(`/api/pool?${params.toString()}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json() as Promise<Person[]>
}
