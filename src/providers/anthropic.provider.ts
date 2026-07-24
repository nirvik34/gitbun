import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProvider {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = 'claude-haiku-4-5') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generateCommitMessage(diff: string, prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 200,
      messages: [{ role: 'user', content: `${prompt}\n\nGit diff:\n\`\`\`\n${diff}\n\`\`\`` }],
    });
    return (response.content[0] as { text: string }).text.trim();
  }
}