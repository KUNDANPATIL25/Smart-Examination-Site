import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

/**
 * Calls the backend to generate an AI-created test.
 * @param {{topic: string, level: string, questionType: string, numberOfQuestions: number, timerEnabled: boolean}} payload
 * @returns {Promise<Object>} TestResponse from the backend
 */
export async function generateTest(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/test/generate`, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 60000, // AI generation can take a while
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        return {
          success: false,
          error:
            "You're generating tests too quickly (free API rate limit). " +
            (retryAfter ? `Please try again in ${retryAfter} seconds.` : "Please try again shortly."),
        };
      }
      const data = error.response.data;
      return {
        success: false,
        error: data?.details || data?.error || "Failed to generate the test. Please try again.",
      };
    }
    return { success: false, error: "Could not reach the server. Is the backend running?" };
  }
}
