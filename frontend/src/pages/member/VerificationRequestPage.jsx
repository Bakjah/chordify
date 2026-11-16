import { useEffect, useState } from 'react'
import PageShell from '../../components/layout/PageShell.jsx'
import { VERIFICATION_CATEGORIES } from '../../constants/library.js'
import { getErrorMessage } from '../../services/api.js'
import { verificationService } from '../../services/verificationService.js'

const STATUS_STYLE = {
  PENDING: { chip: 'bg-[#493a1b]', text: 'text-[#fbbf24]' },
  APPROVED: { chip: 'bg-[#183c29]', text: 'text-app-accent' },
  REJECTED: { chip: 'bg-[#4a1f1f]', text: 'text-[#ef4444]' },
}

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

export default function VerificationRequestPage() {
  const [category, setCategory] = useState('Verified Musician')
  const [proof, setProof] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [applications, setApplications] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadApplications = () =>
    verificationService
      .mine()
      .then(setApplications)
      .catch(() => {
        // Gagal memuat riwayat tidak boleh menutupi form pengajuan.
      })

  useEffect(() => {
    loadApplications()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!proof.trim() && !proofUrl.trim()) {
      setError('Isi minimal salah satu: deskripsi bukti atau tautan bukti.')
      return
    }
    setSubmitting(true)
    setError('')
    setNotice('')
    try {
      await verificationService.submit({ category, proof: proof.trim(), proofUrl: proofUrl.trim() })
      setProof('')
      setProofUrl('')
      setNotice('Pengajuan terkirim dan sedang ditinjau admin.')
      await loadApplications()
    } catch (err) {
      setError(getErrorMessage(err, 'Pengajuan gagal dikirim.'))
    } finally {
      setSubmitting(false)
    }
  }

  const latest = applications[0]
  const statusStyle = latest ? STATUS_STYLE[latest.status] || STATUS_STYLE.PENDING : null

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[32px] font-bold leading-[46px] text-app-text">
          Get your verified badge
        </h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          Help the community recognize your musical identity.
        </p>

        <div className="mt-[30px] flex gap-[30px]">
          <form className="relative h-[680px] w-[760px] rounded-[14px] bg-app-card" onSubmit={handleSubmit}>
            <p className="absolute left-[30px] top-[30px] font-mono text-[10px] font-bold leading-[20px] text-app-accent">
              VERIFICATION CATEGORY
            </p>

            {VERIFICATION_CATEGORIES.map((item, index) => {
              const selected = category === item
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`absolute left-[30px] flex h-[42px] w-[690px] items-center rounded-[8px] px-[18px] text-[12px] font-medium leading-[20px] ${
                    selected ? 'bg-[#183c29] text-app-accent' : 'bg-app-elevated text-app-text'
                  }`}
                  style={{ top: `${60 + index * 54}px` }}
                >
                  {selected ? '◉' : '○'}&nbsp; {item}
                </button>
              )
            })}

            <label
              className="absolute left-[30px] top-[295px] text-[12px] font-medium leading-[20px] text-app-text"
              htmlFor="proof-description"
            >
              Proof description
            </label>
            <textarea
              id="proof-description"
              value={proof}
              onChange={(event) => setProof(event.target.value)}
              placeholder="Describe your role, official releases, or musical credits."
              className="absolute left-[30px] top-[320px] h-[70px] w-[690px] resize-none rounded-[8px] bg-app-elevated p-[16px] text-[12px] leading-[20px] text-app-text outline-none placeholder:text-app-muted"
            />

            <label
              className="absolute left-[30px] top-[410px] text-[12px] font-medium leading-[20px] text-app-text"
              htmlFor="proof-url"
            >
              Proof URL
            </label>
            <input
              id="proof-url"
              value={proofUrl}
              onChange={(event) => setProofUrl(event.target.value)}
              placeholder="https://official-website.com/artist"
              className="absolute left-[30px] top-[435px] h-[42px] w-[690px] rounded-[8px] bg-app-elevated pl-[16px] text-[11px] leading-[20px] text-app-text outline-none placeholder:text-app-muted"
            />

            <button
              type="submit"
              disabled={submitting}
              className="absolute left-[30px] top-[510px] h-[44px] w-[190px] rounded-[9px] bg-app-accent text-[12px] font-bold leading-[20px] text-app-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>

            {error && (
              <p className="absolute left-[30px] top-[566px] text-[11px] leading-[18px] text-[#ef4444]">{error}</p>
            )}
            {notice && (
              <p className="absolute left-[30px] top-[566px] text-[11px] leading-[18px] text-app-accent">{notice}</p>
            )}
          </form>

          <div className="flex flex-col gap-[25px]">
            <aside className="relative h-[210px] w-[320px] rounded-[12px] bg-app-card">
              <p className="absolute left-[24px] top-[26px] font-mono text-[10px] font-bold leading-[20px] text-app-accent">
                HOW IT WORKS
              </p>
              <ol className="absolute left-[24px] top-[60px] text-[13px] leading-[26px] text-app-muted">
                <li>1. Choose the category that fits.</li>
                <li>2. Add credible proof and links.</li>
                <li>3. Admin reviews your request.</li>
                <li>4. Approved badges appear publicly.</li>
              </ol>
            </aside>

            <aside className="relative h-[150px] w-[320px] rounded-[12px] bg-app-card">
              <p className="absolute left-[24px] top-[23px] font-mono text-[10px] font-bold leading-[20px] text-app-muted">
                CURRENT APPLICATION
              </p>
              {latest && statusStyle ? (
                <>
                  <div className={`absolute left-[24px] top-[55px] h-[28px] rounded-[14px] px-[19px] ${statusStyle.chip}`}>
                    <p className={`font-mono text-[9px] font-bold leading-[28px] ${statusStyle.text}`}>
                      {latest.status}
                    </p>
                  </div>
                  <p className="absolute left-[24px] top-[93px] text-[10px] leading-[20px] text-app-muted">
                    Submitted {formatDate(latest.createdAt)}
                  </p>
                  {latest.adminNote && (
                    <p className="absolute left-[24px] top-[113px] w-[272px] text-[10px] leading-[16px] text-app-muted">
                      {latest.adminNote}
                    </p>
                  )}
                </>
              ) : (
                <p className="absolute left-[24px] top-[58px] text-[11px] leading-[20px] text-app-muted">
                  Belum ada pengajuan.
                </p>
              )}
            </aside>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
