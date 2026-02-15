import fetch from "node-fetch";

type OllamaResponse = {
  response: string;
};

export async function enhanceCommit(
  originalMessage: string,
  summary: string
): Promise<string> {
  const prompt = `
You are a senior software engineer.

Improve the description of this Conventional Commit message.
Do NOT change the type or scope.
Keep it under 72 characters.
Return only the improved commit message.

Original:
${originalMessage}

Changes:
${summary}
`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false
      })
    });

    const data = (await response.json()) as OllamaResponse;

    return data.response.trim();
  } catch {
    return originalMessage;
  }
}

