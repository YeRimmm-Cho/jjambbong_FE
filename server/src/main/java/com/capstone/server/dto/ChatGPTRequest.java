package com.capstone.server.dto;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class ChatGPTRequest {
    private String model;
    private Map<String, Object> inputs;

    public ChatGPTRequest(String model, String travelDate, int travelDays, String travelMate, String travelTheme) {
        this.model = model;
        this.inputs = new HashMap<>();
        this.inputs.put("travel_date", travelDate);
        this.inputs.put("travel_days", travelDays);
        this.inputs.put("travel_mate", travelMate);
        this.inputs.put("travel_theme", travelTheme);
    }

//    public ChatGPTRequest(String model, String modifyRequest) {
//        this.model = model;
//        this.inputs = new HashMap<>();
//        this.inputs.put("modify_request", modifyRequest);
//    }
//
//    public ChatGPTRequest(String model, String userInput) {
//        this.model = model;
//        this.inputs = new HashMap<>();
//        this.inputs.put("user_input", userInput);
//    }
}
