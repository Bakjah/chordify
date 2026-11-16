import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChordDiagram from '../../components/chord/ChordDiagram.jsx'
import PageShell from '../../components/layout/PageShell.jsx'
import SearchField from '../../components/search/SearchField.jsx'
import { CHORD_CATEGORIES } from '../../constants/chords.js'
import { getErrorMessage } from '../../services/api.js'
import { chordService } from '../../services/chordService.js'

export default function ChordDictionaryPage() {
  // Kata kunci disimpan di URL supaya hasil pencarian kamus chord bisa dibagikan.
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''

  const setKeyword = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const [category, setCategory] = useState('POPULAR')
  const [chords, setChords] = useState([])
  const [error, setError] = useState('')

  // Saat ada kata kunci, pencarian mengabaikan filter kategori supaya chord
  // yang dicari tetap ditemukan walau tab kategori yang aktif berbeda.
  const categoryFilter = keyword.trim() ? '' : category

  useEffect(() => {
    let active = true
    const timer = setTimeout(async () => {
      try {
        const data = await chordService.list({ q: keyword.trim(), category: categoryFilter })
        if (active) {
          setChords(data)
          setError('')
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Kamus chord tidak dapat dimuat.'))
      }
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [keyword, categoryFilter])

  return (
    <PageShell>
      <div className="mt-[28px] pb-16">
        <h1 className="text-[34px] font-bold leading-[46px] text-app-text">Chord Dictionary</h1>
        <p className="text-[15px] leading-[22px] text-app-muted">
          Learn guitar chord shapes, finger positions, and variations.
        </p>

        <SearchField
          value={keyword}
          onChange={setKeyword}
          onSubmit={() => setKeyword(keyword)}
          placeholder="Search a chord (e.g. Cmaj7, F#m, B7)"
          className="h-[50px] w-[680px] rounded-[10px] bg-app-card pl-[22px]"
          inputClassName="text-[14px]"
        />

        <div className="mt-[31px] flex gap-[26px]">
          {CHORD_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`font-mono text-[11px] leading-[20px] ${
                !keyword.trim() && category === item ? 'text-app-text' : 'text-app-accent'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {error && <p className="mt-[16px] text-[13px] text-app-muted">{error}</p>}

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
