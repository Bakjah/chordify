package com.chordify.dto;

import com.chordify.model.Song;
import com.chordify.model.User;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Bentuk lagu yang dikirim ke frontend.
 *
 * <p>Namanya sengaja disamakan dengan bentuk kartu di frontend supaya
 * hasil API bisa langsung dipakai tanpa perubahan tampilan.
 */
public record SongResponse(
        Long id,
        String title,
        String artist,
        Long artistId,
        String genre,
        Long genreId,
        String key,
        String difficulty,
        String artwork,
        String contributor,
        boolean verified,
        List<LyricLine> lyrics,
        int capo,
        String audio,
        String audioName,
        String status,
        LocalDateTime createdAt) {

    /**
     * Mengubah entity lagu menjadi respons.
     *
     * <p>Status verifikasi diambil lewat {@link User#isVerified()}, jadi pemanggil
     * tidak perlu tahu apakah kontributornya member atau admin (polymorfisme).
     */
    public static SongResponse from(Song song, List<LyricLine> lyrics) {
        User contributor = song.getContributor();
        return new SongResponse(
                song.getId(),
                song.getTitle(),
                song.getArtist().getName(),
                song.getArtist().getId(),
                song.getGenre().getName(),
                song.getGenre().getId(),
                song.getKeySignature(),
                song.getDifficulty(),
                song.getArtworkColor(),
                contributor == null ? null : "@" + contributor.getUsername(),
                contributor != null && contributor.isVerified(),
                lyrics,
                song.getCapo(),
                song.getAudioPath(),
                song.getAudioName(),
                song.getStatus().name(),
                song.getCreatedAt());
    }
}
