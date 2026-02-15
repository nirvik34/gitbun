import fetch from "node-fetch";

export async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:11434");
    return res.ok;
  } catch {
    return false;
  }
}
