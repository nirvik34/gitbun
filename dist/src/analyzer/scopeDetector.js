"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectScope = detectScope;
function detectScope(filePaths) {
    const scopes = {};
    for (const path of filePaths) {
        const parts = path.split("/");
        const srcIndex = parts.indexOf("src");
        if (srcIndex !== -1 && parts[srcIndex + 1]) {
            const scope = parts[srcIndex + 1];
            scopes[scope] = (scopes[scope] || 0) + 1;
        }
    }
    if (Object.keys(scopes).length === 0)
        return "core";
    return Object.entries(scopes).sort((a, b) => b[1] - a[1])[0][0];
}
