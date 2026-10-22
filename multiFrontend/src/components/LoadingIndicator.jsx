import { getAgent } from "../constants/agents";

export default function LoadingIndicator({ agent }) {
  const { working, color } = getAgent(agent);
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 py-2 text-sm text-fog-400">
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-blink rounded-full motion-reduce:animate-none"
            style={{ backgroundColor: color, animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>
      <span>{working}…</span>
    </div>
  );
}
