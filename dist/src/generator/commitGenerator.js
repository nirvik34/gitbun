"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommitMessage = generateCommitMessage;
function generateCommitMessage(type, scope, files) {
    const fileNames = files.map(file => {
        const parts = file.path.split("/");
        return parts[parts.length - 1].replace(/\.[^/.]+$/, "");
    });
    const uniqueNames = Array.from(new Set(fileNames));
    let description = "";
    if (uniqueNames.length === 1) {
        description = `update ${uniqueNames[0]} module`;
    }
    else if (uniqueNames.length <= 3) {
        description = `update ${uniqueNames.join(" and ")} modules`;
    }
    else {
        description = `update multiple ${scope} files`;
    }
    const message = `${type}(${scope}): ${description}`;
    return enforceRules(message);
}
function enforceRules(message) {
    const parts = message.split(": ");
    if (parts.length === 2) {
        parts[1] = parts[1].charAt(0).toLowerCase() + parts[1].slice(1);
    }
    let formatted = parts.join(": ");
    formatted = formatted.replace(/\.$/, "");
    if (formatted.length > 72) {
        formatted = formatted.slice(0, 69) + "...";
    }
    return formatted;
}
