import { memo } from "react";
import { formatRelative } from "../utils/time";

function ConversationItem({ conversation, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation._id)}
      aria-current={active ? "true" : undefined}
      className={`group w-full rounded-lg px-3 py-2 text-left transition-colors ${
        active ? "bg-ink-700 text-white" : "text-fog-300 hover:bg-ink-800 hover:text-white"
      }`}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-sm font-medium">{conversation.title || "Untitled chat"}</span>
        <span className="shrink-0 text-[11px] text-fog-500">{formatRelative(conversation.updatedAt)}</span>
      </span>
      {conversation.lastMessage && (
        <span className="mt-0.5 block truncate text-xs text-fog-500">{conversation.lastMessage}</span>
      )}
    </button>
  );
}

export default memo(ConversationItem);
