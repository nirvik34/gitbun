"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const checkRepo_1 = require("./git/checkRepo");
const getStagedFiles_1 = require("./git/getStagedFiles");
const getDiffStats_1 = require("./git/getDiffStats");
const scopeDetector_1 = require("./analyzer/scopeDetector");
const typeClassifier_1 = require("./analyzer/typeClassifier");
const summarizer_1 = require("./analyzer/summarizer");
const commitGenerator_1 = require("./generator/commitGenerator");
const interactive_1 = require("./ui/interactive");
const commit_1 = require("./git/commit");
const ollamaEnhancer_1 = require("./llm/ollamaEnhancer");
const loadConfig_1 = require("./config/loadConfig");
const checkOllama_1 = require("./llm/checkOllama");
async function run(options) {
    // Ensure we are inside a Git repo
    const repo = await (0, checkRepo_1.isGitRepo)();
    if (!repo) {
        console.log(chalk_1.default.red("Not inside a Git repository."));
        process.exit(1);
    }
    const stagedFiles = await (0, getStagedFiles_1.getStagedFiles)();
    if (stagedFiles.length === 0) {
        console.log(chalk_1.default.yellow("No staged changes found."));
        console.log("Stage changes using: git add <file>");
        process.exit(0);
    }
    // Enrich file stats
    const enrichedFiles = [];
    for (const file of stagedFiles) {
        const stats = await (0, getDiffStats_1.getDiffStats)(file.path);
        enrichedFiles.push({
            path: file.path,
            additions: stats.additions,
            deletions: stats.deletions
        });
    }
    const scope = (0, scopeDetector_1.detectScope)(enrichedFiles.map(f => f.path));
    const type = (0, typeClassifier_1.classifyCommitType)(enrichedFiles);
    const summary = (0, summarizer_1.generateSummary)(enrichedFiles);
    let commitMessage = (0, commitGenerator_1.generateCommitMessage)(type, scope, enrichedFiles);
    // Load config
    const config = await (0, loadConfig_1.loadConfig)();
    const model = options.model ||
        config.model ||
        "deepseek-coder:6.7b";
    // AI enhancement (optional)
    if (options.ai) {
        const running = await (0, checkOllama_1.isOllamaRunning)();
        if (!running) {
            console.log(chalk_1.default.yellow("Ollama is not running. Using rule-based commit."));
        }
        else {
            const spinner = (0, ora_1.default)("Enhancing commit with AI...").start();
            try {
                commitMessage = await (0, ollamaEnhancer_1.enhanceCommit)(commitMessage, summary, model);
                spinner.succeed();
            }
            catch {
                spinner.fail("AI enhancement failed");
            }
        }
    }
    // Confirmation flow
    let finalMessage;
    if (options.auto) {
        finalMessage = commitMessage;
    }
    else {
        const result = await (0, interactive_1.confirmCommit)(commitMessage);
        if (!result) {
            console.log("Commit cancelled.");
            process.exit(0);
        }
        finalMessage = result;
    }
    // Perform commit (git-native output)
    const output = await (0, commit_1.commit)(finalMessage);
    console.log("\n" + output);
}
