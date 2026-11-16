import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../../components/layout/PageShell.jsx'
import { ROUTES } from '../../constants/routes.js'
import { getErrorMessage } from '../../services/api.js'
import { contributionService } from '../../services/contributionService.js'
import { songService } from '../../services/songService.js'

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function MyContributionsPage() {
  const [songs, setSongs] = useState([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(async () => {
    try {
      const data = await contributionService.mine({ page: 0, size: 50 })
      setSongs(data.content || [])
      setTotal(data.totalElements || 0)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Kontribusi tidak dapat dimuat.'))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const removeSong = async (id) => {
    setDeleting(id)
    try {
      await songService.remove(id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Lagu tidak dapat dihapus.'))
    } finally {
      setDeleting(null)
    }
  }

  const published = songs.filter((song) => song.status === 'PUBLISHED').length
  const drafts = songs.length - published

  const stats = [
    { label: 'Total Songs', value: String(total) },
    { label: 'Published', value: String(published) },
    { label: 'Drafts', value: String(drafts) },
  ]

  return (
    <PageShell>
      <div className="relative mt-[28px] pb-16">
        <h1 className="text-[34px] font-bold leading-[46px] text-app-text">My Contributions</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          Manage the songs you've shared with the community.
        </p>

        <Link
          to={ROUTES.ADD_SONG}
          className="absolute right-0 top-[29px] flex h-[46px] w-[220px] items-center justify-center rounded-[10px] bg-app-accent text-[13px] font-bold text-app-bg"
        >
          +&nbsp; Add New Song
        </Link>

        {error && <p className="mt-[12px] text-[13px] text-app-muted">{error}</p>}

        <div className="mt-[35px] flex gap-[20px]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative h-[95px] w-[210px] rounded-[12px] bg-app-card"
            >
              <p className="absolute left-[20px] top-[15px] text-[28px] font-bold leading-[41px] text-app-text">
                {stat.value}
              </p>
              <p className="absolute left-[20px] top-[55px] text-[11px] leading-[20px] text-app-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-[45px] text-[20px] font-bold leading-[29px] text-app-text">
          Your submitted songs
        </h2>

        {songs.length === 0 ? (
          <p className="mt-[16px] text-[13px] leading-[20px] text-app-muted">
            Belum ada lagu yang kamu sumbangkan.
          </p>
        ) : (
          <div className="mt-[16px] flex flex-col gap-[19px]">
            {songs.map((song) => (
              <div
                key={song.id}
                className="relative h-[86px] w-[1110px] rounded-[10px] bg-app-card"
              >
                <p className="absolute left-[22px] top-[17px] text-[15px] font-semibold leading-[22px] text-app-text">
                  {song.title} — {song.artist}
                </p>
                <p className="absolute left-[22px] top-[45px] text-[11px] leading-[20px] text-app-muted">
                  Added {formatDate(song.createdAt)}&nbsp; • &nbsp;Guitar chords
                </p>

                <div className="absolute left-[630px] top-[25px] h-[30px] w-[100px] rounded-[15px] bg-[#183c29]">
                  <p className="font-mono text-[9px] font-bold leading-[20px] text-app-accent">
                    <span className="ml-[16px]">{song.status}</span>
                  </p>
                </div>

                <div className="absolute right-[30px] top-[35px] flex gap-[26px] text-[11px] font-medium leading-[20px] text-app-muted">
                  <Link to={ROUTES.EDIT_SONG(song.id)} className="hover:text-app-text">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeSong(song.id)}
                    disabled={deleting === song.id}
                    className="hover:text-app-text disabled:opacity-50"
                  >
                    {deleting === song.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
