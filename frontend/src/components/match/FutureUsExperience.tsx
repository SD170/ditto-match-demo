import type { FutureUsResponse } from '../../types/person'

function ScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-black/60 shadow-[0_0_40px_rgba(247,72,177,0.22)]">
      <div
        className="absolute inset-2 rounded-full"
        style={{
          background: `conic-gradient(#F748B1 ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
        }}
      />
      <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full bg-zinc-950 text-center ring-1 ring-white/10">
        <span className="font-headline text-3xl font-black leading-none text-white">{score}</span>
        <span className="mt-0.5 text-[8px] font-black uppercase tracking-[0.24em] text-primary">{label}</span>
      </div>
    </div>
  )
}

export function FutureUsExperience({ simulation, onBack }: { simulation: FutureUsResponse; onBack: () => void }) {
  const primaryScenario = simulation.scenarios[0]
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4 sm:px-5 md:px-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-200 transition-colors hover:border-primary/50 hover:text-white"
        >
          ← Match
        </button>
        <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-cyan-200">
          Private simulation
        </span>
      </div>

      <section className="relative overflow-hidden rounded-[1.75rem] border border-primary/35 bg-gradient-to-br from-primary/20 via-zinc-950 to-cyan-400/10 p-5 shadow-[0_0_56px_rgba(247,72,177,0.16)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-label text-[9px] font-black uppercase tracking-[0.42em] text-primary/90">
              {simulation.title}
            </p>
            <h3 className="mt-2 font-headline text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl">
              {simulation.couple_thesis}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300">{simulation.subtitle}</p>
          </div>
          <ScoreRing score={simulation.confidence.score} label="context" />
        </div>
        <p className="relative mt-4 rounded-2xl border border-white/10 bg-black/35 p-3 text-xs leading-relaxed text-zinc-300">
          {simulation.confidence.explanation}
        </p>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {simulation.connected_signals.map((signal) => (
          <article key={signal.source} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-white">{signal.source}</h4>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">{signal.status}</p>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black text-cyan-200">{signal.confidence}%</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-350 text-zinc-300">{signal.insight}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/45 p-4">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="font-label text-[9px] font-black uppercase tracking-[0.34em] text-cyan-300/80">Chemistry map</p>
            <h4 className="mt-1 font-headline text-2xl font-black uppercase text-white">Relationship-specific signals</h4>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-zinc-400">Not a soulmate score — these are conditions that may help the first connection work.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {simulation.chemistry_map.map((dimension) => (
            <article key={dimension.name} className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <h5 className="font-bold text-white">{dimension.name}</h5>
                <span className="font-headline text-xl font-black text-primary">{dimension.score}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-300" style={{ width: `${dimension.score}%` }} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-300">{dimension.signal}</p>
              <p className="mt-2 text-xs leading-relaxed text-cyan-100/85">Best condition: {dimension.opportunity}</p>
            </article>
          ))}
        </div>
      </section>

      {primaryScenario ? (
        <section className="mt-4 rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/[0.04] p-4">
          <p className="font-label text-[9px] font-black uppercase tracking-[0.34em] text-cyan-200">Scenario simulator</p>
          <h4 className="mt-1 font-headline text-2xl font-black uppercase text-white">{primaryScenario.title}</h4>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">{primaryScenario.timeframe}</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-200">{primaryScenario.simulation}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Best move</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-200">{primaryScenario.best_move}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">Watchout</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-200">{primaryScenario.watchout}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-4 rounded-[1.75rem] border border-primary/30 bg-gradient-to-br from-zinc-950 via-black to-primary/10 p-5">
        <p className="font-label text-[9px] font-black uppercase tracking-[0.34em] text-primary">Best Date Compiler</p>
        <h4 className="mt-1 font-headline text-3xl font-black uppercase leading-none text-white">{simulation.best_date.title}</h4>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-black text-white">{simulation.best_date.location}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{simulation.best_date.suggested_time}</p>
          <ol className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-300">
            {simulation.best_date.plan.map((step) => (
              <li key={step} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-xl bg-black/35 p-3 text-xs leading-relaxed text-zinc-300">{simulation.best_date.why_it_works}</p>
        </div>
        <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">Invite draft</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-white">“{simulation.best_date.invite_text}”</p>
        </div>
      </section>

      <footer className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-black/35 p-4 text-[11px] leading-relaxed text-zinc-400">
        <p>{simulation.privacy_note}</p>
        <p>{simulation.research_note}</p>
      </footer>
    </div>
  )
}
