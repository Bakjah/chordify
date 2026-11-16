// Data contoh untuk halaman member & admin. Backend belum jadi.
export const LIBRARY_TABS = ['Favorites', 'Playlists', 'Setlists', 'Recently Viewed']

export const FAVORITE_SONGS = [
  { id: 'separuh-aku', title: 'Separuh Aku', artist: 'NOAH', artwork: '#315a52' },
  { id: 'kangen', title: 'Kangen', artist: 'Dewa 19', artwork: '#6b3d3d' },
  { id: 'komang', title: 'Komang', artist: 'Raim Laode', artwork: '#745d36' },
  { id: 'evaluasi', title: 'Evaluasi', artist: 'Hindia', artwork: '#3e4f72' },
]

export const PLAYLISTS = [
  { id: 'late-night', title: 'Late Night Acoustic', songs: 12, artwork: '#315a52' },
  { id: 'indonesian-rock', title: 'Indonesian Rock', songs: 28, artwork: '#6b3d3d' },
  { id: 'practice-set', title: 'Practice Set', songs: 8, artwork: '#3e4f72' },
]

export const SETLISTS = [
  { id: 'acoustic-evening', title: 'Acoustic Evening', songs: 9, artwork: '#315a52' },
  { id: 'warmup-routine', title: 'Warm-up Routine', songs: 6, artwork: '#745d36' },
]

export const RECENTLY_VIEWED = [
  { id: 'sempurna', title: 'Sempurna', artist: 'Andra and The Backbone', artwork: '#745d36' },
  { id: 'akad', title: 'Akad', artist: 'Payung Teduh', artwork: '#315a52' },
  { id: 'dan', title: 'Dan', artist: 'Sheila On 7', artwork: '#6b3d3d' },
]

export const CONTRIBUTIONS = [
  { id: 'separuh-aku', title: 'Separuh Aku — NOAH', added: 'Added Oct 12, 2026  •  Guitar chords', status: 'PUBLISHED' },
  { id: 'dan', title: 'Dan — Sheila On 7', added: 'Added Oct 13, 2026  •  Guitar chords', status: 'PUBLISHED' },
  { id: 'kangen', title: 'Kangen — Dewa 19', added: 'Added Oct 14, 2026  •  Guitar chords', status: 'PUBLISHED' },
  { id: 'evaluasi', title: 'Evaluasi — Hindia', added: 'Added Oct 15, 2026  •  Guitar chords', status: 'PUBLISHED' },
]

export const CONTRIBUTION_STATS = [
  { label: 'Total Songs', value: '24' },
  { label: 'Published', value: '21' },
  { label: 'Drafts', value: '3' },
]

export const VERIFICATION_CATEGORIES = [
  'Verified Artist',
  'Verified Songwriter',
  'Verified Band Member',
  'Verified Musician',
]

export const NOTIFICATIONS = [
  {
    id: 'verification',
    title: 'Verification request received',
    body: 'Your Verified Musician application is now pending review.',
    time: 'Just now',
    unread: true,
  },
  {
    id: 'published',
    title: 'Song contribution published',
    body: 'Your song contribution is now available in Song Library.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 'report',
    title: 'Report update',
    body: 'The report you submitted has been reviewed by an admin.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'welcome',
    title: 'Welcome to Chordify',
    body: 'Your account is ready. Start saving songs and building setlists.',
    time: '3 days ago',
    unread: false,
  },
]

export const PROFILE_SONGS = [
  { id: 'separuh-aku', title: 'Separuh Aku — NOAH' },
  { id: 'dan', title: 'Dan — Sheila On 7' },
  { id: 'kangen', title: 'Kangen — Dewa 19' },
  { id: 'evaluasi', title: 'Evaluasi — Hindia' },
]

export const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', marker: '●' },
  { label: 'Manage Songs', to: '/admin/songs', marker: '' },
  { label: 'Manage Artists', to: null, marker: '' },
  { label: 'Manage Genres', to: null, marker: '' },
  { label: 'Manage Users', to: '/admin/users', marker: '' },
  { label: 'Manage Reports', to: '/admin/reports', marker: '' },
  { label: 'Manage Verification', to: '/admin/verification', marker: '' },
]

