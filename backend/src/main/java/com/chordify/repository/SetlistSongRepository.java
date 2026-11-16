package com.chordify.repository;

import com.chordify.model.SetlistSong;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SetlistSongRepository extends JpaRepository<SetlistSong, Long> {

    /** Isi sebuah setlist menurut urutan yang ditetapkan member. */
    List<SetlistSong> findBySetlistIdOrderByPositionAsc(Long setlistId);

    /** Satu baris setlist-lagu tertentu. */
    Optional<SetlistSong> findBySetlistIdAndSongId(Long setlistId, Long songId);

    /** Jumlah lagu di dalam sebuah setlist. */
    int countBySetlistId(Long setlistId);
}
