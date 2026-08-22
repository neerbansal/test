import React, { useState } from 'react';
import { TerminalProvider } from './context/TerminalContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Terminal } from './components/Terminal';
import { FileExplorer } from './components/FileExplorer';
import { Chatbot } from './components/Chatbot';

const Shell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'terminal'>('chatbot');
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-screen w-screen bg-[var(--bg)] text-[var(--term)] flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <header className="h-12 border-b border-[#27272a] bg-[#0d0d0d] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black font-extrabold text-xs">
              G
            </div>
            <span className="font-semibold text-sm text-zinc-100 tracking-tight">Grok AI Studio</span>
          </div>

          <nav className="flex space-x-1 bg-[#18181b] p-1 rounded-lg border border-[#27272a]">
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'chatbot'
                  ? 'bg-[#27272a] text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Chatbot
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'terminal'
                  ? 'bg-[#27272a] text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Terminal
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="theme-select" className="text-xs text-zinc-400 font-mono">Theme:</label>
          <select
            id="theme-select"
            aria-label="Select theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="bg-[#18181b] text-xs text-zinc-200 border border-[#27272a] rounded-md px-2 py-1 outline-none font-mono"
          >
            <option value="grok">grok (black & white)</option>
            <option value="dark">dark</option>
            <option value="light">light</option>
            <option value="matrix">matrix</option>
          </select>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        {activeTab === 'chatbot' ? (
          <div className="flex-1 h-full overflow-hidden">
            <Chatbot />
          </div>
        ) : (
          <>
            <FileExplorer />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <Terminal />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <TerminalProvider>
        <Shell />
      </TerminalProvider>
    </ThemeProvider>
  );
}

export default App;
