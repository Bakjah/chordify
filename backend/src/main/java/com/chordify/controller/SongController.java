package com.chordify.controller;

import com.chordify.dto.PageResponse;
import com.chordify.dto.SongRequest;
import com.chordify.dto.SongResponse;
import com.chordify.service.SongService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint lagu: library publik, pencarian, detail, dan kontribusi member.
 *
 * <ul>
 *   <li>{@code GET    /api/songs} — daftar lagu (paginasi, urutan, pencarian)</li>
 *   <li>{@code GET    /api/songs/search} — pencarian cepat saat mengetik</li>
 *   <li>{@code GET    /api/songs/{id}} — detail satu lagu</li>
 *   <li>{@code GET    /api/songs/{id}/transpose} — chord digeser naik/turun</li>
 *   <li>{@code POST   /api/songs} — menyumbangkan lagu baru</li>
 *   <li>{@code PUT    /api/songs/{id}} — mengubah lagu milik sendiri</li>
 *   <li>{@code DELETE /api/songs/{id}} — menghapus lagu milik sendiri</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    /** Daftar lagu yang sudah dipublish. */
    @GetMapping
    public PageResponse<SongResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String q) {
        return songService.search(q, page, size, sort);
    }

    /** Pencarian cepat judul — dipakai live search di TopBar. */
    @GetMapping("/search")
    public PageResponse<SongResponse> search(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return songService.searchByTitle(q, page, size);
    }

    /** Detail satu lagu. */
    @GetMapping("/{id}")
    public SongResponse detail(@PathVariable Long id) {
        return songService.detail(id);
    }

    /**
     * Chord lagu yang digeser naik atau turun.
     *
     * @param semitones jumlah semitone; positif naik, negatif turun
     */
    @GetMapping("/{id}/transpose")
    public SongResponse transpose(@PathVariable Long id,
                                  @RequestParam(defaultValue = "0") int semitones) {
        return songService.transpose(id, semitones);
    }

    /** Menambah lagu baru. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SongResponse create(@Valid @RequestBody SongRequest request, Authentication authentication) {
        return songService.create(request, userId(authentication));
    }

    /** Mengubah lagu. Hanya pemilik lagu atau admin yang boleh. */
    @PutMapping("/{id}")
    public SongResponse update(@PathVariable Long id,
                               @Valid @RequestBody SongRequest request,
                               Authentication authentication) {
        return songService.update(id, request, userId(authentication));
    }

    /** Menghapus lagu. Hanya pemilik lagu atau admin yang boleh. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        songService.delete(id, userId(authentication));
    }

    /** Id user dari token yang dipakai; null kalau request tanpa login. */
    private Long userId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }
}
