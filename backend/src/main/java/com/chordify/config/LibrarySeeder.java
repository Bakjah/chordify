package com.chordify.config;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mengisi library pribadi beberapa member contoh: favorit, playlist, setlist,
 * dan riwayat lagu yang pernah dilihat.
 *
 * <p>Seeder ini idempoten — datanya hanya dibuat kalau member terkait belum
 * punya isi, jadi restart backend tidak bikin data dobel.
 */
@Component
@Order(3)
public class LibrarySeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(LibrarySeeder.class);

    /** Library contoh untuk satu member. */
    private record SeedLibrary(
            String email,
            List<String> favorites,
            String playlistTitle,
            List<String> playlistSongs,
            String setlistTitle,
            List<String> setlistSongs,
            List<String> history) {}

    private static final List<SeedLibrary> SEED_LIBRARIES = List.of(
            new SeedLibrary(
                    "nadya@mail.com",
                    List.of("Separuh Aku", "Kangen", "Evaluasi"),
                    "Late Night Acoustic",
                    List.of("Separuh Aku", "Akad", "Kangen"),
                    "Acoustic Evening",
                    List.of("Evaluasi", "Dan"),
                    List.of("Separuh Aku", "Akad", "Evaluasi")),
            new SeedLibrary(
                    "dimas@mail.com",
                    List.of("Komang", "Sempurna"),
                    "Practice Set",
                    List.of("Komang", "Rumah Ke Rumah"),
                    null,
                    List.of(),
                    List.of("Komang", "Sempurna")));

    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final FavoriteRepository favoriteRepository;
    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SetlistRepository setlistRepository;
    private final SetlistSongRepository setlistSongRepository;
    private final SongHistoryRepository songHistoryRepository;

    public LibrarySeeder(UserRepository userRepository,
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

    @Override
    @Transactional
    public void run(String... args) {
        for (SeedLibrary seed : SEED_LIBRARIES) {
            userRepository.findByEmailIgnoreCase(seed.email()).ifPresent(user -> seedLibrary(user, seed));
        }
    }

    /** Mengisi satu member. Semua langkah dilewati kalau datanya sudah ada. */
    private void seedLibrary(User user, SeedLibrary seed) {
        seedFavorites(user, seed.favorites());
        seedPlaylist(user, seed);
        seedSetlist(user, seed);
        seedHistory(user, seed.history());
        log.info("Library contoh member {} siap", user.getUsername());
    }

    private void seedFavorites(User user, List<String> titles) {
        for (String title : titles) {
            Song song = songRepository.findByTitleIgnoreCase(title).orElse(null);
            if (song == null || favoriteRepository.existsByUserIdAndSongId(user.getId(), song.getId())) {
                continue;
            }
            favoriteRepository.save(new Favorite(user, song));
        }
    }

    private void seedPlaylist(User user, SeedLibrary seed) {
        if (seed.playlistTitle() == null || !playlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).isEmpty()) {
            return;
        }
        Playlist playlist = new Playlist(user, seed.playlistTitle());
        playlist.rename(seed.playlistTitle(), "Koleksi untuk latihan di rumah.", "#315a52");
        playlistRepository.save(playlist);

        int position = 0;
        for (String title : seed.playlistSongs()) {
            Song song = songRepository.findByTitleIgnoreCase(title).orElse(null);
            if (song == null) {
                continue;
            }
            playlistSongRepository.save(new PlaylistSong(playlist, song, position++));
        }
    }

    private void seedSetlist(User user, SeedLibrary seed) {
        if (seed.setlistTitle() == null || !setlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).isEmpty()) {
            return;
        }
        Setlist setlist = new Setlist(user, seed.setlistTitle());
        setlist.rename(seed.setlistTitle(), "Urutan untuk acoustic evening.", "#6b3d3d");
        setlistRepository.save(setlist);

        int position = 0;
        for (String title : seed.setlistSongs()) {
            Song song = songRepository.findByTitleIgnoreCase(title).orElse(null);
            if (song == null) {
                continue;
            }
            setlistSongRepository.save(new SetlistSong(setlist, song, position++));
        }
    }

    private void seedHistory(User user, List<String> titles) {
        for (String title : titles) {
            Song song = songRepository.findByTitleIgnoreCase(title).orElse(null);
            if (song == null || songHistoryRepository.findByUserIdAndSongId(user.getId(), song.getId()).isPresent()) {
                continue;
            }
            songHistoryRepository.save(new SongHistory(user, song));
        }
    }
}
