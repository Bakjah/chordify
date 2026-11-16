package com.chordify.repository;

import com.chordify.model.SetlistSong;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SetlistSongRepository extends JpaRepository<SetlistSong, Long> {
}
