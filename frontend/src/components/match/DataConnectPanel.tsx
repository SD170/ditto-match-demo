import { useMemo, useState } from 'react'

type DataSource = {
  id: string
  name: string
  icon: string
  context: string
  bubble: string
  lift: number
  detail: string
}

const DATA_SOURCES: DataSource[] = [
  {
    id: 'ai-memory',
    name: 'AI Memory',
    icon: 'psychology',
    context: 'Values, green flags, watchouts',
    bubble: 'Conversational LLM notes',
    lift: 14,
    detail: 'Computed from opt-in ChatGPT/Claude/Gemini-style exports and onboarding reflections.',
  },
  {
    id: 'maps',
    name: 'Maps',
    icon: 'location_on',
    context: 'Routine zones, walkable date areas',
    bubble: 'Location context',
    lift: 12,
    detail: 'Contextualized from saved places or location history — not raw GPS in the UI.',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: 'calendar_month',
    context: 'Free windows, energy timing',
    bubble: 'Calendar rhythm',
    lift: 10,
    detail: 'Preprocessed from class, work, and recurring busy blocks.',
  },
  {
    id: 'food',
    name: 'Food Apps',
    icon: 'ramen_dining',
    context: 'Comfort food, low-pressure anchors',
    bubble: 'Food ordering context',
    lift: 9,
    detail: 'Derived from DoorDash/Uber Eats/campus dining patterns or manually selected favorites.',
  },
  {
    id: 'music',
    name: 'Spotify',
    icon: 'graphic_eq',
    context: 'Vibe, music mood, concert energy',
    bubble: 'Music context',
    lift: 8,
    detail: 'Compressed from streaming taste clusters into date environment preferences.',
  },
  {
    id: 'watch',
    name: 'Apple Watch',
    icon: 'directions_walk',
    context: 'Movement energy, active-date fit',
    bubble: 'Activity context',
    lift: 7,
    detail: 'Uses contextual activity style, not biometrics or raw health events.',
  },
  {
    id: 'messages',
    name: 'Ditto Messages',
    icon: 'forum',
    context: 'Reply rhythm, repair style',
    bubble: 'In-app message context',
    lift: 11,
    detail: 'Computed from previous in-app messages and response rhythm after consent.',
  },
]

export function DataConnectPanel() {
  const [connectedIds, setConnectedIds] = useState<string[]>(['ai-memory', 'calendar'])

  const connected = useMemo(
    () => DATA_SOURCES.filter((source) => connectedIds.includes(source.id)),
    [connectedIds],
  )
  const score = Math.min(94, 38 + connected.reduce((sum, source) => sum + source.lift, 0))

  function toggle(id: string) {
    setConnectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <section className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div className="relative rounded-[1.5rem] border border-primary/25 bg-gradient-to-br from-primary/20 via-white/[0.04] to-cyan-400/10 p-5">
          <div className="absolute right-4 top-4 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">
            Demo data room
          </div>
          <p className="font-label text-[10px] font-black uppercase tracking-[0.35em] text-primary/80">
            Connect your context
          </p>
          <h2 className="mt-3 max-w-xl font-headline text-3xl font-black uppercase leading-none tracking-tight text-white md:text-5xl">
            Build the computed persona graph
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
            Tap external data cards to simulate opt-in connections. Each connection turns raw data into a privacy-safe context bubble that improves matching and Future Us.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-zinc-400">Context score</span>
              <span className="font-headline text-3xl font-black text-white">{score}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-fuchsia-300 to-cyan-300 transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              Higher score means more opt-in context coverage — not a prediction of relationship success.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {connected.map((source) => (
              <span
                key={source.id}
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100"
              >
                {source.bubble}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {DATA_SOURCES.map((source) => {
            const isConnected = connectedIds.includes(source.id)
            return (
              <button
                key={source.id}
                type="button"
                onClick={() => toggle(source.id)}
                className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                  isConnected
                    ? 'border-primary/45 bg-primary/15 shadow-[0_0_24px_rgba(247,72,177,0.14)]'
                    : 'border-white/10 bg-black/35 hover:border-white/25 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`material-symbols-outlined rounded-xl p-2 text-[22px] ${isConnected ? 'bg-primary text-white' : 'bg-white/10 text-zinc-300'}`}>
                    {source.icon}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${isConnected ? 'bg-cyan-300 text-black' : 'bg-white/10 text-zinc-400'}`}>
                    {isConnected ? 'Connected' : 'Tap to connect'}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-black text-white">{source.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary/90">+{source.lift}% context</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{source.context}</p>
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">{source.detail}</p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
