import type { TerminalPlugin, CommandContext } from '../../shared/types';

export const infoPlugin: TerminalPlugin = {
  name: 'info',
  category: 'sys',
  description: 'Display system information',
  execute: async (ctx: CommandContext) => {
    ctx.stdout(`AI Terminal v1.0.0\n`);
    ctx.stdout(`OS: Web Browser\n`);
    ctx.stdout(`Engine: React + TypeScript\n`);
    ctx.stdout(`Status: Online\n`);
  }
};
