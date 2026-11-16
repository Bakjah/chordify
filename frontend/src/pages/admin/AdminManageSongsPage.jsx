import { useCallback, useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { getErrorMessage } from '../../services/api.js'
import { adminService } from '../../services/adminService.js'

const COLUMNS = [
  { key: 'title', label: 'SONG TITLE' },
  { key: 'artist', label: 'ARTIST' },
  { key: 'genre', label: 'GENRE' },
  { key: 'contributor', label: 'CONTRIBUTOR' },
  { key: 'created', label: 'CREATED' },
  { key: 'status', label: 'STATUS' },
]

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminManageSongsPage() {
  const [songs, setSongs] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await adminService.listSongs()
      setSongs(data || [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Daftar lagu tidak dapat dimuat.'))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const changeStatus = async (id, status) => {
    try {
      await adminService.setSongStatus(id, status)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Status lagu tidak dapat diubah.'))
    }
  }

  const rows = songs.map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    genre: song.genre,
    contributor: song.contributor,
    created: formatDate(song.createdAt),
    status: song.status,
  }))

  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Songs
        </h1>
        {error && <p className="mt-[12px] text-[13px] text-app-muted">{error}</p>}
        <AdminTable
          columns={COLUMNS}
          rows={rows}
          searchPlaceholder="⌕  Search manage songs..."
          renderActions={(row) =>
            row.status === 'PUBLISHED' ? (
              <button
                type="button"
                onClick={() => changeStatus(row.id, 'REJECTED')}
                className="font-mono text-[9px] text-[#ef4444]"
              >
                REJECT
              </button>
            ) : (
              <button
                type="button"
                onClick={() => changeStatus(row.id, 'PUBLISHED')}
                className="font-mono text-[9px] text-app-accent"
              >
                PUBLISH
              </button>
            )
          }
        />
      </div>
    </PageShell>
  )
}
