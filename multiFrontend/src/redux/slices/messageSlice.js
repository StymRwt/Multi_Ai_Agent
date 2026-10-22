import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { resetSession } from "../actions";
import { ALLOWED_AGENTS } from "../../constants/agents";
import { getErrorMessage } from "../../utils/errors";
import { makeTitle } from "../../utils/time";
import {
  conversationTouched,
  createConversation,
  selectConversation,
  startNewChat,
} from "./conversationSlice";

export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/chat/get-message/${conversationId}`);
      const list = Array.isArray(res.data?.message) ? res.data.message : [];
      return list
        .filter((m) => m && typeof m.content === "string")
        .map((m, i) => ({ ...m, _id: m._id || `${conversationId}-${i}` }));
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load this conversation's messages."));
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/send",
  async (
    { inputvalue },
    { getState, dispatch, rejectWithValue }
  ) => {
    const text = (inputvalue || "").trim();

    if (!text) {
      return rejectWithValue("Type a message first.");
    }

    const agent = getState().messages.agent;

    if (!ALLOWED_AGENTS.includes(agent)) {
      return rejectWithValue("Choose an agent before sending.");
    }

    // Show the user's message immediately
    dispatch(
      userMessageAdded({
        _id: nanoid(),
        role: "human",
        content: text,
        createdAt: new Date().toISOString(),
      })
    );

    try {
      // Create a conversation if one does not exist
      let conversationId =
        getState().conversations.selectedId;

      if (!conversationId) {
        const conversation = await dispatch(
          createConversation(makeTitle(text))
        ).unwrap();

        conversationId = conversation._id;
      }

      dispatch(sendBound(conversationId));

      // Send both requests simultaneously
      const [res, res2] = await Promise.all([
        // Agent API
        api.post("/api/agent/ai", {
          inputvalue: text,
          agent,
          conversationId,
        }),

        // Create human message
        api.post("/api/chat/create-message", {
          content: text,
          role: "human",
          conversationId,
        }),
      ]);


      // Extract AI response
      const content =
        typeof res.data?.content === "string"
          ? res.data.content.trim()
          : "";

      if (!content) {
        return rejectWithValue(
          "The agent returned an empty response. Try rephrasing your message."
        );
      }

      dispatch(
        conversationTouched({
          id: conversationId,
          preview: text,
        })
      );

      return {
        conversationId,
        message: {
          _id: nanoid(),
          role: "assistant",
          content,
          agent: res.data.agent || agent,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to send your message.")
      );
    }
  }
);

const initialState = {
  items: [],
  loadedConversationId: null, // which conversation `items` belongs to
  loading: false, // fetching history
  sending: false, // waiting on an agent reply
  sendingFor: null, // conversation the pending reply belongs to
  error: "",
  agent: "chat",
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setAgent(state, action) {
      if (ALLOWED_AGENTS.includes(action.payload)) state.agent = action.payload;
    },
    dismissError(state) {
      state.error = "";
    },
    userMessageAdded(state, action) {
      state.items.push(action.payload);
    },
    sendBound(state, action) {
      state.sendingFor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startNewChat, (state) => {
        state.items = [];
        state.loadedConversationId = null;
        state.loading = false;
        state.error = "";
      })
      .addCase(selectConversation, (state, action) => {
        if (action.payload !== state.loadedConversationId) {
          state.items = [];
          state.error = "";
        }
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        // Keep the optimistic message; this chat now belongs to the new conversation.
        state.loadedConversationId = action.payload._id;
      })
      .addCase(fetchMessages.pending, (state, action) => {
        state.loadedConversationId = action.meta.arg;
        state.items = [];
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        if (state.loadedConversationId !== action.meta.arg) return; // stale response
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        if (state.loadedConversationId !== action.meta.arg) return;
        state.loading = false;
        state.error = action.payload || "Unable to load this conversation's messages.";
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.sendingFor = null;
        state.error = "";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.sendingFor = null;
        if (state.loadedConversationId === action.payload.conversationId) {
          state.items.push(action.payload.message);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.sendingFor = null;
        state.error = action.payload || "Failed to send your message.";
      })
      .addCase(resetSession, () => initialState);
  },
});

export const { setAgent, dismissError, userMessageAdded, sendBound } = messageSlice.actions;
export default messageSlice.reducer;
