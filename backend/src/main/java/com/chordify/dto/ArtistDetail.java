package com.chordify.dto;

import java.util.List;

/**
 * Detail seorang artis: profilnya singkat plus daftar lagunya.
 */
public record ArtistDetail(ArtistResponse artist, List<ArtistSong> songs) {
}
