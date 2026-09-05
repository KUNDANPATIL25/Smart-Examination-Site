package com.aiexam.service;

import com.aiexam.dto.Question;
import com.aiexam.dto.TestRequest;
import com.aiexam.dto.TestResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public GeminiService(WebClient.Builder webClientBuilder, PromptBuilder promptBuilder) {
        this.webClient = webClientBuilder.build();
        this.promptBuilder = promptBuilder;
    }

    public TestResponse generateTest(TestRequest request) {
        String prompt = promptBuilder.build(request);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "response_mime_type", "application/json"
                )
        );

        String rawResponse;
        try {
            rawResponse = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            throw new GeminiCallException("Failed to reach Gemini API: " + e.getMessage(), e);
        }

        String modelText = extractModelText(rawResponse);
        String cleanJson = stripCodeFences(modelText);

        TestResponse parsed = parseIntoTestResponse(cleanJson, request);
        return parsed;
    }

    private String extractModelText(String rawResponse) {
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new GeminiCallException("Gemini returned no candidates. Raw: " + rawResponse);
            }
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (!parts.isArray() || parts.isEmpty()) {
                throw new GeminiCallException("Gemini response had no content parts. Raw: " + rawResponse);
            }
            return parts.get(0).path("text").asText();
        } catch (GeminiCallException e) {
            throw e;
        } catch (Exception e) {
            throw new GeminiCallException("Could not parse Gemini envelope: " + e.getMessage(), e);
        }
    }

    private String stripCodeFences(String text) {
        String trimmed = text.trim();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceFirst("^```(json)?", "");
            if (trimmed.endsWith("```")) {
                trimmed = trimmed.substring(0, trimmed.length() - 3);
            }
        }
        return trimmed.trim();
    }

    private TestResponse parseIntoTestResponse(String json, TestRequest request) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode questionsNode = root.path("questions");
            List<Question> questions = new ArrayList<>();

            if (questionsNode.isArray()) {
                for (JsonNode qNode : questionsNode) {
                    Question q = objectMapper.treeToValue(qNode, Question.class);
                    questions.add(q);
                }
            }

            if (questions.isEmpty()) {
                throw new GeminiCallException("AI response contained no questions. Raw JSON: " + json);
            }

            int durationSeconds = computeDuration(request.getLevel(), questions.size());

            return new TestResponse(
                    request.getTopic(),
                    request.getLevel(),
                    request.getQuestionType(),
                    questions.size(),
                    durationSeconds,
                    questions
            );
        } catch (GeminiCallException e) {
            throw e;
        } catch (Exception e) {
            throw new GeminiCallException("AI did not return valid JSON we could parse: " + e.getMessage() + " | raw: " + json, e);
        }
    }

    private int computeDuration(String level, int numberOfQuestions) {
        int perQuestionSeconds;
        String normalized = level == null ? "MEDIUM" : level.toUpperCase();
        switch (normalized) {
            case "EASY" -> perQuestionSeconds = 30;
            case "HARD" -> perQuestionSeconds = 75;
            default -> perQuestionSeconds = 45; // MEDIUM
        }
        return perQuestionSeconds * numberOfQuestions;
    }

    public static class GeminiCallException extends RuntimeException {
        public GeminiCallException(String message) { super(message); }
        public GeminiCallException(String message, Throwable cause) { super(message, cause); }
    }
}
