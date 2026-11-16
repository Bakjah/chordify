import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import ReportSongModal from '../../components/song/ReportSongModal.jsx'
import { SONGS } from '../../constants/mockSongs.js'
import { ROUTES } from '../../constants/routes.js'
import { applyCapo, keyLabel, transposeChord } from '../../utils/chordTransposer.js'

const CAPO_OPTIONS = ['No Capo', 'Capo 1', 'Capo 2', 'Capo 3', 'Capo 4', 'Capo 5']

function ControlChip({ children, className = '' }) {
  return (
    <div className={`flex h-[30px] items-center rounded-[8px] bg-app-elevated px-[12px] ${className}`}>
      {children}
    </div>
  )
}

export default function SongDetailPage() {
  const { id } = useParams()
  const song = useMemo(() => SONGS.find((item) => item.id === id) || SONGS[0], [id])

  const [semitones, setSemitones] = useState(0)
  const [capo, setCapo] = useState(0)
  const [fontSize, setFontSize] = useState(16)
  const [showReport, setShowReport] = useState(false)

  const baseSemitone = 7 // G Major
  const chords = (song.lyrics || []).map(({ chord, line }) => ({
    chord: transposeChord(applyCapo(chord, capo), semitones),
    line,
  }))

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
              SONG CHORDS&nbsp;&nbsp;/&nbsp;&nbsp;VERIFIED CONTRIBUTION
            </p>
            <h1 className="mt-[-2px] text-[34px] font-bold leading-[49px] text-app-text">{song.title}</h1>
            <p className="text-[14px] leading-[20px] text-app-text">
              {song.artist}&nbsp;&nbsp;•&nbsp;&nbsp;{song.genre}&nbsp;&nbsp;•&nbsp;&nbsp;
              {song.difficulty}
            </p>
            <p className="text-[12px] font-medium leading-[20px] text-[#1ed760]">
              ✓&nbsp;&nbsp;Official Artist contribution
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="absolute right-[124px] top-[128px] rounded-[8px] border border-[#454545] bg-[#292929] px-[12px] py-[8px] text-left text-[12px] font-semibold leading-[16px] text-[#ebebeb]"
          >
            Report song
          </button>
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

          <div className="absolute left-[690px] top-[33px] flex gap-[26px] text-[13px] font-medium leading-[20px] text-app-text">
            <button type="button">♡ Favorite</button>
            <button type="button">+ Playlist</button>
            <button type="button">+ Setlist</button>
            <button type="button">⋯</button>
          </div>
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
                  <p
                    className="font-mono font-medium text-app-accent"
                    style={{ fontSize: `${fontSize}px`, lineHeight: '23px' }}
                  >
                    {row.chord}
                  </p>
                  <p className="text-app-text" style={{ fontSize: `${fontSize}px`, lineHeight: '23px' }}>
                    {row.line}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-[340px] shrink-0 flex-col">
            {/* Pemutar */}
            <div className="h-[130px] rounded-[14px] bg-app-card px-[29px] pt-[24px]">
              <p className="text-[8px] font-bold leading-[14px] text-[#9e9e9e]">PLAYBACK</p>
              <div className="mt-[4px] flex items-center justify-between">
                <span className="text-[9px] font-semibold leading-[14px] text-[#f5f5f5]">01:24</span>
                <span className="text-[9px] font-semibold leading-[14px] text-[#9e9e9e]">04:26</span>
              </div>
              <div className="relative mt-[4px] h-[3px] w-full rounded-[2px] bg-[#303030]">
                <div className="h-[3px] w-[85px] rounded-[2px] bg-[#1cb954]" />
              </div>
              <div className="mt-[13px] flex items-center justify-between px-[7px]">
                <span className="text-[12px] font-bold leading-[16px] text-[#f5f5f5]">|◀</span>
                <span className="text-[12px] font-bold leading-[16px] text-[#9e9e9e]">1×</span>
                <span className="flex size-[40px] items-center justify-center rounded-full bg-[#1cb954] text-[18px] font-bold leading-none text-white">
                  ▶
                </span>
                <span className="text-[12px] font-bold leading-[16px] text-[#f5f5f5]">▶|</span>
                <span className="text-[17px] font-bold leading-[16px] text-[#9e9e9e]">↻</span>
              </div>
            </div>

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
                    {song.artist} Official
                  </p>
                  <span className="mt-[1px] inline-flex h-[16px] items-center justify-center rounded-full bg-app-verified px-[12px] text-[6px] font-semibold leading-none text-white">
                    ✓ ARTIST
                  </span>
                </div>
              </div>
              <div className="mt-[16px] h-px w-full bg-app-border" />
              <p className="mt-[20px] text-[12px] leading-[20px] text-app-muted">
                Original artist arrangement. Updated 2 days ago.
              </p>
              <a
                href={ROUTES.PROFILE(song.contributor.replace('@', ''))}
                className="mt-[35px] inline-block font-mono text-[10px] font-medium leading-[20px] text-app-accent"
              >
                VIEW PROFILE&nbsp;&nbsp;→
              </a>
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
        <ReportSongModal onClose={() => setShowReport(false)} onSubmit={() => setShowReport(false)} />
      )}
    </PageShell>
  )
}
