package com.capstone.server.dto;

import com.capstone.server.domain.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private Integer id;
    private String nickname;
    private String email;
    private String profileImageUrl;

    public UserDto(User user) {
        this.id = user.getId();
        this.nickname = user.getNickname();
        this.email = user.getEmail();
        this.profileImageUrl = user.getProfileImageUrl(); // User 도메인 객체에서 이미지 URL을 가져와 설정
    }
}