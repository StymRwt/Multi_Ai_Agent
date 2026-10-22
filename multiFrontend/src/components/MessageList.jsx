import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";
import LogoMark from "./LogoMark";
import { AGENTS } from "../constants/agents";
import { setAgent } from "../redux/slices/messageSlice";

function Welcome({ agent }) {
  const dispatch = useDispatch();
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-4 py-10">
      <LogoMark size={40} />
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Welcome to Multi-Agent AI
      </h1>
      <p className="mt-3 text-base text-fog-300">Choose an agent and start a conversation.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {AGENTS.map((a) => {
          const active = agent === a.value;
          return (
            <button
              key={a.value}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch(setAgent(a.value))}
              className="flex items-start gap-3 rounded-xl border bg-ink-900 p-4 text-left transition-colors hover:bg-ink-850"
              style={{ borderColor: active ? a.color : "#2D3448" }}
            >
              <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${a.color}26`, color: a.color }}
              >
                <a.icon size={17} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-medium text-white">{a.label}</span>
                <span className="mt-0.5 block text-sm text-fog-400">{a.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MessageList({
  messages,
  conversationId,
  agent,
  loading,
  showIndicator,
  loadError,
  onRetry,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, showIndicator]);

  if (!conversationId && messages.length === 0 && !showIndicator) {
    return <Welcome agent={agent} />;
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8" role="status" aria-label="Loading messages">
        {[65, 90, 50].map((w, i) => (
          <div key={i} className={`h-14 animate-pulse rounded-2xl bg-ink-850 motion-reduce:animate-none ${i % 2 === 0 ? "ml-auto" : ""}`} style={{ width: `${w}%` }} />
        ))}
      </div>
    );
  }

  if (loadError && messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-fog-300">{loadError}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (messages.length === 0 && !showIndicator) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <h2 className="font-display text-2xl font-semibold text-white">How can I help you today?</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      {messages.map((message) => (
        <MessageBubble key={message._id} message={message} />
      ))}
      {showIndicator && <LoadingIndicator agent={agent} />}
      <div ref={endRef} />
    </div>
  );
}
