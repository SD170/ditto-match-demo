import type { CSSProperties } from 'react'

import type { Gender } from '../../types/person'

const iconFill: CSSProperties = { fontVariationSettings: "'FILL' 1" }

type GenderPreferenceProps = {
  value: Gender
  onChange: (next: Gender) => void
}

export function GenderPreference({ value, onChange }: GenderPreferenceProps) {
  return (
    <div className="space-y-8">
      <p className="mx-auto max-w-sm text-center text-sm font-medium leading-relaxed text-white/75">
        Who do you want to meet?{' '}
        <span className="text-primary">Tap Women or Men</span> to open that pool. Your age range below applies.
      </p>

      <div className="flex items-start justify-center gap-10 md:gap-14">
        <button
          type="button"
          onClick={() => onChange('women')}
          aria-label="Browse women, open pool"
          className="group flex touch-manipulation flex-col items-center gap-4 transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-safe:active:scale-95"
        >
          <div className="relative">
            <span
              className="pointer-events-none absolute inset-[-8px] rounded-full border-2 border-primary/45 motion-safe:animate-ctaRing motion-reduce:animate-none"
              style={{ animationDelay: '0ms' }}
              aria-hidden
            />
            <div
              className={`relative flex h-24 w-24 items-center justify-center rounded-full border shadow-2xl transition-all duration-500 motion-safe:group-hover:scale-105 ${
                value === 'women'
                  ? 'border-primary bg-primary'
                  : 'border-white/10 bg-white/5 group-hover:border-primary group-hover:bg-primary group-hover:text-white'
              }`}
            >
              <span
                className="material-symbols-outlined text-4xl transition-transform duration-300 group-hover:scale-110"
                style={iconFill}
              >
                female
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                value === 'women' ? 'text-white' : 'text-white/45 group-hover:text-white'
              }`}
            >
              Women
            </span>
            <span className="flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary/90 transition-opacity group-hover:opacity-100 sm:text-[10px]">
              Tap
              <span className="material-symbols-outlined text-[14px] motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('men')}
          aria-label="Browse men, open pool"
          className="group flex touch-manipulation flex-col items-center gap-4 transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-safe:active:scale-95"
        >
          <div className="relative">
            <span
              className="pointer-events-none absolute inset-[-8px] rounded-full border-2 border-white/35 motion-safe:animate-ctaRing motion-reduce:animate-none"
              style={{ animationDelay: '500ms' }}
              aria-hidden
            />
            <div
              className={`relative flex h-24 w-24 items-center justify-center rounded-full border shadow-2xl transition-all duration-500 motion-safe:group-hover:scale-105 ${
                value === 'men'
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 bg-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black'
              }`}
            >
              <span
                className="material-symbols-outlined text-4xl transition-transform duration-300 group-hover:scale-110"
                style={iconFill}
              >
                male
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                value === 'men' ? 'text-white' : 'text-white/45 group-hover:text-white'
              }`}
            >
              Men
            </span>
            <span className="flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary/90 transition-opacity group-hover:opacity-100 sm:text-[10px]">
              Tap
              <span className="material-symbols-outlined text-[14px] motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
