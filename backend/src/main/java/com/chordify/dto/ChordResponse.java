package com.chordify.dto;

import java.util.List;

/**
 * Bentuk satu entri kamus chord.
 *
 * @param id pengenal unik, dipakai frontend sebagai key
 * @param symbol simbol chord, misalnya "C", "Am", "G/B"
 * @param name nama yang enak dibaca, misalnya "C Major"
 * @param category kategori chord, hasil dari {@link com.chordify.chord.Chord#category()}
 * @param position fret tempat chord dimainkan
 * @param fingers posisi jari pada diagram
 */
public record ChordResponse(
        String id,
        String symbol,
        String name,
        String category,
        int position,
        List<ChordFinger> fingers) {
}
