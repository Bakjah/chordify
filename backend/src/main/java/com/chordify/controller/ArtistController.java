package com.chordify.controller;

import com.chordify.dto.ArtistDetail;
import com.chordify.dto.ArtistResponse;
import com.chordify.service.ArtistService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint artis: daftar artis yang ada di Chordify dan detail masing-masing.
 */
@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    /** Semua artis, urut nama. */
    @GetMapping
    public List<ArtistResponse> list() {
        return artistService.list();
    }

    /** Pencarian artis berdasarkan nama. */
    @GetMapping("/search")
    public List<ArtistResponse> search(@RequestParam(defaultValue = "") String q) {
        return artistService.search(q).stream()
                .map(ArtistResponse::from)
                .toList();
    }

    /** Detail satu artis beserta daftar lagunya. */
    @GetMapping("/{id}")
    public ArtistDetail detail(@PathVariable Long id) {
        return artistService.detail(id);
    }
}
