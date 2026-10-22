import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import { NEUTRAL_COLOR, getAgent } from "../constants/agents";
import { formatClock } from "../utils/time";

const markdownComponents = {
  pre({ children }) {
    const child = Array.isArray(children) ? children[0] : children;
    const lang = /language-([\w-]+)/.exec(child?.props?.className || "")?.[1];
    const code = String(child?.props?.children ?? "").replace(/\n$/, "");
    return <CodeBlock lang={lang} code={code} />;
  },
  a({ children, href }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto">
        <table>{children}</table>
      </div>
    );
  },
};

function MessageBubble({ message }) {
  const isUser = message.role === "human" || message.role === "user";
  const time = formatClock(message.createdAt);

  if (isUser) {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-ink-700 px-4 py-2.5 text-[15px] leading-6 text-white sm:max-w-[75%]">
          {message.content}
        </div>
        {time && <span className="mt-1 px-1 text-xs text-fog-500">{time}</span>}
      </div>
    );
  }

  const agent = message.agent ? getAgent(message.agent) : null;
  const color = agent?.color || NEUTRAL_COLOR;

  return (
    <div className="flex flex-col items-start">
      <div
        className="w-full max-w-full rounded-2xl rounded-bl-md border border-ink-700 bg-ink-850 px-5 py-4 sm:max-w-[90%]"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        {agent && (
          <div className="mb-2 flex items-center gap-2 text-xs font-medium" style={{ color }}>
            <agent.icon size={14} aria-hidden="true" />
            {agent.label}
          </div>
        )}
        <div className="markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      {time && <span className="mt-1 px-1 text-xs text-fog-500">{time}</span>}
    </div>
  );
}

export default memo(MessageBubble);
