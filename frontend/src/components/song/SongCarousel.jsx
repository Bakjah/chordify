import { useCallback, useEffect, useRef, useState } from 'react'

// Jarak geser satu klik: lebar satu kartu (205px) + jarak antar kartu (20px).
const STEP = 225

const ARROW_BUTTON =
  'flex size-[30px] items-center justify-center rounded-full bg-app-card text-[16px] leading-none text-app-text transition-colors hover:bg-app-elevated disabled:opacity-35 disabled:hover:bg-app-card'

/**
 * Baris kartu lagu yang digeser mendatar.
 *
 * Track-nya melebar sampai tepi kanan halaman, jadi kartu yang banyak bisa
 * digeser pakai tombol ‹ dan › alih-alih menekan kolom yang tersembunyi.
 */
export default function SongCarousel({ title, action, children }) {
  const trackRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const start = el.scrollLeft <= 4
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
  }, [])

  // Pengukuran ulang tiap render: jumlah kartu bisa berubah setelah data
  // dari server masuk atau setelah difilter.
  useEffect(sync)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined
    const onScroll = () => sync()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sync])

  const scrollBy = (direction) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * STEP, behavior: 'smooth' })
  }

  return (
    <section>
      <div className="flex items-start justify-between">
        <h2 className="text-[22px] font-bold leading-[32px] text-app-text">{title}</h2>
        <div className="flex items-center gap-[10px]">
          {action}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={edges.start}
            aria-label="Geser ke kiri"
            className={ARROW_BUTTON}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={edges.end}
            aria-label="Geser ke kanan"
            className={ARROW_BUTTON}
          >
            ›
          </button>
        </div>
      </div>

      {/* Padding kanan halaman dikembalikan di dalam track supaya baris kartu
          bisa menjulang sampai tepi kanan layar. */}
      <div
        ref={trackRef}
        className="no-scrollbar -mr-[60px] mt-[8px] flex gap-[20px] overflow-x-auto scroll-smooth pr-[60px]"
      >
        {children}
      </div>
    </section>
  )
}
