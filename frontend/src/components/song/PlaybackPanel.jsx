import { useEffect, useRef, useState } from 'react'

// Format durasi jadi menit:detik, misalnya "04:26".
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

// Panel PLAYBACK di halaman detail lagu. Kalau lagu punya berkas audio, panel
// ini memutar filenya: play/pause, mundur/maju 10 detik, atur kecepatan, dan
// progress bar yang bisa diklik untuk pindah posisi.
export default function PlaybackPanel({ song }) {
  const audioRef = useRef(null)
  const barRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loop, setLoop] = useState(false)
  const [rate, setRate] = useState(1)

  const src = song?.audio || null

  // Ganti lagu: posisi putar kembali ke awal.
  useEffect(() => {
    setPlaying(false)
    setTime(0)
    setDuration(0)
  }, [src])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }

  const skip = (seconds) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration || 0)
  }

  const seek = (event) => {
    const audio = audioRef.current
    const bar = barRef.current
    if (!audio || !bar || !duration) return
    const bounds = bar.getBoundingClientRect()
    const ratio = (event.clientX - bounds.left) / bounds.width
    audio.currentTime = Math.min(Math.max(ratio, 0), 1) * duration
  }

  const cycleRate = () => {
    const next = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 0.75 : 1
    setRate(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  if (!src) {
    return (
      <div className="h-[130px] rounded-[14px] bg-app-card px-[29px] pt-[24px]">
        <p className="text-[8px] font-bold leading-[14px] text-[#9e9e9e]">PLAYBACK</p>
        <p className="mt-[10px] text-[11px] leading-[16px] text-app-muted">
          Belum ada audio untuk lagu ini.
        </p>
      </div>
    )
  }

  const ratio = duration > 0 ? Math.min(time / duration, 1) : 0

  return (
    <div className="h-[150px] rounded-[14px] bg-app-card px-[29px] pt-[24px]">
      <p className="text-[8px] font-bold leading-[14px] text-[#9e9e9e]">PLAYBACK</p>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        loop={loop}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
      />

      <div className="mt-[4px] flex items-center justify-between">
        <span className="text-[9px] font-semibold leading-[14px] text-[#f5f5f5]">
          {formatTime(time)}
        </span>
        <span className="text-[9px] font-semibold leading-[14px] text-[#9e9e9e]">
          {formatTime(duration)}
        </span>
      </div>

      <div
        ref={barRef}
        onClick={seek}
        role="slider"
        aria-label="Posisi pemutaran"
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration)}
        aria-valuenow={Math.floor(time)}
        tabIndex={0}
        className="relative mt-[4px] h-[3px] w-full cursor-pointer rounded-[2px] bg-[#303030]"
      >
        <div
          className="h-[3px] rounded-[2px] bg-[#1cb954]"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <div className="mt-[13px] flex items-center justify-between px-[7px]">
        <button
          type="button"
          onClick={() => skip(-10)}
          aria-label="Mundur 10 detik"
          className="text-[12px] font-bold leading-[16px] text-[#f5f5f5]"
        >
          |◀
        </button>
        <button
          type="button"
          onClick={cycleRate}
          aria-label="Kecepatan pemutaran"
          className="text-[9px] font-semibold leading-[16px] text-[#9e9e9e]"
        >
          {rate}×
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Jeda' : 'Putar'}
          className="flex size-[40px] items-center justify-center rounded-full bg-[#1cb954] text-[18px] font-bold leading-none text-white"
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <button
          type="button"
          onClick={() => skip(10)}
          aria-label="Maju 10 detik"
          className="text-[12px] font-bold leading-[16px] text-[#f5f5f5]"
        >
          ▶|
        </button>
        <button
          type="button"
          onClick={() => setLoop((value) => !value)}
          aria-label="Ulangi"
          className={`text-[17px] font-bold leading-[16px] ${loop ? 'text-[#1cb954]' : 'text-[#9e9e9e]'}`}
        >
          ↻
        </button>
      </div>
    </div>
  )
}
