import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PlaylistCard from '../../components/library/PlaylistCard.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { LIBRARY_TABS } from '../../constants/library.js'
import { ROUTES } from '../../constants/routes.js'
import { getErrorMessage } from '../../services/api.js'
import { libraryService } from '../../services/libraryService.js'

const FALLBACK_ARTWORK = '#2f3b36'

// Tab aktif dibaca dari URL, jadi pindah menu di sidebar dan klik tab di
// halaman ini selalu konsisten.
const PATH_TABS = {
  [ROUTES.LIBRARY]: 'Overview',
  [ROUTES.FAVORITES]: 'Favorites',
  [ROUTES.PLAYLISTS]: 'Playlists',
  [ROUTES.SETLISTS]: 'Setlists',
}

const TAB_ROUTES = {
  Overview: ROUTES.LIBRARY,
  Favorites: ROUTES.FAVORITES,
  Playlists: ROUTES.PLAYLISTS,
  Setlists: ROUTES.SETLISTS,
  'Recently Viewed': `${ROUTES.LIBRARY}?tab=Recently+Viewed`,
}

const TAB_COPY = {
  Overview: {
    title: 'Your Library',
    subtitle: 'All the songs and setlists you keep close.',
  },
  Favorites: {
    title: 'My Favorites',
    subtitle: 'Songs you saved for later.',
  },
  Playlists: {
    title: 'My Playlists',
    subtitle: 'Curated collections of your favourite songs.',
  },
  Setlists: {
    title: 'My Setlists',
    subtitle: 'Ordered line-ups ready for the stage.',
  },
  'Recently Viewed': {
    title: 'Recently Viewed',
    subtitle: 'Songs you opened recently.',
  },
}

function LibrarySongCard({ song }) {
  return (
    <Link
      to={ROUTES.SONG_DETAIL(song.id)}
      className="relative block h-[235px] w-[205px] rounded-[12px] bg-app-card transition-colors hover:bg-app-elevated"
    >
      <div
        className="absolute left-[12px] top-[12px] h-[120px] w-[181px] rounded-[8px]"
        style={{ backgroundColor: song.artwork || FALLBACK_ARTWORK }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[36px] leading-[52px] text-white/80">
          ♫
        </span>
      </div>
      <p className="absolute left-[14px] top-[147px] text-[14px] font-semibold leading-[20px] text-app-text">
        {song.title}
      </p>
      <p className="absolute left-[14px] top-[171px] text-[11px] leading-[20px] text-app-muted">
        {song.artist}
      </p>
    </Link>
  )
}

function CollectionSongRow({ song, onRemove }) {
  return (
    <div className="flex items-center gap-[6px]">
      <Link
        to={ROUTES.SONG_DETAIL(song.id)}
        className="min-w-0 flex-1 truncate py-[5px] text-[12px] leading-[18px] text-app-text hover:text-app-accent"
      >
        {song.title}
        <span className="text-app-muted"> · {song.artist}</span>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(song.id)}
          aria-label={`Hapus ${song.title} dari daftar`}
          className="h-[22px] w-[22px] shrink-0 rounded-[6px] text-[12px] leading-[22px] text-app-muted hover:bg-app-elevated hover:text-[#ef4444]"
        >
          ×
        </button>
      )}
    </div>
  )
}

function EmptyNote({ children }) {
  return <p className="mt-[10px] text-[13px] leading-[20px] text-app-muted">{children}</p>
}

