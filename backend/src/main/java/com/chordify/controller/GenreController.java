package com.chordify.controller;

import com.chordify.dto.GenreResponse;
import com.chordify.service.GenreService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint genre: daftar genre untuk filter di halaman library.
 */
@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    /** Semua genre, urut nama. */
    @GetMapping
    public List<GenreResponse> list() {
        return genreService.list();
    }

    /** Pencarian genre berdasarkan nama. */
    @GetMapping("/search")
    public List<GenreResponse> search(@RequestParam(defaultValue = "") String q) {
        return genreService.search(q).stream()
                .map(GenreResponse::from)
                .toList();
    }

    /** Detail satu genre. */
    @GetMapping("/{id}")
    public GenreResponse detail(@PathVariable Long id) {
        return genreService.detail(id);
    }
}
