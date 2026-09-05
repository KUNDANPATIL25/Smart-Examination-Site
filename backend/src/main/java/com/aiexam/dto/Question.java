package com.aiexam.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Question {

    private int id;

    // "MCQ" (single correct answer), "MSQ" (multiple correct answers) or "TRUE_FALSE"
    private String type;

    private String question;

    // For TRUE_FALSE this will simply be ["True", "False"]
    private List<String> options;

    // Always a list, even for MCQ/TRUE_FALSE (single-element list), so the
    // frontend can treat every question type the same way.
    private List<String> correctAnswers;

    // Explanation of why the correct answer(s) are correct.
    private String explanation;

    public Question() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public List<String> getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(List<String> correctAnswers) { this.correctAnswers = correctAnswers; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
