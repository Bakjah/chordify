// Data chord contoh untuk Chord Dictionary. Nanti diganti backend /api/chords.
export const CHORD_CATEGORIES = ['POPULAR', 'MAJOR', 'MINOR', '7TH', 'SUSPENDED', 'ADD9']

export const CHORDS = [
  {
    id: 'c-major',
    name: 'C Major',
    symbol: 'C',
    category: 'MAJOR',
    fingers: [
      { string: 1, fret: 3 },
      { string: 2, fret: 2 },
      { string: 3, fret: 1 },
      { string: 5, fret: 1 },
    ],
  },
  {
    id: 'g-major',
    name: 'G Major',
    symbol: 'G',
    category: 'MAJOR',
    fingers: [
      { string: 0, fret: 3 },
      { string: 1, fret: 2 },
      { string: 4, fret: 3 },
      { string: 5, fret: 3 },
    ],
  },
  {
    id: 'd-major',
    name: 'D Major',
    symbol: 'D',
    category: 'MAJOR',
    fingers: [
      { string: 2, fret: 2 },
      { string: 3, fret: 3 },
      { string: 4, fret: 2 },
      { string: 5, fret: 2 },
    ],
  },
  {
    id: 'a-minor',
    name: 'A Minor',
    symbol: 'Am',
    category: 'MINOR',
    fingers: [
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 1 },
      { string: 5, fret: 1 },
    ],
  },
  {
    id: 'e-minor',
    name: 'E Minor',
    symbol: 'Em',
    category: 'MINOR',
    fingers: [
      { string: 0, fret: 2 },
      { string: 1, fret: 3 },
      { string: 2, fret: 2 },
    ],
  },
  {
    id: 'f-major',
    name: 'F Major',
    symbol: 'F',
    category: 'MAJOR',
    fingers: [
      { string: 0, fret: 1 },
      { string: 1, fret: 3 },
      { string: 2, fret: 3 },
      { string: 3, fret: 3 },
      { string: 4, fret: 2 },
      { string: 5, fret: 1 },
    ],
  },
]
