package com.chordify.dto;

import com.chordify.model.Artist;

public record ArtistResponse(Long id, String name, String artwork, String bio) {

    public static ArtistResponse from(Artist artist) {
        return new ArtistResponse(
                artist.getId(),
                artist.getName(),
                artist.getArtworkColor(),
                artist.getBio());
    }
}
