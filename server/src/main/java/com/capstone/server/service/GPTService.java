package com.capstone.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GPTService {
    private final String PYTHON_SERVER_URL = "http://127.0.0.1:5000/generate";
    @Value("${openai.api.key}")
    private String openAiKey;

    public String getPersonaResponse(String userInput) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + openAiKey);

        // JSON 형태로 사용자 입력을 전달
        String requestJson = String.format("{\"user_input\": \"%s\"}", userInput);

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<String> response = restTemplate.exchange(PYTHON_SERVER_URL, HttpMethod.POST, entity, String.class);

        return response.getBody();
    }
}
