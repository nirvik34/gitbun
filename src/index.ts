import chalk from 'chalk';
import {isGitRepo} from "./git/checkRepo";
import {getStagedFiles} from "./git/getStagedFiles";
import {getDiffStats} from "./git/getDiffStats";
import {detectScope} from "./analyzer/scopeDetector";
import { classifyCommitType } from './analyzer/typeClassifier';
import { generateSummary } from './analyzer/summarizer';
import { generateCommitMessage } from "./generator/commitGenerator";
import { confirmCommit } from "./ui/interactive";
import { commit } from "./git/commit";


export async function run(){
    const repo = await isGitRepo();
    if(!repo){
        console.log(chalk.red("Not inside a Git repository."));
        process.exit();
    }
    let stagedFiles = await getStagedFiles();

    stagedFiles = stagedFiles.filter(file => {
        return(
            !file.path.startsWith("node_modules/") &&
            !file.path.startsWith("dist/") &&
            !file.path.startsWith("build/") &&
            !file.path.startsWith("vendor/")&&
            !file.path.endsWith(".lock") &&
            !file.path.endsWith(".log") &&
            !file.path.endsWith(".tmp") &&
            !file.path.endsWith(".bak")&&
            !file.path.startsWith(".git/")&&
            !file.path.startsWith(".github/")&&
            !file.path.startsWith(".vscode/")&&
            !file.path.startsWith(".git/") &&
            !file.path.endsWith("package-lock.json") &&
            !file.path.endsWith("yarn.lock")

        )
    })
    if(stagedFiles.length == 0){
        console.log(chalk.yellow("No staged changes found."));
        console.log("Stage changes using: git add <file>");
        process.exit(0);
    }
    console.log(chalk.blue("Analyzing staged changes...\n"));
    const enrichedFiles = [];
    for(const file of stagedFiles){
        const stats = await getDiffStats(file.path);

        enrichedFiles.push({
            path: file.path,
            additions:stats.additions,
            deletions: stats.deletions
        });
    }
    const scope = detectScope(enrichedFiles.map(f => f.path));
    const type = classifyCommitType(enrichedFiles);
    const summary = generateSummary(enrichedFiles);
    const commitMessage = generateCommitMessage(type,scope,enrichedFiles);



    console.log(`Scope:${scope}`);
    console.log(`Type:${type}`);
    console.log("\nSummary:");
    console.log(summary);

    console.log(chalk.green("\nSuggested Commit Message:"));
    console.log(commitMessage);

    const finalMessage = await confirmCommit(commitMessage);

    if (!finalMessage) {
    console.log("Commit cancelled.");
    process.exit(0);
    }

    await commit(finalMessage);
    console.log("Commit successful.");


}