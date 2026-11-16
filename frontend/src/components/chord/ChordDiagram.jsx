// Diagram senar gitar: 6 senar, 5 fret. Titik hijau menandai posisi jari.
// fingers: [{ string: 0..5 (senar paling rendah ke tertinggi), fret: 1..5 }]
const STRINGS = 6
const FRETS = 5
const STRING_GAP = 20
const FRET_GAP = 22
const DOT_SIZE = 13

export default function ChordDiagram({ fingers = [], width = 100, height = 88 }) {
  const nutX = (width - STRING_GAP * (STRINGS - 1)) / 2

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      {Array.from({ length: STRINGS }).map((_, index) => (
        <line
          key={`string-${index}`}
          x1={nutX + index * STRING_GAP}
          y1={0}
          x2={nutX + index * STRING_GAP}
          y2={height}
          stroke="#6b6b6b"
          strokeWidth={1.5}
        />
      ))}

      {Array.from({ length: FRETS + 1 }).map((_, index) => (
        <line
          key={`fret-${index}`}
          x1={nutX}
          y1={index * FRET_GAP}
          x2={nutX + STRING_GAP * (STRINGS - 1)}
          y2={index * FRET_GAP}
          stroke="#6b6b6b"
          strokeWidth={1.5}
        />
      ))}

      {fingers.map((finger) => {
        const cx = nutX + finger.string * STRING_GAP
        const cy = (finger.fret - 1) * FRET_GAP + FRET_GAP / 2
        return (
          <circle
            key={`${finger.string}-${finger.fret}`}
            cx={cx}
            cy={cy}
            r={DOT_SIZE / 2}
            fill="#1db954"
          />
        )
      })}
    </svg>
  )
}