export default function PersonalLibraryPage() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const tabParam = new URLSearchParams(search).get('tab')
  const tab = tabParam || PATH_TABS[pathname] || 'Overview'

  const [favorites, setFavorites] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [setlists, setSetlists] = useState([])
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [saving, setSaving] = useState(false)

  // Koleksi yang sedang dibuka, beserta isi lagunya.
  const [openCollection, setOpenCollection] = useState(null)
  const [collectionSongs, setCollectionSongs] = useState([])

  useEffect(() => {
    let aktif = true
    Promise.all([
      libraryService.favorites(),
      libraryService.playlists(),
      libraryService.setlists(),
      libraryService.history(),
    ])
      .then(([favorit, daftarPlaylist, daftarSetlist, riwayat]) => {
        if (!aktif) return
        setFavorites(favorit)
        setPlaylists(daftarPlaylist)
        setSetlists(daftarSetlist)
        setHistory(riwayat)
        setError('')
      })
      .catch((err) => {
        if (!aktif) return
        setError(getErrorMessage(err, 'Library tidak dapat dimuat.'))
      })
    return () => {
      aktif = false
    }
  }, [])

  const toggleCreate = (type) => {
    setCreating((current) => (current === type ? null : type))
    setNewTitle('')
  }

  const submitCreate = async (event) => {
    event.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    setSaving(true)
    try {
      if (creating === 'playlist') {
        const dibuat = await libraryService.createPlaylist({
          title,
          description: '',
          artwork: '#315a52',
        })
        setPlaylists((prev) => [dibuat, ...prev])
      } else {
        const dibuat = await libraryService.createSetlist({
          title,
          description: '',
          artwork: '#315a52',
        })
        setSetlists((prev) => [dibuat, ...prev])
      }
      setCreating(null)
      setNewTitle('')
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Daftar tidak dapat dibuat.'))
    } finally {
      setSaving(false)
    }
  }

  const loadCollectionSongs = async (type, id) => {
    const list =
      type === 'playlist'
        ? await libraryService.playlistSongs(id)
        : await libraryService.setlistSongs(id)
    return list
  }

  const toggleCollection = async (type, id) => {
    if (openCollection?.id === id) {
      setOpenCollection(null)
      return
    }
    setOpenCollection({ type, id })
    try {
      setCollectionSongs(await loadCollectionSongs(type, id))
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Isi daftar tidak dapat dimuat.'))
    }
  }

  const removeFromCollection = async (type, id, songId) => {
    try {
      if (type === 'playlist') {
        await libraryService.removeSongFromPlaylist(id, songId)
      } else {
        await libraryService.removeSongFromSetlist(id, songId)
      }
      setCollectionSongs(await loadCollectionSongs(type, id))
      // Jumlah lagu pada kartu ikut diperbarui.
      if (type === 'playlist') {
        setPlaylists(await libraryService.playlists())
      } else {
        setSetlists(await libraryService.setlists())
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Lagu tidak dapat dihapus dari daftar.'))
    }
  }

  const deleteCollection = async (type, id, title) => {
    const label = type === 'playlist' ? 'playlist' : 'setlist'
    if (!window.confirm(`Hapus ${label} "${title}"?`)) return
    try {
      if (type === 'playlist') {
        await libraryService.deletePlaylist(id)
        setPlaylists((prev) => prev.filter((item) => item.id !== id))
      } else {
        await libraryService.deleteSetlist(id)
        setSetlists((prev) => prev.filter((item) => item.id !== id))
      }
      if (openCollection?.id === id) setOpenCollection(null)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Daftar tidak dapat dihapus.'))
    }
  }

  const renderCreateForm = (type) => (
    <form onSubmit={submitCreate} className="mt-[14px] flex items-center gap-[10px]">
      <input
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        placeholder={type === 'playlist' ? 'Nama playlist baru' : 'Nama setlist baru'}
        className="h-[40px] w-[260px] rounded-[8px] bg-app-elevated px-[14px] text-[13px] leading-[20px] text-app-text outline-none placeholder:text-app-muted"
      />
      <button
        type="submit"
        disabled={saving}
        className="h-[40px] w-[110px] rounded-[8px] bg-app-accent text-[12px] font-bold leading-[20px] text-app-bg disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Create'}
      </button>
      <button
        type="button"
        onClick={() => setCreating(null)}
        className="h-[40px] w-[80px] rounded-[8px] bg-app-elevated text-[12px] font-medium leading-[20px] text-app-text"
      >
        Cancel
      </button>
    </form>
  )

  const renderSongs = (songs, kosong) => (
    <>
      {songs.length === 0 ? (
        <EmptyNote>{kosong}</EmptyNote>
      ) : (
        <div className="mt-[10px] flex flex-wrap gap-[20px]">
          {songs.map((song) => (
            <LibrarySongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </>
  )

  const renderCollections = (collections, type, kosong) => (
    <>
      {collections.length === 0 ? (
        <EmptyNote>{kosong}</EmptyNote>
      ) : (
        <div className="mt-[10px] flex flex-wrap gap-[20px]">
          {collections.map((item) => {
            const expanded = openCollection?.id === item.id
            return (
              <PlaylistCard
                key={item.id}
                title={item.title}
                songs={item.songs}
                artwork={item.artwork || FALLBACK_ARTWORK}
                expanded={expanded}
                onToggle={() => toggleCollection(type, item.id)}
                onDelete={() => deleteCollection(type, item.id, item.title)}
              >
                {expanded &&
                  (collectionSongs.length === 0 ? (
                    <p className="py-[6px] text-[12px] leading-[18px] text-app-muted">
                      Belum ada lagu di daftar ini.
                    </p>
                  ) : (
                    collectionSongs.map((song) => (
                      <CollectionSongRow
                        key={song.id}
                        song={song}
                        onRemove={(songId) => removeFromCollection(type, item.id, songId)}
                      />
                    ))
                  ))}
              </PlaylistCard>
            )
          })}
        </div>
      )}
    </>
  )

  const copy = TAB_COPY[tab] || TAB_COPY.Overview

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[34px] font-bold leading-[46px] text-app-text">{copy.title}</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">{copy.subtitle}</p>

        {error && <p className="mt-[12px] text-[13px] text-app-muted">{error}</p>}

        <div className="mt-[25px] flex gap-[15px]">
          {LIBRARY_TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => navigate(TAB_ROUTES[item])}
              className={`h-[42px] w-[160px] rounded-[9px] text-[13px] font-medium leading-[20px] transition-colors ${
                tab === item
                  ? 'bg-app-accent text-app-bg'
                  : 'bg-app-card text-app-text hover:bg-app-elevated'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === 'Overview' && (
          <>
            <h2 className="mt-[38px] text-[22px] font-bold leading-[30px] text-app-text">
              My Favorites
            </h2>
            {renderSongs(favorites, 'Belum ada lagu favorit. Tekan ♡ Favorite di halaman lagu.')}

            <h2 className="mt-[45px] text-[22px] font-bold leading-[30px] text-app-text">
              Your Playlists
            </h2>
            {renderCollections(playlists, 'playlist', 'Belum ada playlist.')}

            <h2 className="mt-[45px] text-[22px] font-bold leading-[30px] text-app-text">
              Your Setlists
            </h2>
            {renderCollections(setlists, 'setlist', 'Belum ada setlist.')}
          </>
        )}

        {tab === 'Favorites' && (
          <>
            <h2 className="mt-[38px] text-[22px] font-bold leading-[30px] text-app-text">
              My Favorites
            </h2>
            {renderSongs(favorites, 'Belum ada lagu favorit. Tekan ♡ Favorite di halaman lagu.')}
          </>
        )}

        {tab === 'Playlists' && (
          <>
            <div className="mt-[38px] flex items-center justify-between">
              <h2 className="text-[22px] font-bold leading-[30px] text-app-text">Your Playlists</h2>
              <button
                type="button"
                onClick={() => toggleCreate('playlist')}
                className="h-[40px] w-[150px] rounded-[8px] bg-app-accent text-[12px] font-bold leading-[20px] text-app-bg"
              >
                + New Playlist
              </button>
            </div>
            {creating === 'playlist' && renderCreateForm('playlist')}
            {renderCollections(playlists, 'playlist', 'Belum ada playlist.')}
          </>
        )}

        {tab === 'Setlists' && (
          <>
            <div className="mt-[38px] flex items-center justify-between">
              <h2 className="text-[22px] font-bold leading-[30px] text-app-text">Your Setlists</h2>
              <button
                type="button"
                onClick={() => toggleCreate('setlist')}
                className="h-[40px] w-[150px] rounded-[8px] bg-app-accent text-[12px] font-bold leading-[20px] text-app-bg"
              >
                + New Setlist
              </button>
            </div>
            {creating === 'setlist' && renderCreateForm('setlist')}
            {renderCollections(setlists, 'setlist', 'Belum ada setlist.')}
          </>
        )}

        {tab === 'Recently Viewed' && (
          <>
            <h2 className="mt-[38px] text-[22px] font-bold leading-[30px] text-app-text">
              Recently Viewed
            </h2>
            {renderSongs(history, 'Belum ada riwayat. Buka sebuah lagu untuk mulai mencatat.')}
          </>
        )}
      </div>
    </PageShell>
  )
}
