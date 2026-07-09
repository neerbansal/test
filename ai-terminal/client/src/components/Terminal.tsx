import React, { useRef, useEffect, useState } from 'react';
import { useTerminal } from '../context/TerminalContext';
import { VirtualList } from './VirtualList';

export const Terminal: React.FC = () => {
  const { lines, execute, isStreaming } = useTerminal();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    const cmd = inputValue;
    setInputValue('');
    await execute(cmd);
  };

  useEffect(() => {
    if (!isStreaming) {
      inputRef.current?.focus();
    }
  }, [isStreaming]);

  return (
    <div className="flex flex-col h-full bg-bg border border-gray-800 shadow-2xl rounded-lg overflow-hidden">
      <div className="bg-gray-900 px-4 py-2 flex items-center border-b border-gray-800">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-400 font-mono">ai-terminal — 80x24</div>
      </div>

      <VirtualList items={lines} rowHeight={24} />

      <form onSubmit={handleSubmit} className="p-2 bg-gray-900/50 border-t border-gray-800 flex items-center">
        <span className="text-blue-400 font-bold mr-2 ml-1">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isStreaming}
          className="flex-1 bg-transparent outline-none text-term font-mono"
          placeholder={isStreaming ? "AI is thinking..." : "Type a command..."}
          autoFocus
        />
      </form>
    </div>
  );
};
