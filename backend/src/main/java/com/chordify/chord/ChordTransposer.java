package com.chordify.chord;

import org.springframework.stereotype.Component;

/**
 * Memindahkan chord naik atau turun beberapa semitone.
 *
 * <p>Contoh: {@code process("D/F#", 2)} menghasilkan {@code "E/G#"}. Not akar dan
 * nada bass sama-sama digeser, sementara karakter tambahan seperti {@code m7},
 * {@code add9}, atau {@code sus4} tetap utuh.
 */
@Component
public class ChordTransposer extends ChordProcessor {

    /**
     * Menggeser satu chord.
     *
     * <p>[PBO-9] Method Overriding — implementasi subclass untuk method abstrak
     * {@code process(Chord, int)} milik {@link ChordProcessor}.
     *
     * @param chord chord yang akan digeser
     * @param amount jumlah semitone; positif naik, negatif turun
     * @return simbol chord hasil geser
     */
    @Override
    public String process(Chord chord, int amount) {
        if (chord == null) {
            return null;
        }
        return chord.transpose(amount).toString();
    }
}
