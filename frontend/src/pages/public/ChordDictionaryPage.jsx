import { useMemo, useState } from 'react'
import ChordDiagram from '../../components/chord/ChordDiagram.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import { CHORD_CATEGORIES, CHORDS } from '../../constants/mockChords.js'

export default function ChordDictionaryPage() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('POPULAR')

  const chords = useMemo(() => {
    const query = keyword.trim().toLowerCase()
    return CHORDS.filter((chord) => {
      const matchQuery =
        !query || chord.name.toLowerCase().includes(query) || chord.symbol.toLowerCase().includes(query)
      const matchCategory = category === 'POPULAR' || chord.category === category
      return matchQuery && matchCategory
    })
  }, [keyword, category])

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[34px] font-bold leading-[46px] text-app-text">Chord Dictionary</h1>
        <p className="text-[15px] leading-[22px] text-app-muted">
          Learn guitar chord shapes, finger positions, and variations.
        </p>

        <div className="mt-[22px] flex h-[50px] w-[680px] items-center rounded-[10px] bg-app-card pl-[22px]">
          <span className="text-[14px] text-app-muted">⌕</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search a chord (e.g. Cmaj7, F#m, B7)"
            className="ml-[10px] w-full bg-transparent text-[14px] text-app-text outline-none placeholder:text-app-muted"
          />
        </div>

        <div className="mt-[31px] flex gap-[26px]">
          {CHORD_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`font-mono text-[11px] leading-[20px] ${
                category === item ? 'text-app-text' : 'text-app-accent'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-[25px] grid grid-cols-3 gap-x-[30px] gap-y-[35px]">
          {chords.map((chord) => (
            <div key={chord.id} className="relative h-[235px] w-[335px] rounded-[14px] bg-app-card">
              <p className="absolute left-[22px] top-[18px] text-[18px] font-semibold leading-[26px] text-app-text">
                {chord.name}
              </p>
              <p className="absolute left-[22px] top-[50px] font-mono text-[14px] leading-[20px] text-app-accent">
                {chord.symbol}
              </p>

              <div className="absolute left-[115px] top-[82px]">
                <ChordDiagram fingers={chord.fingers} />
              </div>

              <p className="absolute left-[22px] top-[190px] font-mono text-[11px] leading-[20px] text-app-muted">
                1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
