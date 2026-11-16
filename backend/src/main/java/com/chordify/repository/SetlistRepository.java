package com.chordify.repository;

import com.chordify.model.Setlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SetlistRepository extends JpaRepository<Setlist, Long> {
}
