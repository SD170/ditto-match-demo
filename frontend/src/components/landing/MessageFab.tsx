import { useState } from 'react'

const EX_MESSAGE =
  "i've been thinking. we should get back together for closure. yours, mostly. i'm fine."

export function MessageFab() {
  const [open, setOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  const toggle = () => {
    setOpen((prev) => !prev)
    setHasUnread(false)
  }

  return (
    <div className="fixed bottom-12 right-12 z-50">
      {open && (
        <div className="glass-panel absolute bottom-20 right-0 w-[310px] rounded-xl border border-white/15 p-4 text-left text-sm text-zinc-100 shadow-2xl">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">New message</p>
          <p>
            <strong>From your ex:</strong> {EX_MESSAGE}
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={toggle}
        className="glass-panel group relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-primary shadow-2xl transition-all hover:scale-110"
        aria-expanded={open}
        aria-label="Messages"
      >
        <span className="material-symbols-outlined text-3xl">chat_bubble</span>
        {hasUnread && (
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
        )}
      </button>
    </div>
  )
}
