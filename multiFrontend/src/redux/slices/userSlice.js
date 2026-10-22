import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { resetSession } from "../actions";
import { getErrorMessage } from "../../utils/errors";

const STORAGE_KEY = "maa-user";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

const toUser = (data, fallbackEmail, fallbackName) => {
  const user = data?.user || {};
  const email = user.email || fallbackEmail;
  return {
    name: user.name || user.username || fallbackName || email?.split("@")[0] || "You",
    email,
  };
};

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      return toUser(res.data, email);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Couldn't sign you in. Check your details and try again."));
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      return toUser(res.data, email, name);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Couldn't create your account. Try again."));
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async (_, { dispatch }) => {
  try {
    await api.post("/api/auth/logout"); // backend clears the HTTP-only cookie
  } catch (error) {
    console.error("Logout error:", error?.message);
  } finally {
    dispatch(resetSession());
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: { user: readStoredUser(), status: "idle", error: "" },
  reducers: {
    clearAuthError(state) {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = "loading";
      state.error = "";
    };
    const fulfilled = (state, action) => {
      state.status = "idle";
      state.user = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    };
    const rejected = (state, action) => {
      state.status = "idle";
      state.error = action.payload || "Something went wrong. Try again.";
    };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected)
      .addCase(resetSession, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = "";
        localStorage.removeItem(STORAGE_KEY);
      });
  },
});

export const { clearAuthError } = userSlice.actions;
export default userSlice.reducer;
