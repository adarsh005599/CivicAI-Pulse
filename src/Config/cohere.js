// src/Config/gemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const runGeminiPrompt = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);

    // ✅ Correct way to access text:
    const text = result.response.text();

    return text || "⚠️ No response from Gemini.";
  } catch (error) {
    console.error("Gemini API Error ❌:", error);
    return "⚠️ Error fetching from Gemini.";
  }
};
