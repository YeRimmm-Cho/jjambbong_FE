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
        // 부모 클래스의 loadUser 호출
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 사용자 정보 디버깅 로그 출력
        System.out.println("OAuth2 사용자 정보: " + oAuth2User.getAttributes());

        // 사용자 정보 추출
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");

        // 닉네임과 이메일 추출 (null 방지)
        String nickname = properties != null ? (String) properties.get("nickname") : "기본 닉네임";
        String email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;

        // 이메일이 없으면 예외 발생
        if (email == null) {
            throw new OAuth2AuthenticationException("카카오 계정에서 이메일을 제공하지 않았습니다. 이메일 제공 동의를 설정하세요.");
        }

        // 사용자 저장 또는 업데이트
        User user = saveOrUpdateUser(nickname, email);

        // 반환할 사용자 객체 구성
        return new DefaultOAuth2User(oAuth2User.getAuthorities(), attributes, "id");
    }

    /**
     * 사용자 정보를 저장하거나 업데이트하는 메서드.
     *
     * @param nickname 사용자 닉네임
     * @param email    사용자 이메일
     * @return 저장된 사용자 객체
     */
    private User saveOrUpdateUser(String nickname, String email) {
        // 기존 사용자 확인
        Optional<User> existingUser = userRepository.findByEmail(email);

        // 사용자 저장 또는 업데이트
        User user = existingUser.orElseGet(User::new);
        user.setNickname(nickname);
        user.setEmail(email);

        // 사용자 저장
        return userRepository.save(user);
    }
}
