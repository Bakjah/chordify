import { useEffect, useState } from 'react'
import StatCard from '../../components/admin/StatCard.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { getErrorMessage } from '../../services/api.js'
import { adminService } from '../../services/adminService.js'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    adminService
      .stats()
      .then((data) => {
        if (active) {
          setStats(data)
          setError('')
        }
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Statistik tidak dapat dimuat.'))
      })
    return () => {
      active = false
    }
  }, [])

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Total Songs', value: stats.totalSongs },
        { label: 'Published', value: stats.publishedSongs },
        { label: 'Open Reports', value: stats.openReports },
        { label: 'Verified Users', value: stats.verifiedUsers },
      ]
    : []

  const queue = stats
    ? [
        { value: stats.pendingVerifications, label: 'Pending verification' },
        { value: stats.openReports, label: 'Open reports' },
        { value: stats.pendingSongs, label: 'Songs awaiting review' },
      ]
    : []

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[32px] font-bold leading-[46px] text-app-text">Dashboard overview</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          Monitor platform activity and review community submissions.
        </p>

        {error && <p className="mt-[16px] text-[13px] text-app-muted">{error}</p>}

        <div className="mt-[40px] flex gap-[20px]">
          {cards.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

        <div className="mt-[35px] flex gap-[25px]">
          <section className="relative h-[390px] w-[690px] rounded-[12px] bg-app-card">
            <h2 className="absolute left-[25px] top-[25px] text-[18px] font-semibold leading-[26px] text-app-text">
              Recent activity
            </h2>
            {(stats?.recentActivity || []).map((item, index) => (
              <div key={item}>
                <p
                  className="absolute left-[25px] text-[12px] leading-[20px] text-app-text"
                  style={{ top: `${70 + index * 54}px` }}
                >
                  {item}
                </p>
                {index < stats.recentActivity.length - 1 && (
                  <div
                    className="absolute left-[25px] h-px w-[610px] bg-app-border"
                    style={{ top: `${99 + index * 54}px` }}
                  />
                )}
              </div>
            ))}
            {stats && stats.recentActivity.length === 0 && (
              <p className="absolute left-[25px] top-[70px] text-[12px] leading-[20px] text-app-muted">
                Belum ada aktivitas.
              </p>
            )}
          </section>

          <section className="relative h-[390px] w-[395px] rounded-[12px] bg-app-card">
            <h2 className="absolute left-[25px] top-[25px] text-[18px] font-semibold leading-[26px] text-app-text">
              Needs your attention
            </h2>
            {queue.map((item, index) => (
              <div key={item.label}>
                <p
                  className="absolute left-[25px] text-[25px] font-bold leading-[36px] text-app-accent"
                  style={{ top: `${80 + index * 85}px` }}
                >
                  {item.value}
                </p>
                <p
                  className="absolute left-[95px] text-[12px] leading-[20px] text-app-text"
                  style={{ top: `${88 + index * 85}px` }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </PageShell>
  )
}
