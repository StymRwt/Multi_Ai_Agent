import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable; ignore */
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-950">
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-900 px-4 py-2 text-xs text-fog-400">
        <span className="font-mono">{lang || "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-fog-300 transition-colors hover:text-white"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-fog-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
