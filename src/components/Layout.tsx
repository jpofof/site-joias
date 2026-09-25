import { Outlet } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  )
}
