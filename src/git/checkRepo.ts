import simpleGit from 'simple-git';
export async function isGitRepo(): Promise<boolean>{
    const git = simpleGit();
    try{
        return await git.checkIsRepo();
    }
    catch{
        return false;
    }
};

export async function isFirstCommit(): Promise<boolean> {
    const git = simpleGit();
    try {
        const count = await git.raw(["rev-list", "--count", "HEAD"]);
        return parseInt(count.trim(), 10) === 0;
    } catch {
        return true;
    }
};