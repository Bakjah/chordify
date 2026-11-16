import { useState } from 'react'
import PlaylistCard from '../../components/library/PlaylistCard.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import {
  FAVORITE_SONGS,
  LIBRARY_TABS,
  PLAYLISTS,
  RECENTLY_VIEWED,
  SETLISTS,
} from '../../constants/mockLibrary.js'

function LibrarySongCard({ song }) {
  return (
    <div className="relative h-[235px] w-[205px] rounded-[12px] bg-app-card">
      <div
        className="absolute left-[12px] top-[12px] h-[120px] w-[181px] rounded-[8px]"
        style={{ backgroundColor: song.artwork }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[36px] leading-[52px] text-white/80">
          ♫
        </span>
      </div>
      <p className="absolute left-[14px] top-[147px] text-[14px] font-semibold leading-[20px] text-app-text">
        {song.title}
      </p>
      <p className="absolute left-[14px] top-[171px] text-[11px] leading-[20px] text-app-muted">
        {song.artist}
      </p>
    </div>
  )
}

export default function PersonalLibraryPage({ initialTab = 'Favorites' }) {
  const [tab, setTab] = useState(initialTab)

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[34px] font-bold leading-[46px] text-app-text">Your Library</h1>
        <p className="text-[14px] leading-[20px] text-app-muted">
          All the songs and setlists you keep close.
        </p>

        <div className="mt-[25px] flex gap-[15px]">
          {LIBRARY_TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`h-[42px] w-[160px] rounded-[9px] text-[13px] font-medium leading-[20px] transition-colors ${
                tab === item
                  ? 'bg-app-accent text-app-bg'
                  : 'bg-app-card text-app-text hover:bg-app-elevated'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === 'Favorites' && (
          <>
            <h2 className="mt-[38px] text-[22px] font-bold leading-[30px] text-app-text">
              My Favorites
            </h2>
            <div className="mt-[10px] flex gap-[20px]">
              {FAVORITE_SONGS.map((song) => (
                <LibrarySongCard key={song.id} song={song} />
              ))}
            </div>

            <h2 className="mt-[45px] text-[22px] font-bold leading-[30px] text-app-text">
              Your Playlists
            </h2>
            <div className="mt-[10px] flex gap-[20px]">
              {PLAYLISTS.map((playlist) => (
                <PlaylistCard key={playlist.id} {...playlist} />
              ))}
            </div>

            <h2 className="mt-[45px] text-[22px] font-bold leading-[30px] text-app-text">
              Your Setlists
            </h2>
            <div className="mt-[10px] flex gap-[20px]">
              {SETLISTS.map((setlist) => (
                <PlaylistCard key={setlist.id} {...setlist} />
              ))}
            </div>
          </>
        )}

        {tab === 'Playlists' && (
          <>
            <h2 className="mt-[38px] text-[22px] font-bold leading-[30px] text-app-text">
              Your Playlists
            </h2>
            <div className="mt-[10px] flex gap-[20px]">
              {PLAYLISTS.map((playlist) => (
                <PlaylistCard key={playlist.id} {...playlist} />
              ))}
            </div>
          </>
        )}

        {tab === 'Setlists' && (
          <>
            <h2 className="mt-[38px] text-[22px] font-bold leading-[30px] text-app-text">
              Your Setlists
            </h2>
            <div className="mt-[10px] flex gap-[20px]">
              {SETLISTS.map((setlist) => (
                <PlaylistCard key={setlist.id} {...setlist} />
              ))}
            </div>
          </>
        )}

        {tab === 'Recently Viewed' && (
          <>
            <h2 className="mt-[38px] text-[22px] font-bold leading-[30px] text-app-text">
              Recently Viewed
            </h2>
            <div className="mt-[10px] flex gap-[20px]">
              {RECENTLY_VIEWED.map((song) => (
                <LibrarySongCard key={song.id} song={song} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageShell>
  )
}
