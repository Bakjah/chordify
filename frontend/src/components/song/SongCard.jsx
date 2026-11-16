import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'

const META_TONES = {
  contributor: 'font-medium text-app-accent',
  verified: 'font-medium text-app-verified',
  community: 'font-normal text-app-muted',
}

export default function SongCard({ song, variant = 'contributor' }) {
  const meta = typeof song.meta === 'string' ? song.meta : song.meta?.label
  const tone = META_TONES[variant] || META_TONES.contributor

  return (
    <Link
      to={ROUTES.SONG_DETAIL(song.id)}
      className="relative block h-[255px] w-[205px] shrink-0 rounded-[12px] bg-app-card transition-colors hover:bg-app-elevated"
    >
      <div
        className="absolute left-[12px] right-[12px] top-[12px] flex h-[130px] items-center justify-center rounded-[8px]"
        style={{ backgroundColor: song.artwork }}
      >
        <span className="font-display text-[40px] font-bold leading-none text-white">♫</span>
      </div>

      <p className="absolute left-[14px] top-[164px] w-[178px] truncate text-[15px] font-semibold leading-[22px] text-app-text">
        {song.title}
      </p>
      <p className="absolute left-[14px] top-[188px] w-[178px] truncate text-[12px] leading-[20px] text-app-muted">
        {song.artist}
      </p>
      <p className={`absolute left-[14px] top-[215px] w-[178px] truncate text-[10px] leading-[20px] ${tone}`}>
        {meta}
      </p>
    </Link>
  )
}
