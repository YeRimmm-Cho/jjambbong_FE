package com.capstone.server.dto;

import com.capstone.server.domain.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String username;
    private String email;
    
    // 기본 생성자
    public UserDto() {}

    // User 엔티티를 받아서 UserDto 객체를 생성하는 생성자
    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
    }
}
