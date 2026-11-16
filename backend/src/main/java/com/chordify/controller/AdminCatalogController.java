package com.chordify.controller;

import com.chordify.dto.AdminArtistResponse;
import com.chordify.dto.AdminGenreResponse;
import com.chordify.dto.ArtistRequest;
import com.chordify.dto.GenreRequest;
import com.chordify.service.ArtistService;
import com.chordify.service.GenreService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint admin untuk mengelola katalog artis dan genre.
 *
 * <p>Aksesnya sudah dijaga {@code SecurityConfig} — seluruh {@code /api/admin/**}
 * hanya boleh dibuka oleh pengguna dengan role ADMIN, jadi class ini tidak
 * perlu memeriksa role-nya sendiri.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminCatalogController {

    private final ArtistService artistService;
    private final GenreService genreService;

    public AdminCatalogController(ArtistService artistService, GenreService genreService) {
        this.artistService = artistService;
        this.genreService = genreService;
    }

    // -------------------------------------------------------------- artis

    /** Daftar artis untuk tabel "Manage Artists". */
    @GetMapping("/artists")
    public List<AdminArtistResponse> listArtists() {
        return artistService.listForAdmin();
    }

    /** Admin menambah artis baru. */
    @PostMapping("/artists")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminArtistResponse createArtist(@Valid @RequestBody ArtistRequest request) {
        return artistService.create(request);
    }

    /** Admin mengubah data artis. */
    @PutMapping("/artists/{id}")
    public AdminArtistResponse updateArtist(@PathVariable Long id,
                                            @Valid @RequestBody ArtistRequest request) {
        return artistService.update(id, request);
    }

    /** Admin menghapus artis yang belum punya lagu. */
    @DeleteMapping("/artists/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteArtist(@PathVariable Long id) {
        artistService.delete(id);
    }

    // -------------------------------------------------------------- genre

    /** Daftar genre untuk tabel "Manage Genres". */
    @GetMapping("/genres")
    public List<AdminGenreResponse> listGenres() {
        return genreService.listForAdmin();
    }

    /** Admin menambah genre baru. */
    @PostMapping("/genres")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminGenreResponse createGenre(@Valid @RequestBody GenreRequest request) {
        return genreService.create(request);
    }

    /** Admin mengubah nama genre. */
    @PutMapping("/genres/{id}")
    public AdminGenreResponse updateGenre(@PathVariable Long id,
                                          @Valid @RequestBody GenreRequest request) {
        return genreService.update(id, request);
    }

    /** Admin menghapus genre yang belum dipakai lagu. */
    @DeleteMapping("/genres/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGenre(@PathVariable Long id) {
        genreService.delete(id);
    }
}
