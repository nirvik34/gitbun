import fetch from "node-fetch";

export async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:11434");
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAvailableModels(): Promise<string[]> {
  try {
    const res = await fetch("http://localhost:11434/api/tags");
    if (!res.ok) return [];
    const data = (await res.json()) as { models: { name: string }[] };
    return data.models.map(m => m.name);
  } catch {
    return [];
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
