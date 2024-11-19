package com.capstone.server.service;

import com.capstone.server.domain.User;
import com.capstone.server.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
//        System.out.println("OAuth2 사용자 정보: " + oAuth2User.getAttributes());

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String nickname = (String) profile.get("nickname");
        String email = (String) kakaoAccount.get("email");
        String profileImageUrl = (String) profile.get("profileImageUrl");  // 썸네일 이미지 URL 추출

        if (email == null) {
            throw new OAuth2AuthenticationException("카카오 계정에서 이메일을 제공하지 않았습니다. 이메일 제공 동의를 설정하세요.");
        }

        User user = saveOrUpdateUser(nickname, email, profileImageUrl);
        return new DefaultOAuth2User(oAuth2User.getAuthorities(), attributes, "id");
    }

    private User saveOrUpdateUser(String nickname, String email, String profileImageUrl) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user = existingUser.orElseGet(User::new);
        user.setNickname(nickname);
        user.setEmail(email);
        user.setProfileImageUrl(profileImageUrl);  // 프로필 이미지 URL 설정

        return userRepository.save(user);
    }
}
