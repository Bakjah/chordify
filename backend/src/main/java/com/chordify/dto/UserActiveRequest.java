package com.chordify.dto;

/**
 * Permintaan admin untuk mengaktifkan atau menonaktifkan sebuah akun.
 */
public record UserActiveRequest(boolean active) {
}
