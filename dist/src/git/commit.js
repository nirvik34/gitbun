"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commit = commit;
const simple_git_1 = __importDefault(require("simple-git"));
async function commit(message) {
    const git = (0, simple_git_1.default)();
    const output = await git.raw([
        "commit",
        "-m",
        message
    ]);
    return output;
}
