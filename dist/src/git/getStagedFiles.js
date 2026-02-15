"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStagedFiles = getStagedFiles;
const simple_git_1 = __importDefault(require("simple-git"));
async function getStagedFiles() {
    const git = (0, simple_git_1.default)();
    const status = await git.status();
    return status.staged.map(file => ({
        path: file,
        status: getStatusType(status, file)
    }));
}
function getStatusType(status, file) {
    if (status.created.includes(file))
        return "A";
    if (status.deleted.includes(file))
        return "D";
    return "M";
}
