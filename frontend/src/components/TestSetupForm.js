import React, { useState } from "react";
import { generateTest } from "../api/testApi";

function TestSetupForm({ onTestGenerated }) {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("MEDIUM");
  const [questionType, setQuestionType] = useState("MCQ");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!topic.trim()) {
      setError("Please enter a topic for the test.");
      return;
    }
    if (numberOfQuestions < 1 || numberOfQuestions > 30) {
      setError("Number of questions must be between 1 and 30.");
      return;
    }

    setLoading(true);
    const result = await generateTest({
      topic: topic.trim(),
      level,
      questionType,
      numberOfQuestions: Number(numberOfQuestions),
      timerEnabled,
    });
    setLoading(false);

    if (result.success) {
      onTestGenerated(result.data, timerEnabled);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="card setup-card">
      <h2>Create your test</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            type="text"
            placeholder="e.g. Newton's Laws of Motion, React Hooks, World War II..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="level">Difficulty level</label>
            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} disabled={loading}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="questionType">Question type</label>
            <select
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              disabled={loading}
            >
              <option value="MCQ">MCQ (single correct answer)</option>
              <option value="MSQ">MSQ (multiple correct answers)</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="MIXED">Mixed</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="numQuestions">Number of questions (1-30)</label>
            <input
              id="numQuestions"
              type="number"
              min="1"
              max="30"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group timer-toggle">
            <label htmlFor="timerToggle">Countdown timer</label>
            <label className="switch">
              <input
                id="timerToggle"
                type="checkbox"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                disabled={loading}
              />
              <span className="slider" />
            </label>
            <span className="timer-toggle-label">{timerEnabled ? "Enabled" : "Disabled"}</span>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Generating your test with AI..." : "Generate Test"}
        </button>

        {loading && (
          <p className="hint-text">
            This can take up to 30-60 seconds depending on the number of questions.
          </p>
        )}
      </form>
    </div>
  );
}

export default TestSetupForm;
