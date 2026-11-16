import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { ADMIN_REPORTS_ROWS } from '../../constants/mockLibrary.js'

const COLUMNS = [
  { key: 'category', label: 'REPORT CATEGORY' },
  { key: 'song', label: 'REPORTED SONG' },
  { key: 'reporter', label: 'REPORTER' },
  { key: 'submitted', label: 'SUBMITTED' },
  { key: 'status', label: 'STATUS' },
]

export default function AdminManageReportsPage() {
  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Reports
        </h1>
        <AdminTable
          columns={COLUMNS}
          rows={ADMIN_REPORTS_ROWS}
          searchPlaceholder="⌕  Search manage reports..."
        />
      </div>
    </PageShell>
  )
}
