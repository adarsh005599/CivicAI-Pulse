import axios from "axios";

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;

export const runCoherePrompt = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        message: prompt,
        model: "command-r",
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 👇 Try to get the actual message
    const text =
      response?.data?.text ||
      response?.data?.generations?.[0]?.text ||
      response?.data?.response;

    return text || "⚠️ No text response found.";
  } catch (error) {
    console.error("❌ Cohere API Error:", error.response?.data || error.message);
    return "⚠️ Error fetching response from Cohere.";
  }
};
