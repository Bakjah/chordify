// Penanda halaman yang belum diimplementasi. Hapus saat halaman asli dibuat.
export default function PlaceholderPage({ title, figma }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-chord-bg p-8 text-center">
      <p className="text-xs font-bold tracking-wide text-chord-green">COMING SOON</p>
      <h1 className="text-3xl font-bold text-chord-text">{title}</h1>
      {figma && <p className="text-sm text-chord-muted">Figma: {figma}</p>}
    </div>
  )
}
