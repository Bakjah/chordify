// Kartu playlist/setlist: artwork 78px + judul + jumlah lagu.
export default function PlaylistCard({ title, songs, artwork }) {
  return (
    <div className="relative h-[105px] w-[250px] rounded-[12px] bg-app-card">
      <div
        className="absolute left-[12px] top-[12px] size-[78px] rounded-[8px]"
        style={{ backgroundColor: artwork }}
      />
      <p className="absolute left-[105px] top-[25px] text-[14px] font-semibold leading-[20px] text-app-text">
        {title}
      </p>
      <p className="absolute left-[105px] top-[51px] text-[11px] leading-[20px] text-app-muted">
        {songs} songs
      </p>
    </div>
  )
}
