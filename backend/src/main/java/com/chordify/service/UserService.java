package com.chordify.service;

import com.chordify.dto.LibrarySongResponse;
import com.chordify.dto.PublicProfileResponse;
import com.chordify.exception.ApiException;
import com.chordify.model.Member;
import com.chordify.model.Song;
import com.chordify.model.SongStatus;
import com.chordify.model.User;
import com.chordify.repository.FavoriteRepository;
import com.chordify.repository.SongRepository;
import com.chordify.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Profil publik seorang pengguna.
 *
 * <p>Yang ditampilkan hanya bagian yang memang publik: nama, status verifikasi,
 * dan lagu-lagu yang sudah dipublish. Email dan hash password tidak pernah
 * keluar dari service ini.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final FavoriteRepository favoriteRepository;

    public UserService(UserRepository userRepository,
                       SongRepository songRepository,
                       FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.songRepository = songRepository;
        this.favoriteRepository = favoriteRepository;
    }

    /** Profil publik seorang kontributor, dicari lewat username-nya. */
    @Transactional(readOnly = true)
    public PublicProfileResponse profile(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pengguna tidak ditemukan."));

        List<Song> published = songRepository.findByContributorIdOrderByCreatedAtDesc(user.getId()).stream()
                .filter(song -> song.getStatus() == SongStatus.PUBLISHED)
                .toList();

        String verifiedCategory = user instanceof Member member ? member.getVerifiedCategory() : null;

        return new PublicProfileResponse(
                user.getUsername(),
                user.getRole(),
                user.isVerified(),
                verifiedCategory,
                user.getBio(),
                user.getProfilePhotoUrl(),
                user.getCreatedAt(),
                published.size(),
                (int) favoriteRepository.countByUserId(user.getId()),
                published.stream().map(LibrarySongResponse::from).toList());
    }
}
