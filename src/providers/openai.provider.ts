import OpenAI from 'openai';

export class OpenAIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateCommitMessage(diff: string, prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `Git diff:\n\`\`\`\n${diff}\n\`\`\`` },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });
    return response.choices[0].message.content?.trim() ?? '';
  }
}