package com.chordify.repository;

import com.chordify.model.SongHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongHistoryRepository extends JpaRepository<SongHistory, Long> {
}
