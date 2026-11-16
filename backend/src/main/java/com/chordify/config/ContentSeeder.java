package com.chordify.config;

import com.chordify.dto.LyricLine;
import com.chordify.model.Artist;
import com.chordify.model.Genre;
import com.chordify.model.Song;
import com.chordify.model.SongStatus;
import com.chordify.model.User;
import com.chordify.repository.ArtistRepository;
import com.chordify.repository.GenreRepository;
import com.chordify.repository.SongRepository;
import com.chordify.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeder isi library: artis, genre, dan lagu contoh.
 *
 * <p>Datanya sama dengan yang dulu dipakai di frontend sebagai data statis, jadi
 * tampilan aplikasi tidak berubah saat backend mulai menyuap data asli.
 * Seeder ini idempoten: lagu hanya dibuat kalau judul dan artisnya belum ada.
 */
@Component
@Order(2)
public class ContentSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ContentSeeder.class);

    /**
     * Satu lagu contoh.
     *
     * @param contributorEmail email akun kontributor; null berarti lagu tanpa kontributor
     */
    private record SeedSong(String title, String artist, String genre, String key,
                            String difficulty, String artwork, Integer capo,
                            String contributorEmail, List<LyricLine> lyrics) { }

    /** Artis yang jadi kontributor di data contoh. */
    private static final String CONTRIBUTOR_DEFAULT = "user@mail.com";
    private static final String CONTRIBUTOR_DIMAS = "dimas@mail.com";
    private static final String CONTRIBUTOR_NADYA = "nadya@mail.com";
    private static final String CONTRIBUTOR_VERIFIED = "team@noah.id";

    private static final List<SeedSong> SEED_SONGS = List.of(
            new SeedSong("Separuh Aku", "NOAH", "Pop", "G Major", "Easy", "#315a52", 0,
                    CONTRIBUTOR_DEFAULT,
                    List.of(
                            new LyricLine("G", "Dan terjadi lagi"),
                            new LyricLine("D/F#", "Kisah lama yang terulang kembali"),
                            new LyricLine("Em7", "Kau terluka lagi"),
                            new LyricLine("Cadd9", "Dari cinta rumit yang kau jalani"),
                            new LyricLine("G", "Aku ingin kau merasa"),
                            new LyricLine("D/F#", "Kamu mengerti aku mengerti"),
                            new LyricLine("Em7", "Kau tak sendiri"),
                            new LyricLine("Cadd9", "Hadapi dunia ini"))),
            new SeedSong("Dan", "Sheila On 7", "Pop Rock", "C Major", "Easy", "#6b3d3d", 0,
                    CONTRIBUTOR_DIMAS, List.of()),
            new SeedSong("Kangen", "Dewa 19", "Rock", "D Major", "Intermediate", "#3e4f72", 2,
                    CONTRIBUTOR_VERIFIED, List.of()),
            new SeedSong("Komang", "Raim Laode", "Pop", "G Major", "Beginner", "#745d36", 0,
                    CONTRIBUTOR_NADYA, List.of()),
            new SeedSong("Sempurna", "Andra and The Backbone", "Pop Rock", "A Major", "Intermediate", "#745d36", 0,
                    CONTRIBUTOR_DIMAS, List.of()),
            new SeedSong("Evaluasi", "Hindia", "Indie", "B Minor", "Intermediate", "#3e4f72", 0,
                    CONTRIBUTOR_NADYA, List.of()),
            new SeedSong("Rumah Ke Rumah", "Hindia", "Indie", "E Major", "Easy", "#6b3d3d", 0,
                    CONTRIBUTOR_DEFAULT, List.of()),
            new SeedSong("Akad", "Payung Teduh", "Acoustic", "C Major", "Beginner", "#315a52", 0,
                    CONTRIBUTOR_DIMAS, List.of()));

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final boolean seedEnabled;

    public ContentSeeder(SongRepository songRepository,
                         ArtistRepository artistRepository,
                         GenreRepository genreRepository,
                         UserRepository userRepository,
                         ObjectMapper objectMapper,
                         @Value("${app.seed.enabled:true}") boolean seedEnabled) {
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.seedEnabled = seedEnabled;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            return;
        }
        int created = 0;
        for (SeedSong seed : SEED_SONGS) {
            if (songRepository.existsByTitleIgnoreCase(seed.title())) {
                continue;
            }
            songRepository.save(buildSong(seed));
            created++;
        }
        log.info("Seeder isi library selesai: {} lagu baru dibuat.", created);
    }

    /** Mengubah data seed menjadi objek lagu yang siap disimpan. */
    private Song buildSong(SeedSong seed) {
        Artist artist = resolveArtist(seed.artist(), seed.artwork());
        Genre genre = resolveGenre(seed.genre());
        Song song = new Song(seed.title(), artist, genre);
        song.setKeySignature(seed.key());
        song.setDifficulty(seed.difficulty());
        song.setArtworkColor(seed.artwork());
        song.setCapo(seed.capo() == null ? 0 : seed.capo());
        song.setLyrics(writeLyrics(seed.lyrics()));
        song.setStatus(SongStatus.PUBLISHED);
        song.setContributor(resolveContributor(seed.contributorEmail()));
        return song;
    }

    /** Artis dibuat kalau belum ada; warna artwork mengikuti lagu pertamanya. */
    private Artist resolveArtist(String name, String artwork) {
        return artistRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    Artist artist = new Artist(name);
                    artist.setArtworkColor(artwork);
                    return artistRepository.save(artist);
                });
    }

    /** Genre dibuat kalau belum ada. */
    private Genre resolveGenre(String name) {
        return genreRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> genreRepository.save(new Genre(name)));
    }

    /** Kontributor dicari berdasarkan email; kalau tidak ada, lagu tetap disimpan tanpa kontributor. */
    private User resolveContributor(String email) {
        if (email == null) {
            return null;
        }
        return userRepository.findByEmailIgnoreCase(email).orElse(null);
    }

    /** Lirik disimpan sebagai JSON array di dalam satu kolom teks. */
    private String writeLyrics(List<LyricLine> lyrics) {
        if (lyrics == null || lyrics.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(lyrics);
        } catch (Exception ex) {
            log.warn("Gagal menulis lirik contoh: {}", ex.getMessage());
            return null;
        }
    }
}
