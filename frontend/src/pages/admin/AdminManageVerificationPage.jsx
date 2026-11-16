import { useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { getErrorMessage } from '../../services/api.js'
import { verificationService } from '../../services/verificationService.js'

const COLUMNS = [
  { key: 'applicant', label: 'APPLICANT' },
  { key: 'category', label: 'CATEGORY' },
  { key: 'proof', label: 'PROOF' },
  { key: 'submitted', label: 'SUBMITTED' },
  { key: 'status', label: 'STATUS' },
]

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'

export default function AdminManageVerificationPage() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    try {
      const data = await verificationService.adminList()
      setRows(data)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Pengajuan gagal dimuat.'))
    }
  }

  useEffect(() => {
    load()
  }, [])

  const review = async (id, status) => {
    setBusyId(id)
    try {
      await verificationService.adminReview(id, { status, note: '' })
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Pengajuan gagal diperbarui.'))
    } finally {
      setBusyId(null)
    }
  }

  const tableRows = rows.map((row) => ({
    id: row.id,
    applicant: `@${row.applicant}`,
    category: row.category.replace('Verified ', ''),
    proof: row.proofUrl || 'Proof link',
    submitted: formatDate(row.createdAt),
    status: row.status,
  }))

  return (
    <PageShell>
      <div className="pb-16">
        <h1 className="mt-[28px] text-[32px] font-bold leading-[46px] text-app-text">
          Manage Verification
        </h1>
        {error && <p className="mt-[10px] text-[12px] leading-[20px] text-[#ef4444]">{error}</p>}
        <AdminTable
          columns={COLUMNS}
          rows={tableRows}
          searchPlaceholder="⌕  Search manage verification..."
          renderActions={(row) =>
            row.status === 'PENDING' ? (
              <>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => review(row.id, 'APPROVED')}
                  className="rounded-[6px] bg-[#183c29] px-[10px] py-[5px] text-[10px] font-semibold leading-[16px] text-app-accent disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => review(row.id, 'REJECTED')}
                  className="rounded-[6px] bg-[#4a1f1f] px-[10px] py-[5px] text-[10px] font-semibold leading-[16px] text-[#ef4444] disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            ) : null
          }
        />
      </div>
    </PageShell>
  )
}
