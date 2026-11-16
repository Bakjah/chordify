package com.chordify.repository;

import com.chordify.model.PlaylistSong;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, Long> {

    /** Isi sebuah playlist menurut urutan yang ditetapkan member. */
    List<PlaylistSong> findByPlaylistIdOrderByPositionAsc(Long playlistId);

    /** Satu baris playlist-lagu tertentu. */
    Optional<PlaylistSong> findByPlaylistIdAndSongId(Long playlistId, Long songId);

    /** Jumlah lagu di dalam sebuah playlist. */
    int countByPlaylistId(Long playlistId);
}
