package com.chordify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data yang dikirim member saat membuat atau mengubah setlist.
 */
public record SetlistRequest(
        @NotBlank @Size(max = 120) String title,
        @Size(max = 255) String description,
        @Size(max = 7) String artwork) {
}
