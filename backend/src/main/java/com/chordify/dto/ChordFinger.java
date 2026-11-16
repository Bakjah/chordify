package com.chordify.dto;

/**
 * Satu posisi jari pada diagram senar gitar.
 *
 * @param string nomor senar, 0 untuk senar paling rendah (E) sampai 5 untuk senar paling tinggi
 * @param fret nomor fret, mulai dari 1
 */
public record ChordFinger(int string, int fret) {
}
