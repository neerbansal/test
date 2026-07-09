import React, { useState } from 'react';

interface FileNode {
    name: string;
    type: 'file' | 'directory';
}

export const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>([
    { name: 'src', type: 'directory' },
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ]);
  const [isOver, setIsOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newNodes = droppedFiles.map(f => ({ name: f.name, type: 'file' as const }));
    setFiles(prev => [...prev, ...newNodes]);
  };

  return (
    <div
      className={`w-64 bg-gray-900 border-r border-gray-800 flex flex-col ${isOver ? 'bg-gray-800' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-gray-800 font-bold text-xs uppercase tracking-widest text-gray-500">
        File Explorer
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {files.map((file, i) => (
          <div key={i} className="flex items-center p-1 text-sm text-gray-300 hover:bg-gray-800 rounded cursor-pointer group">
            {file.type === 'directory' ? (
                <span className="mr-2 text-yellow-500">📁</span>
            ) : (
                <span className="mr-2 text-blue-400">📄</span>
            )}
            <span className="flex-1 truncate">{file.name}</span>
          </div>
        ))}
        {files.length === 0 && (
            <div className="text-xs text-gray-600 text-center mt-4 italic">
                Drag files here to upload
            </div>
        )}
      </div>
    </div>
  );
};
