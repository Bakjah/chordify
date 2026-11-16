import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import PlaybackPanel from '../../components/song/PlaybackPanel.jsx'
import ReportSongModal from '../../components/song/ReportSongModal.jsx'
import { ROUTES } from '../../constants/routes.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getErrorMessage } from '../../services/api.js'
import { libraryService } from '../../services/libraryService.js'
import { reportService } from '../../services/reportService.js'
import { songService } from '../../services/songService.js'
import { applyCapo, keyLabel, transposeChord } from '../../utils/chordTransposer.js'
import { splitInlineChords } from '../../utils/lyricsParser.js'

const CAPO_OPTIONS = ['No Capo', 'Capo 1', 'Capo 2', 'Capo 3', 'Capo 4', 'Capo 5']

// Nada dasar tiap kunci, dipakai untuk menampilkan tombol transpose.
const KEY_SEMITONE = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
}

function ControlChip({ children, className = '' }) {
  return (
    <div className={`flex h-[30px] items-center rounded-[8px] bg-app-elevated px-[12px] ${className}`}>
      {children}
    </div>
  )
}

export default function SongDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [song, setSong] = useState(null)
  const [error, setError] = useState('')

  const [semitones, setSemitones] = useState(0)
  const [capo, setCapo] = useState(0)
  const [fontSize, setFontSize] = useState(16)
  const [showReport, setShowReport] = useState(false)
  const [reportNote, setReportNote] = useState(null)

  const [favoriteIds, setFavoriteIds] = useState([])
  const [collections, setCollections] = useState({ playlists: [], setlists: [] })
  const [openMenu, setOpenMenu] = useState(null)
  const [libraryError, setLibraryError] = useState('')

  useEffect(() => {
    let aktif = true
    songService
      .detail(id)
      .then((data) => {
        if (!aktif) return
        setSong(data)
        setCapo(data.capo || 0)
        setError('')
      })
      .catch((err) => {
        if (aktif) setError(getErrorMessage(err, 'Lagu tidak ditemukan.'))
      })
    return () => {
      aktif = false
    }
  }, [id])

  // Member yang masuk: cek status favorit dan catat riwayat dilihat.
  useEffect(() => {
    if (!isAuthenticated) return undefined
    let aktif = true
    libraryService
      .favorites()
      .then((data) => {
        if (aktif) setFavoriteIds(data.map((item) => item.id))
      })
      .catch(() => {
        // Status favorit tidak boleh membuat halaman gagal dibuka.
      })
    libraryService.recordView(id).catch(() => {
      // Riwayat hanya pelengkap; kegagalan pencatatan tidak dihiraukan.
    })
    return () => {
      aktif = false
    }
  }, [id, isAuthenticated])

  const isFavorite = favoriteIds.includes(Number(id))

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await libraryService.removeFavorite(id)
        setFavoriteIds((prev) => prev.filter((value) => value !== Number(id)))
      } else {
        await libraryService.addFavorite(id)
        setFavoriteIds((prev) => [...prev, Number(id)])
      }
      setLibraryError('')
    } catch (err) {
      setLibraryError(getErrorMessage(err, 'Favorit tidak dapat diperbarui.'))
    }
  }

  const openCollectionMenu = async (menu) => {
    setOpenMenu((current) => (current === menu ? null : menu))
    if (menu === 'playlist' && collections.playlists.length === 0) {
      try {
        const playlists = await libraryService.playlists()
        setCollections((prev) => ({ ...prev, playlists }))
      } catch (err) {
        setLibraryError(getErrorMessage(err, 'Playlist tidak dapat dimuat.'))
      }
    }
    if (menu === 'setlist' && collections.setlists.length === 0) {
      try {
        const setlists = await libraryService.setlists()
        setCollections((prev) => ({ ...prev, setlists }))
      } catch (err) {
        setLibraryError(getErrorMessage(err, 'Setlist tidak dapat dimuat.'))
      }
    }
  }

  const addToCollection = async (menu, collectionId) => {
    try {
      if (menu === 'playlist') {
        await libraryService.addSongToPlaylist(collectionId, id)
      } else {
        await libraryService.addSongToSetlist(collectionId, id)
      }
      setLibraryError('')
    } catch (err) {
      setLibraryError(getErrorMessage(err, 'Lagu tidak dapat ditambahkan.'))
    }
  }

  const submitReport = async ({ category, details }) => {
    if (!isAuthenticated) {
      setReportNote({ tone: 'error', text: 'Login dulu untuk melaporkan lagu ini.' })
      return
    }
    try {
      await reportService.submit({ songId: Number(id), category, details })
      setShowReport(false)
      setReportNote({ tone: 'success', text: 'Laporan terkirim. Terima kasih!' })
    } catch (err) {
      setReportNote({ tone: 'error', text: getErrorMessage(err, 'Laporan gagal dikirim.') })
    }
  }

  const baseSemitone = useMemo(() => {
    const root = (song?.key || '').split(' ')[0]
    return KEY_SEMITONE[root] ?? 0
  }, [song?.key])

  const chords = useMemo(
    () =>
      (song?.lyrics || []).map(({ chord, line }) => {
        // Kurung siku dari data lama dibuang supaya chord tampil polos.
        const label = String(chord || '').replace(/^\[/, '').replace(/\]$/, '').trim()
        return {
          chord: transposeChord(applyCapo(label, capo), semitones),
          // Chord yang ditulis di dalam baris lirik tetap di tempatnya.
          segments: splitInlineChords(line).map((segment) =>
            segment.type === 'chord'
              ? { ...segment, value: transposeChord(applyCapo(segment.value, capo), semitones) }
              : segment
          ),
        }
      }),
    [song?.lyrics, capo, semitones]
  )

  if (error) {
    return (
      <PageShell>
        <p className="mt-[28px] text-[14px] text-app-muted">{error}</p>
      </PageShell>
    )
  }

  if (!song) {
    return (
      <PageShell>
        <p className="mt-[28px] text-[14px] text-app-muted">Memuat lagu…</p>
      </PageShell>
    )
  }

  const contributorName = song.contributor?.replace('@', '') || ''

  return (
    <PageShell wide>
      <div className="mt-[14px] pb-16">
        {/* Hero */}
        <section className="relative h-[180px] rounded-[16px] bg-[#203a32]">
          <div
            className="absolute left-[25px] top-[22px] flex size-[138px] items-center justify-center rounded-[12px]"
            style={{ backgroundColor: song.artwork }}
          >
            <span className="font-mono text-[42px] font-bold leading-none text-white">♫</span>
          </div>

          <div className="absolute left-[190px] top-[26px]">
            <p className="font-mono text-[10px] font-bold leading-[20px] text-[#1ed760]">
              SONG CHORDS&nbsp;&nbsp;/&nbsp;&nbsp;
              {song.verified ? 'VERIFIED CONTRIBUTION' : 'COMMUNITY CONTRIBUTION'}
            </p>
            <h1 className="mt-[-2px] text-[34px] font-bold leading-[49px] text-app-text">{song.title}</h1>
            <p className="text-[14px] leading-[20px] text-app-text">
              {song.artist}&nbsp;&nbsp;•&nbsp;&nbsp;{song.genre}&nbsp;&nbsp;•&nbsp;&nbsp;
              {song.difficulty}
            </p>
            <p className="text-[12px] font-medium leading-[20px] text-[#1ed760]">
              ✓&nbsp;&nbsp;
              {song.verified ? 'Official Artist contribution' : 'Community contribution'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="absolute right-[124px] top-[128px] rounded-[8px] border border-[#454545] bg-[#292929] px-[12px] py-[8px] text-left text-[12px] font-semibold leading-[16px] text-[#ebebeb]"
          >
            Report song
          </button>

          {reportNote && (
            <p
              className={`absolute right-[124px] top-[162px] max-w-[420px] text-right text-[11px] leading-[16px] ${
                reportNote.tone === 'success' ? 'text-[#1ed760]' : 'text-[#ef4444]'
              }`}
            >
              {reportNote.text}
            </p>
          )}
        </section>

        {/* Kontrol chord */}
        <section className="relative mt-[25px] h-[76px] rounded-[12px] bg-app-card">
          <div className="absolute left-[25px] top-[13px]">
            <p className="font-mono text-[10px] font-bold leading-[20px] text-app-muted">TRANSPOSE</p>
            <div className="mt-[4px] flex gap-[8px]">
              <ControlChip className="w-[34px] justify-center !px-0">
                <button
                  type="button"
                  onClick={() => setSemitones((value) => value - 1)}
                  className="text-[22px] font-medium leading-[30px] text-app-text"
                >
                  −
                </button>
              </ControlChip>
              <ControlChip className="w-[76px] justify-center !px-0">
                <span className="font-mono text-[12px] font-medium leading-[30px] text-app-accent">
                  {keyLabel(baseSemitone + semitones)}
                </span>
              </ControlChip>
              <ControlChip className="w-[34px] justify-center !px-0">
                <button
                  type="button"
                  onClick={() => setSemitones((value) => value + 1)}
                  className="text-[22px] font-medium leading-[30px] text-app-text"
                >
                  +
                </button>
              </ControlChip>
            </div>
          </div>

          <div className="absolute left-[230px] top-[13px]">
            <p className="font-mono text-[10px] font-bold leading-[20px] text-app-muted">CAPO</p>
            <label className="relative mt-[4px] block h-[30px] w-[105px]">
              <select
                value={capo}
                onChange={(event) => setCapo(Number(event.target.value))}
                className="h-[30px] w-full appearance-none rounded-[8px] bg-app-elevated px-[12px] text-[11px] leading-[30px] text-app-text outline-none"
              >
                {CAPO_OPTIONS.map((item, index) => (
                  <option key={item} value={index} className="bg-app-elevated">
                    {item}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-[12px] top-[6px] text-[11px] text-app-text">
                ▾
              </span>
            </label>
          </div>

          <div className="absolute left-[390px] top-[13px]">
            <p className="font-mono text-[10px] font-bold leading-[20px] text-app-muted">LYRICS SIZE</p>
            <div className="mt-[4px] flex gap-[8px]">
              <ControlChip className="w-[34px] justify-center !px-0">
                <button
                  type="button"
                  onClick={() => setFontSize((value) => Math.max(12, value - 1))}
                  className="text-[12px] leading-[30px] text-app-text"
                >
                  A−
                </button>
              </ControlChip>
              <ControlChip className="w-[34px] justify-center !px-0">
                <button
                  type="button"
                  onClick={() => setFontSize((value) => Math.min(24, value + 1))}
                  className="text-[12px] leading-[30px] text-app-text"
                >
                  A+
                </button>
              </ControlChip>
            </div>
          </div>

          <div className="absolute left-[690px] top-[33px] z-20 flex gap-[26px] text-[13px] font-medium leading-[20px] text-app-text">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className={isFavorite ? 'text-app-accent' : ''}
                >
                  {isFavorite ? '♥ Favorite' : '♡ Favorite'}
                </button>

                <div className="relative">
                  <button type="button" onClick={() => openCollectionMenu('playlist')}>
                    + Playlist
                  </button>
                  {openMenu === 'playlist' && (
                    <div className="absolute right-0 top-[26px] w-[200px] rounded-[10px] border border-app-border bg-app-card p-[6px]">
                      {collections.playlists.length === 0 ? (
                        <p className="px-[10px] py-[8px] text-[11px] leading-[16px] text-app-muted">
                          Belum ada playlist.
                        </p>
                      ) : (
                        collections.playlists.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => addToCollection('playlist', item.id)}
                            className="block w-full rounded-[8px] px-[10px] py-[8px] text-left text-[12px] leading-[18px] text-app-text hover:bg-app-elevated"
                          >
                            {item.title}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button type="button" onClick={() => openCollectionMenu('setlist')}>
                    + Setlist
                  </button>
                  {openMenu === 'setlist' && (
                    <div className="absolute right-0 top-[26px] w-[200px] rounded-[10px] border border-app-border bg-app-card p-[6px]">
                      {collections.setlists.length === 0 ? (
                        <p className="px-[10px] py-[8px] text-[11px] leading-[16px] text-app-muted">
                          Belum ada setlist.
                        </p>
                      ) : (
                        collections.setlists.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => addToCollection('setlist', item.id)}
                            className="block w-full rounded-[8px] px-[10px] py-[8px] text-left text-[12px] leading-[18px] text-app-text hover:bg-app-elevated"
                          >
                            {item.title}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <span className="text-app-muted">Log in to save songs</span>
            )}
            <button type="button">⋯</button>
          </div>

          {libraryError && (
            <p className="absolute left-[690px] top-[60px] text-[11px] leading-[16px] text-app-muted">
              {libraryError}
            </p>
          )}
        </section>

        {/* Isi: lirik + panel samping */}
        <section className="mt-[23px] flex gap-[20px]">
          <div className="h-[555px] w-[790px] shrink-0 rounded-[14px] bg-app-card px-[30px] pt-[25px]">
            <p className="font-mono text-[11px] font-bold leading-[20px] text-app-muted">
              LYRICS &amp; CHORDS
            </p>
            <div className="mt-[25px] flex flex-col gap-[9px]">
              {chords.map((row, index) => (
                <div key={`${row.chord}-${index}`}>
                  {row.chord && (
                    <p
                      className="font-mono font-medium text-app-accent"
                      style={{ fontSize: `${fontSize}px`, lineHeight: '23px' }}
                    >
                      {row.chord}
                    </p>
                  )}
                  <p
                    className="whitespace-pre-wrap text-app-text"
                    style={{ fontSize: `${fontSize}px`, lineHeight: '23px' }}
                  >
                    {row.segments.map((segment, segmentIndex) =>
                      segment.type === 'chord' ? (
                        <span
                          key={segmentIndex}
                          className="font-mono font-medium text-app-accent"
                        >
                          {segment.value}
                        </span>
                      ) : (
                        <span key={segmentIndex}>{segment.value}</span>
                      )
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-[340px] shrink-0 flex-col">
            {/* Pemutar */}
            <PlaybackPanel song={song} />

            {/* Kontributor */}
            <div className="mt-[18px] h-[245px] rounded-[14px] bg-app-card px-[25px] pt-[25px]">
              <p className="font-mono text-[11px] font-bold leading-[20px] text-app-muted">
                CONTRIBUTOR
              </p>
              <div className="mt-[15px] flex items-center gap-[13px]">
                <div
                  className="flex size-[52px] shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: song.artwork }}
                >
                  <span className="text-[22px] font-bold leading-none text-white">
                    {song.artist.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-[15px] font-semibold leading-[22px] text-app-text">
                    {song.verified ? `${song.artist} Official` : contributorName || 'Chordify Community'}
                  </p>
                  {song.verified && (
                    <span className="mt-[1px] inline-flex h-[16px] items-center justify-center rounded-full bg-app-verified px-[12px] text-[6px] font-semibold leading-none text-white">
                      ✓ ARTIST
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-[16px] h-px w-full bg-app-border" />
              <p className="mt-[20px] text-[12px] leading-[20px] text-app-muted">
                Original artist arrangement. Updated 2 days ago.
              </p>
              {contributorName && (
                <Link
                  to={ROUTES.PROFILE(contributorName)}
                  className="mt-[35px] inline-block font-mono text-[10px] font-medium leading-[20px] text-app-accent"
                >
                  VIEW PROFILE&nbsp;&nbsp;→
                </Link>
              )}
            </div>

            {/* Tips */}
            <div className="mt-[20px] h-[130px] rounded-[14px] bg-app-card px-[25px] pt-[25px]">
              <p className="font-mono text-[11px] font-bold leading-[20px] text-app-accent">PLAYING TIP</p>
              <p className="mt-[10px] text-[14px] leading-[20px] text-app-text">
                Keep your phone in portrait mode. Use transpose controls to match your vocal range.
              </p>
            </div>
          </div>
        </section>
      </div>

      {showReport && (
        <ReportSongModal onClose={() => setShowReport(false)} onSubmit={submitReport} />
      )}
    </PageShell>
  )
}
