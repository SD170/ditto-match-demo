import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { postMatch } from '../api/match'
import { fetchPool } from '../api/pool'
import { StepRail } from '../components/landing/StepRail'
import { MatchCelebrationModal } from '../components/match/MatchCelebrationModal'
import type { Gender, Person } from '../types/person'

function ProfilePreviewModal({ person, onClose }: { person: Person; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-preview-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-charcoal shadow-[0_32px_128px_-16px_rgba(0,0,0,1)] md:max-h-[90vh] md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-primary md:right-6 md:top-6"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="relative h-[42vh] min-h-[240px] w-full shrink-0 overflow-hidden bg-zinc-900 md:h-auto md:w-[46%] md:min-h-[480px]">
          <img src={person.image} alt="" className="h-full w-full object-cover object-center" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-charcoal/20 md:to-charcoal" />
        </div>

        <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-6 md:p-10">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.45em] text-zinc-500">
            Potential match
          </span>
          <h2
            id="profile-preview-title"
            className="font-headline text-3xl font-extrabold leading-tight tracking-tighter text-white md:text-4xl"
          >
            {person.name}
          </h2>
          <p className="mt-1 text-lg text-zinc-400">Age {person.age}</p>
          <p className="mt-8 text-base leading-relaxed text-zinc-300 md:text-lg">{person.bio}</p>
          <p className="mt-8 text-sm text-zinc-500">
            No sparks yet — manifest your vibe below, then hit <strong className="text-white">Run matchmaker</strong> when
            you&apos;re ready for the real match moment.
          </p>
        </div>
      </div>
    </div>
  )
}

