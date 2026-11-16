package com.chordify.config;

import com.chordify.media.FileSystemMediaStorage;
import jakarta.servlet.MultipartConfigElement;
import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Konfigurasi web untuk berkas media.
 *
 * <p>Folder penyimpanan audio dilayani sebagai sumber statis di {@code /uploads/**}
 * supaya file audio bisa diputar langsung oleh browser, termasuk untuk tamu yang
 * belum login.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final FileSystemMediaStorage mediaStorage;

    public WebConfig(FileSystemMediaStorage mediaStorage) {
        this.mediaStorage = mediaStorage;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path root = mediaStorage.root();
        // Slash penutup wajib: tanpa itu Spring Boot menyelesaikan alamat statis
        // relatif terhadap folder induk, bukan folder penyimpanan.
        String location = root.toUri().toString();
        if (!location.endsWith("/")) {
            location = location + "/";
        }
        registry.addResourceHandler("/uploads/**").addResourceLocations(location);
    }

    /**
     * Batas ukuran berkas unggahan.
     *
     * <p>Nilainya diambil lewat {@code app.media.max-size-mb} supaya tidak perlu
     * menulis ulang berkas {@code application.properties}.
     */
    @Bean
    MultipartConfigElement multipartConfigElement(@Value("${app.media.max-size-mb:25}") long maxSizeMb) {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofMegabytes(maxSizeMb));
        factory.setMaxRequestSize(DataSize.ofMegabytes(maxSizeMb + 1));
        return factory.createMultipartConfig();
    }
}
