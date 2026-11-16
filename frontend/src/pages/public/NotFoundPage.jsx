import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-app-bg px-8 text-center text-app-text">
      <p className="font-mono text-[11px] font-bold tracking-wide text-app-accent">404</p>
      <h1 className="text-[32px] font-bold leading-[46px]">Halaman tidak ditemukan</h1>
      <p className="max-w-[420px] text-[14px] leading-[20px] text-app-muted">
        Chord atau halaman yang kamu cari tidak ada. Coba kembali ke pustaka lagu.
      </p>
      <Link
        to={ROUTES.SONGS}
        className="mt-2 flex h-[42px] w-[170px] items-center justify-center rounded-[9px] bg-app-accent text-[12px] font-bold leading-[20px] text-app-bg"
      >
        Browse Song Library
      </Link>
    </div>
  )
}