export const ADMIN_STATS = [
  { label: 'Total Users', value: '12,480' },
  { label: 'Total Songs', value: '8,245' },
  { label: 'Contributions', value: '3,612' },
  { label: 'Open Reports', value: '28' },
  { label: 'Verified Users', value: '146' },
]

export const ADMIN_ACTIVITY = [
  'New member registered — @nadyachords',
  'Song published — Separuh Aku',
  'Verification request — @bagja',
  'Report submitted — Incorrect Chords',
  'Playlist created — Late Night Acoustic',
]

export const ADMIN_QUEUE = [
  { value: '6', label: 'Pending verification' },
  { value: '28', label: 'Open reports' },
  { value: '12', label: 'Song edits flagged' },
]

export const ADMIN_SONGS_ROWS = [
  { title: 'Separuh Aku', artist: 'NOAH', genre: 'Pop Rock', contributor: '@bagja', created: 'Oct 28', status: 'PUBLISHED' },
  { title: 'Dan', artist: 'Sheila On 7', genre: 'Pop', contributor: '@dimas', created: 'Oct 27', status: 'PUBLISHED' },
  { title: 'Kangen', artist: 'Dewa 19', genre: 'Rock', contributor: '@nanda', created: 'Oct 26', status: 'PUBLISHED' },
  { title: 'Komang', artist: 'Raim Laode', genre: 'Pop', contributor: '@nadya', created: 'Oct 25', status: 'PUBLISHED' },
  { title: 'Evaluasi', artist: 'Hindia', genre: 'Alternative', contributor: '@bagja', created: 'Oct 24', status: 'PUBLISHED' },
]

export const ADMIN_USERS_ROWS = [
  { username: '@bagja', email: 'bagja@mail.com', role: 'ADMIN', verification: 'VERIFIED', joined: 'Oct 2026', status: 'ACTIVE' },
  { username: '@nadyachords', email: 'nadya@mail.com', role: 'MEMBER', verification: 'NONE', joined: 'Oct 2026', status: 'ACTIVE' },
  { username: '@dimas', email: 'dimas@mail.com', role: 'MEMBER', verification: 'PENDING', joined: 'Sep 2026', status: 'ACTIVE' },
  { username: '@noahofficial', email: 'team@noah.id', role: 'MEMBER', verification: 'VERIFIED', joined: 'Aug 2026', status: 'ACTIVE' },
  { username: '@guitarist', email: 'user@mail.com', role: 'MEMBER', verification: 'NONE', joined: 'Aug 2026', status: 'ACTIVE' },
]

export const ADMIN_REPORTS_ROWS = [
  { category: 'Incorrect Chords', song: 'Separuh Aku', reporter: '@nadya', submitted: 'Oct 28', status: 'OPEN' },
  { category: 'Duplicate Song', song: 'Dan', reporter: '@dimas', submitted: 'Oct 27', status: 'OPEN' },
  { category: 'Incorrect Lyrics', song: 'Kangen', reporter: '@guitarist', submitted: 'Oct 26', status: 'REVIEWED' },
  { category: 'Spam Content', song: 'Komang', reporter: '@nanda', submitted: 'Oct 25', status: 'OPEN' },
  { category: 'Incorrect Info', song: 'Evaluasi', reporter: '@bagja', submitted: 'Oct 24', status: 'REVIEWED' },
]

export const ADMIN_VERIFICATION_ROWS = [
  { applicant: '@bagja', category: 'Musician', proof: 'Portfolio link', submitted: 'Oct 28', status: 'PENDING' },
  { applicant: '@noahofficial', category: 'Artist', proof: 'Official site', submitted: 'Oct 27', status: 'APPROVED' },
  { applicant: '@dimas', category: 'Songwriter', proof: 'Credits link', submitted: 'Oct 26', status: 'PENDING' },
  { applicant: '@nadyachords', category: 'Musician', proof: 'Social profile', submitted: 'Oct 25', status: 'PENDING' },
  { applicant: '@bandmember', category: 'Band Member', proof: 'Band website', submitted: 'Oct 24', status: 'REJECTED' },
]
