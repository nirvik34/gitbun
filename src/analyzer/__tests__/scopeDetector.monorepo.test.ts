import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
    isMonorepo,
    detectMonorepoPackage,
    detectScope,
} from "../scopeDetector";

describe("isMonorepo", () => {
    let tmpDir: string;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gitbun-test-"));
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it("returns true when nx.json is present", () => {
        fs.writeFileSync(path.join(tmpDir, "nx.json"), "{}");
        expect(isMonorepo(tmpDir)).toBe(true);
    });

    it("returns true when lerna.json is present", () => {
        fs.writeFileSync(path.join(tmpDir, "lerna.json"), "{}");
        expect(isMonorepo(tmpDir)).toBe(true);
    });

    it("returns true when turbo.json is present", () => {
        fs.writeFileSync(path.join(tmpDir, "turbo.json"), "{}");
        expect(isMonorepo(tmpDir)).toBe(true);
    });

    it("returns true when workspace.yaml is present", () => {
        fs.writeFileSync(path.join(tmpDir, "workspace.yaml"), "packages:\n  - apps/*");
        expect(isMonorepo(tmpDir)).toBe(true);
    });

    it("returns true when pnpm-workspace.yaml is present", () => {
        fs.writeFileSync(path.join(tmpDir, "pnpm-workspace.yaml"), "packages:\n  - packages/*");
        expect(isMonorepo(tmpDir)).toBe(true);
    });

    it("returns false when no monorepo marker is present", () => {
        expect(isMonorepo(tmpDir)).toBe(false);
    });
});

describe("detectMonorepoPackage", () => {
    it("extracts package name from apps/", () => {
        expect(detectMonorepoPackage("apps/web/src/auth/login.ts")).toBe("web");
    });

    it("extracts package name from packages/", () => {
        expect(detectMonorepoPackage("packages/ui/Button.tsx")).toBe("ui");
    });

    it("extracts package name from libs/", () => {
        expect(detectMonorepoPackage("libs/shared/utils/index.ts")).toBe("shared");
    });

    it("extracts package name from services/", () => {
        expect(detectMonorepoPackage("services/auth-service/src/handler.ts")).toBe("auth-service");
    });

    it("returns null for paths with no monorepo root segment", () => {
        expect(detectMonorepoPackage("src/analyzer/scopeDetector.ts")).toBeNull();
    });

    it("returns null for a bare filename", () => {
        expect(detectMonorepoPackage("package.json")).toBeNull();
    });
});

describe("detectScope with filesystem-confirmed monorepo", () => {
    let tmpDir: string;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gitbun-mono-"));
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it("uses monorepo package scope when nx.json is present", () => {
        fs.writeFileSync(path.join(tmpDir, "nx.json"), "{}");
        const files = ["apps/dashboard/src/index.ts"];
        expect(detectScope(files, tmpDir)).toBe("dashboard");
    });

    it("uses monorepo package scope when turbo.json is present", () => {
        fs.writeFileSync(path.join(tmpDir, "turbo.json"), "{}");
        const files = ["packages/config/index.ts", "packages/config/tsconfig.json"];
        expect(detectScope(files, tmpDir)).toBe("config");
    });

    it("falls back to standard scope detection when rootDir is not a monorepo and no monorepo path pattern", () => {
        const files = ["src/analyzer/scopeDetector.ts"];
        expect(detectScope(files, tmpDir)).toBe("analyzer");
    });

    it("picks the most frequent monorepo package when files span multiple packages", () => {
        fs.writeFileSync(path.join(tmpDir, "nx.json"), "{}");
        const files = [
            "apps/api/routes.ts",
            "apps/api/server.ts",
            "apps/web/pages/index.tsx",
        ];
        expect(detectScope(files, tmpDir)).toBe("api");
    });
});
