package com.chordify.dto;

public record AuthResponse(String token, UserResponse user) {
}
