import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import type { TerminalState, TerminalAction, TerminalLine } from '../types/terminal';
import { parseCommand } from '../core/parser';
import { registry } from '../core/registry';
import { db } from '../core/db';

const initialState: TerminalState = {
  lines: [],
  isStreaming: false,
  history: [],
  historyIndex: -1,
};

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case 'PRINT':
      return { ...state, lines: [...state.lines, action.line] };
    case 'UPDATE_LAST_LINE':
      const newLines = [...state.lines];
      if (newLines.length > 0) {
        const lastIdx = newLines.length - 1;
        newLines[lastIdx] = {
          ...newLines[lastIdx],
          content: newLines[lastIdx].content + action.content
        };
      }
      return { ...state, lines: newLines };
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.value };
    case 'CLEAR':
      return { ...state, lines: [] };
    case 'ADD_HISTORY':
      return { ...state, history: [action.command, ...state.history], historyIndex: -1 };
    default:
      return state;
  }
}

interface TerminalContextType extends TerminalState {
  execute: (input: string) => Promise<void>;
  print: (content: string, type?: TerminalLine['type']) => void;
  clear: () => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    db.loadLines().then(lines => {
        lines.forEach(line => dispatch({ type: 'PRINT', line }));
    });
  }, []);

  const print = useCallback((content: string, type: TerminalLine['type'] = 'output') => {
    const line = { id: crypto.randomUUID(), content, type, timestamp: Date.now() };
    dispatch({ type: 'PRINT', line });
    db.saveLines([line]);
  }, []);

  const clear = useCallback(() => {
      dispatch({ type: 'CLEAR' });
  }, []);

  const execute = useCallback(async (input: string) => {
    if (!input.trim()) return;

    dispatch({ type: 'ADD_HISTORY', command: input });
    print(input, 'input');

    const { command, args, flags } = parseCommand(input);
    const plugin = registry.getPlugin(command);

    if (command === 'clear') {
        clear();
        return;
    }

    if (!plugin) {
      print(`Command not found: ${command}`, 'error');
      return;
    }

    dispatch({ type: 'SET_STREAMING', value: true });

    let currentLineId = crypto.randomUUID();
    dispatch({
        type: 'PRINT',
        line: { id: currentLineId, content: '', type: 'output', timestamp: Date.now() }
    });

    try {
      await plugin.execute({
        args,
        flags,
        stdout: (chunk) => {
            // If chunk contains newline, we might want to start a new line
            // but for simplicity and "true" terminal feel, we just append
            // and let the CSS whitespace-pre-wrap handle it.
            // The reason it was on one line before was likely the lack of \n in some calls
            // OR the way I was calling it.
            dispatch({ type: 'UPDATE_LAST_LINE', content: chunk });
        },
        stderr: (chunk) => print(chunk, 'error'),
      });

      // Save final state
      const finalLines = stateRef.current.lines;
      const lastLine = finalLines.find(l => l.id === currentLineId);
      if (lastLine) db.saveLines([lastLine]);

    } catch (err) {
      print(`Error executing ${command}: ${(err as Error).message}`, 'error');
    } finally {
      dispatch({ type: 'SET_STREAMING', value: false });
    }
  }, [print, clear]);

  return (
    <TerminalContext.Provider value={{ ...state, execute, print, clear }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) throw new Error('useTerminal must be used within a TerminalProvider');
  return context;
};
