package com.chordify.controller;

import com.chordify.dto.VerificationApplyRequest;
import com.chordify.dto.VerificationResponse;
import com.chordify.service.VerificationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint pengajuan verifikasi Verified User.
 *
 * <p>Admin memakai {@code /api/admin/verification} untuk menilai pengajuan.
 */
@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    /** Mengirim pengajuan verifikasi baru. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VerificationResponse submit(@Valid @RequestBody VerificationApplyRequest request,
                                       Authentication authentication) {
        return verificationService.submit(userId(authentication), request);
    }

    /** Pengajuan milik member yang sedang login. */
    @GetMapping("/mine")
    public List<VerificationResponse> listMine(Authentication authentication) {
        return verificationService.listMine(userId(authentication));
    }

    /** Id user dari token yang dipakai; null kalau request tanpa login. */
    private Long userId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }
}
