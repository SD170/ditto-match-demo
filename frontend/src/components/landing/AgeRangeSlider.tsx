import { useEffect, useRef } from 'react'
import noUiSlider from 'nouislider'

type AgeRangeSliderProps = {
  min?: number
  max?: number
  defaultRange?: [number, number]
  onRangeChange?: (range: [number, number]) => void
  className?: string
}

/** Dual-handle range backed by noUiSlider. */
export function AgeRangeSlider({
  min = 18,
  max = 65,
  defaultRange = [21, 28],
  onRangeChange,
  className = '',
}: AgeRangeSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const initialRangeRef = useRef<[number, number]>(defaultRange)
  const onRangeChangeRef = useRef(onRangeChange)

  useEffect(() => {
    onRangeChangeRef.current = onRangeChange
  }, [onRangeChange])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const slider = noUiSlider.create(el, {
      start: initialRangeRef.current,
      connect: true,
      step: 1,
      range: { min, max },
    })

    slider.on('update', (values) => {
      const next: [number, number] = [Math.round(Number(values[0])), Math.round(Number(values[1]))]
      onRangeChangeRef.current?.(next)
    })

    return () => slider.destroy()
  }, [min, max])

  return <div ref={containerRef} className={`age-slider ${className}`.trim()} />
}
