package com.capstone.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GPTService {
    private final String BASE_PYTHON_SERVER_URL = "http://127.0.0.1:5000/"; // 플라스크 API 기본 URL

    private RestTemplate restTemplate = new RestTemplate();

    public String getGreeting(String frontInput) {
        String url = BASE_PYTHON_SERVER_URL + "/greeting";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String requestJson = String.format("{\"front_input\": \"%s\"}", frontInput);

        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return response.getBody();
    }

    public String generatePlan(String travelDate, int travelDays, String travelMate, String travelTheme) {
        String url = BASE_PYTHON_SERVER_URL + "/plan";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String requestJson = String.format(
                "{\"travel_date\": \"%s\", \"travel_days\": %d, \"travel_mate\": \"%s\", \"travel_theme\": \"%s\"}",
                travelDate, travelDays, travelMate, travelTheme
        );

        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return response.getBody();
    }

    public String modifyPlan(String modifyRequest) {
        String url = BASE_PYTHON_SERVER_URL + "/modify";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String requestJson = String.format("{\"modify_request\": \"%s\"}", modifyRequest);

        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return response.getBody();
    }

    public String finalizePlan(String userInput) {
        String url = BASE_PYTHON_SERVER_URL + "/final";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String requestJson = String.format("{\"user_input\": \"%s\"}", userInput);

        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return response.getBody();
    }
}

