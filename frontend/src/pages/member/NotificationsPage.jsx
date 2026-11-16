import { useCallback, useEffect, useState } from 'react'
import PageShell from '../../components/layout/PageShell.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { getErrorMessage } from '../../services/api.js'
import { notificationService } from '../../services/notificationService.js'

function formatTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState('ALL')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const { refresh } = useNotifications()

  const load = useCallback(async (unreadOnly) => {
    try {
      const data = await notificationService.list({ unread: unreadOnly })
      setItems(data || [])
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Notifikasi tidak dapat dimuat.'))
    }
  }, [])

  useEffect(() => {
    load(filter === 'UNREAD')
  }, [filter, load])

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      await load(filter === 'UNREAD')
      await refresh()
    } catch (err) {
      setError(getErrorMessage(err, 'Notifikasi tidak dapat ditandai.'))
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      await load(filter === 'UNREAD')
      await refresh()
    } catch (err) {
      setError(getErrorMessage(err, 'Notifikasi tidak dapat ditandai.'))
    }
  }

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[32px] font-bold leading-[46px] text-app-text">Notifications</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          Updates about your contributions and community activity.
        </p>

        <div className="mt-[35px] flex items-center gap-[26px]">
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

          <button
            type="button"
            onClick={markAllAsRead}
            className="font-mono text-[11px] leading-[20px] text-app-muted hover:text-app-text"
          >
            MARK ALL READ
          </button>
        </div>

        {error && <p className="mt-[16px] text-[13px] text-app-muted">{error}</p>}

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
                {formatTime(item.createdAt)}
              </p>
              {item.unread ? (
                <button
                  type="button"
                  onClick={() => markAsRead(item.id)}
                  className="absolute right-[40px] top-[39px] font-mono text-[9px] font-medium leading-[20px] text-app-accent"
                >
                  MARK READ
                </button>
              ) : (
                <p className="absolute right-[40px] top-[39px] font-mono text-[9px] font-medium leading-[20px] text-app-muted">
                  READ
                </p>
              )}
            </div>
          ))}

          {items.length === 0 && !error && (
            <p className="text-[13px] leading-[20px] text-app-muted">Belum ada notifikasi.</p>
          )}
        </div>
      </div>
    </PageShell>
  )
}
