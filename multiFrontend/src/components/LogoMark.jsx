import { AGENTS } from "../constants/agents";

/** Four squares, one per agent. */
export default function LogoMark({ size = 22 }) {
  const gap = Math.max(2, Math.round(size / 9));
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 grid-cols-2"
      style={{ width: size, height: size, gap }}
    >
      {AGENTS.map((agent) => (
        <span
          key={agent.value}
          className="rounded-[28%]"
          style={{ backgroundColor: agent.color }}
        />
      ))}
    </span>
  );
}
