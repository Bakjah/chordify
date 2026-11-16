import { useState } from 'react'

// Posisi kolom tetap untuk semua tabel admin (offset relatif container tabel).
const COLUMN_OFFSETS = [20, 290, 450, 590, 760, 940]
const VALUE_OFFSETS = [30, 300, 460, 600, 770, 950]

const STATUS_TONES = {
  PUBLISHED: 'text-app-accent',
  ACTIVE: 'text-app-accent',
  VERIFIED: 'text-app-accent',
  APPROVED: 'text-app-accent',
  RESOLVED: 'text-app-accent',
  OPEN: 'text-[#fbbf24]',
  PENDING: 'text-[#fbbf24]',
  REVIEWED: 'text-app-muted',
  NONE: 'text-app-muted',
  DISMISSED: 'text-app-muted',
  REJECTED: 'text-[#ef4444]',
}

export default function AdminTable({ columns, rows, searchPlaceholder, renderActions }) {
  const [keyword, setKeyword] = useState('')

  const visible = rows.filter((row) =>
    columns.some((column) =>
      String(row[column.key] ?? '').toLowerCase().includes(keyword.trim().toLowerCase())
    )
  )

  // Aksi di kolom paling kanan. Kalau tabel sudah memakai enam kolom,
  // slot terakhir dipakai STATUS, jadi aksi digeser ke kanan supaya tidak tumpang tindih.
  // Kalau kolomnya lebih sedikit, aksi diletakkan sesudah kolom terakhir.
  const actionOffset = columns.length > 5 ? 1015 : VALUE_OFFSETS[columns.length - 1] + 190

  return (
    <div className="mt-[15px]">
      <div className="flex gap-[20px]">
        <div className="flex h-[44px] w-[500px] items-center rounded-[8px] bg-app-card px-[18px]">
          <span className="text-[12px] text-app-muted">⌕</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={searchPlaceholder}
            className="ml-[10px] w-full bg-transparent text-[12px] text-app-text outline-none placeholder:text-app-muted"
          />
        </div>
        <button
          type="button"
          className="h-[44px] w-[160px] rounded-[8px] bg-app-card text-[12px] font-medium leading-[20px] text-app-text"
        >
          Filters&nbsp; ▾
        </button>
      </div>

      <div className="relative mt-[26px] w-[1110px] rounded-[12px] bg-app-card pb-[90px]">
        {columns.map((column, index) => (
          <p
            key={column.key}
            className="absolute top-[22px] font-mono text-[9px] leading-[20px] text-app-muted"
            style={{ left: `${COLUMN_OFFSETS[index]}px` }}
          >
            {column.label}
          </p>
        ))}

        <div className="mt-[16px] flex flex-col gap-[8px] px-[15px]">
          {visible.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`relative h-[68px] w-[1080px] rounded-[7px] ${
                rowIndex % 2 === 0 ? 'bg-app-elevated' : 'bg-app-card'
              }`}
            >
              {columns.map((column, index) => {
                const value = row[column.key]
                const tone = STATUS_TONES[value] || 'text-app-text'
                return (
                  <p
                    key={column.key}
                    className={`absolute top-[25px] text-[11px] leading-[20px] ${tone}`}
                    style={{ left: `${VALUE_OFFSETS[index] - 15}px` }}
                  >
                    {value}
                  </p>
                )
              })}

              {renderActions && (
                <div
                  className="absolute top-[24px] flex gap-[8px]"
                  style={{ left: `${actionOffset - 15}px` }}
                >
                  {renderActions(row)}
                </div>
              )}
            </div>
          ))}

          {visible.length === 0 && (
            <p className="py-[40px] text-center text-[12px] leading-[20px] text-app-muted">
              Tidak ada data yang cocok.
            </p>
          )}
        </div>

        <div className="absolute bottom-[20px] left-[20px] flex w-[1070px] items-center justify-between">
          <p className="font-mono text-[10px] leading-[20px] text-app-muted">
            Showing 1–{visible.length} of {visible.length}
          </p>
          <div className="flex items-center gap-[20px] font-mono text-[10px] leading-[20px] text-app-muted">
            <span>‹</span>
            <span className="text-app-accent">1</span>
            <span>2</span>
            <span>3</span>
            <span>›</span>
          </div>
        </div>
      </div>
    </div>
  )
}
