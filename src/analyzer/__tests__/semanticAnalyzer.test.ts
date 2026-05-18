import { describe, it, expect, vi } from "vitest";
import { analyzeSemanticChanges } from "../semanticAnalyzer";
import * as fileContent from "../../git/getFileContent";

// Mock git functions
vi.mock("../../git/getFileContent", () => ({
  getStagedFileContent: vi.fn(),
  getWorkingFileContent: vi.fn(),
}));

describe("semanticAnalyzer", () => {
  it("should detect a function rename", async () => {
    const oldContent = `
      function greet() { return "hello"; }
    `;
    const newContent = `
      function sayHello() { return "hello"; }
    `;
    vi.mocked(fileContent.getStagedFileContent).mockResolvedValue(oldContent);
    vi.mocked(fileContent.getWorkingFileContent).mockResolvedValue(newContent);

    const result = await analyzeSemanticChanges(["src/test.ts"]);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].type).toBe("function_rename");
    expect(result.events[0].details).toMatchObject({
      oldName: "greet",
      newName: "sayHello",
    });
  });

  it("should detect signature change", async () => {
    const oldContent = `
      function add(a: number, b: number): number { return a + b; }
    `;
    const newContent = `
      function add(a: number, b: number, c: number): number { return a + b + c; }
    `;
    vi.mocked(fileContent.getStagedFileContent).mockResolvedValue(oldContent);
    vi.mocked(fileContent.getWorkingFileContent).mockResolvedValue(newContent);

    const result = await analyzeSemanticChanges(["src/test.ts"]);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].type).toBe("api_signature_change");
    expect(
      (result.events[0].details as { changes: string[] }).changes[0],
    ).toContain("parameter count");
  });

  it("should handle no changes", async () => {
    const content = `const x = 1;`;
    vi.mocked(fileContent.getStagedFileContent).mockResolvedValue(content);
    vi.mocked(fileContent.getWorkingFileContent).mockResolvedValue(content);

    const result = await analyzeSemanticChanges(["src/test.ts"]);
    expect(result.events).toHaveLength(0);
  });
});
