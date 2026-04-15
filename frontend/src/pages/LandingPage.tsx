import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'nouislider/dist/nouislider.css'

import { AgeRangeSlider } from '../components/landing/AgeRangeSlider'
import { GenderPreference } from '../components/landing/GenderPreference'
import { StepRail } from '../components/landing/StepRail'
import type { Gender } from '../types/person'

export function LandingPage() {
  const navigate = useNavigate()
  const [ageRange, setAgeRange] = useState<[number, number]>([21, 28])
  const [seeking, setSeeking] = useState<Gender>('women')

  const goMatches = (g: Gender, range: [number, number] = ageRange) => {
    setSeeking(g)
    navigate(`/matches?gender=${g}&age_min=${range[0]}&age_max=${range[1]}`)
  }

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden">
      <main className="relative flex min-h-[calc(100vh-73px)] flex-col items-center justify-start px-4 pb-12 pt-10 sm:justify-center sm:px-6 sm:pt-0">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[100px]" />
        </div>

        <div className="z-10 w-full max-w-2xl space-y-12 text-center sm:space-y-20">
          <div className="space-y-3 sm:space-y-4">
            <span className="mb-3 block text-[9px] font-bold uppercase tracking-[0.25em] text-primary sm:mb-4 sm:text-[10px] sm:tracking-[0.3em]">
              Personal Curation
            </span>
            <h1 className="font-headline text-5xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-8xl">
              Next date <br />
              is <span className="italic text-primary">here</span>
            </h1>
          </div>

          <div className="space-y-10 sm:space-y-16">
            <GenderPreference value={seeking} onChange={(g) => goMatches(g)} />

            <div className="relative mx-auto w-full max-w-md space-y-6 px-2 pb-4 pt-2 sm:space-y-8 sm:px-4 sm:pb-8">
              <div className="mb-2 flex items-end justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40 sm:text-[10px] sm:tracking-[0.2em]">
                  Target Age Range
                </span>
                <span className="font-headline text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
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
