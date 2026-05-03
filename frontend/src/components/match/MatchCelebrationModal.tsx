import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import Lottie from 'lottie-react'
import { useNavigate } from 'react-router-dom'

import { postFutureUsSimulation } from '../../api/futureUs'
import confettiAnimation from '../../assets/lottie/confetti.json'
import type { FutureUsResponse, Person } from '../../types/person'
import { FutureUsExperience } from './FutureUsExperience'

function GraffitiRail({ side }: { side: 'left' | 'right' }) {
  const outerBlur: CSSProperties = side === 'left' ? { left: '-2.5rem' } : { right: '-2.5rem' }
  const innerBlur: CSSProperties = side === 'left' ? { right: '-1rem' } : { left: '-1rem' }
  return (
    <div
      className="relative hidden w-20 shrink-0 flex-col items-center overflow-visible py-6 sm:flex sm:flex-col md:w-28"
      aria-hidden
    >
      <div
        className="plot-spray-side absolute inset-y-8 w-32 rounded-full bg-primary/20 blur-3xl"
        style={outerBlur}
      />
      <div
        className="plot-spray-side-alt absolute inset-y-12 w-28 rounded-full bg-cyan-400/10 blur-2xl"
        style={innerBlur}
      />
      <div className="relative z-[1] w-16 opacity-90 md:w-[4.5rem]">
        <Lottie animationData={confettiAnimation} loop className="w-full" />
      </div>
      <svg className="relative z-[1] mt-6 w-14 text-primary/50 md:w-16" viewBox="0 0 100 100">
        <text
          x="8"
          y="58"
          className="fill-current font-headline text-[38px] font-black"
          style={{ transform: 'rotate(-10deg)', transformOrigin: '50px 50px' }}
        >
          Ditto
        </text>
      </svg>
      <span className="relative z-[1] mt-4 rotate-[-8deg] font-headline text-lg font-black italic text-white/25">
        100%
      </span>
    </div>
  )
}

type MatchCelebrationModalProps = {
  onClose: () => void
  match: Person
  reason: string
  userBio: string
}

export function MatchCelebrationModal({ onClose, match, reason, userBio }: MatchCelebrationModalProps) {
  const navigate = useNavigate()
  const [futureUs, setFutureUs] = useState<FutureUsResponse | null>(null)
  const [futureUsBusy, setFutureUsBusy] = useState(false)
  const [futureUsError, setFutureUsError] = useState<string | null>(null)
  const closeToAbout = useCallback(() => {
    onClose()
    navigate('/about')
  }, [navigate, onClose])

  async function runFutureUs() {
    setFutureUsError(null)
    setFutureUsBusy(true)
    try {
      const simulation = await postFutureUsSimulation({ userBio, match })
      setFutureUs(simulation)
    } catch (e) {
      setFutureUsError(e instanceof Error ? e.message : 'Future Us simulation failed')
    } finally {
      setFutureUsBusy(false)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeToAbout()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeToAbout])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
      onClick={closeToAbout}
    >
      <div className={`relative z-10 flex max-h-[90vh] w-full items-stretch justify-center gap-1 sm:gap-2 ${futureUs ? 'max-w-6xl' : 'max-w-4xl'}`}>
        <GraffitiRail side="left" />

        <div
          className={`relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border-2 border-primary/50 bg-zinc-950/95 shadow-[0_0_60px_rgba(247,72,177,0.35)] md:rounded-[2rem] ${futureUs ? 'max-w-5xl' : 'max-w-lg md:max-w-md'}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <button
            type="button"
            onClick={closeToAbout}
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white/90 backdrop-blur-md transition-colors hover:border-primary/50 hover:bg-primary/20 hover:text-white"
            aria-label="Close and go to About"
          >
            <span className="material-symbols-outlined text-[20px] leading-none">close</span>
          </button>
          <div className="pointer-events-none absolute -inset-px -z-10 rounded-[inherit] bg-gradient-to-br from-primary/25 via-transparent to-cyan-500/15 opacity-80 blur-sm" />

          {futureUs ? (
            <FutureUsExperience simulation={futureUs} onBack={() => setFutureUs(null)} />
          ) : (
            <>
              <div className="shrink-0 px-5 pb-3 pt-5 md:px-7 md:pt-6">
                <p className="mb-1 text-center font-label text-[9px] font-black uppercase tracking-[0.45em] text-primary/80">
                  Congratulations
                </p>
                <h2
                  id="celebration-title"
                  className="text-center font-headline text-3xl font-black uppercase leading-none tracking-tight text-white md:text-4xl"
                  style={{ textShadow: '2px 2px 0 rgba(247,72,177,0.35), -1px -1px 0 rgba(34,211,238,0.2)' }}
                >
                  It&apos;s a match
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-400 md:text-base">
                  <span className="font-medium text-white">{match.name}</span>
                </p>

                <div className="mt-5 rounded-[1.5rem] border border-primary/35 bg-gradient-to-br from-primary/20 via-white/[0.04] to-cyan-400/10 p-4 text-left shadow-[0_0_32px_rgba(247,72,177,0.16)]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-label text-[9px] font-black uppercase tracking-[0.32em] text-cyan-200">Future Us</p>
                      <h3 className="mt-1 font-headline text-2xl font-black uppercase leading-none text-white">Run the private chemistry simulation</h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-primary">82% context</span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    Let private agents simulate possible dynamics, scenario friction, repair moves, and one compiled first date. Not a prediction — just the conditions that make this match worth testing.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-300">
                    <span className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">AI Memory</span>
                    <span className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">Maps + Calendar</span>
                    <span className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">Spotify vibe</span>
                    <span className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">Food graph</span>
                  </div>
                  {futureUsError ? (
                    <p className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-100">{futureUsError}</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void runFutureUs()}
                    disabled={futureUsBusy}
                    className="mt-4 w-full rounded-2xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-white shadow-lg shadow-primary/25 transition-colors hover:bg-[#ff69c1] disabled:cursor-wait disabled:opacity-60"
                  >
                    {futureUsBusy ? 'Simulating Future Us…' : 'Preview Future Us'}
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-1 md:px-7">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3 md:max-w-sm">
                  <div
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-white/15 ring-1 ring-primary/25 md:h-32 md:w-32"
                    style={{
                      boxShadow:
                        '0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(247,72,177,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <img
                      src={match.image}
                      alt=""
                      className="h-full w-full object-cover"
                      decoding="async"
                      fetchPriority="high"
                    />
                    <span className="pointer-events-none absolute -right-0.5 -top-0.5 rounded-md bg-cyan-400/95 px-1.5 py-0.5 font-label text-[8px] font-black uppercase tracking-widest text-black">
                      Locked in
                    </span>
                  </div>
                  <div className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left">
                    <p className="mb-1.5 font-label text-[8px] font-black uppercase tracking-[0.35em] text-primary/90">
                      The model&apos;s verdict
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-300 md:text-sm">{reason}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <GraffitiRail side="right" />
      </div>

      <style>{`
        @keyframes plot-spray-side {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.08); }
        }
        .plot-spray-side { animation: plot-spray-side 3.2s ease-in-out infinite; }
        .plot-spray-side-alt { animation: plot-spray-side 2.6s ease-in-out infinite reverse; }
        @keyframes plot-arrow-bob {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -3px); }
        }
        .plot-arrow-bob { animation: plot-arrow-bob 0.8s ease-in-out infinite; }
        .plot-arrow-delay-1 { animation-delay: 0.12s; }
        .plot-arrow-delay-2 { animation-delay: 0.24s; }
      `}</style>
    </div>
  )
}
