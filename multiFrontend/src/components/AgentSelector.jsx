import { useDispatch, useSelector } from "react-redux";
import { AGENTS } from "../constants/agents";
import { setAgent } from "../redux/slices/messageSlice";

export default function AgentSelector() {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.messages.agent);

  return (
    <div
      role="group"
      aria-label="Agent"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {AGENTS.map((agent) => {
        const active = selected === agent.value;
        return (
          <button
            key={agent.value}
            type="button"
            aria-pressed={active}
            onClick={() => dispatch(setAgent(agent.value))}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active ? "" : "border-ink-700 bg-ink-850 text-fog-300 hover:border-ink-600 hover:text-white"
            }`}
            style={
              active
                ? {
                    color: agent.color,
                    borderColor: agent.color,
                    backgroundColor: `${agent.color}1F`,
                  }
                : undefined
            }
          >
            <agent.icon size={15} aria-hidden="true" />
            {agent.label}
          </button>
        );
      })}
    </div>
  );
}
