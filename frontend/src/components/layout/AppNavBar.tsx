import { Link, NavLink, type NavLinkRenderProps } from 'react-router-dom'

const navClass = ({ isActive }: NavLinkRenderProps) =>
  `text-xs font-bold uppercase tracking-[0.3em] transition-colors ${
    isActive ? 'text-primary' : 'text-slate-400 hover:text-primary'
  }`

export function AppNavBar() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-black/40 px-8 py-6 font-headline tracking-tight backdrop-blur-xl">
      <nav className="flex items-center gap-8">
        <NavLink to="/" className={navClass} end>
          App
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
      </nav>
      <Link
        to="/"
        className="absolute left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-[0.12em] text-white/85"
      >
        ditto.ai // future intern
      </Link>
      <div className="w-[72px]" aria-hidden />
    </header>
  )
}
