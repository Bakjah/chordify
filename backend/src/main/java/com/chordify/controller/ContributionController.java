package com.chordify.controller;

import com.chordify.dto.PageResponse;
import com.chordify.dto.SongResponse;
import com.chordify.service.ContributionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint kontribusi member: lagu-lagu yang ia sumbangkan.
 */
@RestController
@RequestMapping("/api/contributions")
public class ContributionController {

    private final ContributionService contributionService;

    public ContributionController(ContributionService contributionService) {
        this.contributionService = contributionService;
    }

    /** Lagu-lagu milik member yang sedang masuk. */
    @GetMapping
    public PageResponse<SongResponse> listMine(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size,
                                               Authentication authentication) {
        return contributionService.listMine(userId(authentication), page, size);
    }

    /** Id user dari token yang dipakai; null kalau request tanpa login. */
    private Long userId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }
}
