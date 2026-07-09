import type { TerminalPlugin, CommandContext } from '../../shared/types';

export const askPlugin: TerminalPlugin = {
  name: 'ask',
  category: 'ai',
  description: 'Ask the AI a question',
  execute: async (ctx: CommandContext) => {
    const prompt = ctx.args.join(' ');
    if (!prompt) {
        ctx.stderr('Please provide a prompt.');
        return;
    }

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        ctx.stdout(decoder.decode(value));
      }
    } catch (err) {
      ctx.stderr(`AI Error: ${(err as Error).message}`);
    }
  }
};
