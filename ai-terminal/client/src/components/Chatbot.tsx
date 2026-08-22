import React, { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning_details?: any;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<number, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleReasoning = (index: number) => {
    setExpandedReasoning((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const assistantMsgIndex = updatedMessages.length;
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'stealth/ox-alpha',
          messages: updatedMessages,
          reasoning: { enabled: true }
        }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        setMessages((prev) => {
          const next = [...prev];
          next[assistantMsgIndex] = {
            role: 'assistant',
            content: `Error: ${errorText || 'Failed to fetch response'}`
          };
          return next;
        });
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedContent = '';
      let accumulatedReasoning: any = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.substring(6);
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta;

              if (delta) {
                if (delta.content) {
                  accumulatedContent += delta.content;
                }
                if (delta.reasoning_details) {
                  accumulatedReasoning = delta.reasoning_details;
                } else if (parsed.choices?.[0]?.message?.reasoning_details) {
                  accumulatedReasoning = parsed.choices[0].message.reasoning_details;
                }
              }

              setMessages((prev) => {
                const next = [...prev];
                next[assistantMsgIndex] = {
                  role: 'assistant',
                  content: accumulatedContent,
                  reasoning_details: accumulatedReasoning
                };
                return next;
              });
            } catch {
              // Ignore parse error for incomplete JSON SSE chunks
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[assistantMsgIndex] = {
          role: 'assistant',
          content: `Error: ${(err as Error).message}`
        };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#f4f4f5] font-sans rounded-xl border border-[#27272a] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#121212]/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center font-bold text-white text-sm">
            G
          </div>
          <div>
            <h2 className="font-semibold text-base text-zinc-100 tracking-tight">Grok Assistant</h2>
            <p className="text-xs text-zinc-400 font-mono">stealth/ox-alpha • reasoning mode enabled</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-[#1c1c1f] hover:bg-[#27272a] rounded-lg border border-[#27272a] transition-all"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#27272a] flex items-center justify-center text-zinc-200 text-xl font-bold">
              /
            </div>
            <h3 className="text-xl font-medium text-zinc-200">How can Grok help you today?</h3>
            <p className="text-sm text-zinc-500 max-w-md">
              Ask any question or test multi-turn logic with full reasoning details support.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#27272a] text-zinc-100 rounded-br-xs'
                    : 'bg-[#141414] text-zinc-200 border border-[#27272a] rounded-bl-xs'
                }`}
              >
                {msg.reasoning_details && (
                  <div className="mb-3 border-b border-[#27272a] pb-2">
                    <button
                      onClick={() => toggleReasoning(idx)}
                      className="text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center space-x-1.5 focus:outline-none"
                    >
                      <span>{expandedReasoning[idx] ? '▼ Hide Reasoning' : '▶ Show Reasoning'}</span>
                    </button>
                    {expandedReasoning[idx] && (
                      <pre className="mt-2 text-xs font-mono bg-[#0a0a0a] text-zinc-400 p-3 rounded-lg border border-[#27272a] whitespace-pre-wrap overflow-x-auto">
                        {typeof msg.reasoning_details === 'string'
                          ? msg.reasoning_details
                          : JSON.stringify(msg.reasoning_details, null, 2)}
                      </pre>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">
                  {msg.content || (isLoading && idx === messages.length - 1 ? (
                    <span className="text-zinc-500 italic animate-pulse">Thinking...</span>
                  ) : null)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#0a0a0a] border-t border-[#27272a] max-w-4xl w-full mx-auto">
        <form onSubmit={handleSend} className="relative flex items-end bg-[#141414] border border-[#27272a] rounded-xl focus-within:border-zinc-500 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Grok anything..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none max-h-32 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="m-1.5 px-4 py-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};
