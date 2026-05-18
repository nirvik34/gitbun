import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";

const execFileAsync = promisify(execFile);

/**
 * Get the content of a file as it exists in the git staging area.
 * @param filePath path relative to repository root
 * @returns file content as string, or null if the file is new (no staged version)
 */
export async function getStagedFileContent(
  filePath: string
): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["show", `:${filePath}`]
    );

    return stdout;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (
        error.message.includes("bad revision") ||
        error.message.includes("does not exist")
      )
    ) {
      return null;
    }

    throw error;
  }
}

/**
 * Get the current working tree content of a file.
 */
export async function getWorkingFileContent(
  filePath: string
): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null; // file might be deleted
  }
}