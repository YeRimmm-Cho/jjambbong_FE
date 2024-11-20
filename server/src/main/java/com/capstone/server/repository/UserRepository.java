package com.capstone.server.repository;

import com.capstone.server.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 이메일로 사용자 검색
    Optional<User> findByEmail(String email);
}
