// Transpose + capo untuk Chord Studio (Song Detail).
// Bergeser nama not dan nada basename/root chord, sisanya (min, sus, dll) tetap.
const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const FLAT_TO_SHARP = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
}

const ROOT_PATTERN = /^([A-G][b#]?)(.*)$/

function toSemitone(note) {
  const normalized = FLAT_TO_SHARP[note] || note
  const index = SHARP_NOTES.indexOf(normalized)
  return index === -1 ? null : index
}

function toNote(semitone) {
  return SHARP_NOTES[((semitone % 12) + 12) % 12]
}

function shiftNote(note, semitones) {
  const base = toSemitone(note)
  if (base === null) return note
  return toNote(base + semitones)
}

export function transposeChord(chord, semitones) {
  if (!chord || !semitones) return chord
  return chord
    .split('/')
    .map((part) => {
      const match = part.match(ROOT_PATTERN)
      if (!match) return part
      return shiftNote(match[1], semitones) + match[2]
    })
    .join('/')
}

// Chord dihitung dari posisi capo: capo adalah fret terendah yang dipetik,
// nada bass yang sebenarnya adalah nada capo dikurangi capo.
export function applyCapo(chord, capo) {
  if (!chord || !capo) return chord
  return chord
    .split('/')
    .map((part) => {
      const match = part.match(ROOT_PATTERN)
      if (!match) return part
      return shiftNote(match[1], -capo) + match[2]
    })
    .join('/')
}

export const CHORD_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function keyLabel(semitone) {
  return `${CHORD_KEYS[((semitone % 12) + 12) % 12]} Major`
}
