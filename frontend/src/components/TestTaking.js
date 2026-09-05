import React, { useEffect, useRef, useState, useCallback } from "react";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function TestTaking({ testData, timerEnabled, onSubmit }) {
  const { questions, recommendedDurationSeconds } = testData;
  const [currentIndex, setCurrentIndex] = useState(0);
  // answers[questionId] = array of selected option strings
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(recommendedDurationSeconds);
  const submittedRef = useRef(false);

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, onSubmit]);

  useEffect(() => {
    if (!timerEnabled) return undefined;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerEnabled, handleSubmit]);

  const currentQuestion = questions[currentIndex];
  const isMultiSelect = currentQuestion.type === "MSQ";

  const selectedForCurrent = answers[currentQuestion.id] || [];

  const toggleOption = (option) => {
    setAnswers((prev) => {
      const existing = prev[currentQuestion.id] || [];
      let updated;
      if (isMultiSelect) {
        updated = existing.includes(option)
          ? existing.filter((o) => o !== option)
          : [...existing, option];
      } else {
        updated = [option];
      }
      return { ...prev, [currentQuestion.id]: updated };
    });
  };

  const goTo = (index) => {
    if (index >= 0 && index < questions.length) setCurrentIndex(index);
  };

  const answeredCount = Object.keys(answers).filter((qid) => (answers[qid] || []).length > 0).length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const lowTime = timerEnabled && secondsLeft <= 30;

  return (
    <div className="testing-layout">
      <div className="testing-topbar">
        <div className="progress-info">
          Question {currentIndex + 1} of {questions.length} &middot; Answered {answeredCount}/{questions.length}
        </div>
        {timerEnabled ? (
          <div className={`timer-pill ${lowTime ? "timer-low" : ""}`}>⏱ {formatTime(secondsLeft)}</div>
        ) : (
          <div className="timer-pill timer-off">Timer off</div>
        )}
      </div>

      <div className="testing-body">
        <aside className="question-palette">
          {questions.map((q, idx) => {
            const isAnswered = (answers[q.id] || []).length > 0;
            const isActive = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                className={`palette-btn ${isAnswered ? "answered" : ""} ${isActive ? "active" : ""}`}
                onClick={() => goTo(idx)}
              >
                {idx + 1}
              </button>
            );
          })}
        </aside>

        <div className="card question-card">
          <div className="question-meta">
            <span className="badge">{currentQuestion.type}</span>
            {isMultiSelect && <span className="hint-text">Select all that apply</span>}
          </div>
          <h3 className="question-text">{currentQuestion.question}</h3>

          <div className="options-list">
            {currentQuestion.options.map((option, idx) => {
              const checked = selectedForCurrent.includes(option);
              return (
                <label key={idx} className={`option-item ${checked ? "selected" : ""}`}>
                  <input
                    type={isMultiSelect ? "checkbox" : "radio"}
                    name={`question-${currentQuestion.id}`}
                    checked={checked}
                    onChange={() => toggleOption(option)}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>

          <div className="nav-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            {!isLastQuestion ? (
              <button type="button" className="btn btn-primary" onClick={() => goTo(currentIndex + 1)}>
                Next →
              </button>
            ) : (
              <button type="button" className="btn btn-success" onClick={handleSubmit}>
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="submit-anytime">
        <button type="button" className="btn btn-danger-outline" onClick={handleSubmit}>
          Submit now
        </button>
      </div>
    </div>
  );
}

export default TestTaking;
