package com.capstone.server.controller;

import com.capstone.server.dto.ChatGPTRequest;
import com.capstone.server.dto.ChatGPTResponse;
import com.capstone.server.service.GPTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/bot")
public class CustomBotController {
    private final GPTService gptService;

    public CustomBotController(GPTService gptService) {
        this.gptService = gptService;
    }

    @PostMapping("/greeting")
    public String getGreeting(@RequestBody Map<String, String> body) {
        String frontInput = body.get("front_input"); // JSON에서 값 추출
        return gptService.getGreeting(frontInput);
    }

//    @PostMapping("/greeting")
//    public String getGreeting(@RequestBody Map<String, String> body) {
//        String frontInput = body.get("front_input"); // JSON에서 값 추출
//        return gptService.getGreeting(frontInput);
//    }

    @PostMapping("/plan")
    public String generatePlan(@RequestBody Map<String, Object> body) {
        String travelDate = (String) body.get("travel_date");
        int travelDays = (int) body.get("travel_days");
        String travelMate = (String) body.get("travel_mate");
        String travelTheme = (String) body.get("travel_theme");
        return gptService.generatePlan(travelDate, travelDays, travelMate, travelTheme);
    }

    // Plan API 호출
//    @PostMapping("/plan")
//    public String generatePlan(
//            @RequestParam String travel_date,
//            @RequestParam int travel_days,
//            @RequestParam String travel_mate,
//            @RequestParam String travel_theme
//    ) {
//        return gptService.generatePlan(travel_date, travel_days, travel_mate, travel_theme);
//    }

    @PostMapping("/modify")
    public String modifyPlan(@RequestBody Map<String, String> body) {
        String modifyRequest = body.get("modify_request");
        return gptService.modifyPlan(modifyRequest);
    }

//    // Modify API 호출
//    @PostMapping("/modify")
//    public String modifyPlan(@RequestParam String modifyRequest) {
//        return gptService.modifyPlan(modifyRequest);
//    }

    // Final API 호출
    @PostMapping("/final")
    public String finalizePlan(@RequestParam String userInput) {
        return gptService.finalizePlan(userInput);
    }
}
