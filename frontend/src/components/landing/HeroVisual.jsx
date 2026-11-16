import VinylRecord from './VinylRecord.jsx'

// Sisi kanan landing: glow hijau + vinyl + 2 kartu mengambang (koordinat relatif terhadap glow 620px).
export default function HeroVisual() {
  return (
    <div className="relative hidden h-[680px] w-[620px] shrink-0 lg:block" aria-hidden="true">
      <div className="absolute left-0 top-0 h-[620px] w-[620px] rounded-full bg-chord-green/20" />

      <div className="absolute left-[-10px] top-[145px]">
        <VinylRecord />
      </div>

      <div className="absolute left-[40px] top-[110px] h-[100px] w-[270px] rounded-2xl bg-chord-surface px-[22px] py-[18px] shadow-lg shadow-black/30">
        <p className="text-[10px] font-bold tracking-wide text-chord-green">NOW PLAYING</p>
        <p className="mt-[6px] text-[19px] font-semibold leading-tight text-chord-text">Midnight City</p>
        <p className="mt-[6px] text-[11px] text-chord-muted">M83 &nbsp;•&nbsp; Synth-pop</p>
      </div>

      <div className="absolute left-[240px] top-[585px] h-[74px] w-[245px] rounded-[14px] bg-chord-surface px-5 py-4 shadow-lg shadow-black/30">
        <p className="text-sm font-semibold text-chord-text">Made for musicians</p>
        <p className="mt-[6px] text-[10px] text-chord-muted">Learn • Share • Grow</p>
      </div>
    </div>
  )
}
