package com.chordify.security;

import com.chordify.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Implementasi {@link TokenService} memakai JWT.
 *
 * <p>Setiap token punya id sendiri (claim {@code jti}) supaya pencabutannya bisa
 * dilacak lewat {@link RevokedTokenStore}.
 */
@Service
public class JwtService implements TokenService {

    private final SecretKey key;
    private final long expirationMs;
    private final RevokedTokenStore revokedTokens;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-ms}") long expirationMs,
                      RevokedTokenStore revokedTokens) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
        this.revokedTokens = revokedTokens;
    }

    @Override
    public String issue(User user) {
        Date now = new Date();
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(String.valueOf(user.getId()))
                .claim("role", user.getRole())
                .claim("username", user.getUsername())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    /** @return claims jika token valid, selain itu null. */
    @Override
    public Claims parse(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }

    @Override
    public void revoke(String token) {
        Claims claims = parse(token);
        if (claims == null || claims.getId() == null || claims.getExpiration() == null) {
            return;
        }
        revokedTokens.revoke(claims.getId(), claims.getExpiration().toInstant());
    }

    @Override
    public boolean isRevoked(Claims claims) {
        return claims != null && claims.getId() != null && revokedTokens.isRevoked(claims.getId());
    }
}
