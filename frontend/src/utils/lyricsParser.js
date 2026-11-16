// Mengubah blok teks "chord di atas lirik" menjadi pasangan chord + baris lirik
// yang dipakai backend, dan sebaliknya.
//
// Format teks: baris yang isinya hanya nama chord dianggap sebagai chord untuk
// baris lirik di bawahnya. Tanda kurung siku boleh dipakai, jadi "[G]" sama
// dengan "G".
//
// Chord yang ditulis di dalam baris lirik (misal "teks [G] lanjut") tidak
// diangkat ke baris di atasnya, karena posisinya menentukan; chord seperti ini
// ditampilkan menyatu di tempatnya.
const CHORD_PATTERN = /^[A-G][#b]?(\/[A-G][#b]?)?(m|maj|min|sus|dim|aug|add\d+|\d+)*$/

// Chord di dalam kurung siku, misalnya "[G]" atau "[Am7]".
const INLINE_CHORD_PATTERN = /\[([^\]\n]{1,12})\]/g

function isChordLine(line) {
  const cleaned = line.replace(/^\[/, '').replace(/\]$/, '').trim()
  return cleaned.length > 0 && CHORD_PATTERN.test(cleaned)
}

/**
 * Memecah baris lirik jadi segmen teks dan segmen chord.
 *
 * <p>Segmen chord dipakai untuk menampilkan chord hijau tepat di posisi aslinya,
 * tanpa kurung siku.
 *
 * @param {string} line satu baris lirik
 * @returns {{type: 'text'|'chord', value: string}[]} segmen baris
 */
export function splitInlineChords(line) {
  const text = String(line || '')
  const segments = []
  let lastIndex = 0

  for (const match of text.matchAll(INLINE_CHORD_PATTERN)) {
    const value = match[1].trim()
    if (!CHORD_PATTERN.test(value)) continue
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'chord', value })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return segments
}

/**
 * Memecah teks editor menjadi daftar baris lirik beserta chord-nya.
 *
 * @param {string} text isi textarea
 * @returns {{chord: string, line: string}[]} baris yang siap dikirim ke API
 */
export function parseLyrics(text) {
  const rows = []
  let pendingChord = ''

  for (const raw of String(text || '').split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (isChordLine(line)) {
      pendingChord = line.replace(/^\[/, '').replace(/\]$/, '').trim()
      continue
    }
    rows.push({ chord: pendingChord, line })
    pendingChord = ''
  }

  // Chord di baris terakhir tidak punya baris lirik di bawahnya, jadi
  // dikaitkan ke baris lirik terakhir yang belum punya chord.
  if (pendingChord && rows.length > 0 && !rows[rows.length - 1].chord) {
    rows[rows.length - 1].chord = pendingChord
  }

  return rows
}

/**
 * Menyusun baris lirik kembali menjadi teks editor.
 *
 * @param {{chord: string, line: string}[]} lyrics baris dari API
 * @returns {string} teks siap diletakkan di textarea
 */
export function formatLyrics(lyrics) {
  return (lyrics || [])
    .map(({ chord, line }) => (chord ? `[${chord}]\n${line}` : line))
    .join('\n')
}
