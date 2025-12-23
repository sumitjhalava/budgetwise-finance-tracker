package com.budgetwise.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private String expirationRaw;

    private long expirationMs;

    @PostConstruct
    public void init() {
        try {
            // allow values like "86400000" or "86400000#24hours" — extract digits
            String digits = expirationRaw.replaceAll("[^0-9]", "");
            this.expirationMs = Long.parseLong(digits);
        } catch (Exception ex) {
            // fallback to 24 hours
            this.expirationMs = 86400000L;
        }
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String subject) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return getClaims(token).getSubject();
        } catch (JwtException ex) {
            logger.warn("Failed to extract username from token: {}", ex.getMessage(), ex);
            return null;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (ExpiredJwtException ex) {
            logger.warn("JWT token is expired: {}", ex.getMessage(), ex);
            return false;
        } catch (UnsupportedJwtException ex) {
            logger.error("JWT token is unsupported: {}", ex.getMessage(), ex);
            return false;
        } catch (MalformedJwtException ex) {
            logger.error("JWT token is malformed: {}", ex.getMessage(), ex);
            return false;
        } catch (JwtException ex) {
            logger.error("JWT validation failed: {}", ex.getMessage(), ex);
            return false;
        }
    }
}
