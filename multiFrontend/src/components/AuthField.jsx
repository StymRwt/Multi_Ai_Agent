export default function AuthField({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fog-300">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-2.5 text-[15px] text-white outline-none transition-colors placeholder:text-fog-500 focus:border-[var(--agent)]"
      />
    </div>
  );
}
