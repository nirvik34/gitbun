import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CommitResult } from "./ruleBased";

const getClient = () => {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set in .env.local");
  return new GoogleGenerativeAI(key);
};

const PROMPT = (diff: string) => `You are Gitbun, an AI-powered Git commit message generator.
Analyze the following git diff carefully and generate a conventional commit message.

Rules:
- type must be one of: feat, fix, docs, test, refactor, chore
- scope should be the affected module/file (or null if unclear)
- subject must be imperative, lowercase, under 72 chars, no period
- body should have 2 concise bullet points explaining what changed and why
- confidence is your certainty score 0-100

Respond ONLY with a valid JSON object. No markdown fences, no explanation:
{
  "type": "feat",
  "scope": "auth",
  "subject": "add JWT token generation with 24h expiry",
  "body": ["implemented jwt.sign with configurable expiry", "returns token alongside calculated expiry timestamp"],
  "confidence": 92
}

Git diff:
${diff}`;

export async function callGemini(diff: string): Promise<CommitResult> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(PROMPT(diff));
  const text   = result.response.text();

  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed  = JSON.parse(cleaned);

  return {
    type:       parsed.type       ?? "feat",
    scope:      parsed.scope      ?? null,
    subject:    parsed.subject    ?? "update codebase",
    body:       Array.isArray(parsed.body) ? parsed.body : [],
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 80,
  };
}
