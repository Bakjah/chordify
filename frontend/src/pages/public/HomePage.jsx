import { Link } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import SongCard from '../../components/song/SongCard.jsx'
import { POPULAR_SONGS, RECENT_SONGS } from '../../constants/mockSongs.js'
import { ROUTES } from '../../constants/routes.js'
import { useAuth } from '../../hooks/useAuth.js'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const { user } = useAuth()
  const name = user?.username || 'Bagja'

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
      <h1 className="text-[34px] font-bold leading-[46px] text-app-text">
        {greeting()}, {name}.
      </h1>
      <p className="text-[15px] leading-[22px] text-app-muted">
        Find your next song, learn a new chord, and keep playing.
      </p>

      <div className="mt-[22px] flex h-[58px] w-full items-center rounded-[12px] bg-app-card pl-[25px]">
        <span className="text-[15px] text-app-muted">⌕</span>
        <span className="ml-[10px] text-[15px] text-app-muted">
          Search songs, artists, or chord progressions
        </span>
      </div>

      <div className="mt-[40px] flex items-start justify-between">
        <h2 className="text-[22px] font-bold leading-[32px] text-app-text">Recently Added</h2>
        <Link
          to={ROUTES.SONGS}
          className="mt-[9px] font-mono text-[10px] leading-[20px] text-app-accent"
        >
          SEE ALL&nbsp;&nbsp;→
        </Link>
      </div>

      <div className="mt-[6px] flex gap-[20px]">
        {RECENT_SONGS.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            variant={song.verified ? 'verified' : 'contributor'}
          />
        ))}
      </div>

      <h2 className="mt-[40px] text-[22px] font-bold leading-[32px] text-app-text">
        Popular with guitarists
      </h2>

      <div className="mt-[8px] flex gap-[20px]">
        {POPULAR_SONGS.map((song) => (
          <SongCard key={song.id} song={song} variant="community" />
        ))}
      </div>
      </div>
    </PageShell>
  )
}
