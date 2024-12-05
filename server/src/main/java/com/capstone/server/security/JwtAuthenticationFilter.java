package com.capstone.server.security;

import com.capstone.server.service.JwtService;
import com.capstone.server.service.TokenBlacklistService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenBlacklistService blacklistService;

    public JwtAuthenticationFilter(JwtService jwtService, TokenBlacklistService blacklistService) {
        this.jwtService = jwtService;
        this.blacklistService = blacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 헤더에서 토큰 추출
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            // 블랙리스트에 있는지 확인
            if (blacklistService.isTokenBlacklisted(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Token is blacklisted.\"}");
                return;
            }

            // 토큰 유효성 검증
            if (jwtService.validateToken(token)) {
                String email = jwtService.extractClaims(token).getSubject();
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, null);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 다음 필터로 이동
        filterChain.doFilter(request, response);
    }
}
