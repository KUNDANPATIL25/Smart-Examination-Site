import React, { useState } from "react";
import TestSetupForm from "./components/TestSetupForm";
import TestTaking from "./components/TestTaking";
import ResultPage from "./components/ResultPage";

// App-level "screens"
const SCREENS = {
  SETUP: "SETUP",
  TESTING: "TESTING",
  RESULT: "RESULT",
};

function App() {
  const [screen, setScreen] = useState(SCREENS.SETUP);
  const [testData, setTestData] = useState(null); // TestResponse from backend
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [testResult, setTestResult] = useState(null); // { answers, score, ... }

  const handleTestGenerated = (data, timerPref) => {
    setTestData(data);
    setTimerEnabled(timerPref);
    setScreen(SCREENS.TESTING);
  };

  const handleTestSubmit = (answers) => {
    setTestResult({ answers });
    setScreen(SCREENS.RESULT);
  };

  const handleRestart = () => {
    setTestData(null);
    setTestResult(null);
    setScreen(SCREENS.SETUP);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>🧠 AI Exam</h1>
        <p className="app-subtitle">AI-generated practice tests on any topic</p>
      </header>

      <main className="app-main">
        {screen === SCREENS.SETUP && (
          <TestSetupForm onTestGenerated={handleTestGenerated} />
        )}

        {screen === SCREENS.TESTING && testData && (
          <TestTaking
            testData={testData}
            timerEnabled={timerEnabled}
            onSubmit={handleTestSubmit}
          />
        )}

        {screen === SCREENS.RESULT && testData && testResult && (
          <ResultPage
            testData={testData}
            answers={testResult.answers}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

export default App;
