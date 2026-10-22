const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelative(iso) {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";
  const diff = Date.now() - time;
  if (diff < MINUTE) return "Just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return new Date(time).toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatClock(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** Group conversations (already sorted newest first) into recency buckets. */
export function groupByRecency(conversations) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekAgo = startOfToday - 6 * DAY;

  const buckets = [
    { label: "Today", items: [] },
    { label: "Previous 7 days", items: [] },
    { label: "Earlier", items: [] },
  ];

  for (const conversation of conversations) {
    const time = new Date(conversation.updatedAt).getTime();
    if (time >= startOfToday) buckets[0].items.push(conversation);
    else if (time >= weekAgo) buckets[1].items.push(conversation);
    else buckets[2].items.push(conversation);
  }
  return buckets.filter((bucket) => bucket.items.length > 0);
}

export function makeTitle(text, max = 48) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}
