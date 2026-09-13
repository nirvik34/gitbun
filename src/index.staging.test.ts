import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  execFileSyncMock,
  promptMock,
  isGitRepoMock,
  isFirstCommitMock,
  getStagedFilesMock,
  getDiffStatsMock,
  classifyCommitTypeMock,
  loadConfigMock,
  commitMock,
  confirmCommitMock,
  enhanceCommitMock,
  isOllamaRunningMock,
  getBestModelMock,
  detectScopeMock,
  generateSummaryFromResultMock,
  filterLowSignalFilesMock,
  sortBySignalMock,
  deduplicateFilesMock,
  generateCommitMessageMock,
} = vi.hoisted(() => ({
  execFileSyncMock: vi.fn(),
  promptMock: vi.fn(),
  isGitRepoMock: vi.fn(),
  isFirstCommitMock: vi.fn(),
  getStagedFilesMock: vi.fn(),
  getDiffStatsMock: vi.fn(),
  classifyCommitTypeMock: vi.fn(),
  loadConfigMock: vi.fn(),
  commitMock: vi.fn(),
  confirmCommitMock: vi.fn(),
  enhanceCommitMock: vi.fn(),
  isOllamaRunningMock: vi.fn(),
  getBestModelMock: vi.fn(),
  detectScopeMock: vi.fn(),
  generateSummaryFromResultMock: vi.fn(),
  filterLowSignalFilesMock: vi.fn(),
  sortBySignalMock: vi.fn(),
  deduplicateFilesMock: vi.fn(),
  generateCommitMessageMock: vi.fn(),
}));

vi.mock("node:child_process", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, any>;  return {
    ...actual,
    execFileSync: execFileSyncMock,
  };
});

vi.mock("inquirer", () => ({
  default: {
    prompt: promptMock,
  },
}));

vi.mock("ora", () => ({
  default: () => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
  }),
}));

vi.mock("./git/checkRepo", () => ({
  isGitRepo: isGitRepoMock,
  isFirstCommit: isFirstCommitMock,
}));

vi.mock("./git/getStagedFiles", () => ({
  getStagedFiles: getStagedFilesMock,
}));

vi.mock("./git/getDiffStats", () => ({
  getDiffStats: getDiffStatsMock,
}));

vi.mock("./analyzer/scopeDetector", () => ({
  detectScope: detectScopeMock,
}));

vi.mock("./analyzer/typeClassifier", () => ({
  classifyCommitType: classifyCommitTypeMock,
}));

vi.mock("./analyzer/summarizer", () => ({
  generateSummaryFromResult: generateSummaryFromResultMock,
}));

vi.mock("./analyzer/fileFilter", () => ({
  filterLowSignalFiles: filterLowSignalFilesMock,
}));

vi.mock("./analyzer/fileScorer", () => ({
  sortBySignal: sortBySignalMock,
}));

vi.mock("./analyzer/fileDeduplicator", () => ({
  deduplicateFiles: deduplicateFilesMock,
}));

vi.mock("./analyzer/diffScanner", () => ({
  scanDiff: vi.fn().mockResolvedValue({
    hasNewFunction: false,
    hasRemovedCode: false,
    hasBugFix: false,
    hasRefactor: false,
    hasOptimization: false,
    newFunctions: [],
    removedFunctions: [],
    renamedFunctions: [],
    newClasses: [],
    removedClasses: [],
    newImports: [],
    removedImports: [],
    newFiles: [],
    deletedFiles: [],
    renamedFiles: [],
    functionSignatureChanges: [],
    addedLines: 0,
    deletedLines: 0,
  }),
}));

vi.mock("./generator/commitGenerator", () => ({
  generateCommitMessage: generateCommitMessageMock,
}));

vi.mock("./ui/interactive", () => ({
  confirmCommit: confirmCommitMock,
}));

vi.mock("./git/commit", () => ({
  commit: commitMock,
}));

vi.mock("./llm/ollamaEnhancer", () => ({
  enhanceCommit: enhanceCommitMock,
}));

