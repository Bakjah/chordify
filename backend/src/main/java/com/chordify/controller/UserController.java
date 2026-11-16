package com.chordify.controller;

import com.chordify.dto.PublicProfileResponse;
import com.chordify.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint profil publik pengguna.
 *
 * <p>Terbuka untuk tamu, jadi hanya data yang memang publik yang dikirim.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /** Profil publik seorang kontributor. */
    @GetMapping("/{username}/profile")
    public PublicProfileResponse profile(@PathVariable String username) {
        return userService.profile(username);
    }
}
