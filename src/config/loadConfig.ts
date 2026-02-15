import { cosmiconfig } from "cosmiconfig";

export async function loadConfig() {
  const explorer = cosmiconfig("smartcommit");
  const result = await explorer.search();

  return result?.config || {};
}
