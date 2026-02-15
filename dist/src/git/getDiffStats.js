"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiffStats = getDiffStats;
const simple_git_1 = __importDefault(require("simple-git"));
async function getDiffStats(filePath) {
    const git = (0, simple_git_1.default)();
    const diff = await git.diff(["--cached", "--numstat", filePath]);
    if (!diff.trim()) {
        return { additions: 0, deletions: 0 };
    }
    const parts = diff.trim().split("\t");
    return {
        additions: Number(parts[0]) || 0,
        deletions: Number(parts[1]) || 0
    };
}
