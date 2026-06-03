import Button from "../ui/Button";

export default function ChatSidebar({
  conversations,
  currentConversationId,
  historyStatus,
  onSwitchConversation,
  onStartNewChat,
  isStarting,
  onClose,
  showCloseButton = false,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold uppercase tracking-wider text-ink-muted">Your chats</p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onStartNewChat}
            disabled={isStarting}
            className="text-xs font-semibold py-1.5 px-3 border border-white/5 bg-brand-light hover:bg-brand/20 text-white"
          >
            {showCloseButton ? "New chat" : "New"}
          </Button>
          {showCloseButton && onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs font-semibold py-1.5 px-3 hover:bg-white/5 text-ink-muted hover:text-white"
            >
              Close
            </Button>
          ) : null}
        </div>
      </div>
      <div className="mt-4 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {historyStatus === "loading" ? (
          <p className="text-xs text-ink-muted p-2">Loading history...</p>
        ) : null}
        {historyStatus === "error" ? (
          <p className="text-xs text-danger p-2">Unable to load history.</p>
        ) : null}
        {historyStatus === "ready" && conversations.length === 0 ? (
          <p className="text-xs text-ink-muted p-2">No previous chats yet.</p>
        ) : null}
        {historyStatus === "ready" &&
          conversations.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSwitchConversation(entry.id)}
              className={`w-full rounded-xl border text-left text-sm transition-all duration-200 cursor-pointer ${
                currentConversationId === entry.id
                  ? "border-brand/50 bg-brand-light/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  : "border-white/5 bg-slate-950/20 hover:border-white/10 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between gap-3 px-4 pt-3.5">
                <span className="font-semibold text-white">Conversation</span>
                <span className="text-[10px] font-bold text-ink-faint uppercase tracking-wider">
                  {entry.status}
                </span>
              </div>
              <div className="px-4 pb-3.5 pt-1.5">
                {entry.preview ? (
                  <p className="line-clamp-2 text-xs text-ink-muted leading-relaxed">
                    {entry.preview}
                  </p>
                ) : (
                  <p className="text-xs text-ink-faint italic">No messages yet.</p>
                )}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
