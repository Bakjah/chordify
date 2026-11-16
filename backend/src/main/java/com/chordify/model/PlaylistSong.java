package com.chordify.model;

import jakarta.persistence.*;

/** TODO: lengkapi kolom & relasi sesuai ERD di makalah. */
@Entity
@Table(name = "playlist_songs")
public class PlaylistSong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() { return id; }
}
