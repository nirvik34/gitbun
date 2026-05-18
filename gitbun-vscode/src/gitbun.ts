import { spawn } from "child_process";

const ANSI_ESCAPE_PATTERN =
	/[\u001B\u009B][[\]()#;?]*(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;

function stripAnsi(value: string): string {
	return value.replace(ANSI_ESCAPE_PATTERN, "");
}

function extractCommitMessage(output: string): string {
	const promptIndex = output.indexOf("Accept commit?");
	const messageBlock = promptIndex >= 0 ? output.slice(0, promptIndex) : output;
	return messageBlock.trim();
}

export async function generateCommitMessage(cwd: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const command = process.platform === "win32" ? "npx.cmd" : "npx";
		const child = spawn(command, ["gitbun"], { cwd });
		const timer = setTimeout(() => {
			child.kill();
			reject(new Error("Gitbun timed out"));
		}, 30000);

		let stdout = "";
		let stderr = "";

		child.stdout.on("data", (chunk: Buffer | string) => {
			stdout += chunk.toString();
		});

		child.stderr.on("data", (chunk: Buffer | string) => {
			stderr += chunk.toString();
		});

		child.on("error", (error) => {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") {
				reject(new Error("Gitbun not installed"));
				return;
			}

			reject(error);
		});

		child.stdin.write("n\n");
		child.stdin.end();

		child.on("close", (code) => {
			clearTimeout(timer);
			const cleanStdout = stripAnsi(stdout);
			const cleanStderr = stripAnsi(stderr);
			const message = extractCommitMessage(cleanStdout);
			const combinedOutput = `${cleanStdout}\n${cleanStderr}`;

			if (combinedOutput.includes("'gitbun' is not recognized")
				|| combinedOutput.includes("gitbun: command not found")
				|| combinedOutput.includes("could not determine executable to run")) {
				reject(new Error("Gitbun not installed"));
				return;
			}

			if (code !== 0) {
				reject(new Error(cleanStderr.trim() || "Failed to generate commit message"));
				return;
			}

			if (message) {
				resolve(message);
				return;
			}

			reject(new Error("Failed to generate commit message"));
		});
	});
}
