package com.chordify.repository;

import com.chordify.model.Song;
import com.chordify.model.SongStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SongRepository extends JpaRepository<Song, Long> {

    /** Lagu yang sudah dipublish, untuk library publik. */
    Page<Song> findByStatus(SongStatus status, Pageable pageable);

    /**
     * Pencarian bebas: judul, nama artis, atau nama genre.
     *
     * <p>Query ini yang dipakai service untuk satisfy kontrak
     * {@link com.chordify.contract.Searchable}.
     */
    @Query("""
            select s from Song s
            where s.status = com.chordify.model.SongStatus.PUBLISHED
              and (lower(s.title) like lower(concat('%', :keyword, '%'))
                   or lower(s.artist.name) like lower(concat('%', :keyword, '%'))
                   or lower(s.genre.name) like lower(concat('%', :keyword, '%')))
            """)
    Page<Song> search(@Param("keyword") String keyword, Pageable pageable);

    /** Pencarian khusus judul, untuk pencarian yang diketik pengguna. */
    @Query("""
            select s from Song s
            where s.status = com.chordify.model.SongStatus.PUBLISHED
              and lower(s.title) like lower(concat('%', :keyword, '%'))
            """)
    Page<Song> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    /** Lagu yang disumbangkan oleh seorang kontributor. */
    Page<Song> findByContributorId(Long contributorId, Pageable pageable);

    /** Semua lagu milik seorang kontributor, tanpa paginasi. */
    List<Song> findByContributorIdOrderByCreatedAtDesc(Long contributorId);

    /** Lagu milik artis tertentu. */
    List<Song> findByArtistIdOrderByTitleAsc(Long artistId);

    /** Lagu dengan judul tertentu, dipakai seeder biar tidak membuat duplikat. */
    boolean existsByTitleIgnoreCase(String title);

    /** Mencari satu lagu berdasarkan judulnya. */
    Optional<Song> findByTitleIgnoreCase(String title);

    /** Jumlah lagu dengan status tertentu — dipakai kartu statistik admin. */
    long countByStatus(SongStatus status);

    /** Jumlah lagu milik seorang artis — dipakai tabel "Manage Artists". */
    long countByArtistId(Long artistId);

    /** Jumlah lagu dengan sebuah genre — dipakai tabel "Manage Genres". */
    long countByGenreId(Long genreId);

    /** Semua lagu, yang terbaru di atas — dipakai tabel "Manage Songs" admin. */
    List<Song> findAllByOrderByCreatedAtDesc();
}
