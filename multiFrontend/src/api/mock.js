// A tiny in-browser backend so the UI works without a server.
// Enabled with VITE_USE_MOCK=true. Data persists in localStorage.
import { AxiosError } from "axios";

const KEY = "maa-mock-db-v1";
const uid = () => Math.random().toString(16).slice(2, 10) + Date.now().toString(16);
const ago = (ms) => new Date(Date.now() - ms).toISOString();

function seed() {
  const c1 = uid();
  const c2 = uid();
  const c3 = uid();
  return {
    conversations: [
      { _id: c1, title: "Learning Node.js", updatedAt: ago(20 * 60_000) },
      { _id: c2, title: "DSA practice: two pointers", updatedAt: ago(26 * 3_600_000) },
      { _id: c3, title: "Reading a stack trace", updatedAt: ago(9 * 86_400_000) },
    ],
    messages: {
      [c1]: [
        { _id: uid(), role: "human", content: "Explain Node.js in two sentences.", createdAt: ago(21 * 60_000) },
        {
          _id: uid(),
          role: "assistant",
          agent: "chat",
          content:
            "Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser.\n\nIts event-driven, non-blocking I/O model makes it well suited to network services that handle many connections at once.",
          createdAt: ago(20 * 60_000),
        },
      ],
      [c2]: [
        { _id: uid(), role: "human", content: "Show me two-pointer code to find a pair with a given sum in a sorted array.", createdAt: ago(26 * 3_600_000) },
        {
          _id: uid(),
          role: "assistant",
          agent: "code",
          content:
            "Move one pointer in from each end and adjust based on the sum:\n\n```js\nfunction pairWithSum(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n\n  while (left < right) {\n    const sum = nums[left] + nums[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return null;\n}\n```\n\nIt runs in **O(n)** time and **O(1)** space.",
          createdAt: ago(26 * 3_600_000),
        },
      ],
      [c3]: [],
    },
  };
}

const save = (db) => localStorage.setItem(KEY, JSON.stringify(db));

// Seed once and persist, so ids stay stable across requests.
const load = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    if (stored) return stored;
  } catch {
    /* fall through and reseed */
  }
  const db = seed();
  save(db);
  return db;
};

function reply(agent, text) {
  const topic = text.length > 80 ? `${text.slice(0, 80)}…` : text;
  switch (agent) {
    case "search":
      return `I searched for **${topic}** and found these points:\n\n- **Overview:** a short summary of the topic would appear here.\n- **Key detail:** the most relevant facts, pulled from the top results.\n- **Worth reading:** [Example source](https://example.com)\n\n_This is a mock response. Connect the backend to get real results._`;
    case "code":
      return `Here's a starting point for **${topic}**:\n\n\`\`\`js\nexport function example(input) {\n  // TODO: replace with the real implementation\n  return input;\n}\n\`\`\`\n\nUse \`example()\` as a template. _This is a mock response._`;
    case "image":
      return `Image analysis needs the backend. When it's connected, I'd describe what's in the image for: **${topic}**.\n\n_This is a mock response._`;
    default:
      return `You asked: **${topic}**\n\nThis is a mock reply so you can try the interface without a server. Markdown works here:\n\n1. Lists\n2. **Bold** and _italic_ text\n3. \`inline code\`\n\nSet \`VITE_USE_MOCK=false\` in \`.env\` to use your real backend.`;
  }
}

function respond(config, status, data) {
  return { data, status, statusText: "OK", headers: {}, config, request: {} };
}
function fail(config, status, message) {
  const response = respond(config, status, { success: false, message });
  return new AxiosError(message, "ERR_BAD_REQUEST", config, {}, response);
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockAdapter(config) {
  const method = (config.method || "get").toLowerCase();
  const url = (config.url || "").split("?")[0];
  let body = {};
  try {
    body = typeof config.data === "string" ? JSON.parse(config.data) : config.data || {};
  } catch {
    body = {};
  }

  await wait(250);
  const db = load();

  if (method === "post" && url === "/api/auth/login") {
    if (!body.email || !body.password) throw fail(config, 400, "Email and password are required.");
    const name = body.email.split("@")[0];
    return respond(config, 200, { success: true, user: { name, email: body.email } });
  }
  if (method === "post" && url === "/api/auth/register") {
    if (!body.email || !body.password) throw fail(config, 400, "Name, email and password are required.");
    return respond(config, 201, { success: true, user: { name: body.name, email: body.email } });
  }
  if (method === "post" && url === "/api/auth/logout") {
    return respond(config, 200, { success: true });
  }

  if (method === "get" && url === "/api/chat/get-conversation") {
    return respond(config, 200, { success: true, conversations: db.conversations });
  }

  if (method === "get" && url.startsWith("/api/chat/messages/")) {
    const id = url.split("/").pop();
    if (!db.messages[id]) throw fail(config, 404, "Conversation not found.");
    return respond(config, 200, { success: true, messages: db.messages[id] });
  }

  if (method === "post" && url === "/api/chat/create-conversation") {
    const conversation = { _id: uid(), title: body.title || "New chat", updatedAt: new Date().toISOString() };
    db.conversations.unshift(conversation);
    db.messages[conversation._id] = [];
    save(db);
    return respond(config, 201, { success: true, conversation });
  }

  if (method === "post" && url === "/api/chat/send-message") {
    const { inputvalue, agent, conversationId } = body;
    if (!inputvalue?.trim()) throw fail(config, 400, "Message is empty.");
    if (!["chat", "search", "code", "image"].includes(agent)) throw fail(config, 400, "Unknown agent.");
    if (!db.messages[conversationId]) throw fail(config, 404, "Conversation not found.");

    await wait(900 + Math.random() * 700);

    const now = new Date().toISOString();
    const response = reply(agent, inputvalue);
    db.messages[conversationId].push(
      { _id: uid(), role: "human", content: inputvalue, createdAt: now },
      { _id: uid(), role: "assistant", agent, content: response, createdAt: now }
    );
    const conversation = db.conversations.find((c) => c._id === conversationId);
    if (conversation) conversation.updatedAt = now;
    save(db);
    return respond(config, 200, { success: true, response, agent });
  }

  throw fail(config, 404, `No mock route for ${method.toUpperCase()} ${url}`);
}
