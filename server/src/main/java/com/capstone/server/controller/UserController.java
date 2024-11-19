package com.capstone.server.controller;

import com.capstone.server.domain.User;
import com.capstone.server.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/oauth")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 로그인 성공 후 사용자 정보를 반환하는 엔드포인트
     */
    @GetMapping("/login/success")
    public ResponseEntity<?> loginSuccess(Authentication authentication) {
        try {
            // OAuth2 사용자 정보 추출
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();

            // 카카오 사용자 정보 추출
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            String nickname = (String) properties.getOrDefault("nickname", "기본 닉네임");
            String email = (String) kakaoAccount.getOrDefault("email", "이메일 없음");
            String profileImageUrl = (String) properties.getOrDefault("thumbnail_image", "기본 이미지 URL");

            // 사용자 정보 저장 또는 업데이트
            User user = userRepository.findByEmail(email).orElse(new User());
            user.setNickname(nickname);
            user.setEmail(email);
            user.setProfileImageUrl(profileImageUrl); // 프로필 이미지 URL 설정
            userRepository.save(user);

            // 반환 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("nickname", nickname);
            response.put("email", email);
            response.put("profileImageUrl", profileImageUrl); // 프로필 이미지 URL 포함

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // 예외 로그 출력
            return ResponseEntity.status(500).body("에러 발생: " + e.getMessage());
        }
    }
}
