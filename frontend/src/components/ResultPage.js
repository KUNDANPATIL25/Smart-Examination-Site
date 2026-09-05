import React, { useMemo } from "react";

function sameSet(a = [], b = []) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

function ResultPage({ testData, answers, onRestart }) {
  const { questions, topic, level, questionType } = testData;

  const scored = useMemo(() => {
    return questions.map((q) => {
      const userAnswer = answers[q.id] || [];
      const isCorrect = sameSet(userAnswer, q.correctAnswers);
      const attempted = userAnswer.length > 0;
      return { ...q, userAnswer, isCorrect, attempted };
    });
  }, [questions, answers]);

  const correctCount = scored.filter((q) => q.isCorrect).length;
  const attemptedCount = scored.filter((q) => q.attempted).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="result-layout">
      <div className="card score-card">
        <h2>Your Result</h2>
        <div className="score-summary">
          <div className="score-circle">
            <span className="score-percentage">{percentage}%</span>
          </div>
          <div className="score-details">
            <p><strong>Topic:</strong> {topic}</p>
            <p><strong>Level:</strong> {level} &middot; <strong>Type:</strong> {questionType}</p>
            <p><strong>Correct:</strong> {correctCount} / {total}</p>
            <p><strong>Attempted:</strong> {attemptedCount} / {total}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onRestart}>
          Take another test
        </button>
      </div>

      <div className="review-list">
        {scored.map((q, idx) => (
          <div key={q.id} className={`card review-item ${q.isCorrect ? "review-correct" : "review-incorrect"}`}>
            <div className="review-header">
              <span className="badge">{q.type}</span>
              <span className={`result-tag ${q.isCorrect ? "tag-correct" : "tag-incorrect"}`}>
                {q.isCorrect ? "Correct" : q.attempted ? "Incorrect" : "Not answered"}
              </span>
            </div>
            <h4 className="review-question">
              Q{idx + 1}. {q.question}
            </h4>

            <ul className="review-options">
              {q.options.map((option, i) => {
                const isCorrectOption = q.correctAnswers.includes(option);
                const isUserPick = q.userAnswer.includes(option);
                let className = "review-option";
                if (isCorrectOption) className += " option-correct";
                if (isUserPick && !isCorrectOption) className += " option-wrong-pick";
                if (isUserPick && isCorrectOption) className += " option-user-correct";

                return (
                  <li key={i} className={className}>
                    <span>{option}</span>
                    {isCorrectOption && <span className="option-flag">✓ Correct answer</span>}
                    {isUserPick && !isCorrectOption && <span className="option-flag">✗ Your answer</span>}
                    {isUserPick && isCorrectOption && <span className="option-flag">✓ Your answer</span>}
                  </li>
                );
              })}
            </ul>

            <div className="explanation-box">
              <strong>Explanation:</strong> {q.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultPage;
