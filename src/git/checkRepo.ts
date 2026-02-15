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