export function MatchesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const genderParam = (searchParams.get('gender') ?? 'women').toLowerCase()
  const gender: Gender | null = genderParam === 'men' || genderParam === 'women' ? genderParam : null
  const ageMin = searchParams.get('age_min') != null ? Number(searchParams.get('age_min')) : undefined
  const ageMax = searchParams.get('age_max') != null ? Number(searchParams.get('age_max')) : undefined

  const [people, setPeople] = useState<Person[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Person | null>(null)
  const [vibe, setVibe] = useState('')
  const [matchBusy, setMatchBusy] = useState(false)
  const [matchErr, setMatchErr] = useState<string | null>(null)
  const [celebrateMatch, setCelebrateMatch] = useState<{
    match: Person
    reason: string
    userBio: string
  } | null>(null)
  const [vibeHelpOpen, setVibeHelpOpen] = useState(false)
  const vibeHelpRef = useRef<HTMLDivElement | null>(null)

  const load = useCallback(async () => {
    if (!gender) return
    setError(null)
    setPeople(null)
    try {
      const data = await fetchPool({
        gender,
        ageMin: Number.isFinite(ageMin) ? ageMin : undefined,
        ageMax: Number.isFinite(ageMax) ? ageMax : undefined,
      })
      setPeople(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load pool')
      setPeople([])
    }
  }, [gender, ageMin, ageMax])

  useEffect(() => {
    if (!gender) {
      navigate('/', { replace: true })
      return
    }
    void load()
  }, [gender, load, navigate])

  useEffect(() => {
    if (!selected) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  useEffect(() => {
    if (!vibeHelpOpen) return undefined
    const onDoc = (e: MouseEvent) => {
      if (vibeHelpRef.current && !vibeHelpRef.current.contains(e.target as Node)) {
        setVibeHelpOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVibeHelpOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [vibeHelpOpen])

  async function onUpdateVibe() {
    const trimmed = vibe.trim()
    if (!trimmed || !gender) return
    if (
      ageMin === undefined ||
      ageMax === undefined ||
      !Number.isFinite(ageMin) ||
      !Number.isFinite(ageMax)
    ) {
      setMatchErr('Age range missing — go back to App and pick ages.')
      return
    }
    setMatchErr(null)
    setMatchBusy(true)
    try {
      const out = await postMatch({
        userBio: trimmed,
        seeking: gender,
        ageMin,
        ageMax,
      })
      setCelebrateMatch({
        match: out.match,
        reason: out.reason,
        userBio: trimmed,
      })
    } catch (e) {
      setMatchErr(e instanceof Error ? e.message : 'Match request failed')
    } finally {
      setMatchBusy(false)
    }
  }

  if (!gender) return null

  return (
    <>
      <StepRail step="02" label="Curate" />
      <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 pb-52 sm:px-6 sm:py-12 md:px-12 md:pb-48">
        <section className="mb-12 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="font-label text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
              Curated selection
            </span>
            <h1 className="font-headline text-4xl font-extrabold leading-[1.04] tracking-tighter text-white sm:text-5xl md:text-8xl md:leading-[0.98]">
              Your <span className="italic text-primary">potential matches</span>
            </h1>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-500 md:mt-5">
              Showing <span className="text-primary">{gender}</span>
              {Number.isFinite(ageMin) && Number.isFinite(ageMax) ? (
                <>
                  {' '}
                  · Ages {ageMin}—{ageMax}
                </>
              ) : null}
            </p>
          </div>
        </section>

        {error && (
          <div className="relative mb-8 rounded-2xl border border-red-400/35 bg-black/80 py-3 pl-4 pr-12 text-sm text-red-100 shadow-lg backdrop-blur-sm">
            <p className="leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="absolute right-2 top-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-200/90 transition-colors hover:bg-white/10 hover:text-red-50"
              aria-label="Dismiss error"
            >
              <span className="material-symbols-outlined text-[22px] leading-none">close</span>
            </button>
          </div>
        )}

        {people === null && (
          <div className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-center text-sm text-zinc-300 backdrop-blur-md md:text-left">
            <p className="font-medium text-zinc-200">Waking up the Render backend…</p>
            <p className="mt-1 text-zinc-400">
              I&apos;m short on budget, so cold starts happen. Hold on a sec while your cards load.
            </p>
          </div>
        )}

        {people && people.length === 0 && !error && (
          <p className="text-zinc-400">No one in that range — widen ages or go back to App.</p>
        )}

        {people && people.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {people.map((p) => (
              <div
                key={`${p.name}-${p.age}`}
                className="vibe-panel-container group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900 transition-transform duration-500 hover:border-primary/40"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  decoding="async"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 pt-20 sm:p-8">
                  <h3 className="mb-2 text-2xl font-black text-white sm:text-3xl">{p.name}</h3>
                  <p className="mb-6 line-clamp-2 text-sm italic text-zinc-300">{p.bio}</p>
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="inline-block text-xs font-black uppercase tracking-widest text-primary underline-offset-4 transition-all hover:underline hover:decoration-2"
                  >
                    See more
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && <ProfilePreviewModal person={selected} onClose={() => setSelected(null)} />}

      {celebrateMatch && (
        <MatchCelebrationModal
          match={celebrateMatch.match}
          reason={celebrateMatch.reason}
          userBio={celebrateMatch.userBio}
          onClose={() => setCelebrateMatch(null)}
        />
      )}

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-t from-black via-black/95 to-transparent p-3 sm:p-4 md:p-6">
        <div className="vibe-panel-container pointer-events-auto mx-auto w-full max-w-3xl">
          {matchErr && (
            <div className="relative mb-2 rounded-lg border border-red-400/35 bg-black/85 py-2 pl-3 pr-10 text-xs text-red-100 shadow-md backdrop-blur-sm">
              <p className="text-center leading-relaxed md:text-left">{matchErr}</p>
              <button
                type="button"
                onClick={() => setMatchErr(null)}
                className="absolute right-1 top-1.5 flex h-8 w-8 items-center justify-center rounded-md text-red-200/90 transition-colors hover:bg-white/10 hover:text-red-50"
                aria-label="Dismiss error"
              >
                <span className="material-symbols-outlined text-[20px] leading-none">close</span>
              </button>
            </div>
          )}
          <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-white/10 bg-zinc-950/95 p-4 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.85)] backdrop-blur-2xl md:flex-row md:items-center md:gap-6 md:p-5">
            <div className="w-full flex-1 space-y-3">
              <div className="group/vibe space-y-2">
                <div className="flex flex-col items-center gap-1 md:items-start">
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <label
                      htmlFor="vibe-manifest"
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                    >
                      Manifest your vibe
                    </label>
                    <div className="relative" ref={vibeHelpRef}>
                      <button
                        type="button"
                        onClick={() => setVibeHelpOpen((o) => !o)}
                        aria-expanded={vibeHelpOpen}
                        aria-controls="vibe-help-popover"
                        aria-label="How matching works"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors duration-150 md:hover:border-primary/50 md:hover:bg-primary/15 md:hover:text-primary active:scale-95 active:border-primary/50 active:bg-primary/15 active:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none">info</span>
                      </button>
                      {vibeHelpOpen ? (
                        <div
                          id="vibe-help-popover"
                          role="tooltip"
                          className="absolute bottom-full left-1/2 z-[70] mb-2 w-[min(calc(100vw-2rem),17rem)] -translate-x-1/2 rounded-xl border border-white/15 bg-black/95 p-3 text-left text-xs font-medium leading-relaxed text-zinc-100 shadow-2xl shadow-black/70 ring-1 ring-black/60 backdrop-blur-2xl md:left-0 md:translate-x-0"
                        >
                          Who should we match you with?{' '}
                          <span className="text-primary">Describe your vibe</span> in the box, then tap{' '}
                          <span className="text-primary">Run matchmaker</span> or press{' '}
                          <kbd className="rounded border border-white/20 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/90">
                            Enter
                          </kbd>
                          .{' '}
                          <kbd className="rounded border border-white/20 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/90">
                            Shift
                          </kbd>{' '}
                          +{' '}
                          <kbd className="rounded border border-white/20 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/90">
                            Enter
                          </kbd>{' '}
                          adds a new line.
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <span className="flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary/90 sm:text-[10px]">
                    Type here
                    <span className="material-symbols-outlined text-[14px] motion-safe:transition-transform motion-safe:group-hover/vibe:translate-y-0.5">
                      arrow_downward
                    </span>
                  </span>
                </div>
                <div className="group/field relative isolate">
                  <span
                    className="pointer-events-none absolute -inset-px rounded-xl border-2 border-primary/50 motion-safe:animate-ctaRing motion-reduce:animate-none"
                    aria-hidden
                  />
                  <div className="relative z-[1]">
                    <textarea
                      id="vibe-manifest"
                      value={vibe}
                      onChange={(e) => setVibe(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter' || e.shiftKey) return
                        if (e.nativeEvent.isComposing) return
                        e.preventDefault()
                        if (!matchBusy && vibe.trim()) void onUpdateVibe()
                      }}
                      rows={2}
                      placeholder="Describe the soul you're looking for…"
                      className="no-scrollbar min-h-[4.5rem] w-full resize-none rounded-xl border border-white/5 bg-black/40 py-2.5 pl-4 pr-11 text-sm font-medium text-white placeholder:text-zinc-600 transition-shadow focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/40 motion-safe:group-hover/field:shadow-[0_0_0_1px_rgba(247,72,177,0.2)] md:min-h-[5rem] md:text-base"
                    />
                    <div className="pointer-events-none absolute right-3 top-3">
                      <span className="material-symbols-outlined text-[22px] text-primary/50 transition-colors group-focus-within/field:text-primary md:text-[24px]">
                        auto_awesome
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2 md:w-auto md:min-w-[11rem]">
              <div
                className={`relative w-full md:w-auto md:shrink-0 ${vibe.trim() && !matchBusy ? 'motion-safe:transition-transform motion-safe:hover:-translate-y-1 motion-safe:active:scale-[0.98]' : ''}`}
              >
                {vibe.trim() && !matchBusy ? (
                  <span
                    className="pointer-events-none absolute -inset-px rounded-xl border-2 border-primary/50 motion-safe:animate-ctaRing motion-reduce:animate-none"
                    style={{ animationDelay: '400ms' }}
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  disabled={matchBusy || !vibe.trim()}
                  onClick={() => void onUpdateVibe()}
                  className="relative z-[1] w-full touch-manipulation rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-colors hover:bg-[#ff69c1] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto md:px-6 md:text-sm"
                >
                  {matchBusy ? 'Matching…' : 'Run matchmaker'}
                </button>
              </div>
              <span
                className={`flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] sm:text-[10px] ${
                  vibe.trim() && !matchBusy ? 'text-primary/90' : 'text-zinc-500'
                }`}
              >
                Tap
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-primary/10 blur-[128px]" />
        <div className="absolute -right-48 top-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-[128px]" />
      </div>
    </>
  )
}
