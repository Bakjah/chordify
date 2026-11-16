import { useState } from 'react'
import PageShell from '../../components/layout/PageShell.jsx'
import { NOTIFICATIONS } from '../../constants/mockLibrary.js'

export default function NotificationsPage() {
  const [filter, setFilter] = useState('ALL')
  const items = filter === 'UNREAD' ? NOTIFICATIONS.filter((item) => item.unread) : NOTIFICATIONS

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[32px] font-bold leading-[46px] text-app-text">Notifications</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          Updates about your contributions and community activity.
        </p>

        <div className="mt-[35px] flex gap-[26px]">
          {['ALL', 'UNREAD'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`font-mono text-[11px] leading-[20px] ${
                filter === item ? 'text-app-accent' : 'text-app-muted'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-[25px] flex flex-col gap-[18px]">
          {items.map((item) => (
            <div key={item.id} className="relative h-[94px] w-[1110px] rounded-[10px] bg-app-card">
              <div
                className={`absolute left-[20px] top-[24px] size-[10px] rounded-[5px] ${
                  item.unread ? 'bg-app-accent' : 'bg-app-muted'
                }`}
              />
              <p className="absolute left-[50px] top-[17px] text-[14px] font-semibold leading-[20px] text-app-text">
                {item.title}
              </p>
              <p className="absolute left-[50px] top-[44px] text-[12px] leading-[20px] text-app-muted">
                {item.body}
              </p>
              <p className="absolute left-[50px] top-[69px] text-[10px] leading-[20px] text-app-muted">
                {item.time}
              </p>
              <p
                className={`absolute right-[40px] top-[39px] font-mono text-[9px] font-medium leading-[20px] ${
                  item.unread ? 'text-app-accent' : 'text-app-muted'
                }`}
              >
                {item.unread ? 'UNREAD' : 'READ'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
