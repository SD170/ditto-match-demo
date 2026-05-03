import { Link, useSearchParams } from 'react-router-dom'

import { StepRail } from '../components/landing/StepRail'
import { DataConnectPanel } from '../components/match/DataConnectPanel'

export function ConnectContextPage() {
  const [searchParams] = useSearchParams()
  const qs = searchParams.toString()
  const matchesHref =
    qs.length > 0 ? `/matches?${qs}` : '/matches?gender=women&age_min=21&age_max=28'

  return (
    <>
      <StepRail step="02" label="Context" />
      <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 pb-24 sm:px-6 sm:py-12 md:px-12">
        <section className="mb-10 text-center md:text-left">
          <span className="font-label text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
            Data room
          </span>
          <h1 className="mt-2 font-headline text-4xl font-extrabold leading-[1.04] tracking-tighter text-white sm:text-5xl md:text-7xl md:leading-[0.98]">
            Connect your <span className="italic text-primary">context</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-zinc-400 md:text-base">
            Opt-in signals become privacy-safe bubbles that tune matching and Future Us. When you&apos;re done, continue to
            your curated pool.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link
              to={matchesHref}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-colors hover:bg-[#ff69c1]"
            >
              Continue to matches
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              App
            </Link>
          </div>
        </section>

        <DataConnectPanel />
      </main>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-primary/10 blur-[128px]" />
        <div className="absolute -right-48 top-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-[128px]" />
      </div>
    </>
  )
}
