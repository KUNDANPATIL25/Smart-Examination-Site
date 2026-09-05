package com.aiexam.controller;

import com.aiexam.dto.TestRequest;
import com.aiexam.dto.TestResponse;
import com.aiexam.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final GeminiService geminiService;

    public TestController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<TestResponse> generateTest(@Valid @RequestBody TestRequest request) {
        TestResponse response = geminiService.generateTest(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
