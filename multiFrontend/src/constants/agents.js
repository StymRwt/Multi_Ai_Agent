import { MessageSquare, Search, Code2, Eye } from "lucide-react";

// `value` must match the backend LangGraph routing: chat | search | code | image
export const AGENTS = [
  {
    label: "Chat",
    value: "chat",
    color: "#7C97FF",
    icon: MessageSquare,
    blurb: "Explanations, ideas, and everyday questions",
    placeholder: "Ask anything",
    working: "Thinking",
  },
  {
    label: "Search",
    value: "search",
    color: "#2EC4B6",
    icon: Search,
    blurb: "Look things up and get answers with sources",
    placeholder: "What do you want to find out?",
    working: "Searching",
  },
  {
    label: "Coding",
    value: "code",
    color: "#F2A93B",
    icon: Code2,
    blurb: "Write, explain, and debug code",
    placeholder: "Describe the code you need, or paste an error",
    working: "Writing code",
  },
  {
    label: "Vision",
    value: "image",
    color: "#B48CFF",
    icon: Eye,
    blurb: "Understand and analyze images",
    placeholder: "Describe the image you want analyzed",
    working: "Looking",
  },
];

export const ALLOWED_AGENTS = AGENTS.map((a) => a.value);

export const getAgent = (value) =>
  AGENTS.find((a) => a.value === value) || AGENTS[0];

export const NEUTRAL_COLOR = "#7F86A0";
