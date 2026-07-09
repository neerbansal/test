import type { TerminalPlugin } from '../shared/types';

class PluginRegistry {
  private plugins = new Map<string, TerminalPlugin>();

  register(plugin: TerminalPlugin) {
    this.plugins.set(plugin.name, plugin);
  }

  getPlugin(name: string): TerminalPlugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): TerminalPlugin[] {
    return Array.from(this.plugins.values());
  }

  getCommandsByCategory(): Record<string, TerminalPlugin[]> {
    const categories: Record<string, TerminalPlugin[]> = {};
    this.plugins.forEach(p => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });
    return categories;
  }
}

export const registry = new PluginRegistry();
