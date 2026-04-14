import { Outlet } from 'react-router-dom'

import { MessageFab } from '../landing/MessageFab'
import { AppNavBar } from './AppNavBar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface antialiased selection:bg-primary/30">
      <AppNavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <MessageFab />
    </div>
  )
}
