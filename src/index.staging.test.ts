// src/index.staging.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

// Hoist mocks so they are available before module imports
const {
  execFileSyncMock,
  promptMock,
  isGitRepoMock,
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

// Single mock for node:child_process – includes both execFileSync and execFile
vi.mock("node:child_process", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, any>;
  return {
    ...actual,
    execFileSync: execFileSyncMock,
    execFile: vi.fn(), // needed for other modules (e.g., semanticAnalyzer)
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

// Spy on process.exit – throws an error so we can catch it
const exitSpy = vi
  .spyOn(process, "exit")
  .mockImplementation(((code?: number) => {
    throw new Error(`process.exit called with ${code ?? 0}`);
  }) as never);

// Silence console logs during tests
const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

import { run } from "./index";

describe("interactive staging UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks for all dependencies
    isGitRepoMock.mockResolvedValue(true);
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

    // Ensure test environment is set
    process.env.NODE_ENV = "test";
  });

  it("exits cleanly when no unstaged files exist", async () => {
    // No modified or untracked files
    execFileSyncMock
      .mockReturnValueOnce(Buffer.from("")) // git ls-files --modified
      .mockReturnValueOnce(Buffer.from("")); // git ls-files --others

    // The function should exit with 0
    await expect(run({ auto: true })).rejects.toThrow("process.exit called with 0");

    // Verify that we didn't prompt the user
    expect(promptMock).not.toHaveBeenCalled();
    // Verify no error was logged (catch block not entered)
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("exits cleanly when user selects nothing in the prompt", async () => {
    // There are unstaged files
    execFileSyncMock
      .mockReturnValueOnce(Buffer.from("src/index.ts\n")) // modified
      .mockReturnValueOnce(Buffer.from("")); // untracked

    // User selects nothing
    promptMock.mockResolvedValue({ filesToStage: [] });

    // Should exit with 0
    await expect(run({ auto: true })).rejects.toThrow("process.exit called with 0");

    expect(promptMock).toHaveBeenCalledOnce();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("calls git add with correct files when user selects files", async () => {
    // Setup: staged files initially empty, then after staging we have files
    getStagedFilesMock
      .mockResolvedValueOnce([]) // first call in run
      .mockResolvedValueOnce([
        { path: "src/index.ts", status: "M" },
        { path: "README.md", status: "A" },
      ]);

    // Mock git commands in order of execution:
    // 1. ls-files --modified
    // 2. ls-files --others
    // 3. git add (success)
    // 4. git diff --cached --name-only (verification success)
    execFileSyncMock
      .mockReturnValueOnce(Buffer.from("src/index.ts\n")) // modified
      .mockReturnValueOnce(Buffer.from("README.md\n"))   // others
      .mockReturnValueOnce(Buffer.from(""))              // git add
      .mockReturnValueOnce(Buffer.from("src/index.ts\nREADME.md\n")); // verification

    promptMock.mockResolvedValue({
      filesToStage: ["src/index.ts", "README.md"],
    });

    // Mock diff stats for the staged files (called during commit generation)
    getDiffStatsMock
      .mockResolvedValueOnce({ additions: 10, deletions: 2 })
      .mockResolvedValueOnce({ additions: 5, deletions: 1 });

    // The commit generation will proceed; we don't expect an exit here
    await run({ auto: true });

    // Verify git add was called with the correct files
    expect(execFileSyncMock).toHaveBeenCalledWith(
      "git",
      ["add", "src/index.ts", "README.md"],
      { stdio: "inherit" }
    );
    expect(commitMock).toHaveBeenCalledOnce();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("exits with error when staging verification fails", async () => {
    // There are unstaged files
    execFileSyncMock
      .mockReturnValueOnce(Buffer.from("src/index.ts\n")) // modified
      .mockReturnValueOnce(Buffer.from(""))               // others
      .mockReturnValueOnce(Buffer.from(""))               // git add
      .mockReturnValueOnce(Buffer.from(""));              // verification fails (empty)

    promptMock.mockResolvedValue({ filesToStage: ["src/index.ts"] });

    // Should exit with 1
    await expect(run({ auto: true })).rejects.toThrow("process.exit called with 1");

    expect(execFileSyncMock).toHaveBeenCalledWith(
      "git",
      ["add", "src/index.ts"],
      { stdio: "inherit" }
    );
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Staging failed"));
    expect(errorSpy).toHaveBeenCalled();
  });
});