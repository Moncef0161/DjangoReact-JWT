import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const API_BASE_URL = "http://127.0.0.1:8000"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response, // Just return the response if everything is okay
  async (error) => {
    const originalRequest = error.config;

    // Prevent retry loop or if no response available
    if (originalRequest._retry || !error.response) {
      return Promise.reject(error);
    }

    // If error status is 401 (Unauthorized) and token refresh is possible
    if (error.response.status === 401) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      // If no refresh token is found, logout or handle the session expiry
      if (!refreshToken) {
        // Optional: Trigger an event or handle session expiry here
        // window.location.href = "/logout";
        const event = new Event("refreshTokenExpired");
        window.dispatchEvent(event);

        return Promise.reject(error);
      }

      originalRequest._retry = true; // Mark request as retried to avoid loops

      try {
        // Attempt to refresh the access token
        console.log("expirsed token");
        const { data } = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        console.log("data: ", data);

        // Update tokens in localStorage
        localStorage.setItem(ACCESS_TOKEN, data.access);
     

        // Update the authorization header in the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (tokenRefreshError) {
        // Refresh token failed, trigger logout or handle accordingly
        // window.location.href = "/logout";
        const event = new Event("refreshTokenExpired");
        window.dispatchEvent(event);
        return Promise.reject(tokenRefreshError);
      }
    }

    // Return any other errors that aren't 401
    return Promise.reject(error);
  }
);

export default api;
