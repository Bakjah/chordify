package com.chordify.service;

import com.chordify.chord.ChordProcessor;
import com.chordify.contract.MediaStorage;
import com.chordify.contract.Searchable;
import com.chordify.dto.ArtistResponse;
import com.chordify.dto.LyricLine;
import com.chordify.dto.MediaResponse;
import com.chordify.dto.PageResponse;
import com.chordify.dto.SongRequest;
import com.chordify.dto.SongResponse;
import com.chordify.dto.StoredMedia;
import com.chordify.exception.ApiException;
import com.chordify.model.Artist;
import com.chordify.model.Genre;
import com.chordify.model.Song;
import com.chordify.model.SongStatus;
import com.chordify.model.User;
import com.chordify.repository.ArtistRepository;
import com.chordify.repository.GenreRepository;
import com.chordify.repository.SongRepository;
import com.chordify.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *	Layanan lagu: pencarian, detail, dan kontribusi member.
 *
 * <p>Class ini memenuhi kontrak {@link Searchable} sehingga pencarian lagu bisa
 * dipakai lewat tipe kontrak, bukan hanya lewat implementasi konkret.
 */
@Service
public class SongService implements Searchable<Song> {

    private static final int MAX_PAGE_SIZE = 100;

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final ChordProcessor chordProcessor;
    private final MediaStorage mediaStorage;

    public SongService(SongRepository songRepository,
                       ArtistRepository artistRepository,
                       GenreRepository genreRepository,
                       UserRepository userRepository,
                       ObjectMapper objectMapper,
                       ChordProcessor chordProcessor,
                       MediaStorage mediaStorage) {
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.chordProcessor = chordProcessor;
        this.mediaStorage = mediaStorage;
    }

