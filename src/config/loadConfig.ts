import { cosmiconfig } from "cosmiconfig";

/** Configuration loaded from .gitbunrc or cosmiconfig sources. */
export interface GitbunConfig {
  customPrompt?: string;
  format?: string;
  model?: string;
  ai?: boolean;
  interactive?: boolean;
  provider?: 'ollama' | 'openai' | 'anthropic'; // add this
  apiKey?: string;  
}

/** Loads and returns user config from .gitbunrc or cosmiconfig. */
export async function loadConfig(): Promise<GitbunConfig> {
  const explorer = cosmiconfig("smartcommit");
  const result = await explorer.search();

  return result?.config || {};
}
