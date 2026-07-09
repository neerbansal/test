import { parseCommand } from '../parser';

describe('Command Parser', () => {
  test('parses simple commands', () => {
    const res = parseCommand('help');
    expect(res.command).toBe('help');
    expect(res.args).toEqual([]);
  });

  test('parses commands with args', () => {
    const res = parseCommand('ask "hello world"');
    expect(res.command).toBe('ask');
    expect(res.args).toEqual(['hello world']);
  });

  test('parses flags', () => {
    const res = parseCommand('theme --dark');
    expect(res.flags.dark).toBe(true);
  });

  test('parses flags with values', () => {
    const res = parseCommand('config --user=jules');
    expect(res.flags.user).toBe('jules');
  });
});
