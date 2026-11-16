// Vinyl 420px: ring luar + 5 groove + label hijau berisi "C" (Figma node 64:19 – 64:26).
const GROOVES = [340, 286, 232, 178, 124]

export default function VinylRecord() {
  return (
    <div
      aria-hidden="true"
      className="relative h-[420px] w-[420px] rounded-full border border-chord-border bg-chord-bg/40"
    >
      {GROOVES.map((size) => (
        <span
          key={size}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-chord-border/70"
          style={{ width: size, height: size }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 flex h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-chord-green">
        <span className="text-[46px] font-bold leading-none text-chord-bg">C</span>
      </div>
    </div>
  )
}
