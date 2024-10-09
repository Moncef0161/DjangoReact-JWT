import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  email: string;
  name: string;
  avatar: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        credentials
      );
      localStorage.setItem("token", response.data.access);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/",
        userData
      );
      // localStorage.setItem("token", response.data.access);
      // Navigate to login page after registration
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.detail ||
          error.response.data ||
          "Something went wrong"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // state.isAuthenticated = true;
        state.user = action.payload.user;
        // state.token = action.payload.access;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
