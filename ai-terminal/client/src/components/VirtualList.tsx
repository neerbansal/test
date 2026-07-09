import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { TerminalLine } from '../types/terminal';

interface Props {
  items: TerminalLine[];
  rowHeight: number;
}

export const VirtualList: React.FC<Props> = ({ items, rowHeight }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [items]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Since lines can have newlines, rowHeight is just a baseline.
  // In a real terminal, we'd calculate each row's height.
  // For this demo, we'll keep it simple but ensure whitespace is preserved.

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 font-mono text-sm leading-relaxed"
      onScroll={onScroll}
    >
      <div className="flex flex-col space-y-1">
        {items.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap break-all ${
              line.type === 'error' ? 'text-red-500' :
              line.type === 'input' ? 'text-blue-400 font-bold' :
              line.type === 'system' ? 'text-yellow-500 italic' :
              'text-[var(--term)]'
            }`}
          >
            {line.type === 'input' ? `> ${line.content}` : line.content}
          </div>
        ))}
      </div>
    </div>
  );
};