vi.mock("./config/loadConfig", () => ({
  loadConfig: loadConfigMock,
}));

vi.mock("./llm/checkOllama", () => ({
  isOllamaRunning: isOllamaRunningMock,
  getBestModel: getBestModelMock,
}));

const exitSpy = vi
  .spyOn(process, "exit")
  .mockImplementation(((code?: number) => {
    throw new Error(`process.exit:${code ?? 0}`);
  }) as never);

const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

import { run } from "./index";

describe("interactive staging UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    isGitRepoMock.mockResolvedValue(true);
    isFirstCommitMock.mockResolvedValue(false);
    getStagedFilesMock.mockResolvedValue([]);
    getDiffStatsMock.mockResolvedValue({ additions: 1, deletions: 0 });
    detectScopeMock.mockReturnValue("core");
    classifyCommitTypeMock.mockResolvedValue("feat");
    generateSummaryFromResultMock.mockReturnValue("summary");
    filterLowSignalFilesMock.mockImplementation((files) => files);
    sortBySignalMock.mockImplementation((files) => files);
    deduplicateFilesMock.mockReturnValue({ files: [] });
    generateCommitMessageMock.mockReturnValue("feat(core): add staging ui");
    loadConfigMock.mockResolvedValue({ format: "conventional", model: "" });
    isOllamaRunningMock.mockResolvedValue(false);
    getBestModelMock.mockResolvedValue("deepseek-coder:6.7b");
    confirmCommitMock.mockResolvedValue("feat(core): add staging ui");
    commitMock.mockResolvedValue("committed");
    enhanceCommitMock.mockResolvedValue("feat(core): add staging ui");
  });

  it("exits cleanly when no unstaged files exist", async () => {
    execFileSyncMock
      .mockReturnValueOnce(Buffer.from(""))
      .mockReturnValueOnce(Buffer.from(""));

    await expect(run({ auto: true })).rejects.toThrow("process.exit:1");

    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(promptMock).not.toHaveBeenCalled();
  });

  it("exits cleanly when user selects nothing in the prompt", async () => {
    execFileSyncMock
      .mockReturnValueOnce(Buffer.from("src/index.ts\n"))
      .mockReturnValueOnce(Buffer.from(""));
    promptMock.mockResolvedValue({ filesToStage: [] });

    await expect(run({ auto: true })).rejects.toThrow("process.exit:1");

    expect(promptMock).toHaveBeenCalledOnce();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("calls git add with correct files when user selects files", async () => {
    getStagedFilesMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { path: "src/index.ts", status: "M" },
        { path: "README.md", status: "A" },
      ]);
    execFileSyncMock
      .mockReturnValueOnce(Buffer.from("src/index.ts\n"))
      .mockReturnValueOnce(Buffer.from("README.md\n"))
      .mockReturnValueOnce(Buffer.from(""))
      .mockReturnValueOnce(Buffer.from("src/index.ts\nREADME.md\n"));
    promptMock.mockResolvedValue({
      filesToStage: ["src/index.ts", "README.md"],
    });

    await run({ auto: true });

    expect(execFileSyncMock).toHaveBeenCalledWith(
      "git",
      ["add", "src/index.ts", "README.md"],
      { stdio: "inherit" }
    );
    expect(commitMock).toHaveBeenCalledOnce();
  });

  it("exits with error when staging verification fails", async () => {
    execFileSyncMock
      .mockReturnValueOnce(Buffer.from("src/index.ts\n"))
      .mockReturnValueOnce(Buffer.from(""))
      .mockReturnValueOnce(Buffer.from(""))
      .mockReturnValueOnce(Buffer.from(""));
    promptMock.mockResolvedValue({ filesToStage: ["src/index.ts"] });

    await expect(run({ auto: true })).rejects.toThrow("process.exit:1");

    expect(execFileSyncMock).toHaveBeenCalledWith(
      "git",
      ["add", "src/index.ts"],
      { stdio: "inherit" }
    );
    expect(logSpy).toHaveBeenCalledWith("Staging failed. No files were staged.");
    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
