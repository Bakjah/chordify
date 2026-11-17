package com.chordify.chord;

import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Simbol satu chord gitar: nada akar, kualitas, dan nada bass.
 *
 * <p>Kelas ini adalah domain class murni — bukan entity JPA dan tidak punya
 * tabel sendiri di database. Chord menempel pada lirik lagu, bukan berdiri
 * sendiri sebagai baris data.
 *
 * <p>Objeknya immutable. {@link #transpose(int)} tidak mengubah chord yang
 * sudah ada, tapi mengembalikan chord baru.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-1] Class &amp; Object — {@code Chord} adalah class domain untuk satu
 *       simbol chord; objeknya dibuat lewat {@code new Chord(...)} atau
 *       {@link #parse(String)}.</li>
 *   <li>[PBO-2] Encapsulation — atribut {@code final} dan private, dibaca lewat
 *       getter; chord tidak bisa diubah setelah dibuat.</li>
 *   <li>[PBO-7] Constructor — objek hanya bisa dibuat lewat konstruktor yang
 *       memvalidasi nadanya.</li>
 *   <li>[PBO-8] Method Overloading — dua konstruktor dengan nama sama tapi
 *       jumlah parameter berbeda: tiga argumen dan empat argumen.</li>
 * </ul>
 */
public final class Chord {

    /** Jumlah semitone tiap nada, dihitung dari C. */
    private static final Map<String, Integer> NOTE_SEMITONES = Map.ofEntries(
            Map.entry("C", 0), Map.entry("C#", 1), Map.entry("Db", 1),
            Map.entry("D", 2), Map.entry("D#", 3), Map.entry("Eb", 3),
            Map.entry("E", 4), Map.entry("E#", 5), Map.entry("F", 5),
            Map.entry("F#", 6), Map.entry("Gb", 6),
            Map.entry("G", 7), Map.entry("G#", 8), Map.entry("Ab", 8),
            Map.entry("A", 9), Map.entry("A#", 10), Map.entry("Bb", 10),
            Map.entry("B", 11), Map.entry("B#", 0));

    /** Nama nada hasil geser, gaya kres. */
    private static final String[] SHARP_NAMES = {
            "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
    };

    /** Nama nada hasil geser, gaya mol. */
    private static final String[] FLAT_NAMES = {
            "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"
    };

    /** Kualitas chord yang dikenali, dipakai agar kata biasa tidak dianggap chord. */
    private static final String QUALITY = "(?:maj|min|m|dim|aug|sus|add|\\+|\\-)";

    /** Suffix chord: boleh kombinasi kualitas dan angka, misalnya "m7" atau "add9". */
    private static final String SUFFIX = "(?:" + QUALITY + ")?\\d*(?:" + QUALITY + ")?";

    private static final Pattern PATTERN = Pattern.compile(
            "^([A-G])([#b]?)(" + SUFFIX + ")?(?:/([A-G][#b]?))?$");

    /** Nada akar, misalnya "G" atau "C#". */
    private final String root;

    /** Kualitas chord, misalnya "m", "m7", "sus4". String kosong berarti major. */
    private final String quality;

    /** Nada bass, misalnya "B" untuk "G/B". Null kalau chord tanpa nada bass. */
    private final String bass;

    /** Posisi chord di fretboard, dihitung dari senar terendah. */
    private final int position;

    /**
     * Chord pada posisi fret pertama.
     *
     * @param root nada akar, misalnya "G"
     * @param quality kualitas chord; null berarti major
     * @param bass nada bass; null berarti tanpa nada bass
     */
    public Chord(String root, String quality, String bass) {
        this(root, quality, bass, 1);
    }

    /**
     * Chord pada posisi tertentu di fretboard.
     *
     * <p>[PBO-8] Method Overloading — konstruktor ini menambah satu parameter
     * dibandingkan versi tiga argumen di atas, dengan nama sama.
     *
     * @param root nada akar, misalnya "G"
     * @param quality kualitas chord; null berarti major
     * @param bass nada bass; null berarti tanpa nada bass
     * @param position nomor fret tempat chord dimainkan, mulai dari 1
     */
    public Chord(String root, String quality, String bass, int position) {
        this.root = requireNote(root);
        this.quality = quality == null ? "" : quality;
        this.bass = bass == null ? null : requireNote(bass);
        this.position = position;
    }

    /**
     * Membaca simbol chord dari teks, misalnya "D/F#".
     *
     * @param text teks yang mungkin berisi chord
     * @return chord, atau null kalau teksnya bukan simbol chord
     */
    public static Chord parse(String text) {
        if (text == null) {
            return null;
        }
        Matcher matcher = PATTERN.matcher(text.trim());
        if (!matcher.matches()) {
            return null;
        }
        String root = matcher.group(1) + matcher.group(2);
        String quality = matcher.group(3) == null ? "" : matcher.group(3);
        return new Chord(root, quality, matcher.group(4));
    }

    /**
     * Menggeser chord naik atau turun.
     *
     * <p>Not akar dan nada bass sama-sama digeser, sementara karakter
     * kualitas seperti {@code m7} atau {@code add9} tetap utuh. Chord lama
     * tidak berubah — yang dikembalikan adalah chord baru.
     *
     * @param semitones jumlah semitone; positif naik, negatif turun
     * @return chord hasil geser
     */
    public Chord transpose(int semitones) {
        if (semitones == 0) {
            return this;
        }
        String newRoot = shift(root, semitones);
        String newBass = bass == null ? null : shift(bass, semitones);
        return new Chord(newRoot, quality, newBass, position);
    }

    /** True kalau chord ini minor. */
    public boolean isMinor() {
        return quality.startsWith("m") && !quality.startsWith("maj");
    }

    /** Kategori chord untuk kamus chord: MAJOR, MINOR, 7TH, SUSPENDED, ADD9, DIM, atau AUG. */
    public String category() {
        if (quality.contains("sus")) {
            return "SUSPENDED";
        }
        if (quality.contains("add")) {
            return "ADD9";
        }
        if (quality.contains("7")) {
            return "7TH";
        }
        if (quality.contains("dim")) {
            return "DIM";
        }
        if (quality.contains("aug")) {
            return "AUG";
        }
        return isMinor() ? "MINOR" : "MAJOR";
    }

    /** Menggeser satu nada, mempertahankan gaya kres atau mol dari nada asal. */
    private static String shift(String note, int semitones) {
        int moved = Math.floorMod(NOTE_SEMITONES.get(note) + semitones, 12);
        return note.contains("b") ? FLAT_NAMES[moved] : SHARP_NAMES[moved];
    }

    /** Memastikan nada dikenal, supaya chord tidak pernah menyimpan nada ngawur. */
    private static String requireNote(String note) {
        if (note == null || !NOTE_SEMITONES.containsKey(note)) {
            throw new IllegalArgumentException("Nada tidak dikenal: " + note);
        }
        return note;
    }

    public String getRoot() {
        return root;
    }

    public String getQuality() {
        return quality;
    }

    public String getBass() {
        return bass;
    }

    public int getPosition() {
        return position;
    }

    /** Simbol chord dalam bentuk yang biasa ditulis orang, misalnya "G/B". */
    @Override
    public String toString() {
        return root + quality + (bass == null ? "" : "/" + bass);
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Chord chord)) {
            return false;
        }
        return position == chord.position
                && root.equals(chord.root)
                && quality.equals(chord.quality)
                && Objects.equals(bass, chord.bass);
    }

    @Override
    public int hashCode() {
        return Objects.hash(root, quality, bass, position);
    }
}
