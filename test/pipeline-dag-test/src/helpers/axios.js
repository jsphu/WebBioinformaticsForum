import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getAccessToken, getRefreshToken } from "../hooks/user.actions";

export const baseURL = "http://localhost:8000";

const axiosService = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach token only if available
axiosService.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // ensure no bogus header gets sent for anonymous users
    delete config.headers.Authorization;
  }
  return config;
});

// Response interceptor
axiosService.interceptors.response.use(
  (res) => Promise.resolve(res),
  (err) => Promise.reject(err),
);

// Refresh logic
const refreshAuthLogic = async (failedRequest) => {
  const refresh = getRefreshToken();

  // If there’s no refresh token, user is anonymous → don’t try to refresh
  if (!refresh) {
    return Promise.reject(failedRequest);
  }

  return axios
    .post(
      "/api/auth/refresh/",
      { refresh },
      {
        baseURL: baseURL,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    .then((resp) => {
      const { access } = resp.data;
      let user = null;

      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        user = auth?.user || null;
      } catch (e) {
        console.error("Failed to read user data from localStorage", e);
      }

      // Update the failed request with new access token
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + access;

      // Store new tokens
      localStorage.setItem(
        "auth",
        JSON.stringify({
          refresh,
          access,
          user,
        }),
      );

      return Promise.resolve();
    })
    .catch(() => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        auth.access = null;
        localStorage.setItem("auth", JSON.stringify(auth));
      } catch (e) {
        console.error("Failed to update auth object in localStorage", e);
      }
      return Promise.reject(failedRequest);
    });
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

// Simple fetcher helper
export async function fetcher(url) {
  return await axiosService.get(url).then((res) => res.data);
}

export default axiosService;
