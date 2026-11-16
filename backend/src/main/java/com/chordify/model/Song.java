package com.chordify.model;

import jakarta.persistence.*;

/** TODO: lengkapi kolom & relasi sesuai ERD di makalah. */
@Entity
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() { return id; }
}
