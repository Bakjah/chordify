import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import { ROUTES } from '../../constants/routes.js'
import { getErrorMessage } from '../../services/api.js'
import { songService } from '../../services/songService.js'
import { CHORD_KEYS } from '../../utils/chordTransposer.js'
import { parseLyrics } from '../../utils/lyricsParser.js'

const GENRE_OPTIONS = ['Pop', 'Pop Rock', 'Rock', 'Indie', 'Alternative', 'Acoustic']
const DIFFICULTY_OPTIONS = ['Beginner', 'Easy', 'Intermediate', 'Advanced']
const KEY_OPTIONS = CHORD_KEYS.flatMap((note) => [`${note} Major`, `${note} Minor`])

// Berkas audio playback yang boleh diunggah, sama dengan yang diterima backend.
const AUDIO_ACCEPT = '.mp3,.mp4,.m4a,.mp4a,.aac,.wav,.ogg,.flac'
const AUDIO_MAX_BYTES = 25 * 1024 * 1024

const FIELD_CLASS =
  'absolute left-[30px] w-[750px] h-[42px] rounded-[8px] bg-app-elevated pl-[16px] text-[11px] leading-[20px] text-app-text outline-none placeholder:text-app-muted'
const LABEL_CLASS =
  'absolute left-[30px] text-[12px] font-medium leading-[20px] text-app-text'

export default function AddSongPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    artist: '',
    genre: '',
    key: '',
    difficulty: 'Beginner',
    lyrics: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [audio, setAudio] = useState(null)

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const pickAudio = (event) => {
    const file = event.target.files?.[0]
    setMessage('')
    if (!file) {
      setAudio(null)
      return
    }
    if (file.size > AUDIO_MAX_BYTES) {
      setAudio(null)
      setMessage('Ukuran audio maksimal 25 MB.')
      return
    }
    setAudio(file)
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const created = await songService.create({
        title: form.title,
        artist: form.artist,
        genre: form.genre,
        key: form.key,
        difficulty: form.difficulty,
        artwork: '#315a52',
        lyrics: parseLyrics(form.lyrics),
      })
      // Audio diunggah setelah lagu dibuat, karena endpointnya butuh id lagu.
      if (audio) {
        await songService.uploadMedia(created.id, audio)
      }
      navigate(ROUTES.CONTRIBUTIONS)
    } catch (err) {
      setMessage(getErrorMessage(err, 'Lagu tidak dapat dikirim.'))
      setSaving(false)
    }
  }

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[32px] font-bold leading-[46px] text-app-text">Contribute a Song</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          Share an accurate, guitar-ready version with fellow musicians.
        </p>

        <div className="mt-[25px] flex gap-[30px]">
          <form className="relative h-[830px] w-[820px] rounded-[14px] bg-app-card" onSubmit={submit}>
            <p className="absolute left-[30px] top-[25px] font-mono text-[11px] font-bold leading-[20px] text-app-accent">
              SONG DETAILS
            </p>

            <label className={`${LABEL_CLASS} top-[65px]`} htmlFor="song-title">
              Song title
            </label>
            <input
              id="song-title"
              className={`${FIELD_CLASS} top-[89px]`}
              value={form.title}
              onChange={update('title')}
              placeholder="e.g. Separuh Aku"
            />

            <label className={`${LABEL_CLASS} top-[147px]`} htmlFor="song-artist">
              Artist
            </label>
            <input
              id="song-artist"
              className={`${FIELD_CLASS} top-[171px]`}
              value={form.artist}
              onChange={update('artist')}
              placeholder="e.g. NOAH"
            />

            <label className={`${LABEL_CLASS} top-[229px]`} htmlFor="song-genre">
              Genre
            </label>
            <select
              id="song-genre"
              className={`${FIELD_CLASS} top-[253px] appearance-none`}
              value={form.genre}
              onChange={update('genre')}
            >
              <option value="">Choose a genre  ▾</option>
              {GENRE_OPTIONS.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <label className={`${LABEL_CLASS} top-[311px]`} htmlFor="song-key">
              Original key
            </label>
            <select
              id="song-key"
              className={`${FIELD_CLASS} top-[335px] appearance-none`}
              value={form.key}
              onChange={update('key')}
            >
              <option value="">Choose a key  ▾</option>
              {KEY_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            <label className={`${LABEL_CLASS} top-[393px]`} htmlFor="song-difficulty">
              Difficulty
            </label>
            <select
              id="song-difficulty"
              className={`${FIELD_CLASS} top-[417px] appearance-none`}
              value={form.difficulty}
              onChange={update('difficulty')}
            >
              {DIFFICULTY_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}  ▾
                </option>
              ))}
            </select>

            <label className={`${LABEL_CLASS} top-[485px]`} htmlFor="song-lyrics">
              Lyrics &amp; chords
            </label>
            <textarea
              id="song-lyrics"
              className="absolute left-[30px] top-[510px] h-[160px] w-[750px] resize-none rounded-[8px] bg-app-elevated p-[18px] text-[12px] leading-[20px] text-app-text outline-none placeholder:text-app-muted"
              value={form.lyrics}
              onChange={update('lyrics')}
              placeholder={'Place chord names on their own lines above the lyrics,\nor inline in brackets, e.g. "Dan terjadi lagi [G]".\n\n[G]  Add your chord progression here...\n     Write the song lyrics here...'}
            />

            <label className={`${LABEL_CLASS} top-[683px]`} htmlFor="song-audio">
              Audio playback (optional)
            </label>
            <input
              id="song-audio"
              type="file"
              accept={AUDIO_ACCEPT}
              onChange={pickAudio}
              className="absolute left-[30px] top-[707px] w-[420px] text-[11px] text-app-muted file:mr-[12px] file:rounded-[8px] file:bg-app-elevated file:px-[14px] file:py-[10px] file:text-[11px] file:text-app-text"
            />
            {audio && (
              <p className="absolute left-[470px] top-[712px] text-[11px] leading-[20px] text-app-muted">
                {audio.name}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="absolute left-[30px] top-[770px] h-[42px] w-[170px] rounded-[9px] bg-app-accent text-[12px] font-bold leading-[20px] text-app-bg disabled:opacity-60"
            >
              {saving ? 'Publishing…' : 'Publish Song'}
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.CONTRIBUTIONS)}
              className="absolute left-[215px] top-[770px] h-[42px] w-[110px] rounded-[9px] bg-app-elevated text-[12px] font-medium leading-[20px] text-app-text"
            >
              Cancel
            </button>
            {message && (
              <p className="absolute left-[340px] top-[780px] text-[11px] leading-[20px] text-app-muted">
                {message}
              </p>
            )}
          </form>

          <aside className="relative h-[205px] w-[260px] rounded-[12px] bg-app-card">
            <p className="absolute left-[22px] top-[25px] font-mono text-[10px] font-bold leading-[20px] text-app-accent">
              GOOD CONTRIBUTIONS
            </p>
            <ul className="absolute left-[22px] top-[57px] text-[13px] leading-[26px] text-app-muted">
              <li>• Double-check the original key</li>
              <li>• Keep chords aligned with lyrics</li>
              <li>• Use clear section labels</li>
              <li>• Credit the original artist</li>
            </ul>
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
