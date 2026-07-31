export type LineType = 'input' | 'output' | 'error' | 'system';

export type TerminalLine = {
  id: string;
  content: string;
  type: LineType;
  timestamp: number;
}

export type TerminalState = {
  lines: TerminalLine[];
  isStreaming: boolean;
  history: string[];
  historyIndex: number;
}

export type TerminalAction =
  | { type: 'PRINT'; line: TerminalLine }
  | { type: 'UPDATE_LAST_LINE'; content: string }
  | { type: 'SET_STREAMING'; value: boolean }
  | { type: 'CLEAR' }
  | { type: 'ADD_HISTORY'; command: string };
