import api from './api.js'

// Kamus chord: daftar simbol chord beserta diagram jarinya.
export const chordService = {
  // params: { q, category } — category bisa 'POPULAR' atau 'MAJOR', 'MINOR', dll.
  list: (params) => api.get('/chords', { params }).then((r) => r.data),
  // Satu chord berdasarkan simbolnya, misalnya 'Am'.
  detail: (symbol) => api.get(`/chords/${encodeURIComponent(symbol)}`).then((r) => r.data),
  // Chord hasil geser naik/turun.
  transpose: (symbol, semitones) =>
    api
      .get(`/chords/${encodeURIComponent(symbol)}/transpose`, { params: { semitones } })
      .then((r) => r.data),
}
