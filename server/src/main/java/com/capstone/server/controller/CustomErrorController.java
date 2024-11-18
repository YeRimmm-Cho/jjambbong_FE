package com.capstone.server.controller;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.ServletWebRequest;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("/error")
public class CustomErrorController implements ErrorController {

    private final ErrorAttributes errorAttributes;

    public CustomErrorController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

    @RequestMapping
    public ResponseEntity<?> handleError(HttpServletRequest request) {
        // ServletWebRequest로 변환
        ServletWebRequest webRequest = new ServletWebRequest(request);

        // ErrorAttributes에서 에러 정보 가져오기
        Map<String, Object> errorDetails = errorAttributes.getErrorAttributes(webRequest, ErrorAttributeOptions.defaults());

        // 에러 상태 코드 가져오기
        HttpStatus status = HttpStatus.valueOf((int) errorDetails.getOrDefault("status", 500));

        return ResponseEntity.status(status).body(errorDetails);
    }
}
