package com.capstone.server.controller;

import com.capstone.server.dto.ChatGPTRequest;
import com.capstone.server.dto.ChatGPTResponse;
import com.capstone.server.service.GPTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/bot")
public class CustomBotController {
    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiURL;

    @Autowired
    private RestTemplate template;

    // KSH: Python 서버 통신 서비스 추가
    @Autowired
    private GPTService gptService;

    // KSH: 프롬프트 템플릿 없는 기존 엔드포인트
    @GetMapping("/chat")
    public String chat(@RequestParam(name = "prompt")String prompt){
        ChatGPTRequest request = new ChatGPTRequest(model, prompt);
        ChatGPTResponse chatGPTResponse =  template.postForObject(apiURL, request, ChatGPTResponse.class);
        return chatGPTResponse.getChoices().get(0).getMessage().getContent();
    }

    // KSH: Python LangChain 서버와 통신하는 새로운 엔드포인트
    @GetMapping("/custom-chat")
    public String customChat(@RequestParam(name = "prompt") String prompt) {
        System.out.println("Received prompt: " + prompt);
        return gptService.getPersonaResponse(prompt);  // Python 서버로 요청을 전달하고 응답 반환
    }
}