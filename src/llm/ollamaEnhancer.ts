import fetch from "node-fetch";

const OLLAMA_ENHANCE_TIMEOUT_MS = 10000;

type OllamaChatResponse = {
  message?: {
    content: string;
  };
  error?: string;
};

const SYSTEM_PROMPT = `You are a senior developer who writes perfect conventional commits.
Your task is to refine the description of a commit message while keeping its type and scope.
Follow these rules strictly:
1. Return ONLY the commit message line. No explanations.
2. Use the format: <type>(<scope>): <description>
3. The description must be in the IMPERATIVE mood (e.g., "add" instead of "added").
4. Description must start with a lowercase letter.
5. Do NOT include a trailing period.
6. Max length 72 characters.
7. If the original message is already excellent, return it as is.`;

const getOllamaUrl = () => process.env.OLLAMA_HOST?.replace(/\/$/, "") || "http://localhost:11434";

export async function enhanceCommit(
  originalMessage: string,
  summary: string,
  model: string
): Promise<string> {
  const userPrompt = `Refine this commit message:
Original: ${originalMessage}

Context of changes:
${summary}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_ENHANCE_TIMEOUT_MS);

  try {
    const response = await fetch(`${getOllamaUrl()}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        stream: false
      }),
      signal: controller.signal
    });

    const data = (await response.json()) as OllamaChatResponse;

    if (data.error) {
      console.log(`\nOllama error: ${data.error}`);
      return originalMessage;
    }

    if (!data.message?.content) {
      return originalMessage;
    }

    let result = data.message.content.trim();

    // Clean up common LLM artifacts in case it ignores system prompt
    result = result.replace(/^[`"']|[`"']$/g, ""); // remove quotes or backticks
    result = result.replace(/^commit:\s*/i, "");
    result = result.split("\n")[0];

    return result;
  } catch (error) {
    console.log("\nAI Enhancement Failed:", error);
    return originalMessage;
  } finally {
    clearTimeout(timeoutId);
  }
}
