package com.chordify.controller;

import com.chordify.dto.ChordResponse;
import com.chordify.service.ChordService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint kamus chord. Terbuka untuk umum, karena dipakai halaman publik
 * Chord Dictionary.
 */
@RestController
@RequestMapping("/api/chords")
public class ChordController {

    private final ChordService chordService;

    public ChordController(ChordService chordService) {
        this.chordService = chordService;
    }

    /** Daftar chord, boleh disaring dengan kata kunci dan kategori. */
    @GetMapping
    public List<ChordResponse> list(@RequestParam(required = false) String q,
                                    @RequestParam(required = false) String category) {
        return chordService.list(q, category);
    }

    /** Satu chord berdasarkan simbolnya. */
    @GetMapping("/{symbol}")
    public ChordResponse detail(@PathVariable String symbol) {
        return chordService.detail(symbol);
    }

    /** Chord yang sudah digeser beberapa semitone. */
    @GetMapping("/{symbol}/transpose")
    public ChordResponse transpose(@PathVariable String symbol,
                                   @RequestParam(defaultValue = "0") int semitones) {
        return chordService.transpose(symbol, semitones);
    }
}
