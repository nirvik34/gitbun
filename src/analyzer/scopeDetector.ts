import * as fs from "fs";
import * as path from "path";
import { getLanguageProfile } from "./languageAnalyzer";

const MONOREPO_MARKERS = [
  "nx.json",
  "lerna.json",
  "turbo.json",
  "workspace.yaml",
  "pnpm-workspace.yaml",
];

const MONOREPO_ROOT_SEGMENTS = [
  "apps",
  "packages",
  "libs",
  "services",
];

export function isMonorepo(rootDir: string): boolean {
  return MONOREPO_MARKERS.some((marker) =>
    fs.existsSync(path.join(rootDir, marker))
  );
}

export function detectMonorepoPackage(
  file: string
): string | null {
  const parts = file.split("/");
  const firstSegment = parts[0];

  if (MONOREPO_ROOT_SEGMENTS.includes(firstSegment) && parts[1]) {
    return parts[1];
  }

  return null;
}

function detectFileScope(
  file: string
): string | null {
  const profile = getLanguageProfile(file);

  if (profile) {
    return profile.detectScope(file);
  }

const normalizedFile = path.normalize(file);
const parts = normalizedFile.split(path.sep);

  const srcIndex = parts.indexOf("src");

  if (
    srcIndex !== -1 &&
    parts[srcIndex + 1]
  ) {
    return parts[srcIndex + 1];
  }

  return null;
}

function hasMonorepoPathPattern(filePaths: string[]): boolean {
  return filePaths.some((file) => {
    const firstSegment = file.split("/")[0];
    return MONOREPO_ROOT_SEGMENTS.includes(firstSegment);
  });
}

export function detectScope(
  filePaths: string[],
  rootDir: string = process.cwd()
): string {
  const scopes: Record<string, number> = {};

  const monorepoActive =
    isMonorepo(rootDir) || hasMonorepoPathPattern(filePaths);

  for (const file of filePaths) {
    let scope: string | null = null;

    if (monorepoActive) {
      scope = detectMonorepoPackage(file);
    }

    if (!scope) {
      scope = detectFileScope(file);
    }

    if (!scope) continue;

    scopes[scope] = (scopes[scope] || 0) + 1;
  }

  if (Object.keys(scopes).length === 0) {
    return "core";
  }

  return Object.entries(scopes).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
}