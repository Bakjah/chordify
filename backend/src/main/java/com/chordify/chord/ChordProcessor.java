package com.chordify.chord;

/**
 * Abstract class pemrosesan chord.
 *
 * <p>Subclass hanya perlu tahu cara menggeser satu simbol chord. Cara memproses
 * seluruh teks chord sudah disediakan di sini sebagai template method: setiap
 * token dibaca menjadi {@link Chord}, lalu invoking ke method milik subclass.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-3] Inheritance — superclass dari {@link ChordTransposer} dan
 *       {@link ChordInverter}.</li>
 *   <li>[PBO-4] Polymorphism — service menulis {@code chordProcessor.process(...)}
 *       tanpa perlu tahu subclass mana yang sedang dipakai.</li>
 *   <li>[PBO-5] Abstraction — class abstrak dengan method abstrak
 *       {@link #process(Chord, int)}.</li>
 *   <li>[PBO-8] Method Overloading — dua method bernama sama tapi parameter
 *       berbeda: {@code process(Chord, int)} dan {@code process(String, int)}.</li>
 *   <li>[PBO-9] Method Overriding — {@link #process(Chord, int)} di-override di
 *       setiap subclass.</li>
 * </ul>
 */
public abstract class ChordProcessor {

    /**
     * Menggeser satu simbol chord.
     *
     * <p>[PBO-5] Abstraction — method abstrak: setiap subclass wajib
     * mengimplementasikan aturan geser masing-masing.
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
     * <p>[PBO-8] Method Overloading — nama method sama dengan
     * {@code process(Chord, int)}, tapi tipe parameter pertama berbeda, jadi
     * Java memilih versi yang pas saat dipanggil.
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
