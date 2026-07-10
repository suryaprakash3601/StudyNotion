import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true, // send cookies with every request
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Automatically inject Authorization header from localStorage token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parsed = JSON.parse(token);
        config.headers["Authorization"] = `Bearer ${parsed}`;
      } catch {
        // token was stored as a plain string (not JSON-encoded)
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// Handle 401 Unauthorized globally – clear local state and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page without losing current location
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData || null,
    headers: headers || {},
    params: params || null,
  });
};