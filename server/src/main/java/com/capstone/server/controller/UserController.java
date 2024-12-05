package com.capstone.server.controller;

import com.capstone.server.domain.User;
import com.capstone.server.dto.UserDto;
import com.capstone.server.repository.UserRepository;
import com.capstone.server.service.JwtService;
import com.capstone.server.service.TokenBlacklistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenBlacklistService blacklistService;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, TokenBlacklistService blacklistService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.blacklistService = blacklistService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String nickname = request.get("nickname");
        String password = request.get("password");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use."));
        }

        User user = new User();
        user.setEmail(email);
        user.setNickname(nickname);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Signup successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        Optional<User> userOptional = userRepository.findByEmail(userDto.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid password."));
        }

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token, "user", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        blacklistService.addTokenToBlacklist(token);
        return ResponseEntity.ok(Map.of("message", "Logout successful!"));
    }

    // OPTIONS 요청 처리 (특정 경로에 대해서만)
    @RequestMapping(method = RequestMethod.OPTIONS, value = "/signup")
    public ResponseEntity<?> handleSignupOptions() {
        return ResponseEntity.ok().build();
    }

    @RequestMapping(method = RequestMethod.OPTIONS, value = "/login")
    public ResponseEntity<?> handleLoginOptions() {
        return ResponseEntity.ok().build();
    }
}
