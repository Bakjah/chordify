package com.chordify.service;

import com.chordify.chord.Chord;
import com.chordify.chord.ChordProcessor;
import com.chordify.dto.ChordFinger;
import com.chordify.dto.ChordResponse;
import com.chordify.exception.ApiException;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * Kamus chord: daftar simbol chord beserta diagram jarinya.
 *
 * <p>Kosakata chord (nada akar dan kualitas) diambil dari kelas domain
 * {@link Chord}, jadi daftar nama chord tidak ditulis dua kali.
 */
@Service
public class ChordService {

    /** Chord open yang paling sering dipakai — dipakai untuk filter "populer". */
    private static final List<String> POPULAR = List.of("C", "G", "D", "Am", "Em", "F", "Dm", "B7");

    /** Satu bentuk chord: simbol, nama, posisi, dan jari-jarinya. */
    private record Shape(String symbol, String name, int position, List<ChordFinger> fingers) {
    }

    private static final List<Shape> CATALOG = List.of(
            new Shape("C", "C Major", 1, List.of(
                    new ChordFinger(1, 3), new ChordFinger(2, 2),
                    new ChordFinger(3, 1), new ChordFinger(5, 1))),
            new Shape("G", "G Major", 1, List.of(
                    new ChordFinger(0, 3), new ChordFinger(1, 2),
                    new ChordFinger(4, 3), new ChordFinger(5, 3))),
            new Shape("D", "D Major", 1, List.of(
                    new ChordFinger(2, 3), new ChordFinger(3, 2),
                    new ChordFinger(4, 3), new ChordFinger(5, 2))),
            new Shape("Am", "A Minor", 1, List.of(
                    new ChordFinger(2, 2), new ChordFinger(3, 2), new ChordFinger(4, 1))),
            new Shape("Em", "E Minor", 1, List.of(
                    new ChordFinger(0, 2), new ChordFinger(1, 2))),
            new Shape("F", "F Major", 1, List.of(
                    new ChordFinger(0, 1), new ChordFinger(1, 3), new ChordFinger(2, 3),
                    new ChordFinger(3, 2), new ChordFinger(4, 1), new ChordFinger(5, 1))),
            new Shape("Dm", "D Minor", 1, List.of(
                    new ChordFinger(2, 3), new ChordFinger(3, 2),
                    new ChordFinger(4, 3), new ChordFinger(5, 1))),
            new Shape("F#m", "F Sharp Minor", 2, List.of(
                    new ChordFinger(0, 2), new ChordFinger(1, 4), new ChordFinger(2, 2),
                    new ChordFinger(3, 3), new ChordFinger(4, 2), new ChordFinger(5, 2))),
            new Shape("B7", "B Seven", 1, List.of(
                    new ChordFinger(1, 2), new ChordFinger(2, 1),
                    new ChordFinger(3, 2), new ChordFinger(5, 2))),
            new Shape("Cadd9", "C Add Nine", 1, List.of(
                    new ChordFinger(1, 3), new ChordFinger(2, 2), new ChordFinger(3, 3),
                    new ChordFinger(4, 3), new ChordFinger(5, 3))),
            new Shape("Dsus4", "D Sus Four", 1, List.of(
                    new ChordFinger(2, 3), new ChordFinger(3, 2),
                    new ChordFinger(4, 3), new ChordFinger(5, 3))));

    private final ChordProcessor chordProcessor;

    public ChordService(ChordProcessor chordProcessor) {
        this.chordProcessor = chordProcessor;
    }

    /**
     * Daftar chord, boleh disaring dengan kata kunci dan kategori.
     *
     * @param query kata kunci pada simbol atau nama; null berarti semua
     * @param category kategori chord, atau {@code POPULAR}; null berarti semua
     */
    public List<ChordResponse> list(String query, String category) {
        String keyword = query == null ? "" : query.trim().toLowerCase();
        String filter = category == null ? "" : category.trim().toUpperCase();

        return CATALOG.stream()
                .map(this::toResponse)
                .filter(chord -> keyword.isEmpty()
                        || chord.symbol().toLowerCase().contains(keyword)
                        || chord.name().toLowerCase().contains(keyword))
                .filter(chord -> matchesCategory(chord, filter))
                .toList();
    }

    /** Satu chord berdasarkan simbolnya, misalnya {@code Am}. */
    public ChordResponse detail(String symbol) {
        return CATALOG.stream()
                .filter(shape -> shape.symbol().equalsIgnoreCase(symbol))
                .findFirst()
                .map(this::toResponse)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Chord tidak ditemukan: " + symbol));
    }

    /** Chord hasil geser dari simbol yang diberikan. */
    public ChordResponse transpose(String symbol, int semitones) {
        Chord parsed = Chord.parse(symbol);
        if (parsed == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Simbol chord tidak valid: " + symbol);
        }
        String shifted = chordProcessor.process(parsed, semitones);
        return new ChordResponse(
                id(shifted),
                shifted,
                shifted + " Chord",
                parsed.transpose(semitones).category(),
                parsed.getPosition(),
                List.of());
    }

    // ------------------------------------------------------------------ helper

    private boolean matchesCategory(ChordResponse chord, String filter) {
        if (filter.isEmpty()) {
            return true;
        }
        if ("POPULAR".equals(filter)) {
            return POPULAR.contains(chord.symbol());
        }
        return chord.category().equals(filter);
    }

    private ChordResponse toResponse(Shape shape) {
        Chord parsed = Chord.parse(shape.symbol());
        String category = parsed == null ? "MAJOR" : parsed.category();
        return new ChordResponse(
                id(shape.symbol()),
                shape.symbol(),
                shape.name(),
                category,
                shape.position(),
                shape.fingers());
    }

    private String id(String symbol) {
        return symbol.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "-");
    }
}
