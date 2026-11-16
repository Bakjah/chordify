package com.chordify.media;

import com.chordify.contract.MediaStorage;
import com.chordify.dto.StoredMedia;
import com.chordify.exception.ApiException;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Penyimpanan media di disk lokal.
 *
 * <p>Berkas disimpan di folder {@code app.media.dir} (default {@code uploads})
 * dan dilayani Spring Boot sebagai sumber statis lewat {@code /uploads/**}.
 * Nama berkas di disk dibuat acak supaya nama asli dari pengguna tidak dipakai
 * sebagai path (mencegah path traversal dan tabrakan nama).
 */
@Component
public class FileSystemMediaStorage implements MediaStorage {

    /** Ekstensi audio yang boleh diunggah. */
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("mp3", "mp4", "m4a", "mp4a", "aac", "wav", "ogg", "flac");

    private final Path root;

    public FileSystemMediaStorage(@Value("${app.media.dir:uploads}") String directory) {
        this.root = Paths.get(directory).toAbsolutePath().normalize();
    }

    @Override
    public StoredMedia store(String namespace, String filename, String contentType, byte[] content) {
        String extension = extensionOf(filename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Format audio belum didukung. Pakai mp3, mp4, m4a, mp4a, aac, wav, ogg, atau flac.");
        }

        String storedName = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        Path folder = root.resolve(namespace).normalize();
        Path target = folder.resolve(storedName).normalize();
        if (!target.startsWith(root)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Lokasi berkas tidak valid");
        }

        try {
            Files.createDirectories(folder);
            Files.write(target, content);
        } catch (IOException ex) {
            throw new UncheckedIOException("Gagal menyimpan berkas audio", ex);
        }

        return new StoredMedia(
                "/uploads/" + namespace + "/" + storedName,
                filename == null || filename.isBlank() ? storedName : filename,
                contentType == null || contentType.isBlank() ? guessType(extension) : contentType,
                content.length);
    }

    @Override
    public void delete(String url) {
        if (url == null || url.isBlank()) {
            return;
        }
        Path target = resolve(url);
        if (target == null) {
            return;
        }
        try {
            Files.deleteIfExists(target);
        } catch (IOException ex) {
            throw new UncheckedIOException("Gagal menghapus berkas audio", ex);
        }
    }

    /** Folder tempat berkas disimpan, dipakai saat merekstal resource handler. */
    public Path root() {
        return root;
    }

    /** Mengubah URL publik menjadi path di disk; null kalau di luar folder storage. */
    private Path resolve(String url) {
        String relative = url.startsWith("/uploads/") ? url.substring("/uploads/".length()) : url;
        Path target = root.resolve(relative).normalize();
        return target.startsWith(root) ? target : null;
    }

    /** Ekstensi berkas dalam huruf kecil, tanpa titik. */
    private static String extensionOf(String filename) {
        if (filename == null) {
            return "";
        }
        int dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) {
            return "";
        }
        return filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    /** Tipe MIME cadangan kalau browser tidak mengirim tipe yang benar. */
    private static String guessType(String extension) {
        return switch (extension) {
            case "mp3" -> "audio/mpeg";
            case "mp4", "m4a", "mp4a", "aac" -> "audio/mp4";
            case "wav" -> "audio/wav";
            case "ogg" -> "audio/ogg";
            case "flac" -> "audio/flac";
            default -> "application/octet-stream";
        };
    }
}
