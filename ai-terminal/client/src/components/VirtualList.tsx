import React, { useState, useRef, useEffect } from 'react';
import type { TerminalLine } from '../types/terminal';

interface Props {
  items: TerminalLine[];
  rowHeight?: number;
}

export const VirtualList: React.FC<Props> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_scrollTop, setScrollTop] = useState(0);
  const [_containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      setContainerHeight(container.clientHeight);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"
    >
      {items.map((line) => (
        <div
          key={line.id}
          className={`whitespace-pre-wrap leading-relaxed ${
            line.type === 'input'
              ? 'text-blue-400 font-bold'
              : line.type === 'error'
              ? 'text-red-400'
              : 'text-term'
          }`}
        >
          {line.type === 'input' && <span className="mr-2 select-none">$</span>}
          {line.content}
        </div>
      ))}
    </div>
  );
};
