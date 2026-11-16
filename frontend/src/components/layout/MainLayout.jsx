import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'

// Shell aplikasi: sidebar 236px + topbar global. Padding konten diatur tiap
// halaman lewat PageShell karena lebar panel berbeda-beda.
export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-app-bg text-app-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
