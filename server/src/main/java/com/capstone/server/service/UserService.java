package com.capstone.server.service;

import com.capstone.server.domain.User;
import com.capstone.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User saveOrUpdateUser(String nickname, String email) {
        User user = userRepository.findByEmail(email).orElse(new User());
        user.setNickname(nickname);
        user.setEmail(email);
        return userRepository.save(user);
    }
}
