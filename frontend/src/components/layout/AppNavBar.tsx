import { Link, NavLink, type NavLinkRenderProps } from 'react-router-dom'

const navClass = ({ isActive }: NavLinkRenderProps) =>
  `text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] sm:tracking-[0.3em] transition-colors ${
    isActive ? 'text-primary' : 'text-slate-400 hover:text-primary'
  }`

export function AppNavBar() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-black/40 px-4 py-4 font-headline tracking-tight backdrop-blur-xl sm:px-8 sm:py-6">
      <nav className="flex items-center gap-4 sm:gap-8">
        <NavLink to="/" className={navClass} end>
          App
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
      </nav>
      <Link
        to="/"
        className="absolute left-1/2 hidden -translate-x-1/2 text-xs font-black uppercase tracking-[0.12em] text-white/85 md:block"
      >
        ditto.ai // future intern
      </Link>
      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/70 md:hidden">ditto.ai</span>
    </header>
  )
}
