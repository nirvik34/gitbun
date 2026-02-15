#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("../src/index");
commander_1.program
    .name("smartcommit")
    .description("AI-powered commit assistant")
    .version("0.1.0")
    .option("--ai", "Enhance commit message using AI")
    .option("--auto", "Auto accept commit without confirmation")
    .option("--model <name>", "Specify Ollama model");
commander_1.program.action(async (options) => {
    await (0, index_1.run)(options);
});
commander_1.program.parse();
