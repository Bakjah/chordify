package com.chordify.controller;

import com.chordify.dto.LibrarySongResponse;
import com.chordify.dto.PlaylistRequest;
import com.chordify.dto.PlaylistResponse;
import com.chordify.dto.SetlistRequest;
import com.chordify.dto.SetlistResponse;
import com.chordify.service.LibraryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint library pribadi member: favorit, playlist, setlist, dan riwayat.
 *
 * <p>Semua endpoint memakai user yang sedang login, jadi tidak ada parameter
 * id-member yang bisa dimanipulasi dari luar.
 */
@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    // ---------------------------------------------------------------- favorit

    /** Lagu-lagu yang ditandai sebagai favorit. */
    @GetMapping("/favorites")
    public List<LibrarySongResponse> listFavorites(Authentication authentication) {
        return libraryService.listFavorites(userId(authentication));
    }

    /** Menandai sebuah lagu sebagai favorit. */
    @PostMapping("/favorites/{songId}")
    @ResponseStatus(HttpStatus.CREATED)
    public LibrarySongResponse addFavorite(@PathVariable Long songId, Authentication authentication) {
        return libraryService.addFavorite(userId(authentication), songId);
    }

    /** Membatalkan status favorit. */
    @DeleteMapping("/favorites/{songId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(@PathVariable Long songId, Authentication authentication) {
        libraryService.removeFavorite(userId(authentication), songId);
    }

    // --------------------------------------------------------------- playlist

    /** Playlist milik member yang sedang masuk. */
    @GetMapping("/playlists")
    public List<PlaylistResponse> listPlaylists(Authentication authentication) {
        return libraryService.listPlaylists(userId(authentication));
    }

    /** Membuat playlist baru. */
    @PostMapping("/playlists")
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistResponse createPlaylist(@Valid @RequestBody PlaylistRequest request,
                                           Authentication authentication) {
        return libraryService.createPlaylist(userId(authentication), request);
    }

    /** Mengubah playlist milik sendiri. */
    @PutMapping("/playlists/{id}")
    public PlaylistResponse updatePlaylist(@PathVariable Long id,
                                           @Valid @RequestBody PlaylistRequest request,
                                           Authentication authentication) {
        return libraryService.updatePlaylist(userId(authentication), id, request);
    }

    /** Menghapus playlist milik sendiri. */
    @DeleteMapping("/playlists/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlaylist(@PathVariable Long id, Authentication authentication) {
        libraryService.deletePlaylist(userId(authentication), id);
    }

    /** Lagu-lagu di dalam sebuah playlist. */
    @GetMapping("/playlists/{id}/songs")
    public List<LibrarySongResponse> listPlaylistSongs(@PathVariable Long id, Authentication authentication) {
        return libraryService.listPlaylistSongs(userId(authentication), id);
    }

    /** Menambahkan lagu ke playlist. */
    @PostMapping("/playlists/{id}/songs/{songId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addSongToPlaylist(@PathVariable Long id,
                                  @PathVariable Long songId,
                                  Authentication authentication) {
        libraryService.addSongToPlaylist(userId(authentication), id, songId);
    }

    /** Menghapus lagu dari playlist. */
    @DeleteMapping("/playlists/{id}/songs/{songId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSongFromPlaylist(@PathVariable Long id,
                                       @PathVariable Long songId,
                                       Authentication authentication) {
        libraryService.removeSongFromPlaylist(userId(authentication), id, songId);
    }

    // ---------------------------------------------------------------- setlist

    /** Setlist milik member yang sedang masuk. */
    @GetMapping("/setlists")
    public List<SetlistResponse> listSetlists(Authentication authentication) {
        return libraryService.listSetlists(userId(authentication));
    }

    /** Membuat setlist baru. */
    @PostMapping("/setlists")
    @ResponseStatus(HttpStatus.CREATED)
    public SetlistResponse createSetlist(@Valid @RequestBody SetlistRequest request,
                                          Authentication authentication) {
        return libraryService.createSetlist(userId(authentication), request);
    }

    /** Mengubah setlist milik sendiri. */
    @PutMapping("/setlists/{id}")
    public SetlistResponse updateSetlist(@PathVariable Long id,
                                          @Valid @RequestBody SetlistRequest request,
                                          Authentication authentication) {
        return libraryService.updateSetlist(userId(authentication), id, request);
    }

    /** Menghapus setlist milik sendiri. */
    @DeleteMapping("/setlists/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSetlist(@PathVariable Long id, Authentication authentication) {
        libraryService.deleteSetlist(userId(authentication), id);
    }

    /** Lagu-lagu di dalam sebuah setlist. */
    @GetMapping("/setlists/{id}/songs")
    public List<LibrarySongResponse> listSetlistSongs(@PathVariable Long id, Authentication authentication) {
        return libraryService.listSetlistSongs(userId(authentication), id);
    }

    /** Menambahkan lagu ke setlist. */
    @PostMapping("/setlists/{id}/songs/{songId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addSongToSetlist(@PathVariable Long id,
                                 @PathVariable Long songId,
                                 Authentication authentication) {
        libraryService.addSongToSetlist(userId(authentication), id, songId);
    }

    /** Menghapus lagu dari setlist. */
    @DeleteMapping("/setlists/{id}/songs/{songId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSongFromSetlist(@PathVariable Long id,
                                      @PathVariable Long songId,
                                      Authentication authentication) {
        libraryService.removeSongFromSetlist(userId(authentication), id, songId);
    }

    // ---------------------------------------------------------------- riwayat

    /** Lagu-lagu yang terakhir dilihat member. */
    @GetMapping("/history")
    public List<LibrarySongResponse> listHistory(Authentication authentication,
                                                  @RequestParam(defaultValue = "20") int limit) {
        return libraryService.listHistory(userId(authentication), limit);
    }

    /** Mencatat bahwa member baru saja membuka sebuah lagu. */
    @PostMapping("/history/{songId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void recordView(@PathVariable Long songId, Authentication authentication) {
        libraryService.recordView(userId(authentication), songId);
    }

    /** Id user dari token yang dipakai; null kalau request tanpa login. */
    private Long userId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }
}
