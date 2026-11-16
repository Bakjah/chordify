*TOPIK TUBES PBO*

*Chordify – Your Personal Guitar Chord Library*

*1. Gambaran Umum Aplikasi*

Chordify merupakan aplikasi berbasis web yang berfungsi sebagai platform perpustakaan chord gitar dan komunitas musik. Aplikasi ini memungkinkan pengguna mencari lagu, melihat lirik beserta chord gitar, melakukan transpose chord, serta menyimpan koleksi lagu pribadi.

Pengguna juga dapat berkontribusi dengan menambahkan chord lagu dan memiliki profil publik. Chordify menyediakan sistem *Verified User* untuk memberikan tanda verifikasi kepada artis, pencipta lagu, dan musisi yang telah disetujui oleh admin.

Teknologi yang digunakan:

* Frontend: React.js
* Styling: Tailwind CSS
* Backend: Java Spring Boot
* Database: MySQL

*2. Fitur Aplikasi*

1. Registrasi, login, dan logout.
2. Menampilkan dan mencari lagu berdasarkan judul, artis, dan genre.
3. Menampilkan lirik dan chord gitar.
4. Transpose chord dan pengaturan capo.
5. Chord Dictionary dan diagram gitar.
6. Menyimpan lagu ke Favorites.
7. Membuat Playlist dan Setlist.
8. Melihat riwayat lagu.
9. Menambahkan, mengedit, dan menghapus kontribusi lagu.
10. Public User Profile.
11. Pengajuan Verified User.
12. Report System.
13. Admin Dashboard untuk mengelola lagu, pengguna, laporan, dan verifikasi.

*3. Use Case Diagram*

Terdapat tiga aktor utama:

*Guest:*

* Melihat lagu.
* Mencari lagu.
* Membaca chord.
* Menggunakan fitur transpose.
* Melihat profil publik.

*Member:*

* Seluruh fitur Guest.
* Mengelola Favorites.
* Membuat dan mengelola Playlist.
* Membuat dan mengelola Setlist.
* Melihat riwayat lagu.
* Menambahkan, mengedit, dan menghapus kontribusi lagu sendiri.
* Melaporkan lagu.
* Mengajukan Verified User.

*Admin:*

* Mengelola seluruh lagu.
* Mengelola artis dan genre.
* Mengelola pengguna.
* Mengelola laporan.
* Menyetujui atau menolak pengajuan verifikasi.

*4. ERD (Entity Relationship Diagram)*

Entitas utama:

1. Users
2. Songs
3. Artists
4. Genres
5. Favorites
6. Playlists
7. Playlist_Songs
8. Setlists
9. Setlist_Songs
10. Song_History
11. Reports
12. Verification_Requests

Relasi utama:

* Users berelasi dengan Songs, Favorites, Playlists, Setlists, Song_History, Reports, dan Verification_Requests.
* Songs berelasi dengan Artists, Genres, dan Reports.
* Playlists berelasi dengan Songs melalui Playlist_Songs.
* Setlists berelasi dengan Songs melalui Setlist_Songs.

*5. Class Diagram*

Class utama:

1. User
2. Member
3. Admin
4. Song
5. Artist
6. Genre
7. Chord
8. Playlist
9. Setlist
10. Favorite
11. SongHistory
12. Report
13. VerificationRequest

Penerapan konsep PBO:

* Encapsulation
* Inheritance
* Polymorphism
* Abstraction
* Interface
* Constructor
* Method Overloading
* Method Overriding