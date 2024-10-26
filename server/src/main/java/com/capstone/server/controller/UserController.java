package com.capstone.server.controller;

import com.capstone.server.dto.UserDto;
import com.capstone.server.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/user/{email}")
    public UserDto getUserByEmail(@PathVariable String email) {
        return new UserDto(userService.getUserByEmail(email));
    }
}
