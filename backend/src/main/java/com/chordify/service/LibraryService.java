package com.chordify.service;

import com.chordify.contract.CollectionEntry;
import com.chordify.dto.LibrarySongResponse;
import com.chordify.dto.PlaylistRequest;
import com.chordify.dto.PlaylistResponse;
import com.chordify.dto.SetlistRequest;
import com.chordify.dto.SetlistResponse;
import com.chordify.exception.ApiException;
import com.chordify.model.Favorite;
import com.chordify.model.Playlist;
import com.chordify.model.PlaylistSong;
import com.chordify.model.Setlist;
import com.chordify.model.SetlistSong;
import com.chordify.model.Song;
import com.chordify.model.SongHistory;
import com.chordify.model.User;
import com.chordify.repository.FavoriteRepository;
import com.chordify.repository.PlaylistRepository;
import com.chordify.repository.PlaylistSongRepository;
import com.chordify.repository.SetlistRepository;
import com.chordify.repository.SetlistSongRepository;
import com.chordify.repository.SongHistoryRepository;
import com.chordify.repository.SongRepository;
import com.chordify.repository.UserRepository;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Library pribadi member: favorit, playlist, setlist, dan riwayat lagu yang
 * terakhir dilihat.
 *
 * <p>Semua data di sini milik satu member — service selalu memfilter berdasarkan
 * pemilik, jadi satu member tidak bisa membaca atau mengubah daftar member lain.
 */
@Service
public class LibraryService {

    /** Batas jumlah riwayat yang dikembalikan. */
    private static final int HISTORY_LIMIT = 50;

    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final FavoriteRepository favoriteRepository;
    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SetlistRepository setlistRepository;
    private final SetlistSongRepository setlistSongRepository;
    private final SongHistoryRepository songHistoryRepository;

    public LibraryService(UserRepository userRepository,
                          SongRepository songRepository,
                          FavoriteRepository favoriteRepository,
                          PlaylistRepository playlistRepository,
                          PlaylistSongRepository playlistSongRepository,
                          SetlistRepository setlistRepository,
                          SetlistSongRepository setlistSongRepository,
                          SongHistoryRepository songHistoryRepository) {
        this.userRepository = userRepository;
        this.songRepository = songRepository;
        this.favoriteRepository = favoriteRepository;
        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.setlistRepository = setlistRepository;
        this.setlistSongRepository = setlistSongRepository;
        this.songHistoryRepository = songHistoryRepository;
    }

    // ---------------------------------------------------------------- favorit

