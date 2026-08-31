// server.ts (or API route)
import { GoogleGenAI } from "@google/genai";
import express from "express";

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  // Limit context to last 8 messages
  const history = messages.slice(-8).map((m: any) => ({
    role: m.role === 'bot' ? 'model' : 'user',
    parts: [{ text: m.text }]
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    console.log('Sending request to Gemini...');
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: history,
      config: {
        systemInstruction: "You are the Ladder AI Faculty Advisor for CSIT HOD Dr. Arvind Sharma. Help with student intervention, workshops, mentorship, and academic planning. Respond professionally, structured, and concisely, grounding answers in CSIT department context.",
        maxOutputTokens: 600
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.write(`data: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
  } finally {
    res.end();
  }
});
