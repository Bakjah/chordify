import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import SearchField from '../../components/search/SearchField.jsx'
import { ROUTES } from '../../constants/routes.js'
import { genreService } from '../../services/genreService.js'
import { songService } from '../../services/songService.js'
import { getErrorMessage } from '../../services/api.js'

const ALL_GENRES = 'ALL SONGS'
const SORTS = ['Most Relevant', 'Newest', 'Difficulty']

// Pengurutan yang bisa dikirim ke server; sisanya diolah di sisi browser.
const SERVER_SORT = {
  'Most Relevant': 'title',
  Newest: undefined,
  Difficulty: 'title',
}

export default function SongLibraryPage() {
  // Kata kunci disimpan di URL supaya hasil pencarian bisa dibagikan dan
  // kotak search di top bar selalu sama dengan yang difilter di halaman ini.
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''

  const setKeyword = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const [genre, setGenre] = useState(ALL_GENRES)
  const [sort, setSort] = useState('Most Relevant')
  const [songs, setSongs] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let aktif = true
    genreService
      .list()
      .then((data) => {
        if (aktif) setGenres(data.map((item) => item.name))
      })
      .catch(() => {})
    return () => {
      aktif = false
    }
  }, [])

  useEffect(() => {
    let aktif = true
    setLoading(true)
    const timer = setTimeout(() => {
      songService
        .list({ q: keyword.trim(), size: 100, sort: SERVER_SORT[sort] })
        .then((data) => {
          if (!aktif) return
          setSongs(data.content)
          setError('')
        })
        .catch((err) => {
          if (!aktif) return
          setError(getErrorMessage(err, 'Gagal memuat daftar lagu.'))
        })
        .finally(() => {
          if (aktif) setLoading(false)
        })
    }, keyword ? 250 : 0)
    return () => {
      aktif = false
      clearTimeout(timer)
    }
  }, [keyword, sort])

  const visibleSongs = useMemo(() => {
    let list = songs
    if (genre !== ALL_GENRES) {
      list = list.filter((song) => song.genre === genre)
    }
    if (sort === 'Difficulty') {
      const rank = { Beginner: 0, Easy: 1, Intermediate: 2 }
      list = [...list].sort((a, b) => (rank[a.difficulty] ?? 3) - (rank[b.difficulty] ?? 3))
    }
    return list
  }, [songs, genre, sort])

  return (
    <PageShell>
    <div className="mt-[28px] pb-16">
      <h1 className="text-[34px] font-bold leading-[46px] text-app-text">Song Library</h1>
      <p className="text-[15px] leading-[22px] text-app-muted">
        Explore guitar-ready songs from the Chordify community.
      </p>

      <div className="mt-[22px] flex gap-[15px]">
        <SearchField
          value={keyword}
          onChange={setKeyword}
          onSubmit={() => setKeyword(keyword)}
          placeholder="Search by song title or artist"
          className="h-[50px] flex-1 rounded-[10px] bg-app-card pl-[22px]"
          inputClassName="text-[14px]"
        />

        <label className="relative flex h-[50px] w-[175px] shrink-0 items-center rounded-[10px] bg-app-card px-[20px]">
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="w-full appearance-none bg-transparent text-[14px] text-app-text outline-none"
          >
            <option value={ALL_GENRES} className="bg-app-card">
              Genre
            </option>
            {genres.map((item) => (
              <option key={item} value={item} className="bg-app-card">
                {item}
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
        {[ALL_GENRES, ...genres].map((item) => (
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

      {error && <p className="mt-[20px] text-[13px] text-app-muted">{error}</p>}

      <div className="mt-[25px] flex flex-col gap-[16px]">
        {visibleSongs.map((song) => (
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

        {!loading && !error && visibleSongs.length === 0 && (
          <p className="text-[14px] leading-[22px] text-app-muted">Belum ada lagu yang cocok.</p>
        )}
      </div>
    </div>
    </PageShell>
  )
}
