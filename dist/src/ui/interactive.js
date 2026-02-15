"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmCommit = confirmCommit;
const inquirer_1 = __importDefault(require("inquirer"));
async function confirmCommit(message) {
    console.log("\n" + message + "\n");
    const { action } = await inquirer_1.default.prompt([
        {
            type: "input",
            name: "action",
            message: "Accept commit? (Y/n/e)",
            default: "Y"
        }
    ]);
    const value = action.toLowerCase();
    if (value === "y" || value === "")
        return message;
    if (value === "e") {
        const { edited } = await inquirer_1.default.prompt([
            {
                type: "input",
                name: "edited",
                message: "Edit commit:",
                default: message
            }
        ]);
        return edited;
    }
    return null;
}
