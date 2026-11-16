import { useCallback, useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { getErrorMessage } from '../../services/api.js'
import { adminService } from '../../services/adminService.js'

const COLUMNS = [
  { key: 'username', label: 'USERNAME' },
  { key: 'email', label: 'EMAIL' },
  { key: 'role', label: 'ROLE' },
  { key: 'verification', label: 'VERIFICATION' },
  { key: 'joined', label: 'JOINED' },
  { key: 'status', label: 'STATUS' },
]

function formatMonth(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await adminService.listUsers()
      setUsers(data || [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Daftar pengguna tidak dapat dimuat.'))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleActive = async (id, active) => {
    try {
      await adminService.setUserActive(id, active)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Status pengguna tidak dapat diubah.'))
    }
  }

  const rows = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    verification: user.verification,
    joined: formatMonth(user.joined),
    status: user.status,
  }))

  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Users
        </h1>
        {error && <p className="mt-[12px] text-[13px] text-app-muted">{error}</p>}
        <AdminTable
          columns={COLUMNS}
          rows={rows}
          searchPlaceholder="⌕  Search manage users..."
          renderActions={(row) => (
            <button
              type="button"
              onClick={() => toggleActive(row.id, row.status !== 'ACTIVE')}
              className={`font-mono text-[9px] ${
                row.status === 'ACTIVE' ? 'text-[#ef4444]' : 'text-app-accent'
              }`}
            >
              {row.status === 'ACTIVE' ? 'DEACTIVATE' : 'ACTIVATE'}
            </button>
          )}
        />
      </div>
    </PageShell>
  )
}
