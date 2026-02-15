type FileInfo = {
    path : string;
    additions: number;
    deletions: number;
};

export function classifyCommitType(files: FileInfo[]): string{
    let totalAdd = 0;
    let totalDel = 0;

    for(const file of files){
        totalAdd+= file.additions;
        totalDel+= file.deletions;

        if(file.path.includes("test")) return "test";
        if(file.path.includes(".md")) return "docs";
        if(file.path.includes("lock")) return "chore";

    }

    if(totalAdd > totalDel * 2) return "feat";
    if(totalDel > totalAdd * 2) return "refactor";

    return "fix";
}

