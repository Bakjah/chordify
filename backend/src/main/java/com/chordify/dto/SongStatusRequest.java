package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Permintaan admin untuk mengubah status sebuah lagu.
 */
public record SongStatusRequest(@NotBlank String status) {
}
