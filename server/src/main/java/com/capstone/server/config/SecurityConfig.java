package com.capstone.server.config;

import com.capstone.server.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login", "/oauth2/authorize", "/error").permitAll() // 인증 불필요 경로
                        .requestMatchers("/oauth2/loginSuccess").authenticated() // 인증 필요 경로
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin())) // H2 콘솔 등 프레임 설정
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("https://tamtam2.shop/oauth2/loginSuccess", false) // OAuth2 성공 후 리디렉션 경로
                        .failureUrl("/login/error") // OAuth2 실패 경로
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService)) // 사용자 정보 처리 서비스
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true); // 인증 정보 포함 허용
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://tamtam2.shop",
                "https://HyunJong00.github.io",
                "https://hyunjong00.github.io/JJAMBBONG/"
        )); // 허용할 프론트엔드 도메인
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용할 HTTP 메서드
        config.setAllowedHeaders(List.of("*")); // 모든 요청 헤더 허용
        config.setExposedHeaders(List.of("Authorization")); // 필요 시 노출할 헤더 추가

        source.registerCorsConfiguration("/**", config); // 모든 경로에 CORS 설정 적용
        return source;
    }
}
