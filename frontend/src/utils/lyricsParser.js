// Mengubah blok teks "chord di atas lirik" menjadi pasangan chord + baris lirik
// yang dipakai backend, dan sebaliknya.
//
// Format teks: baris yang isinya hanya nama chord dianggap sebagai chord untuk
// baris lirik di bawahnya. Tanda kurung siku boleh dipakai, jadi "[G]" sama
// dengan "G".
const CHORD_PATTERN = /^[A-G][#b]?(\/[A-G][#b]?)?(m|maj|min|sus|dim|aug|add\d+|\d+)*$/

function isChordLine(line) {
  const cleaned = line.replace(/^\[/, '').replace(/\]$/, '').trim()
  return cleaned.length > 0 && CHORD_PATTERN.test(cleaned)
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
