import { useEffect, useRef } from "react";

export default function ChatMessages({ messages, isSending }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/5 bg-slate-950/20 p-4 sm:p-5">
      {messages.length === 0 ? (
        <p className="text-center text-xs text-ink-muted py-6">
          No messages yet. Say hello to get started.
        </p>
      ) : null}
      {messages.map((item) => (
        <div
          key={item.id}
          className={`flex ${
            item.sender === "visitor" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4.5 py-3 text-sm leading-relaxed shadow-sm ${
              item.sender === "visitor"
                ? "rounded-br-none bg-linear-to-r from-brand to-brand-glow text-white"
                : "rounded-bl-none border border-white/5 bg-slate-900/60 text-white"
            } ${item.id?.toString().startsWith("pending") ? "opacity-70" : ""}`}
          >
            {item.sender === "assistant" ? (
              <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-brand-glow">
                Assistant
              </span>
            ) : null}
            <span className="whitespace-pre-wrap">{item.content}</span>
          </div>
        </div>
      ))}
      {isSending ? (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-none border border-white/5 bg-slate-900/60 px-5 py-3.5">
            <span className="flex gap-1.5 items-center">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-glow" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-glow [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-glow [animation-delay:0.3s]" />
            </span>
          </div>
        </div>
      ) : null}
      <div ref={messagesEndRef} />
    </div>
  );
}
