import { GoogleGenerativeAI } from "@google/generative-ai";
import { STARTBRIDGE_CONTEXT } from "../Context/startbridgeContext.js"; 
import { startbridgeData } from "../Data/startbridgeData.js";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Main function to send prompts to Gemini with StartBridge context + data
export const runGeminiPrompt = async (userPrompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert StartBridge data (array) into a readable text block
    const formattedData = startbridgeData
      .map((item, index) => 
        `(${index + 1}) [${item.section.toUpperCase()}]: ${item.content}`
      )
      .join("\n");

    // Inject StartBridge context + real platform data + user query
    const contextualPrompt = `
${STARTBRIDGE_CONTEXT}

Below is StartBridge's current internal knowledge base:
${formattedData}

Now, the user says:
"${userPrompt}"

Please respond as *Comrade AI*, the official assistant of StartBridge.
Tone: Visionary, friendly, and authentic.
Guidelines:
- Always speak as part of StartBridge ("we", "our community").
- If the question relates to startups, founders, or investors — connect it to StartBridge whenever possible.
- Use information from the knowledge base above if relevant.
- Avoid technical AI jargon. Focus on clarity and inspiration.
`;

    const result = await model.generateContent(contextualPrompt);
    const text = result?.response?.text();

    return text || "⚠️ No response from Gemini.";
  } catch (error) {
    console.error("Gemini API Error ❌:", error);
    return "⚠️ Error fetching from Gemini.";
  }
};
