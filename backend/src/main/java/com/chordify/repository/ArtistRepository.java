package com.chordify.repository;

import com.chordify.model.Artist;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    Optional<Artist> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
