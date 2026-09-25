import { Outlet, useLocation } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

export default function Layout() {
  // A Home tem header e footer próprios no desktop (variante `home`).
  const home = useLocation().pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader home={home} />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter home={home} />
    </div>
  )
}
