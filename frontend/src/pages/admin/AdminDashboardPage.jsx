import StatCard from '../../components/admin/StatCard.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { ADMIN_ACTIVITY, ADMIN_QUEUE, ADMIN_STATS } from '../../constants/mockLibrary.js'

export default function AdminDashboardPage() {
  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[32px] font-bold leading-[46px] text-app-text">Dashboard overview</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          Monitor platform activity and review community submissions.
        </p>

        <div className="mt-[40px] flex gap-[20px]">
          {ADMIN_STATS.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

        <div className="mt-[35px] flex gap-[25px]">
          <section className="relative h-[390px] w-[690px] rounded-[12px] bg-app-card">
            <h2 className="absolute left-[25px] top-[25px] text-[18px] font-semibold leading-[26px] text-app-text">
              Recent activity
            </h2>
            {ADMIN_ACTIVITY.map((item, index) => (
              <div key={item}>
                <p
                  className="absolute left-[25px] text-[12px] leading-[20px] text-app-text"
                  style={{ top: `${70 + index * 54}px` }}
                >
                  {item}
                </p>
                {index < ADMIN_ACTIVITY.length - 1 && (
                  <div
                    className="absolute left-[25px] h-px w-[610px] bg-app-border"
                    style={{ top: `${99 + index * 54}px` }}
                  />
                )}
              </div>
            ))}
          </section>

          <section className="relative h-[390px] w-[395px] rounded-[12px] bg-app-card">
            <h2 className="absolute left-[25px] top-[25px] text-[18px] font-semibold leading-[26px] text-app-text">
              Needs your attention
            </h2>
            {ADMIN_QUEUE.map((item, index) => (
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
