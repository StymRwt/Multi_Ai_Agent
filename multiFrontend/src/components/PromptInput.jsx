import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function PromptInput({ onSend, disabled, placeholder }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const canSend = input.trim().length > 0 && !disabled;

  // Grow with content, up to a cap.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const submit = () => {
    if (!canSend) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-ink-700 bg-ink-850 p-2 pl-4 transition-colors focus-within:border-[var(--agent)]">
      <textarea
        ref={textareaRef}
        value={input}
        rows={1}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Message"
        className="max-h-[200px] min-h-[28px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 text-white outline-none placeholder:text-fog-500"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!canSend}
        aria-label="Send message"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--agent)] text-ink-950 transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
