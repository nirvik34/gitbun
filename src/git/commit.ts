import simpleGit from "simple-git";

export async function commit(message:string) {
    const git = simpleGit();
    await git.commit(message);
    
}