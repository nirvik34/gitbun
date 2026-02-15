"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const cosmiconfig_1 = require("cosmiconfig");
async function loadConfig() {
    const explorer = (0, cosmiconfig_1.cosmiconfig)("smartcommit");
    const result = await explorer.search();
    return result?.config || {};
}
