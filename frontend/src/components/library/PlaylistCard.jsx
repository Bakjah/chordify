// Kartu playlist/setlist: artwork 78px + judul + jumlah lagu.
// Seluruh div kartu bisa diklik untuk membuka daftar lagunya di dalam kartu,
// sama seperti kartu lagu di My Favorites yang link-nya menutupi penuh kartu.
export default function PlaylistCard({
  title,
  songs,
  artwork,
  expanded = false,
  onToggle,
  onDelete,
  children,
}) {
  // Area daftar lagu yang sudah terbuka punya link dan tombol sendiri, jadi
  // klik di sana tidak boleh ikut membuka/menutup kartu.
  const stop = (event) => event.stopPropagation()

  const open = () => {
    if (onToggle) onToggle()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          open()
        }
      }}
      className="w-[250px] cursor-pointer rounded-[12px] bg-app-card p-[12px] transition-colors hover:bg-app-elevated"
    >
      <div className="flex items-start gap-[10px]">
        <span
          className="size-[78px] shrink-0 rounded-[8px]"
          style={{ backgroundColor: artwork }}
        />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold leading-[20px] text-app-text">
            {title}
          </span>
          <span className="block text-[11px] leading-[20px] text-app-muted">{songs} songs</span>
        </span>

        {onDelete && (
          <button
            type="button"
            onClick={(event) => {
              stop(event)
              onDelete()
            }}
            aria-label={`Hapus ${title}`}
            className="h-[24px] w-[24px] shrink-0 rounded-[6px] text-[13px] leading-[24px] text-app-muted hover:bg-app-elevated hover:text-[#ef4444]"
          >
            ×
          </button>
        )}
      </div>

      {expanded && (
        <div onClick={stop} className="mt-[10px] border-t border-app-border pt-[6px]">
          {children}
        </div>
      )}
    </div>
  )
}
