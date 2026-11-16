import { useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { getErrorMessage } from '../../services/api.js'
import { REPORT_CATEGORIES, reportService } from '../../services/reportService.js'

const CATEGORY_LABELS = Object.fromEntries(REPORT_CATEGORIES.map((item) => [item.value, item.label]))

const COLUMNS = [
  { key: 'category', label: 'REPORT CATEGORY' },
  { key: 'song', label: 'REPORTED SONG' },
  { key: 'reporter', label: 'REPORTER' },
  { key: 'submitted', label: 'SUBMITTED' },
  { key: 'status', label: 'STATUS' },
]

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'

export default function AdminManageReportsPage() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    try {
      const data = await reportService.adminList()
      setRows(data)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Laporan gagal dimuat.'))
    }
  }

  useEffect(() => {
    load()
  }, [])

  const review = async (id, status) => {
    setBusyId(id)
    try {
      await reportService.adminReview(id, { status, note: '' })
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Laporan gagal diperbarui.'))
    } finally {
      setBusyId(null)
    }
  }

  const tableRows = rows.map((row) => ({
    id: row.id,
    category: CATEGORY_LABELS[row.category] || row.category,
    song: row.songTitle,
    reporter: `@${row.reporter}`,
    submitted: formatDate(row.createdAt),
    status: row.status,
  }))

  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Reports
        </h1>
        {error && <p className="mt-[10px] text-[12px] leading-[20px] text-[#ef4444]">{error}</p>}
        <AdminTable
          columns={COLUMNS}
          rows={tableRows}
          searchPlaceholder="⌕  Search manage reports..."
          renderActions={(row) =>
            row.status === 'OPEN' ? (
              <>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => review(row.id, 'RESOLVED')}
                  className="rounded-[6px] bg-[#183c29] px-[10px] py-[5px] text-[10px] font-semibold leading-[16px] text-app-accent disabled:opacity-50"
                >
                  Resolve
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => review(row.id, 'DISMISSED')}
                  className="rounded-[6px] bg-[#333333] px-[10px] py-[5px] text-[10px] font-semibold leading-[16px] text-app-muted disabled:opacity-50"
                >
                  Dismiss
                </button>
              </>
            ) : null
          }
        />
      </div>
    </PageShell>
  )
}
