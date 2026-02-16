type FileInfo = {
    path: string;
    additions: number;
    deletions: number;
    status: "A" | "M" | "D";
}

export function generateSummary(files: FileInfo[]): string{
    const summaries = files.map(file => {
        return `${file.path} (+${file.additions} - ${file.deletions})`;
    });

    return summaries.join("\n");
}