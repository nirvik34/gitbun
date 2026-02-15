"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOllamaRunning = isOllamaRunning;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function isOllamaRunning() {
    try {
        const res = await (0, node_fetch_1.default)("http://localhost:11434");
        return res.ok;
    }
    catch {
        return false;
    }
}
