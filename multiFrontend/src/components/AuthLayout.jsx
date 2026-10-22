import LogoMark from "./LogoMark";
import { AGENTS } from "../constants/agents";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-dvh bg-ink-950 lg:grid-cols-[1.1fr_1fr]">
      <aside className="hidden flex-col justify-between border-r border-ink-800 bg-ink-900 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <LogoMark size={26} />
          <span className="font-display text-xl font-semibold text-white">Multi-Agent AI</span>
        </div>

        <div>
          <h2 className="max-w-md font-display text-4xl font-semibold leading-tight tracking-tight text-white">
            Ask, search, code, and look, all in one conversation.
          </h2>
          <ul className="mt-10 space-y-4">
            {AGENTS.map((agent) => (
              <li key={agent.value} className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${agent.color}26`, color: agent.color }}
                >
                  <agent.icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-white">{agent.label}</span>
                  <span className="block text-sm text-fog-400">{agent.blurb}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <span aria-hidden="true" />
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <LogoMark />
            <span className="font-display text-lg font-semibold text-white">Multi-Agent AI</span>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-fog-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-sm text-fog-400">{footer}</p>
        </div>
      </main>
    </div>
  );
}
