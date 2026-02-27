import { callGemini } from "./gemini";
import { ruleBasedCommit } from "./ruleBased";
import type { CommitResult } from "./ruleBased";

export type Mode = "ai" | "rule-based";

export async function generateCommit(diff: string, mode: Mode): Promise<CommitResult> {
  if (!diff.trim()) {
    throw new Error("Diff cannot be empty");
  }

  if (mode === "rule-based") {
    return ruleBasedCommit(diff);
  }

  return await callGemini(diff);
}

export type { CommitResult };
