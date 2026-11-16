package com.chordify.service;

import com.chordify.dto.PageResponse;
import com.chordify.dto.SongResponse;
import org.springframework.stereotype.Service;

/**
 * Kontribusi member: lagu-lagu yang ia sumbangkan ke Chordify.
 *
 * <p>Logikanya tetap milik {@link SongService} — service ini hanya jadi pintu
 * masuk yang jelas untuk sisi member.
 */
@Service
public class ContributionService {

    private final SongService songService;

    public ContributionService(SongService songService) {
        this.songService = songService;
    }

    /** Semua lagu yang disumbangkan member yang sedang login. */
    public PageResponse<SongResponse> listMine(Long userId, int page, int size) {
        return songService.listByContributor(userId, page, size);
    }
}
