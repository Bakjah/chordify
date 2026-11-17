package com.chordify.service;

import com.chordify.contract.Searchable;
import com.chordify.dto.AdminGenreResponse;
import com.chordify.dto.GenreRequest;
import com.chordify.dto.GenreResponse;
import com.chordify.exception.ApiException;
import com.chordify.model.Genre;
import com.chordify.repository.GenreRepository;
import com.chordify.repository.SongRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Layanan genre: daftar genre untuk filter di halaman library.
 *
 * <p>Class ini juga memenuhi kontrak {@link Searchable}, jadi pencarian genre
 * bisa dipanggil lewat tipe kontrak, sama seperti {@link SongService}.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-6] Interface — {@code GenreService implements Searchable<Genre>}.</li>
 * </ul>
 */
@Service
public class GenreService implements Searchable<Genre> {

    private static final int MAX_PAGE_SIZE = 100;

    private final GenreRepository genreRepository;
    private final SongRepository songRepository;

    public GenreService(GenreRepository genreRepository, SongRepository songRepository) {
        this.genreRepository = genreRepository;
        this.songRepository = songRepository;
    }

    /**
     * Pencarian genre dari kontrak {@link Searchable}: pencocokan nama.
     *
     * @param keyword kata kunci pencarian
     * @return daftar genre yang namanya mengandung kata kunci
     */
    @Override
    @Transactional(readOnly = true)
    public List<Genre> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }
        String needle = keyword.trim().toLowerCase();
        return genreRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .filter(genre -> genre.getName().toLowerCase().contains(needle))
                .limit(MAX_PAGE_SIZE)
                .toList();
    }

    /** Semua genre, urut nama. */
    @Transactional(readOnly = true)
    public List<GenreResponse> list() {
        return genreRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(GenreResponse::from)
                .toList();
    }

    /** Detail satu genre. */
    @Transactional(readOnly = true)
    public GenreResponse detail(Long id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Genre tidak ditemukan"));
        return GenreResponse.from(genre);
    }

    // ------------------------------------------------------------- administration

    /** Daftar genre untuk tabel "Manage Genres", lengkap dengan jumlah lagunya. */
    @Transactional(readOnly = true)
    public List<AdminGenreResponse> listForAdmin() {
        return genreRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(genre -> AdminGenreResponse.from(genre, songRepository.countByGenreId(genre.getId())))
                .toList();
    }

    /** Admin menambah genre baru. */
    @Transactional
    public AdminGenreResponse create(GenreRequest request) {
        String name = request.name().trim();
        if (genreRepository.existsByNameIgnoreCase(name)) {
            throw new ApiException(HttpStatus.CONFLICT, "Genre dengan nama itu sudah ada");
        }
        Genre genre = new Genre(name);
        return AdminGenreResponse.from(genreRepository.save(genre), 0);
    }

    /** Admin mengubah nama genre. */
    @Transactional
    public AdminGenreResponse update(Long id, GenreRequest request) {
        Genre genre = findGenre(id);
        String name = request.name().trim();
        genreRepository.findByNameIgnoreCase(name).ifPresent(lain -> {
            if (!lain.getId().equals(id)) {
                throw new ApiException(HttpStatus.CONFLICT, "Genre dengan nama itu sudah ada");
            }
        });
        genre.setName(name);
        genreRepository.save(genre);
        return AdminGenreResponse.from(genre, songRepository.countByGenreId(id));
    }

    /**
     * Admin menghapus genre.
     *
     * <p>Genre yang masih dipakai lagu tidak boleh dihapus karena lagu itu
     * menunjuk ke genre ini lewat foreign key.
     */
    @Transactional
    public void delete(Long id) {
        Genre genre = findGenre(id);
        long songCount = songRepository.countByGenreId(id);
        if (songCount > 0) {
            throw new ApiException(
                    HttpStatus.CONFLICT, "Genre masih dipakai " + songCount + " lagu, hapus lagunya dulu");
        }
        genreRepository.delete(genre);
    }

    private Genre findGenre(Long id) {
        return genreRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Genre tidak ditemukan"));
    }
}
