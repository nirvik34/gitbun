import simpleGit from "simple-git";

const git = simpleGit();

export type DiffSignals = {
  hasNewFunction: boolean;
  hasRemovedCode: boolean;
  hasBugFix: boolean;
  hasRefactor: boolean;
  hasOptimization: boolean;
};

export async function scanDiff(): Promise<DiffSignals> {
  const diff = await git.diff(["--cached","-U0"]);

  const lower = diff.toLowerCase();

  return {
    hasNewFunction:
      lower.includes("function ") ||
      lower.includes("class ") ||
      lower.includes("def ") ||
      lower.includes("public ") ||
      lower.includes("export "),
    
    hasRemovedCode:
      lower.includes("-function ") ||
      lower.includes("-class ") ||
      lower.includes("-def "),
    
    hasBugFix:
      lower.includes("fix") ||
      lower.includes("bug") ||
      lower.includes("null") ||
      lower.includes("undefined") ||
      lower.includes("error"),
    
    hasRefactor:
      lower.includes("rename") ||
      lower.includes("restructure") ||
      lower.includes("cleanup"),
    
    hasOptimization:
      lower.includes("optimize") ||
      lower.includes("memo") ||
      lower.includes("cache") ||
      lower.includes("performance")
  };
}
