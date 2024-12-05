package com.capstone.server.service;

import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;

@Service
public class TokenBlacklistService {

    private final Set<String> blacklist = new HashSet<>();

    // 토큰을 블랙리스트에 추가
    public void addTokenToBlacklist(String token) {
        blacklist.add(token);
    }

    // 토큰이 블랙리스트에 있는지 확인
    public boolean isTokenBlacklisted(String token) {
        return blacklist.contains(token);
    }
}
