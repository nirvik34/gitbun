"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGitRepo = isGitRepo;
const simple_git_1 = __importDefault(require("simple-git"));
async function isGitRepo() {
    const git = (0, simple_git_1.default)();
    try {
        return await git.checkIsRepo();
    }
    catch {
        return false;
    }
}
;
