import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConversationItem from "./ConversationItem";
import { fetchConversations, selectConversation } from "../redux/slices/conversationSlice";
import { groupByRecency } from "../utils/time";

export default function ConversationList({ onNavigate }) {
  const dispatch = useDispatch();
  const { items, selectedId, status, error } = useSelector((s) => s.conversations);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const groups = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return groupByRecency(sorted);
  }, [items]);

  const handleSelect = (id) => {
    dispatch(selectConversation(id));
    onNavigate?.();
  };

  if (status === "loading" && items.length === 0) {
    return (
      <div className="space-y-2 px-1" role="status" aria-label="Loading conversations">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-ink-800 motion-reduce:animate-none" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="px-2 text-sm text-fog-300">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => dispatch(fetchConversations())}
          className="mt-2 font-medium text-white underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="px-2 text-sm text-fog-500">No conversations yet. Send a message to start one.</p>;
  }

  return (
    <nav aria-label="Conversations" className="space-y-5">
      {groups.map((group) => (
        <section key={group.label}>
          <h3 className="mb-1 px-3 text-xs font-medium text-fog-500">{group.label}</h3>
          <div className="space-y-0.5">
            {group.items.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                active={conversation._id === selectedId}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}
