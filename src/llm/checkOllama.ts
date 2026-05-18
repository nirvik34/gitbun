import fetch from "node-fetch";

const getOllamaUrl = () => process.env.OLLAMA_HOST?.replace(/\/$/, "") || "http://localhost:11434";
const OLLAMA_TIMEOUT_MS = 10000;

export async function isOllamaRunning(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);
  try {
    const res = await fetch(getOllamaUrl(), { signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getAvailableModels(): Promise<string[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);
  try {
    const res = await fetch(`${getOllamaUrl()}/api/tags`, { signal: controller.signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { models: { name: string }[] };
    return data.models.map(m => m.name);
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

const PREFERRED_MODELS = [
  "deepseek-coder:6.7b",
  "deepseek-coder:base",
  "deepseek-coder",
  "codellama",
  "qwen2.5-coder",
  "llama3",
  "mistral"
];

export async function getBestModel(): Promise<string | null> {
  const models = await getAvailableModels();
  if (models.length === 0) return null;

  // Find first preferred model that exists
  for (const preferred of PREFERRED_MODELS) {
    if (models.some(m => m.startsWith(preferred))) {
      const match = models.find(m => m.startsWith(preferred));
      return match || null;
    }
  }

  // Fallback to first available model if none of preferred are found
  return models[0];
}
