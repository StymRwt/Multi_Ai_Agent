# Multi-Agent AI Chat: Frontend

React + Tailwind + Redux Toolkit frontend for the multi-agent chat platform.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

`.env` ships with `VITE_USE_MOCK=true`, so the app runs **without a backend**:
sign in with any email and password, browse seeded conversations, and send
messages to any agent. Mock data persists in `localStorage`.

## Connect your backend

In `.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5000
```

Requests use `withCredentials: true`, so your backend needs CORS with
credentials enabled for `http://localhost:5173`. The frontend calls the Chat
Service only, never the Agent Service directly.

| Method | Endpoint                             | Body / response the UI expects                              |
| ------ | ------------------------------------ | ----------------------------------------------------------- |
| POST   | `/api/auth/login`                    | `{ email, password }` → `{ user: { name, email } }`         |
| POST   | `/api/auth/register`                 | `{ name, email, password }` → `{ user }`                    |
| POST   | `/api/auth/logout`                   | clears the cookie                                           |
| GET    | `/api/chat/get-conversation`         | `{ conversations: [{ _id, title, updatedAt }] }`            |
| GET    | `/api/chat/messages/:conversationId` | `{ messages: [{ _id, role, content, createdAt }] }`         |
| POST   | `/api/chat/create-conversation`      | `{ title }` → `{ conversation: { _id, title, updatedAt } }` |
| POST   | `/api/chat/send-message`             | `{ inputvalue, agent, conversationId }` → `{ response, agent }` |

The auth routes weren't listed in the requirements, so I assumed those paths.
Change them in `src/redux/slices/userSlice.js`. Any other route is a one-line
change in the matching slice. Agent values are `chat | search | code | image`.
Roles `human` and `user` render as the user; anything else renders as the assistant.

## Behavior

- **New chat** clears the view; the conversation is created on the first message, added to the sidebar, and selected.
- **Switching conversations** clears old messages, shows a skeleton, and loads the new history. Stale responses are ignored.
- **Agent selector** changes only the agent for the next prompt. The conversation and any text you've typed are kept.
- **401 from any request** signs the user out and redirects to `/login`. Other errors show a plain-language message.
- **Mobile**: the sidebar becomes a drawer (menu button, backdrop tap, or Esc closes it).

## Structure

```
src/
├── api/          axios.js (instance + 401 handling), mock.js (fake backend)
├── components/   Sidebar, ConversationList/Item, ChatArea, MessageList,
│                 MessageBubble, AgentSelector, PromptInput, LoadingIndicator, ...
├── constants/    agents.js (values, labels, colors)
├── pages/        Home, Login, Register
├── redux/        store.js, actions.js, slices/{user,conversation,message}Slice.js
└── utils/        errors.js, time.js
```

## Notes

- **Vision** sends text only, per the request contract in the requirements. Image upload would need a new field (or multipart) on `send-message`.
- Code blocks have a copy button but no syntax highlighting. Adding `rehype-highlight` to `MessageBubble` is a small change.
