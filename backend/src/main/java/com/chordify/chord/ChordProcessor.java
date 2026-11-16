package com.chordify.chord;

/**
 * Abstract class pemrosesan chord.
 *
 * <p>Subclass hanya perlu tahu cara menggeser satu simbol chord. Cara memproses
 * seluruh teks chord sudah disediakan di sini sebagai template method: setiap
 * token dibaca menjadi {@link Chord}, lalu invoking ke method milik subclass.
 */
public abstract class ChordProcessor {

    /**
     * Menggeser satu simbol chord.
     *
     * @param chord chord yang akan digeser
     * @param amount jumlah semitone; positif naik, negatif turun
     * @return simbol chord hasil geser
     */
    public abstract String process(Chord chord, int amount);

    /**
     * Menggeser semua chord yang ada di dalam teks.
     *
     * <p>Token yang bukan simbol chord dibiarkan apa adanya, jadi teks lirik
     * yang ikut terparsing tidak rusak.
     *
     * @param chordText teks chord, boleh memuat beberapa chord dipisah spasi
     * @param amount jumlah semitone; positif naik, negatif turun
     * @return teks dengan semua chord yang sudah digeser
     */
    public String process(String chordText, int amount) {
        if (chordText == null || chordText.isBlank() || amount == 0) {
            return chordText;
        }
        StringBuilder result = new StringBuilder();
        for (String token : chordText.trim().split("\\s+")) {
            if (!result.isEmpty()) {
                result.append(' ');
            }
            Chord chord = Chord.parse(token);
            result.append(chord == null ? token : process(chord, amount));
        }
        return result.toString();
    }
}
