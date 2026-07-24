import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import chalk from 'chalk';

async function detectOllamaModels(): Promise<string[]> {
  try {
    const output = execSync('ollama list --format json', {
      stdio: ['pipe', 'pipe', 'ignore'],
    }).toString();
    return JSON.parse(output).map((m: { name: string }) => m.name);
  } catch {
    return [];
  }
}

function detectProjectType(): string {
  if (existsSync('Cargo.toml')) return 'rust';
  if (existsSync('pyproject.toml') || existsSync('requirements.txt')) return 'python';
  if (existsSync('go.mod')) return 'go';
  if (existsSync('package.json')) {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    if (pkg.dependencies?.next || pkg.devDependencies?.next) return 'nextjs';
    if (pkg.dependencies?.react || pkg.devDependencies?.react) return 'react';
    return 'nodejs';
  }
  return 'generic';
}

export async function runInitWizard(opts: { yes?: boolean } = {}) {
  console.log(chalk.cyan("\n🐇 Welcome to Gitbun! Let's set up your config.\n"));

  const configPath = '.gitbunrc';

  // Ask before overwriting
  if (existsSync(configPath) && !opts.yes) {
    const { overwrite } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: `${configPath} already exists. Overwrite?`,
      default: false,
    }]);
    if (!overwrite) {
      console.log(chalk.yellow('Aborted.'));
      return;
    }
  }

  const projectType = detectProjectType();
  const ollamaModels = await detectOllamaModels();
  const hasOllama = ollamaModels.length > 0;

  console.log(chalk.gray(`Detected project type: ${projectType}`));
  console.log(chalk.gray(`Ollama: ${hasOllama ? `✓ (${ollamaModels.length} models)` : '✗ not detected'}\n`));

  const answers = opts.yes
    ? { provider: hasOllama ? 'ollama' : 'none', model: ollamaModels[0], interactive: true, conventionalCommits: true }
    : await inquirer.prompt([
        {
          type: 'list',
          name: 'provider',
          message: 'Which AI provider?',
          choices: [
            ...(hasOllama ? [{ name: 'Ollama (local, private)', value: 'ollama' }] : []),
            { name: 'OpenAI (requires OPENAI_API_KEY)', value: 'openai' },
            { name: 'Anthropic Claude (requires ANTHROPIC_API_KEY)', value: 'anthropic' },
            { name: 'Rule-based only (no AI)', value: 'none' },
          ],
        },
        {
          type: 'list',
          name: 'model',
          message: 'Which Ollama model?',
          choices: ollamaModels,
          when: (a) => a.provider === 'ollama' && hasOllama,
        },
        { type: 'confirm', name: 'interactive', message: 'Always preview before committing?', default: true },
        { type: 'confirm', name: 'conventionalCommits', message: 'Enforce Conventional Commits?', default: true },
      ]);

  const config: Record<string, unknown> = {
    ...(answers.provider !== 'none' && { provider: answers.provider }),
    ...(answers.model && { model: answers.model }),
    ai: answers.provider !== 'none',
    interactive: answers.interactive,
  };

  console.log(chalk.cyan('\nConfig preview:'));
  console.log(JSON.stringify(config, null, 2));

  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(chalk.green(`\n✓ Config written to ${configPath}`));
  console.log(chalk.cyan('Run `gitbun` in any repo to generate your first commit message.\n'));
}