    /**
     * Pencarian lagu dari kontrak {@link Searchable}: judul, artis, atau genre.
     *
     * @param keyword kata kunci pencarian
     * @return daftar lagu yang cocok
     */
    @Override
    @Transactional(readOnly = true)
    public List<Song> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }
        return songRepository.search(keyword.trim(), PageRequest.of(0, MAX_PAGE_SIZE)).getContent();
    }

    /** Pencarian dengan paginasi dan urutan yang bisa dipilih. */
    @Transactional(readOnly = true)
    public PageResponse<SongResponse> search(String keyword, int page, int size, String sort) {
        PageRequest pageable = PageRequest.of(Math.max(page, 0), clampSize(size), resolveSort(sort));
        Page<Song> result = (keyword == null || keyword.isBlank())
                ? songRepository.findByStatus(SongStatus.PUBLISHED, pageable)
                : songRepository.search(keyword.trim(), pageable);
        return toPageResponse(result);
    }

    /** Pencarian khusus judul — dipakai saat pengguna mengetik di kotak pencarian. */
    @Transactional(readOnly = true)
    public PageResponse<SongResponse> searchByTitle(String keyword, int page, int size) {
        PageRequest pageable = PageRequest.of(Math.max(page, 0), clampSize(size), Sort.by("title"));
        Page<Song> result = songRepository.searchByTitle(keyword == null ? "" : keyword.trim(), pageable);
        return toPageResponse(result);
    }

    /** Semua lagu yang dipublish, untuk halaman library publik. */
    @Transactional(readOnly = true)
    public PageResponse<SongResponse> list(int page, int size, String sort) {
        PageRequest pageable = PageRequest.of(Math.max(page, 0), clampSize(size), resolveSort(sort));
        return toPageResponse(songRepository.findByStatus(SongStatus.PUBLISHED, pageable));
    }

    /** Detail satu lagu. */
    @Transactional(readOnly = true)
    public SongResponse detail(Long id) {
        return toResponse(findSong(id));
    }

    /** Lagu milik seorang kontributor, untuk halaman "My Contributions". */
    @Transactional(readOnly = true)
    public PageResponse<SongResponse> listByContributor(Long contributorId, int page, int size) {
        PageRequest pageable = PageRequest.of(Math.max(page, 0), clampSize(size),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPageResponse(songRepository.findByContributorId(contributorId, pageable));
    }

    /**
     * Menambah lagu baru.
     *
     * <p>Artis dan genre ditulis sebagai nama. Kalau belum ada, dibuat baru
     * supaya member tidak perlu memilih dari daftar yang belum lengkap.
     */
    @Transactional
    public SongResponse create(SongRequest request, Long contributorId) {
        User contributor = findUser(contributorId);
        Song song = new Song(request.title().trim(), resolveArtist(request.artist()), resolveGenre(request.genre()));
        applyRequest(song, request);
        song.setContributor(contributor);
        songRepository.save(song);
        return toResponse(song);
    }

    /** Mengubah lagu. Hanya kontributor lagu atau admin yang boleh. */
    @Transactional
    public SongResponse update(Long id, SongRequest request, Long userId) {
        Song song = findSong(id);
        ensureCanModify(song, userId);
        song.setTitle(request.title().trim());
        song.setArtist(resolveArtist(request.artist()));
        song.setGenre(resolveGenre(request.genre()));
        applyRequest(song, request);
        songRepository.save(song);
        return toResponse(song);
    }

    /** Menghapus lagu. Hanya kontributor lagu atau admin yang boleh. */
    @Transactional
    public void delete(Long id, Long userId) {
        Song song = findSong(id);
        ensureCanModify(song, userId);
        songRepository.delete(song);
    }

    /**
     * Menggeser chord sebuah lagu naik atau turun.
     *
     * @param semitones jumlah semitone; positif naik, negatif turun
     * @return lagu dengan chord yang sudah digeser
     */
    @Transactional(readOnly = true)
    public SongResponse transpose(Long id, int semitones) {
        Song song = findSong(id);
        List<LyricLine> lines = readLyrics(song.getLyrics()).stream()
                .map(line -> new LyricLine(chordProcessor.process(line.chord(), semitones), line.line()))
                .toList();
        return SongResponse.from(song, lines);
    }

    /**
     * Mengganti berkas audio playback milik sebuah lagu.
     *
     * <p>Berkas lama otomatis dihapus supaya folder storage tidak menumpuk
     * berkas yang sudah tidak terpakai.
     */
    @Transactional
    public MediaResponse attachMedia(Long songId,
                                     String filename,
                                     String contentType,
                                     byte[] content,
                                     Long userId) {
        Song song = findSong(songId);
        ensureCanModify(song, userId);

        String previous = song.getAudioPath();
        StoredMedia stored = mediaStorage.store("songs", filename, contentType, content);

        song.setAudioPath(stored.url());
        song.setAudioName(stored.name());
        song.setAudioType(stored.type());
        songRepository.save(song);

        if (previous != null && !previous.equals(stored.url())) {
            mediaStorage.delete(previous);
        }
        return MediaResponse.from(stored);
    }

    /** Menghapus berkas audio playback milik sebuah lagu. */
    @Transactional
    public void removeMedia(Long songId, Long userId) {
        Song song = findSong(songId);
        ensureCanModify(song, userId);

        String previous = song.getAudioPath();
        song.setAudioPath(null);
        song.setAudioName(null);
        song.setAudioType(null);
        songRepository.save(song);

        mediaStorage.delete(previous);
    }

    /** Daftar artis beserta jumlah lagunya. */
    @Transactional(readOnly = true)
    public List<ArtistResponse> listArtists() {
        return artistRepository.findAll().stream()
                .map(ArtistResponse::from)
                .toList();
    }

    /** Artis yang punya minimal satu lagu. */
    @Transactional(readOnly = true)
    public List<ArtistResponse> listArtistsWithSongs() {
        return artistRepository.findAll().stream()
                .filter(artist -> !songRepository.findByArtistIdOrderByTitleAsc(artist.getId()).isEmpty())
                .map(ArtistResponse::from)
                .toList();
    }

    // ------------------------------------------------------------------
    // metode bantu
    // ------------------------------------------------------------------

    private Song findSong(Long id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lagu tidak ditemukan"));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sesi tidak valid"));
    }

    /** Hanya pemilik lagu atau admin yang boleh mengubah dan menghapusnya. */
    private void ensureCanModify(Song song, Long userId) {
        User user = findUser(userId);
        boolean isAdmin = "ADMIN".equals(user.getRole());
        boolean isOwner = song.getContributor() != null
                && song.getContributor().getId().equals(userId);
        if (!isAdmin && !isOwner) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Kamu cuma bisa mengubah lagu milikmu sendiri");
        }
    }

    /** Menemukan artis berdasarkan nama, atau membuatnya kalau belum ada. */
    private Artist resolveArtist(String name) {
        String trimmed = name.trim();
        return artistRepository.findByNameIgnoreCase(trimmed)
                .orElseGet(() -> artistRepository.save(new Artist(trimmed)));
    }

    /** Menemukan genre berdasarkan nama, atau membuatnya kalau belum ada. */
    private Genre resolveGenre(String name) {
        String trimmed = name.trim();
        return genreRepository.findByNameIgnoreCase(trimmed)
                .orElseGet(() -> genreRepository.save(new Genre(trimmed)));
    }

    /** Memindahkan kolom dari request ke entity lagu. */
    private void applyRequest(Song song, SongRequest request) {
        song.setKeySignature(request.key());
        song.setDifficulty(request.difficulty());
        song.setArtworkColor(request.artwork());
        song.setCapo(request.capo() == null ? 0 : Math.max(request.capo(), 0));
        song.setLyrics(writeLyrics(request.lyrics()));
    }

    /** Mengubah daftar baris lirik menjadi teks JSON untuk disimpan. */
    private String writeLyrics(List<LyricLine> lyrics) {
        if (lyrics == null || lyrics.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(lyrics);
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Format lirik tidak valid");
        }
    }

    /** Membaca teks JSON lirik. Isi rusak dianggap lirik kosong, bukan error fatal. */
    private List<LyricLine> readLyrics(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<LyricLine>>() { });
        } catch (Exception ex) {
            return new ArrayList<>();
        }
    }

    private PageResponse<SongResponse> toPageResponse(Page<Song> page) {
        Page<SongResponse> mapped = page.map(song -> SongResponse.from(song, readLyrics(song.getLyrics())));
        return PageResponse.from(mapped);
    }

    private SongResponse toResponse(Song song) {
        return SongResponse.from(song, readLyrics(song.getLyrics()));
    }

    private int clampSize(int size) {
        return Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
    }

    /** Mengubah nama pengurutan dari frontend menjadi {@link Sort}. */
    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        return switch (sort) {
            case "title" -> Sort.by(Sort.Direction.ASC, "title");
            case "title_desc" -> Sort.by(Sort.Direction.DESC, "title");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
