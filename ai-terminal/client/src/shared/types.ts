export type CommandCategory = 'sys' | 'fs' | 'net' | 'dev' | 'fun' | 'ai';

export type CommandContext = {
  args: string[];
  flags: Record<string, boolean | string>;
  stdout: (chunk: string) => void;
  stderr: (chunk: string) => void;
}

export type TerminalPlugin = {
  name: string;
  category: CommandCategory;
  description: string;
  usage?: string;
  execute: (ctx: CommandContext) => Promise<void>;
}
