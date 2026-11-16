import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { getErrorMessage } from '../../services/api.js'
import { userService } from '../../services/userService.js'

function formatMonth(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function PublicContributorProfilePage() {
  const { username = 'bagja' } = useParams()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    userService
      .profile(username)
      .then((data) => {
        if (active) {
          setProfile(data)
          setError('')
        }
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Profil tidak dapat dimuat.'))
      })
    return () => {
      active = false
    }
  }, [username])

  const verified = profile?.verified
  const badge = verified ? `✓ VERIFIED ${(profile.verifiedCategory || 'MEMBER').toUpperCase()}` : 'CHORDIFY CONTRIBUTOR'

  return (
    <div className="-mt-[76px]">
      <section className="relative h-[340px] w-full bg-[#203a32]">
        <div className="absolute left-[49px] top-[155px] flex size-[132px] items-center justify-center rounded-[66px] bg-[#315a52]">
          <span className="font-display text-[55px] font-bold leading-[80px] text-white">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>

        <p className="absolute left-[219px] top-[160px] font-mono text-[10px] font-bold leading-[20px] text-[#1ed760]">
          CHORDIFY CONTRIBUTOR
        </p>
        <h1 className="absolute left-[219px] top-[188px] text-[36px] font-bold leading-[52px] text-white">
          {username}
        </h1>

        <div className="absolute left-[219px] top-[238px] h-[28px] w-[230px] rounded-[14px] bg-[#183c55]">
          <p className="ml-[13px] font-mono text-[10px] font-bold leading-[20px] text-[#60a5fa]">
            {badge}
          </p>
        </div>

        <p className="absolute left-[219px] top-[286px] text-[13px] leading-[20px] text-white">
          {profile?.bio || 'Guitar enthusiast sharing chords and discovering new music.'}
        </p>
      </section>

      <div className="pl-[49px] pr-[75px] pb-16">
        {error && <p className="mt-[24px] text-[13px] text-app-muted">{error}</p>}

        <p className="mt-[30px] font-mono text-[11px] font-medium leading-[20px] text-app-muted">
          {profile?.contributions ?? 0} CONTRIBUTIONS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MEMBER SINCE{' '}
          {formatMonth(profile?.memberSince).toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
          {profile?.favorites ?? 0} FAVORITES
        </p>

        <h2 className="mt-[45px] text-[22px] font-bold leading-[32px] text-app-text">
          Songs contributed
        </h2>

        <div className="mt-[18px] flex flex-col gap-[18px]">
          {(profile?.songs || []).map((song) => (
            <div key={song.id} className="relative h-[72px] w-[1080px] rounded-[10px] bg-app-card">
              <p className="absolute left-[22px] top-[15px] text-[14px] font-semibold leading-[20px] text-app-text">
                {song.title} — {song.artist}
              </p>
              <p className="absolute left-[22px] top-[41px] text-[11px] leading-[20px] text-app-muted">
                Guitar chords&nbsp; • &nbsp;Updated recently
              </p>
              <Link
                to={ROUTES.SONG_DETAIL(song.id)}
                className="absolute right-[20px] top-[28px] font-mono text-[10px] font-medium leading-[20px] text-app-accent"
              >
                VIEW SONG&nbsp; →
              </Link>
            </div>
          ))}

          {profile && profile.songs.length === 0 && (
            <p className="text-[13px] leading-[20px] text-app-muted">
              Belum ada lagu yang dipublish.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
