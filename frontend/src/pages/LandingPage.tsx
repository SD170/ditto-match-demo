import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'nouislider/dist/nouislider.css'

import { trackHomepageView } from '../api/metrics'
import { AgeRangeSlider } from '../components/landing/AgeRangeSlider'
import { GenderPreference } from '../components/landing/GenderPreference'
import { StepRail } from '../components/landing/StepRail'
import type { Gender } from '../types/person'

export function LandingPage() {
  const navigate = useNavigate()
  const [ageRange, setAgeRange] = useState<[number, number]>([21, 28])
  const [seeking, setSeeking] = useState<Gender>('women')
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    void trackHomepageView()
      .then((count) => {
        if (!cancelled) setViews(count)
      })
      .catch(() => {
        if (!cancelled) setViews(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const goMatches = (g: Gender, range: [number, number] = ageRange) => {
    setSeeking(g)
    navigate(`/matches?gender=${g}&age_min=${range[0]}&age_max=${range[1]}`)
  }

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden">
      <main className="relative flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6">
        {views !== null ? (
          <div className="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-md md:right-8 md:top-8">
            Homepage views <span className="ml-2 font-black text-primary">{views.toLocaleString()}</span>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[100px]" />
        </div>

        <div className="z-10 w-full max-w-2xl space-y-20 text-center">
          <div className="space-y-4">
            <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Personal Curation
            </span>
            <h1 className="font-headline text-6xl font-extrabold leading-none tracking-tighter text-white md:text-8xl">
              Next date <br />
              is <span className="italic text-primary">here</span>
            </h1>
          </div>

          <div className="space-y-16">
            <GenderPreference value={seeking} onChange={(g) => goMatches(g)} />

            <div className="relative mx-auto max-w-md space-y-8 px-4 pb-8 pt-2">
              <div className="mb-2 flex items-end justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Target Age Range
                </span>
                <span className="font-headline text-3xl font-extrabold tracking-tight text-primary">
                  {ageRange[0]} — {ageRange[1]}
                </span>
              </div>
              <AgeRangeSlider defaultRange={[21, 28]} onRangeChange={setAgeRange} />
            </div>
          </div>
        </div>
      </main>

      <StepRail step="01" label="Discovery" />
    </div>
  )
}
