package com.aiexam.service;

import com.aiexam.dto.TestRequest;
import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    public String build(TestRequest request) {
        String type = request.getQuestionType().toUpperCase();
        String typeInstruction;

        switch (type) {
            case "MCQ":
                typeInstruction = "Every question must be a single-correct-answer multiple choice question (MCQ) with exactly 4 options and exactly 1 correct answer.";
                break;
            case "MSQ":
                typeInstruction = "Every question must be a multiple-select question (MSQ) with exactly 4 to 6 options, where 2 or more options are correct.";
                break;
            case "TRUE_FALSE":
                typeInstruction = "Every question must be a True/False question. The options array must be exactly [\"True\", \"False\"] and correctAnswers must contain exactly one of them.";
                break;
            case "MIXED":
            default:
                typeInstruction = "Randomly mix question types across the test: some MCQ (single correct answer, 4 options), some MSQ (2+ correct answers, 4-6 options), and some TRUE_FALSE (options [\"True\",\"False\"]). Vary the \"type\" field per question accordingly.";
                break;
        }

        return """
                You are an expert exam-setter. Generate an online examination in strict JSON only.

                Topic: %s
                Difficulty level: %s
                Number of questions: %d
                Question type rule: %s

                Rules you MUST follow:
                1. Return ONLY a JSON object, no markdown fences, no commentary, no leading/trailing text.
                2. The JSON object must have this exact shape:
                {
                  "questions": [
                    {
                      "id": 1,
                      "type": "MCQ" | "MSQ" | "TRUE_FALSE",
                      "question": "string",
                      "options": ["string", "string", "..."],
                      "correctAnswers": ["string", "..."],
                      "explanation": "string explaining why the correct answer(s) are correct"
                    }
                  ]
                }
                3. "correctAnswers" values must be copied verbatim (character for character) from "options".
                4. "id" must start at 1 and increase by 1 for each question, matching the order in the array.
                5. Produce exactly %d questions.
                6. Questions must be appropriate for a "%s" difficulty level learner on the topic "%s".
                7. Do not repeat the same question twice.
                8. Keep each explanation concise (1-3 sentences) but informative enough to teach the concept.
                """.formatted(
                request.getTopic(),
                request.getLevel(),
                request.getNumberOfQuestions(),
                typeInstruction,
                request.getNumberOfQuestions(),
                request.getLevel(),
                request.getTopic()
        );
    }
}
