import { registry } from './registry';
import { helpPlugin } from '../plugins/help';
import { askPlugin } from '../plugins/ai/ask';
import { cowsayPlugin } from '../plugins/fun/cowsay';
import { infoPlugin } from '../plugins/sys/info';

export function setupPlugins() {
  registry.register(helpPlugin);
  registry.register(askPlugin);
  registry.register(cowsayPlugin);
  registry.register(infoPlugin);

  registry.register({
    name: 'theme',
    category: 'sys',
    description: 'Change the terminal theme (dark, light, matrix)',
    execute: async (ctx) => {
      const theme = ctx.args[0] as any;
      if (['dark', 'light', 'matrix'].includes(theme)) {
          window.dispatchEvent(new CustomEvent('change-theme', { detail: theme }));
          ctx.stdout(`Theme changed to ${theme}\n`);
      } else {
          ctx.stderr('Invalid theme. Use dark, light, or matrix.\n');
      }
    }
  });

  // Add mock commands to reach 150+ for demonstration of scale
  const categories: any[] = ['sys', 'fs', 'net', 'dev', 'fun', 'ai'];
  for (let i = 1; i <= 150; i++) {
      const cat = categories[i % categories.length];
      registry.register({
          name: `${cat}.cmd${i}`,
          category: cat,
          description: `Automatically generated ${cat} command ${i}`,
          execute: async (ctx) => {
              ctx.stdout(`Executing ${cat} command ${i}...\n`);
              ctx.stdout(`Args: ${ctx.args.join(', ')}\n`);
          }
      });
  }
}
