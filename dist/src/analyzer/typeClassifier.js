"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyCommitType = classifyCommitType;
function classifyCommitType(files) {
    let totalAdd = 0;
    let totalDel = 0;
    for (const file of files) {
        totalAdd += file.additions;
        totalDel += file.deletions;
        if (file.path.includes("test"))
            return "test";
        if (file.path.includes(".md"))
            return "docs";
        if (file.path.includes("lock"))
            return "chore";
    }
    if (totalAdd > totalDel * 2)
        return "feat";
    if (totalDel > totalAdd * 2)
        return "refactor";
    return "fix";
}
