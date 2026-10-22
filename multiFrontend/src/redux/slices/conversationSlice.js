import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { resetSession } from "../actions";
import { getErrorMessage } from "../../utils/errors";

export const fetchConversations = createAsyncThunk(
  "conversations/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/chat/get-conversation");
      const list = Array.isArray(res.data?.conversation) ? res.data.conversation : [];
      return list.filter((c) => c && c._id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Couldn't load your conversations."));
    }
  }
);

export const createConversation = createAsyncThunk(
  "conversations/create",
  async (title, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/chat/create-conversation", { title });
      const conversation = res.data?.conversation || res.data;
      if (!conversation?._id) throw new Error("Malformed create-conversation response");
      return {
        title: title || "New chat",
        updatedAt: new Date().toISOString(),
        ...conversation,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Couldn't start a new conversation."));
    }
  }
);

const initialState = { items: [], selectedId: null, status: "idle", error: "" };

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    selectConversation(state, action) {
      state.selectedId = action.payload;
    },
    startNewChat(state) {
      state.selectedId = null;
    },
    conversationTouched(state, action) {
      const { id, preview } = action.payload;
      const item = state.items.find((c) => c._id === id);
      if (!item) return;
      item.updatedAt = new Date().toISOString();
      item.lastMessage = preview;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = "ready";
        state.items = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Couldn't load your conversations.";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.selectedId = action.payload._id;
      })
      .addCase(resetSession, () => initialState);
  },
});

export const { selectConversation, startNewChat, conversationTouched } =
  conversationSlice.actions;
export default conversationSlice.reducer;
