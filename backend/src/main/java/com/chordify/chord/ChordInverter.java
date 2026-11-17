package com.chordify.chord;

/**
 * Membalik urutan nada sebuah chord (inversi).
 *
 * <p>Chord biasa ditulis sebagai akar saja, misalnya {@code C}. Chord inversi
 * menyebut nada bass-nya, misalnya {@code C/E} (inversi pertama) dan
 * {@code C/G} (inversi kedua). Bentuk {@code C/E} sangat sering dipakai di
 * chord sheet lagu Indonesia, jadi layak jadi fitur sendiri.
 *
 * <p>Class ini mewarisi template method dari {@link ChordProcessor}: cara
 * membaca teks chord dan memecahnya per token sudah ditangani di parent, yang
 * ditegaskan di sini hanya cara memilih nada bass. Parameter {@code degree}
 * dipakai berbeda dengan {@link ChordTransposer} — di situ artinya jumlah
 * semitone, di sini artinya tingkat inversi (1 = nada ketiga, 2 = nada kelima).
 *
 * <p>Sengaja bukan {@code @Component}: kalau jadi bean, injeksi
 * {@link ChordProcessor} di service akan ambigu dan aplikasi gagal start.
 * Processor ini dipakai langsung oleh service yang membutuhkannya.
 */
public class ChordInverter extends ChordProcessor {

    /** Nama nada dalam urutan huruf, dipakai untuk menghitung huruf nada bass. */
    private static final String LETTERS = "CDEFGAB";

    /** Jumlah semitone tiap nada natural, dihitung dari C. */
    private static final int[] NATURAL_SEMITONES = {0, 2, 4, 5, 7, 9, 11};

    /**
     * Membalik satu chord.
     *
     * <p>[PBO-9] Method Overriding — implementasi subclass untuk method abstrak
     * {@code process(Chord, int)} milik {@link ChordProcessor}.
     *
     * @param chord chord yang akan dibalik
     * @param degree tingkat inversi: 1 untuk nada ketiga, 2 untuk nada kelima
     * @return simbol chord hasil inversi
     */
    @Override
    public String process(Chord chord, int degree) {
        if (chord == null) {
            return null;
        }
        int step = Math.floorMod(degree, 3);
        if (step == 0) {
            return chord.toString();
        }
        String bass = step == 1 ? thirdOf(chord) : fifthOf(chord);
        return new Chord(chord.getRoot(), chord.getQuality(), bass, chord.getPosition()).toString();
    }

    /** Nada ketiga chord: tiga nada di atas akar, major atau minor sesuai kualitas. */
    private String thirdOf(Chord chord) {
        int semitones = isMinorish(chord.getQuality()) ? 3 : 4;
        return bassNote(chord.getRoot(), 2, semitones);
    }

    /** Nada kelima chord: tujuh nada di atas akar, diminished atau augmented sesuai kualitas. */
    private String fifthOf(Chord chord) {
        String quality = chord.getQuality();
        int semitones = 7;
        if (quality.contains("dim")) {
            semitones = 6;
        } else if (quality.contains("aug")) {
            semitones = 8;
        }
        return bassNote(chord.getRoot(), 4, semitones);
    }

    /**
     * Menghitung nama nada bass dari nada akar.
     *
     * <p>Huruf nada bass selalu mengikuti pola chord: huruf ketiga untuk nada
     * ketiga, huruf kelima untuk nada fifth — bukan sembarang nama nada yang
     * kebetulan sama suaranya. Kres/mol dihitung dari selisih semitone, jadi
     * akar {@code Bb} menghasilkan {@code D} (bukan {@code D#}).
     */
    private static String bassNote(String root, int letterOffset, int semitones) {
        int rootIndex = LETTERS.indexOf(root.charAt(0));
        int rootSemitone = NATURAL_SEMITONES[rootIndex] + accidentalOf(root);
        int targetIndex = (rootIndex + letterOffset) % LETTERS.length();
        int targetPitch = Math.floorMod(rootSemitone + semitones, 12);

        int difference = targetPitch - NATURAL_SEMITONES[targetIndex];
        int accidental = Math.floorMod(difference, 12);
        if (accidental > 6) {
            accidental -= 12;
        }

        if (accidental == 0) {
            return LETTERS.charAt(targetIndex) + "";
        }
        if (accidental == 1) {
            return LETTERS.charAt(targetIndex) + "#";
        }
        if (accidental == -1) {
            return LETTERS.charAt(targetIndex) + "b";
        }
        // Nada di luar kres/mol tunggal (misalnya A# mayor) ditulis dengan
        // nada natural yang sama suaranya, supaya tetap chord yang bisa dimainkan.
        return naturalLetterOf(targetPitch);
    }

    /** Nada natural yang suaranya sama dengan pitch class yang diminta. */
    private static String naturalLetterOf(int pitchClass) {
        for (int index = 0; index < LETTERS.length(); index++) {
            if (NATURAL_SEMITONES[index] == pitchClass) {
                return String.valueOf(LETTERS.charAt(index));
            }
        }
        return "C";
    }

    /** Selisih semitone nada akar dari nada natural: kres satu, mol minus satu. */
    private static int accidentalOf(String note) {
        if (note.length() < 2) {
            return 0;
        }
        return note.charAt(1) == '#' ? 1 : -1;
    }

    /** True kalau kualitas chord memakai nada ketiga minor (m, min, dim). */
    private static boolean isMinorish(String quality) {
        return (quality.startsWith("m") && !quality.startsWith("maj")) || quality.contains("dim");
    }
}
