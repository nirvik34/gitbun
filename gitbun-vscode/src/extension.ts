import * as vscode from 'vscode';
import { generateCommitMessage } from './gitbun';

/**
 * Activates the extension and registers the gitbun.generateCommit command.
 */
export function activate(context: vscode.ExtensionContext) {
	const output = vscode.window.createOutputChannel('Gitbun');
	const disposable = vscode.commands.registerCommand('gitbun.generateCommit', async () => {
		const cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

		if (!cwd) {
			vscode.window.showErrorMessage('No workspace folder is open');
			return;
		}

		const gitExt = vscode.extensions.getExtension('vscode.git');
		const gitExports = gitExt ? await gitExt.activate() : undefined;
		const api = gitExports?.getAPI(1);
		const repo = api?.repositories[0];

		if (!repo) {
			vscode.window.showErrorMessage('No Git repository found');
			return;
		}

		if (repo.state.indexChanges.length === 0) {
			vscode.window.showWarningMessage('Please stage your changes before generating a commit.');
			return;
		}

		try {
			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: 'Gitbun: Generating commit message...',
				cancellable: false
			}, async () => {
				const message = await generateCommitMessage(cwd);
				repo.inputBox.value = message;
				output.appendLine('[Success] Message injected');
			});
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			output.appendLine(`[Error] ${text}`);
			vscode.window.showErrorMessage(text);
		}
	});

	context.subscriptions.push(disposable);
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate() {}
