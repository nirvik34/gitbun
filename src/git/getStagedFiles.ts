import simpleGit from "simple-git";
export async function getStagedFiles() {
    const git = simpleGit();
    const status = await git.status();
    return status.staged.map(file => {
        let type: "A" | "M" | "D" = "M";
        if (status.created.includes(file)) type = "A";
        if (status.deleted.includes(file)) type = "D";
        return { path: file, status: type };
    });
}