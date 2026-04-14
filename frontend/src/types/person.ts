export type Gender = 'men' | 'women'

export type Person = {
  name: string
  age: number
  bio: string
  image: string
}

export type MatchApiResponse = {
  match: Person
  reason: string
  date_plan: string
  location: string
  suggested_time: string
}

export type MatchRequestBody = {
  userBio: string
  seeking: Gender
  ageMin: number
  ageMax: number
}
