import simpleGit from "simple-git";
export async function getStagedFiles() {
    const git = simpleGit();
    const status = await git.status();
    return status.staged.map(file => ({
        path : file,
        status: getStatusType(status,file)
    }));
}
function getStatusType(status: any,file: string): string{
    if(status.created.includes(file)) return "A";
    if(status.deleted.icnludes(file)) return "D";
    return "M";
}