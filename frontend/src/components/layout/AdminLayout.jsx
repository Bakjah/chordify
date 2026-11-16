import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ADMIN_NAV } from '../../constants/mockLibrary.js'

const ADMIN_TRAILS = {
  '/admin': 'ADMINISTRATION  /  OVERVIEW',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const trail = ADMIN_TRAILS[pathname] || 'ADMINISTRATION  /  MANAGEMENT'

  return (
    <div className="flex min-h-screen bg-app-bg text-app-text">
      <aside className="hidden w-[236px] shrink-0 flex-col bg-app-sidebar lg:flex">
        <div className="px-[26px] pt-[26px]">
          <p className="text-[25px] font-bold leading-[36px] text-app-text">CHORDIFY</p>
          <p className="mt-[-2px] h-[20px] font-mono text-[9px] font-bold leading-[20px] text-app-accent">
            ADMIN CONSOLE
          </p>
        </div>

        <div className="mx-[24px] mt-[12px] h-px w-[188px] bg-app-border" />

        <nav className="mt-[25px] flex flex-col">
          {ADMIN_NAV.map((item) =>
            item.to ? (
              <NavLink key={item.label} to={item.to} className="relative block h-[43px]">
                {({ isActive }) => (
                  <span
                    className={`absolute left-[16px] right-[16px] top-0 flex h-[38px] items-center rounded-[8px] pl-[12px] text-[13px] font-medium leading-[20px] ${
                      isActive ? 'bg-app-card text-app-accent' : 'text-app-muted'
                    }`}
                  >
                    <span className="whitespace-pre">{isActive ? '●  ' : '   '}</span>
                    {item.label}
                  </span>
                )}
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="relative block h-[43px]"
              >
                <span className="absolute left-[16px] right-[16px] top-0 flex h-[38px] items-center rounded-[8px] pl-[12px] text-[13px] font-medium leading-[20px] text-app-muted">
                  <span className="whitespace-pre">{'   '}</span>
                  {item.label}
                </span>
              </span>
            )
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative h-[76px] shrink-0">
          <p className="absolute left-[34px] top-[28px] font-mono text-[10px] leading-[20px] text-app-muted">
            {trail}
          </p>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
