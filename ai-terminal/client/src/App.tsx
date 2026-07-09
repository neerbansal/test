import React from 'react';
import { TerminalProvider } from './context/TerminalContext';
import { ThemeProvider } from './context/ThemeContext';
import { Terminal } from './components/Terminal';
import { FileExplorer } from './components/FileExplorer';

const Shell: React.FC = () => {
    return (
      <div className="h-screen w-screen bg-[var(--bg)] text-[var(--term)] flex overflow-hidden">
        <FileExplorer />
        <div className="flex-1 p-4 flex flex-col h-full overflow-hidden">
          <Terminal />
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
