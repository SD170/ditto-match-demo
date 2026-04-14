type StepRailProps = {
  step: string
  label: string
}

export function StepRail({ step, label }: StepRailProps) {
  return (
    <div className="pointer-events-none fixed left-12 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center space-y-10 opacity-40 lg:flex">
      <div className="h-32 w-px bg-white/20" />
      <div className="origin-left translate-x-1 rotate-90 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.5em] text-white">
        Step {step} / {label}
      </div>
    </div>
  )
}
