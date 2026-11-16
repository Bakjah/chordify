package com.chordify.service;

import com.chordify.contract.Searchable;
import com.chordify.dto.AdminArtistResponse;
import com.chordify.dto.ArtistDetail;
import com.chordify.dto.ArtistRequest;
import com.chordify.dto.ArtistResponse;
import com.chordify.dto.ArtistSong;
import com.chordify.exception.ApiException;
import com.chordify.model.Artist;
import com.chordify.repository.ArtistRepository;
import com.chordify.repository.SongRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Layanan artis: daftar artis dan detail lagu milik seorang artis.
 *
 * <p>Sama seperti {@link SongService}, class ini memenuhi kontrak
 * {@link Searchable} sehingga pencarian bisa dipakai lewat tipe kontrak.
 */
@Service
public class ArtistService implements Searchable<Artist> {

    private static final int MAX_PAGE_SIZE = 100;

    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;

    public ArtistService(ArtistRepository artistRepository, SongRepository songRepository) {
        this.artistRepository = artistRepository;
        this.songRepository = songRepository;
    }

    /**
     * Pencarian artis dari kontrak {@link Searchable}: pencocokan nama.
     *
     * @param keyword kata kunci pencarian
     * @return daftar artis yang namanya mengandung kata kunci
     */
    @Override
    @Transactional(readOnly = true)
    public List<Artist> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }
        String needle = keyword.trim().toLowerCase();
        return artistRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .filter(artist -> artist.getName().toLowerCase().contains(needle))
                .limit(MAX_PAGE_SIZE)
                .toList();
    }

    /** Semua artis, urut nama. */
    @Transactional(readOnly = true)
    public List<ArtistResponse> list() {
        return artistRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(ArtistResponse::from)
                .toList();
    }

    /** Detail satu artis, termasuk daftar lagunya. */
    @Transactional(readOnly = true)
    public ArtistDetail detail(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Artis tidak ditemukan"));
        List<ArtistSong> songs = songRepository.findByArtistIdOrderByTitleAsc(id).stream()
                .map(song -> new ArtistSong(song.getId(), song.getTitle(), song.getArtworkColor()))
                .toList();
        return new ArtistDetail(ArtistResponse.from(artist), songs);
    }

    // ------------------------------------------------------------- administration

    /** Daftar artis untuk tabel "Manage Artists", lengkap dengan jumlah lagunya. */
    @Transactional(readOnly = true)
    public List<AdminArtistResponse> listForAdmin() {
        return artistRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(artist -> AdminArtistResponse.from(artist, songRepository.countByArtistId(artist.getId())))
                .toList();
    }

    /** Admin menambah artis baru. */
    @Transactional
    public AdminArtistResponse create(ArtistRequest request) {
        String name = request.name().trim();
        if (artistRepository.existsByNameIgnoreCase(name)) {
            throw new ApiException(HttpStatus.CONFLICT, "Artis dengan nama itu sudah ada");
        }
        Artist artist = new Artist(name);
        artist.setArtworkColor(blankToNull(request.artwork()));
        artist.setBio(blankToNull(request.bio()));
        return AdminArtistResponse.from(artistRepository.save(artist), 0);
    }

    /** Admin mengubah data artis. */
    @Transactional
    public AdminArtistResponse update(Long id, ArtistRequest request) {
        Artist artist = findArtist(id);
        String name = request.name().trim();
        artistRepository.findByNameIgnoreCase(name).ifPresent(lain -> {
            if (!lain.getId().equals(id)) {
                throw new ApiException(HttpStatus.CONFLICT, "Artis dengan nama itu sudah ada");
            }
        });
        artist.setName(name);
        artist.setArtworkColor(blankToNull(request.artwork()));
        artist.setBio(blankToNull(request.bio()));
        artistRepository.save(artist);
        return AdminArtistResponse.from(artist, songRepository.countByArtistId(id));
    }

    /**
     * Admin menghapus artis.
     *
     * <p>Artis yang masih punya lagu tidak boleh dihapus karena lagu itu
     * menunjuk ke artis ini lewat foreign key.
     */
    @Transactional
    public void delete(Long id) {
        Artist artist = findArtist(id);
        long songCount = songRepository.countByArtistId(id);
        if (songCount > 0) {
            throw new ApiException(
                    HttpStatus.CONFLICT, "Artis masih punya " + songCount + " lagu, hapus lagunya dulu");
        }
        artistRepository.delete(artist);
    }

    private Artist findArtist(Long id) {
        return artistRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Artis tidak ditemukan"));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
