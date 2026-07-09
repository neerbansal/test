import type { TerminalPlugin, CommandContext } from '../shared/types';
import { registry } from '../core/registry';

export const helpPlugin: TerminalPlugin = {
  name: 'help',
  category: 'sys',
  description: 'List all available commands',
  execute: async (ctx: CommandContext) => {
    const plugins = registry.getAllPlugins();
    ctx.stdout('Available commands:\n\n');
    plugins.forEach(p => {
      ctx.stdout(`${p.name.padEnd(15)} - ${p.description}\n`);
    });
  }
};
