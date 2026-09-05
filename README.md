# AI Exam — AI-Generated Online Test Web App

React (JavaScript) frontend + Spring Boot backend. The backend calls the
Google Gemini API to generate an exam as strict JSON (questions, MCQ/MSQ/True-False
options, correct answers, explanations), and the frontend runs the test with
an optional countdown timer and a detailed result/review screen.

```
ai-exam-app/
├── backend/   Spring Boot 3 (Java 17) + Gemini API + Bucket4j rate limiting
└── frontend/  React 18 (JavaScript, Create React App)
```

## 1. Backend setup

1. Get a free Gemini API key: https://aistudio.google.com/app/apikey
2. Set it as an environment variable (recommended, keeps it out of source control):
   ```bash
   export GEMINI_API_KEY=your_real_key_here
   ```
   Or edit `backend/src/main/resources/application.properties` and replace
   `PUT_YOUR_GEMINI_API_KEY_HERE` directly.
3. Run it:
   ```bash
   cd backend
   ./mvnw spring-boot:run          # or: mvn spring-boot:run
   ```
   The API starts on `http://localhost:8080`.

### Rate limiting
`ratelimit.capacity` / `ratelimit.refill-tokens` / `ratelimit.refill-duration-minutes`
in `application.properties` control how many `/api/test/generate` calls a single
client IP can make (default: 5 requests per minute). This protects the free
Gemini quota. Requests over the limit get an HTTP `429` with a `Retry-After`
header, which the frontend surfaces as a friendly message.

### Key endpoint
`POST /api/test/generate`
```json
{
  "topic": "Newton's Laws of Motion",
  "level": "MEDIUM",
  "questionType": "MIXED",
  "numberOfQuestions": 10,
  "timerEnabled": true
}
```
Returns a `TestResponse` with `questions[]`, each having `id`, `type`
(`MCQ`/`MSQ`/`TRUE_FALSE`), `question`, `options[]`, `correctAnswers[]`, and
`explanation`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env     # points the app at http://localhost:8080/api
npm start
```
Opens on `http://localhost:3000`.

## 3. How it works end-to-end

1. **Setup screen** — user enters topic, difficulty (Easy/Medium/Hard),
   question type (MCQ / MSQ / True-False / Mixed), number of questions
   (1-30), and toggles the timer on/off.
2. Frontend calls the backend, which builds a strict prompt, calls Gemini
   (`response_mime_type: application/json` for reliable structured output),
   parses the JSON, and computes a recommended total test duration from the
   level and question count (Easy 30s/question, Medium 45s/question, Hard
   75s/question).
3. **Test screen** — one question at a time, a question palette to jump
   around, a countdown timer (if enabled) that auto-submits at zero, and a
   "Submit now" button available at any time.
4. **Result screen** — overall score/percentage, then every question with
   your selected answer(s), the correct answer(s) clearly marked, and the
   AI's explanation.

## Notes / things to harden before production
- The in-memory rate limiter resets if the backend restarts and only works
  for a single instance — swap for Bucket4j's Redis-backed proxy manager if
  you scale horizontally.
- Add authentication if you don't want anonymous users burning your Gemini
  quota.
- Consider caching generated tests by (topic, level, type, count) to save
  API calls for repeated requests.
- Add server-side scoring if you don't trust the client to self-grade.
