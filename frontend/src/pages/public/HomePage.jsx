import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import SearchField from '../../components/search/SearchField.jsx'
import SongCard from '../../components/song/SongCard.jsx'
import SongCarousel from '../../components/song/SongCarousel.jsx'
import { ROUTES } from '../../constants/routes.js'
import { useAuth } from '../../hooks/useAuth.js'
import { songService } from '../../services/songService.js'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const name = user?.username || 'Bagja'
  const [songs, setSongs] = useState([])
  const [keyword, setKeyword] = useState('')

  const submitSearch = () => {
    const q = keyword.trim()
    navigate(q ? `${ROUTES.SONGS}?q=${encodeURIComponent(q)}` : ROUTES.SONGS)
  }

  useEffect(() => {
    let aktif = true
    songService
      .list({ size: 24 })
      .then((data) => {
        if (aktif) setSongs(data.content)
      })
      .catch(() => {})
    return () => {
      aktif = false
    }
  }, [])

  // Satu baris untuk lagu yang baru masuk, satu lagi untuk sisanya. Lagu
  // dibagi dua sama besar supaya kedua baris tetap ada walau jumlahnya sedikit.
  const half = Math.ceil(songs.length / 2)
  const recentSongs = songs.slice(0, half)
  const popularSongs = songs.slice(half)

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
      <h1 className="text-[34px] font-bold leading-[46px] text-app-text">
        {greeting()}, {name}.
      </h1>
      <p className="text-[15px] leading-[22px] text-app-muted">
        Find your next song, learn a new chord, and keep playing.
      </p>

      <SearchField
        value={keyword}
        onChange={setKeyword}
        onSubmit={submitSearch}
        placeholder="Search songs, artists, or chord progressions"
        className="mt-[22px] h-[58px] w-full rounded-[12px] bg-app-card pl-[25px]"
        inputClassName="text-[15px]"
      />

      <div className="mt-[40px]">
        <SongCarousel
          title="Recently Added"
          action={
            <Link to={ROUTES.SONGS} className="font-mono text-[10px] leading-[20px] text-app-accent">
              SEE ALL&nbsp;&nbsp;→
            </Link>
          }
        >
          {recentSongs.map((song) => (
            <SongCard
              key={song.id}
              song={{ ...song, meta: song.verified ? '✓ Verified Musician' : `by ${song.contributor}` }}
              variant={song.verified ? 'verified' : 'contributor'}
            />
          ))}
        </SongCarousel>
      </div>

      <div className="mt-[40px]">
        <SongCarousel title="Popular with guitarists">
          {popularSongs.map((song) => (
            <SongCard
              key={song.id}
              song={{ ...song, meta: 'Community contribution' }}
              variant="community"
            />
          ))}
        </SongCarousel>
      </div>
    </div>
    </PageShell>
  )
}
