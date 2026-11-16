import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { ADMIN_VERIFICATION_ROWS } from '../../constants/mockLibrary.js'

const COLUMNS = [
  { key: 'applicant', label: 'APPLICANT' },
  { key: 'category', label: 'CATEGORY' },
  { key: 'proof', label: 'PROOF' },
  { key: 'submitted', label: 'SUBMITTED' },
  { key: 'status', label: 'STATUS' },
]

export default function AdminManageVerificationPage() {
  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Verification
        </h1>
        <AdminTable
          columns={COLUMNS}
          rows={ADMIN_VERIFICATION_ROWS}
          searchPlaceholder="⌕  Search manage verification..."
        />
      </div>
    </PageShell>
  )
}
