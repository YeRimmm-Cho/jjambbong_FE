package com.capstone.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactController {

    @GetMapping(value = {"/", "/oauth2/loginSuccess", "/kakaoLogin", "/mypage", "/new", "/main", "/test"})
    public String forward() {
        // 모든 요청을 React의 index.html로 전달
        return "forward:/index.html";
    }
}
