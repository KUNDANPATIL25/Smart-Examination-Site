package com.aiexam.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TestRequest {

    @NotBlank(message = "topic is required")
    private String topic;

    @NotBlank(message = "level is required")
    private String level; // EASY, MEDIUM, HARD

    @NotBlank(message = "questionType is required")
    private String questionType; // MCQ, MSQ, TRUE_FALSE, MIXED

    @NotNull
    @Min(value = 1, message = "numberOfQuestions must be at least 1")
    @Max(value = 30, message = "numberOfQuestions cannot exceed 30 (free API tier)")
    private Integer numberOfQuestions;

    // Whether the user wants a countdown timer during the test (UI-only flag,
    // echoed back so the frontend can persist it alongside the generated test).
    private boolean timerEnabled = true;

    public TestRequest() {}

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public Integer getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(Integer numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }

    public boolean isTimerEnabled() { return timerEnabled; }
    public void setTimerEnabled(boolean timerEnabled) { this.timerEnabled = timerEnabled; }
}
