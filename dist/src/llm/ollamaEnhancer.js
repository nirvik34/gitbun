"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhanceCommit = enhanceCommit;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function enhanceCommit(originalMessage, summary, model) {
    const prompt = `
You are a senior software engineer.

Rewrite ONLY the description part of this Conventional Commit.
Do NOT add explanations.
Do NOT add prefixes like "Improved:".
Return exactly one single-line commit message.
Keep format: <type>(<scope>): <description>
Max 72 characters.
Description must start lowercase.

Original commit:
${originalMessage}

Changes:
${summary}
`;
    try {
        const response = await (0, node_fetch_1.default)("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model, // ✅ now dynamic
                prompt,
                stream: false
            })
        });
        const data = (await response.json());
        // Handle model-not-found or API errors
        if (data.error) {
            console.log(`Ollama error: ${data.error}`);
            return originalMessage;
        }
        if (!data.response) {
            console.log("AI returned unexpected format:", data);
            return originalMessage;
        }
        let result = data.response.trim();
        // Remove common LLM prefixes
        result = result.replace(/^Improved:\s*/i, "");
        result = result.replace(/^Here.*:\s*/i, "");
        // Convert past tense to imperative
        result = result.replace(/\bupdated\b/i, "update");
        result = result.replace(/\badded\b/i, "add");
        result = result.replace(/\bfixed\b/i, "fix");
        result = result.replace(/\bremoved\b/i, "remove");
        // Take only first line
        result = result.split("\n")[0];
        // Remove trailing period
        result = result.replace(/\.$/, "");
        return result;
    }
    catch (error) {
        console.log("AI Enhancement Failed:", error);
        return originalMessage;
    }
}
