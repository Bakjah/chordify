import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import { GENRES, SONGS, SORTS } from '../../constants/mockSongs.js'
import { ROUTES } from '../../constants/routes.js'

export default function SongLibraryPage() {
  const [keyword, setKeyword] = useState('')
  const [genre, setGenre] = useState('ALL SONGS')
  const [sort, setSort] = useState('Most Relevant')

  const songs = useMemo(() => {
    const filtered = SONGS.filter((song) => {
      const matchGenre =
        genre === 'ALL SONGS' || song.genre.toUpperCase().includes(genre.split(' ')[0])
      const query = keyword.trim().toLowerCase()
      const matchKeyword =
        !query || song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
      return matchGenre && matchKeyword
    })
    if (sort === 'Newest') return [...filtered].reverse()
    if (sort === 'Difficulty') {
      const rank = { Beginner: 0, Easy: 1, Intermediate: 2 }
      return [...filtered].sort((a, b) => rank[a.difficulty] - rank[b.difficulty])
    }
    return filtered
  }, [keyword, genre, sort])

  return (
    <PageShell>
    <div className="mt-[28px] pb-16">
      <h1 className="text-[34px] font-bold leading-[46px] text-app-text">Song Library</h1>
      <p className="text-[15px] leading-[22px] text-app-muted">
        Explore guitar-ready songs from the Chordify community.
      </p>

      <div className="mt-[22px] flex gap-[15px]">
        <div className="flex h-[50px] flex-1 items-center rounded-[10px] bg-app-card pl-[22px]">
          <span className="text-[14px] text-app-muted">⌕</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search by song title or artist"
            className="ml-[10px] w-full bg-transparent text-[14px] text-app-text outline-none placeholder:text-app-muted"
          />
        </div>

        <label className="relative flex h-[50px] w-[175px] shrink-0 items-center rounded-[10px] bg-app-card px-[20px]">
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="w-full appearance-none bg-transparent text-[14px] text-app-text outline-none"
          >
            {GENRES.map((item) => (
              <option key={item} value={item} className="bg-app-card">
                {item === 'ALL SONGS' ? 'Genre' : item}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-[20px] text-[14px] text-app-text">▾</span>
        </label>

        <label className="relative flex h-[50px] w-[215px] shrink-0 items-center rounded-[10px] bg-app-card px-[20px]">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full appearance-none bg-transparent text-[14px] text-app-text outline-none"
          >
            {SORTS.map((item) => (
              <option key={item} value={item} className="bg-app-card">
                {item}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-[20px] text-[14px] text-app-text">▾</span>
        </label>
      </div>

      <div className="mt-[31px] flex gap-[26px]">
        {GENRES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setGenre(item)}
            className={`font-mono text-[11px] leading-[20px] ${
              genre === item ? 'text-app-text' : 'text-app-accent'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-[25px] flex flex-col gap-[16px]">
        {songs.map((song) => (
          <Link
            key={song.id}
            to={ROUTES.SONG_DETAIL(song.id)}
            className="relative flex h-[80px] w-full items-center rounded-[10px] bg-app-card px-[14px] transition-colors hover:bg-app-elevated"
          >
            <div
              className="flex size-[60px] shrink-0 items-center justify-center rounded-[8px]"
              style={{ backgroundColor: song.artwork }}
            >
              <span className="font-display text-[24px] font-bold leading-none text-white">♫</span>
            </div>

            <div className="ml-[16px] min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold leading-[22px] text-app-text">
                {song.title}
              </p>
              <p className="truncate text-[12px] leading-[20px] text-app-muted">{song.artist}</p>
            </div>

            <p className="w-[130px] shrink-0 text-[12px] leading-[20px] text-app-muted">{song.genre}</p>
            <p className="w-[110px] shrink-0 font-mono text-[12px] leading-[20px] text-app-text">
              {song.key}
            </p>
            <p className="w-[130px] shrink-0 text-[12px] leading-[20px] text-app-muted">
              {song.difficulty}
            </p>
            <p
              className={`w-[260px] shrink-0 text-[11px] font-medium leading-[20px] ${
                song.verified ? 'text-app-verified' : 'text-app-muted'
              }`}
            >
              {song.verified ? '✓ Official Artist' : song.contributor}
            </p>
          </Link>
        ))}
      </div>
    </div>
    </PageShell>
  )
}
