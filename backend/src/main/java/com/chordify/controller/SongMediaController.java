package com.chordify.controller;

import com.chordify.dto.MediaResponse;
import com.chordify.exception.ApiException;
import com.chordify.service.SongService;
import java.io.IOException;
import java.io.UncheckedIOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Endpoint media audio playback untuk sebuah lagu.
 *
 * <p>Berkas disimpan lewat {@link com.chordify.contract.MediaStorage}, lalu
 * dilayani Spring Boot sebagai sumber statis di {@code /uploads/**}. Hanya
 * pemilik lagu atau admin yang boleh mengunggah dan menghapus media.
 */
@RestController
@RequestMapping("/api/songs")
public class SongMediaController {

    private final SongService songService;
    private final long maxSizeBytes;

    public SongMediaController(SongService songService,
                               @Value("${app.media.max-size-mb:25}") long maxSizeMb) {
        this.songService = songService;
        this.maxSizeBytes = maxSizeMb * 1024L * 1024L;
    }

    /**
     * Mengunggah atau mengganti berkas audio playback sebuah lagu.
     *
     * @param id id lagu yang diunggah
     * @param file berkas audio dari pengguna
     * @param authentication sesi pengguna yang mengunggah
     * @return media yang sekarang menempel pada lagu
     */
    @PostMapping(value = "/{id}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MediaResponse upload(@PathVariable Long id,
                                @RequestPart("file") MultipartFile file,
                                Authentication authentication) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Berkas audio belum dipilih");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new ApiException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "Ukuran berkas melebihi batas " + (maxSizeBytes / (1024 * 1024)) + " MB");
        }
        try {
            return songService.attachMedia(
                    id,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes(),
                    userId(authentication));
        } catch (IOException ex) {
            throw new UncheckedIOException("Gagal membaca berkas audio", ex);
        }
    }

    /** Menghapus berkas audio playback sebuah lagu. */
    @DeleteMapping("/{id}/media")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long id, Authentication authentication) {
        songService.removeMedia(id, userId(authentication));
    }

    /** Id user dari token yang dipakai; null kalau request tanpa login. */
    private Long userId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }
}
