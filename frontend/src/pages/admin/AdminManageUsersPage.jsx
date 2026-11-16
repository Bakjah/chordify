import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { ADMIN_USERS_ROWS } from '../../constants/mockLibrary.js'

const COLUMNS = [
  { key: 'username', label: 'USERNAME' },
  { key: 'email', label: 'EMAIL' },
  { key: 'role', label: 'ROLE' },
  { key: 'verification', label: 'VERIFICATION' },
  { key: 'joined', label: 'JOINED' },
  { key: 'status', label: 'STATUS' },
]

export default function AdminManageUsersPage() {
  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Users
        </h1>
        <AdminTable
          columns={COLUMNS}
          rows={ADMIN_USERS_ROWS}
          searchPlaceholder="⌕  Search manage users..."
        />
      </div>
    </PageShell>
  )
}
