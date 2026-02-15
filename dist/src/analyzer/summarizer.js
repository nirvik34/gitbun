"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = generateSummary;
function generateSummary(files) {
    const summaries = files.map(file => {
        return `${file.path} (+${file.additions} - ${file.deletions})`;
    });
    return summaries.join("\n");
}
