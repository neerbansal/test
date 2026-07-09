import type { TerminalPlugin, CommandContext } from '../../shared/types';

export const cowsayPlugin: TerminalPlugin = {
  name: 'cowsay',
  category: 'fun',
  description: 'Mooo!',
  execute: async (ctx: CommandContext) => {
    const text = ctx.args.join(' ') || 'Moo!';
    const border = '-'.repeat(text.length + 2);
    ctx.stdout(` ${border} \n< ${text} >\n ${border} \n        \   ^__^\n         \  (oo)\_______\n            (__)\       )\/\\n                ||----w |\n                ||     ||\n`);
  }
};
