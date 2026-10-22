import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import MessageList from "./MessageList";
import AgentSelector from "./AgentSelector";
import PromptInput from "./PromptInput";
import { getAgent } from "../constants/agents";
import { dismissError, fetchMessages, sendMessage } from "../redux/slices/messageSlice";

export default function ChatArea({ onOpenSidebar }) {
  const dispatch = useDispatch();
  const conversationId = useSelector((s) => s.conversations.selectedId);
  const conversation = useSelector((s) =>
    s.conversations.items.find((c) => c._id === s.conversations.selectedId)
  );
  const { items, loadedConversationId, loading, sending, sendingFor, error, agent } =
    useSelector((s) => s.messages);

  const current = getAgent(agent);

  // Load history whenever the selected conversation changes.
  useEffect(() => {
    if (conversationId && conversationId !== loadedConversationId) {
      dispatch(fetchMessages(conversationId));
    }
  }, [conversationId, loadedConversationId, dispatch]);

  const showIndicator = sending && sendingFor === loadedConversationId;
  const loadError = error && !sending && items.length === 0 && conversationId ? error : "";

  return (
    <main
      className="flex min-w-0 flex-1 flex-col bg-ink-950"
      style={{ "--agent": current.color }}
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-ink-800 px-3 sm:px-5">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open conversations"
          className="rounded-lg p-2 text-fog-300 transition-colors hover:bg-ink-800 hover:text-white md:hidden"
        >
          <Menu size={20} />
        </button>
        <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-white">
          {conversation?.title || "New chat"}
        </h2>
        <span
          className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{ color: current.color, backgroundColor: `${current.color}1F` }}
        >
          <current.icon size={13} aria-hidden="true" />
          {current.label}
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <MessageList
          messages={items}
          conversationId={conversationId}
          agent={agent}
          loading={loading}
          showIndicator={showIndicator}
          loadError={loadError}
          onRetry={() => dispatch(fetchMessages(conversationId))}
        />
      </div>

      <div className="shrink-0 px-3 pb-4 pt-2 sm:px-5">
        <div className="mx-auto w-full max-w-3xl space-y-2">
          {error && !loadError && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-200"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => dispatch(dismissError())}
                aria-label="Dismiss error"
                className="mt-0.5 shrink-0 text-red-200/70 hover:text-red-100"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <AgentSelector />
          <PromptInput
            disabled={sending || loading}
            placeholder={current.placeholder}
            onSend={(inputvalue) => dispatch(sendMessage({ inputvalue }))}
          />
        </div>
      </div>
    </main>
  );
}
