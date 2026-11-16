import { useState } from 'react'
import { useParams } from 'react-router-dom'

const CHORD_CHIPS = ['B', 'F#', 'G#m', 'E']

const FIELD =
  'absolute h-[48px] rounded-[8px] border border-white/5 bg-[#1f1f1f] pl-[14px] text-[14px] leading-[20px] text-app-text outline-none focus:border-app-accent'

// Frame Figma "Desktop / 08 Edit Song" memakai sidebar & top bar sendiri.
// Di sini shell aplikasi tetap dipakai (sidebar 236px + top bar), hanya isi
// form yang mengikuti desain frame tersebut, digeser agar sinkron dengan sidebar.
export default function EditSongPage() {
  const { id } = useParams()
  const [chords, setChords] = useState(CHORD_CHIPS)

  return (
    <div className="relative h-[964px]">
      <p className="absolute left-[38px] top-[36px] font-mono text-[10px] font-medium leading-[20px] text-app-muted">
        CONTRIBUTOR WORKSPACE
      </p>
      <h1 className="absolute left-[38px] top-[60px] text-[32px] font-bold leading-[46px] text-app-text">
        Edit song
      </h1>
      <p className="absolute left-[38px] top-[105px] text-[14px] leading-[20px] text-app-muted">
        Update the song details, chords, and lyrics before submitting your changes.
      </p>

      <div className="absolute right-[0px] top-[61px] h-[30px] w-[92px] rounded-[15px] bg-app-card">
        <p className="mt-[5px] text-center text-[12px] font-medium leading-[20px] text-app-muted">
          DRAFT
        </p>
      </div>
      <button
        type="button"
        className="absolute right-[100px] top-[55px] h-[42px] w-[92px] rounded-[9px] bg-app-card text-[13px] font-medium leading-[20px] text-app-text"
      >
        Preview
      </button>
      <button
        type="button"
        className="absolute right-[0px] top-[55px] h-[42px] w-[92px] rounded-[9px] bg-app-accent text-[13px] font-medium leading-[20px] text-app-bg"
      >
        Save changes
      </button>

      {/* Song details */}
      <section className="absolute left-[38px] top-[148px] h-[286px] w-[724px] rounded-[14px] bg-app-card">
        <h2 className="absolute left-[24px] top-[24px] text-[16px] font-semibold leading-[23px] text-app-text">
          Song details
        </h2>
        <p className="absolute left-[24px] top-[49px] text-[12px] leading-[20px] text-app-muted">
          Keep the song information accurate and easy to discover.
        </p>

        <label className="absolute left-[24px] top-[80px] text-[12px] leading-[20px] text-app-text" htmlFor="edit-title">
          Song title
        </label>
        <input id="edit-title" className={`${FIELD} left-[24px] top-[104px] w-[330px]`} defaultValue="Yellow" />

        <label className="absolute left-[378px] top-[80px] text-[12px] leading-[20px] text-app-text" htmlFor="edit-artist">
          Artist / band
        </label>
        <input id="edit-artist" className={`${FIELD} left-[378px] top-[104px] w-[322px]`} defaultValue="Coldplay" />

        <label className="absolute left-[24px] top-[182px] text-[12px] leading-[20px] text-app-text" htmlFor="edit-key">
          Original key
        </label>
        <select id="edit-key" className={`${FIELD} left-[24px] top-[206px] w-[190px] appearance-none`} defaultValue="B major">
          <option>B major</option>
          <option>C major</option>
          <option>G major</option>
        </select>
        <span className="absolute left-[184px] top-[218px] text-[17px] text-app-muted">⌄</span>

        <label className="absolute left-[234px] top-[182px] text-[12px] leading-[20px] text-app-text" htmlFor="edit-capo">
          Capo
        </label>
        <input id="edit-capo" className={`${FIELD} left-[234px] top-[206px] w-[130px]`} defaultValue="4" />

        <label className="absolute left-[384px] top-[182px] text-[12px] leading-[20px] text-app-text" htmlFor="edit-tuning">
          Tuning
        </label>
        <select id="edit-tuning" className={`${FIELD} left-[384px] top-[206px] w-[316px] appearance-none`} defaultValue="Standard (E A D G B E)">
          <option>Standard (E A D G B E)</option>
          <option>Drop D</option>
          <option>Half step down</option>
        </select>
        <span className="absolute left-[670px] top-[218px] text-[17px] text-app-muted">⌄</span>
      </section>

      {/* Submission details */}
      <aside className="absolute left-[782px] top-[148px] h-[286px] w-[370px] rounded-[14px] bg-app-card">
        <p className="absolute left-[24px] top-[24px] font-mono text-[11px] leading-[20px] text-app-muted">
          SUBMISSION DETAILS
        </p>
        <p className="absolute left-[24px] top-[49px] text-[18px] font-semibold leading-[26px] text-app-text">
          Version 1.2
        </p>
        <p className="absolute left-[24px] top-[76px] text-[12px] leading-[20px] text-app-muted">
          Edited just now · by you
        </p>

        <div className="absolute left-[24px] top-[118px] h-px w-[322px] bg-app-border" />

        <p className="absolute left-[24px] top-[138px] font-mono text-[10px] leading-[20px] text-app-muted">
          REVIEW STATUS
        </p>
        <div className="absolute left-[24px] top-[165px] h-[30px] w-[210px] rounded-[15px] bg-[#124726]">
          <span className="absolute left-[12px] top-[11px] size-[8px] rounded-full bg-app-accent" />
          <p className="ml-[28px] text-[12px] leading-[20px] text-app-accent">Changes not submitted</p>
        </div>
        <p className="absolute left-[24px] top-[214px] text-[12px] leading-[20px] text-app-muted">
          Your edits stay in draft until you submit them.
        </p>
        <p className="absolute left-[24px] top-[252px] text-[12px] leading-[20px] text-app-accent">
          View contribution history →
        </p>
      </aside>

      {/* Chord progression */}
      <section className="absolute left-[38px] top-[454px] h-[152px] w-[724px] rounded-[14px] bg-app-card">
        <h2 className="absolute left-[24px] top-[24px] text-[16px] font-semibold leading-[23px] text-app-text">
          Chord progression
        </h2>
        <p className="absolute left-[24px] top-[49px] text-[12px] leading-[20px] text-app-muted">
          Add the chord sequence used throughout the song.
        </p>

        <div className="absolute left-[24px] top-[82px] flex gap-[16px]">
          {chords.map((chord) => (
            <button
              key={chord}
              type="button"
              onClick={() => setChords((prev) => prev.filter((item) => item !== chord))}
              className="h-[42px] w-[78px] rounded-[8px] bg-[#1b1b1b] text-[17px] leading-[42px] text-app-text"
            >
              {chord}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setChords((prev) => [...prev, 'Am'])}
            className="h-[42px] w-[106px] rounded-[8px] bg-[#124726] text-[12px] leading-[42px] text-app-accent"
          >
            + Add chord
          </button>
        </div>

        <p className="absolute left-[24px] top-[130px] text-[11px] leading-[20px] text-app-muted">
          Tip: use the chord names exactly as they appear above the lyrics.
        </p>
      </section>

      {/* Lyrics editor */}
      <section className="absolute left-[38px] top-[626px] h-[286px] w-[724px] rounded-[14px] bg-app-card">
        <h2 className="absolute left-[24px] top-[22px] text-[16px] font-semibold leading-[23px] text-app-text">
          Lyrics &amp; chords
        </h2>
        <p className="absolute left-[24px] top-[47px] text-[12px] leading-[20px] text-app-muted">
          Use chord markers above the lyric line they belong to.
        </p>

        <div className="absolute left-[24px] top-[72px] flex h-[40px] w-[676px] items-center gap-[12px] rounded-[7px] bg-[#1b1b1b] px-[16px]">
          <button type="button" className="text-[15px] font-bold leading-[20px] text-app-text">B</button>
          <button type="button" className="text-[15px] font-bold italic leading-[20px] text-app-text">I</button>
          <button type="button" className="font-mono text-[13px] leading-[20px] text-app-text">[♬]</button>
          <span className="text-[14px] leading-[20px] text-app-muted">|</span>
          <button type="button" className="text-[17px] leading-[20px] text-app-muted">↶</button>
          <button type="button" className="text-[17px] leading-[20px] text-app-muted">↷</button>
          <span className="ml-auto font-mono text-[9px] leading-[20px] text-app-muted">
            CHORD / LYRICS EDITOR
          </span>
        </div>

        <div className="absolute left-[24px] top-[124px] h-[132px] w-[676px] rounded-[8px] bg-[#1b1b1b] px-[30px] py-[18px]">
          <p className="text-[16px] leading-[24px] text-app-accent">B</p>
          <p className="text-[14px] leading-[25px] text-app-text">
            Look at the stars, look how they shine for you
          </p>
          <p className="text-[16px] leading-[24px] text-app-accent">F#</p>
          <p className="text-[16px] leading-[24px] text-app-accent">G#m</p>
          <p className="text-[14px] leading-[25px] text-app-text">And everything you do</p>
        </div>
      </section>

      {/* Live preview */}
      <aside className="absolute left-[782px] top-[454px] h-[458px] w-[370px] rounded-[14px] bg-app-card">
        <p className="absolute left-[24px] top-[24px] font-mono text-[11px] leading-[20px] text-app-muted">
          LIVE PREVIEW
        </p>

        <div className="absolute left-[24px] top-[54px] h-[146px] w-[322px] rounded-[10px] bg-[#124726]">
          <div className="absolute left-[20px] top-[16px] size-[56px] rounded-[8px] bg-[#1c633d]" />
          <div className="absolute left-[104px] top-[16px] size-[56px] rounded-[8px] bg-[#29874f]" />
          <div className="absolute left-[188px] top-[16px] h-[74px] w-[114px] rounded-[8px] bg-[#144f30]" />
        </div>

        <p className="absolute left-[24px] top-[220px] text-[20px] font-semibold leading-[29px] text-app-text">
          Yellow
        </p>
        <p className="absolute left-[24px] top-[249px] text-[12px] leading-[20px] text-app-muted">
          Coldplay
        </p>

        <div className="absolute left-[24px] top-[285px] h-[30px] w-[112px] rounded-[15px] bg-[#1b1b1b]">
          <p className="ml-[12px] font-mono text-[12px] leading-[20px] text-app-muted">
            KEY&nbsp; B MAJOR
          </p>
        </div>
        <div className="absolute left-[148px] top-[285px] h-[30px] w-[88px] rounded-[15px] bg-[#1b1b1b]">
          <p className="ml-[12px] font-mono text-[12px] leading-[20px] text-app-muted">CAPO&nbsp; 4</p>
        </div>

        <div className="absolute left-[24px] top-[332px] h-px w-[322px] bg-app-border" />

        <p className="absolute left-[24px] top-[350px] font-mono text-[9px] leading-[20px] text-app-muted">
          CHORD PROGRESSION
        </p>
        <p className="absolute left-[24px] top-[377px] text-[15px] leading-[22px] text-app-text">
          {chords.join('  ·  ')}
        </p>
      </aside>

      <p className="absolute left-[38px] top-[932px] text-[11px] leading-[20px] text-app-muted">
        All changes are saved locally as a draft until submitted.
      </p>
      <p className="sr-only">Editing song {id}</p>
    </div>
  )
}