    /** Daftar lagu yang ditandai member sebagai favorit. */
    @Transactional(readOnly = true)
    public List<LibrarySongResponse> listFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(favorite -> LibrarySongResponse.from(favorite.getSong()))
                .toList();
    }

    /** Menandai lagu sebagai favorit. Kalau sudah jadi favorit, tidak diduplikasi. */
    @Transactional
    public LibrarySongResponse addFavorite(Long userId, Long songId) {
        Favorite existing = favoriteRepository.findByUserIdAndSongId(userId, songId).orElse(null);
        if (existing != null) {
            return LibrarySongResponse.from(existing.getSong());
        }
        Favorite favorite = new Favorite(requireUser(userId), requireSong(songId));
        return LibrarySongResponse.from(favoriteRepository.save(favorite).getSong());
    }

    /** Membatalkan status favorit. Lagu yang tidak jadi favorit tidak dianggap error. */
    @Transactional
    public void removeFavorite(Long userId, Long songId) {
        favoriteRepository.findByUserIdAndSongId(userId, songId)
                .ifPresent(favoriteRepository::delete);
    }

    // --------------------------------------------------------------- playlist

    /** Semua playlist milik member, lengkap dengan jumlah lagunya. */
    @Transactional(readOnly = true)
    public List<PlaylistResponse> listPlaylists(Long userId) {
        return playlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(playlist -> PlaylistResponse.from(playlist, playlistSongRepository.countByPlaylistId(playlist.getId())))
                .toList();
    }

    /** Membuat playlist baru. */
    @Transactional
    public PlaylistResponse createPlaylist(Long userId, PlaylistRequest request) {
        Playlist playlist = new Playlist(requireUser(userId), request.title());
        playlist.rename(request.title(), request.description(), request.artwork());
        return PlaylistResponse.from(playlistRepository.save(playlist), 0);
    }

    /** Mengubah judul dan keterangan playlist milik sendiri. */
    @Transactional
    public PlaylistResponse updatePlaylist(Long userId, Long playlistId, PlaylistRequest request) {
        Playlist playlist = requirePlaylist(userId, playlistId);
        playlist.rename(request.title(), request.description(), request.artwork());
        return PlaylistResponse.from(playlist, playlistSongRepository.countByPlaylistId(playlist.getId()));
    }

    /** Menghapus playlist beserta seluruh isinya. */
    @Transactional
    public void deletePlaylist(Long userId, Long playlistId) {
        Playlist playlist = requirePlaylist(userId, playlistId);
        playlistSongRepository.findByPlaylistIdOrderByPositionAsc(playlist.getId())
                .forEach(playlistSongRepository::delete);
        playlistRepository.delete(playlist);
    }

    /** Lagu-lagu di dalam sebuah playlist, menurut urutan member. */
    @Transactional(readOnly = true)
    public List<LibrarySongResponse> listPlaylistSongs(Long userId, Long playlistId) {
        requirePlaylist(userId, playlistId);
        return toLibrarySongs(playlistSongRepository.findByPlaylistIdOrderByPositionAsc(playlistId));
    }

    /** Menambahkan lagu ke playlist. Lagu yang sudah ada tidak diduplikasi. */
    @Transactional
    public void addSongToPlaylist(Long userId, Long playlistId, Long songId) {
        Playlist playlist = requirePlaylist(userId, playlistId);
        Song song = requireSong(songId);
        if (playlistSongRepository.findByPlaylistIdAndSongId(playlist.getId(), songId).isPresent()) {
            return;
        }
        int position = playlistSongRepository.countByPlaylistId(playlist.getId());
        playlistSongRepository.save(new PlaylistSong(playlist, song, position));
    }

    /** Menghapus lagu dari playlist. */
    @Transactional
    public void removeSongFromPlaylist(Long userId, Long playlistId, Long songId) {
        requirePlaylist(userId, playlistId);
        playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songId)
                .ifPresent(playlistSongRepository::delete);
    }

    // ---------------------------------------------------------------- setlist

    /** Semua setlist milik member, lengkap dengan jumlah lagunya. */
    @Transactional(readOnly = true)
    public List<SetlistResponse> listSetlists(Long userId) {
        return setlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(setlist -> SetlistResponse.from(setlist, setlistSongRepository.countBySetlistId(setlist.getId())))
                .toList();
    }

    /** Membuat setlist baru. */
    @Transactional
    public SetlistResponse createSetlist(Long userId, SetlistRequest request) {
        Setlist setlist = new Setlist(requireUser(userId), request.title());
        setlist.rename(request.title(), request.description(), request.artwork());
        return SetlistResponse.from(setlistRepository.save(setlist), 0);
    }

    /** Mengubah judul dan keterangan setlist milik sendiri. */
    @Transactional
    public SetlistResponse updateSetlist(Long userId, Long setlistId, SetlistRequest request) {
        Setlist setlist = requireSetlist(userId, setlistId);
        setlist.rename(request.title(), request.description(), request.artwork());
        return SetlistResponse.from(setlist, setlistSongRepository.countBySetlistId(setlist.getId()));
    }

    /** Menghapus setlist beserta seluruh isinya. */
    @Transactional
    public void deleteSetlist(Long userId, Long setlistId) {
        Setlist setlist = requireSetlist(userId, setlistId);
        setlistSongRepository.findBySetlistIdOrderByPositionAsc(setlist.getId())
                .forEach(setlistSongRepository::delete);
        setlistRepository.delete(setlist);
    }

    /** Lagu-lagu di dalam sebuah setlist, menurut urutan member. */
    @Transactional(readOnly = true)
    public List<LibrarySongResponse> listSetlistSongs(Long userId, Long setlistId) {
        requireSetlist(userId, setlistId);
        return toLibrarySongs(setlistSongRepository.findBySetlistIdOrderByPositionAsc(setlistId));
    }

    /** Menambahkan lagu ke setlist. Lagu yang sudah ada tidak diduplikasi. */
    @Transactional
    public void addSongToSetlist(Long userId, Long setlistId, Long songId) {
        Setlist setlist = requireSetlist(userId, setlistId);
        Song song = requireSong(songId);
        if (setlistSongRepository.findBySetlistIdAndSongId(setlist.getId(), songId).isPresent()) {
            return;
        }
        int position = setlistSongRepository.countBySetlistId(setlist.getId());
        setlistSongRepository.save(new SetlistSong(setlist, song, position));
    }

    /** Menghapus lagu dari setlist. */
    @Transactional
    public void removeSongFromSetlist(Long userId, Long setlistId, Long songId) {
        requireSetlist(userId, setlistId);
        setlistSongRepository.findBySetlistIdAndSongId(setlistId, songId)
                .ifPresent(setlistSongRepository::delete);
    }

    // ---------------------------------------------------------------- riwayat

    /** Mencatat bahwa member baru saja membuka sebuah lagu. */
    @Transactional
    public void recordView(Long userId, Long songId) {
        SongHistory history = songHistoryRepository.findByUserIdAndSongId(userId, songId).orElse(null);
        if (history == null) {
            songHistoryRepository.save(new SongHistory(requireUser(userId), requireSong(songId)));
            return;
        }
        history.touch();
        songHistoryRepository.save(history);
    }

    /** Lagu-lagu yang terakhir dilihat member, yang terbaru di atas. */
    @Transactional(readOnly = true)
    public List<LibrarySongResponse> listHistory(Long userId, int limit) {
        int size = Math.max(1, Math.min(limit, HISTORY_LIMIT));
        return songHistoryRepository
                .findByUserIdOrderByViewedAtDesc(userId, PageRequest.of(0, size))
                .stream()
                .map(entry -> LibrarySongResponse.from(entry.getSong()))
                .toList();
    }

    // ------------------------------------------------------------------ helper

    /**
     * Mengubah baris playlist/setlist menjadi bentuk yang dikirim ke frontend.
     *
     * <p>Kedua jenis baris memenuhi {@link CollectionEntry}, jadi satu cara baca
     * ini cukup untuk keduanya.
     */
    private List<LibrarySongResponse> toLibrarySongs(List<? extends CollectionEntry> entries) {
        return entries.stream()
                .map(entry -> LibrarySongResponse.from(entry.getSong()))
                .toList();
    }

    private User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pengguna tidak ditemukan."));
    }

    private Song requireSong(Long songId) {
        return songRepository.findById(songId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lagu tidak ditemukan."));
    }

    private Playlist requirePlaylist(Long userId, Long playlistId) {
        return playlistRepository.findByIdAndUserId(playlistId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Playlist tidak ditemukan."));
    }

    private Setlist requireSetlist(Long userId, Long setlistId) {
        return setlistRepository.findByIdAndUserId(setlistId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Setlist tidak ditemukan."));
    }
}
