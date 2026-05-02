export type Gender = 'men' | 'women'

export type Person = {
  name: string
  age: number
  bio: string
  image: string
  persona_graph?: Record<string, unknown>
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

export type ConnectedSignal = {
  source: string
  status: string
  insight: string
  confidence: number
}

export type ContextConfidence = {
  score: number
  label: string
  explanation: string
}

export type ChemistryDimension = {
  name: string
  score: number
  signal: string
  opportunity: string
}

export type FutureUsScenario = {
  title: string
  timeframe: string
  prompt: string
  simulation: string
  best_move: string
  watchout: string
}

export type BestDatePlan = {
  title: string
  location: string
  suggested_time: string
  plan: string[]
  why_it_works: string
  invite_text: string
}

export type FutureUsResponse = {
  title: string
  subtitle: string
  match_name: string
  couple_thesis: string
  confidence: ContextConfidence
  connected_signals: ConnectedSignal[]
  chemistry_map: ChemistryDimension[]
  scenarios: FutureUsScenario[]
  best_date: BestDatePlan
  privacy_note: string
  research_note: string
}
