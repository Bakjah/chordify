import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { ADMIN_SONGS_ROWS } from '../../constants/mockLibrary.js'

const COLUMNS = [
  { key: 'title', label: 'SONG TITLE' },
  { key: 'artist', label: 'ARTIST' },
  { key: 'genre', label: 'GENRE' },
  { key: 'contributor', label: 'CONTRIBUTOR' },
  { key: 'created', label: 'CREATED' },
  { key: 'status', label: 'STATUS' },
]

export default function AdminManageSongsPage() {
  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Songs
        </h1>
        <AdminTable
          columns={COLUMNS}
          rows={ADMIN_SONGS_ROWS}
          searchPlaceholder="⌕  Search manage songs..."
        />
      </div>
    </PageShell>
  )
}
