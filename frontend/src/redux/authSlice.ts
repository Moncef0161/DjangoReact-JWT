import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  username: string;  // Added username
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
    userData: { email: string; password: string; name: string; username: string }, // Added name and username
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/",
        userData
      );
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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ id, ...userData }: { id: string } & Partial<User>, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/user/${id}/`, userData);
      return response.data; // Returns updated user data
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.detail || "Something went wrong"
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
    updateProfileInState: (state, action: PayloadAction<User>) => {
      state.user = { ...state.user, ...action.payload };
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
        state.isAuthenticated = true; // Assuming you want to auto-login after registration
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.access); // Set token if applicable
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Update user in the state with the new profile information
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { logout, updateProfileInState } = authSlice.actions; // Corrected the export
export default authSlice.reducer;
