package com.aiexam.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TestResponse {

    private String topic;
    private String level;
    private String questionType;
    private int totalQuestions;

    // Recommended total time for the whole test, in seconds. Computed by the
    // backend from level + number of questions; frontend just counts it down.
    private int recommendedDurationSeconds;

    private List<Question> questions;

    public TestResponse() {}

    public TestResponse(String topic, String level, String questionType, int totalQuestions,
                         int recommendedDurationSeconds, List<Question> questions) {
        this.topic = topic;
        this.level = level;
        this.questionType = questionType;
        this.totalQuestions = totalQuestions;
        this.recommendedDurationSeconds = recommendedDurationSeconds;
        this.questions = questions;
    }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public int getRecommendedDurationSeconds() { return recommendedDurationSeconds; }
    public void setRecommendedDurationSeconds(int recommendedDurationSeconds) { this.recommendedDurationSeconds = recommendedDurationSeconds; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}
