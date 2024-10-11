import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  email: string;
  username: string;
  avatar: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface JwtPayload {
  user_id: number;
  exp: number;
  iat: number;
  jti: string;
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
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        credentials
      );
      const { access } = response.data;
      localStorage.setItem("token", access);

      const decodedToken = jwtDecode<JwtPayload>(access);
      const userId = decodedToken.user_id;
      console.log("userId:", userId);

      // Fetch user information
      const userResponse = await axios.get(
        `http://127.0.0.1:8000/api/user/${userId}/`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      return { token: access, user: userResponse.data };
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: { username: string; email: string; password: string },
    { dispatch }
  ) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        userData
      );
      const { access } = response.data;
      localStorage.setItem("token", access);

      const decodedToken = jwtDecode<JwtPayload>(access);
      const userId = decodedToken.user_id;
      console.log("userId:", userId);

      // Fetch user information
      const userResponse = await axios.get(
        `http://127.0.0.1:8000/api/user/${userId}/`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      return { token: access, user: userResponse.data };
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    profileData: {
      username: string;
      email: string;
      avatar: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const userId = state.auth.user?.id;

      const response = await axios.patch(
        `http://127.0.0.1:8000/api/user/${userId}/`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
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
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
