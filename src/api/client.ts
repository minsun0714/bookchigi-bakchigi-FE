import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  if (!config.headers.has("Authorization")) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
      withCredentials: true,
    });
    const token = (res.headers["authorization"] as string)?.replace(
      "Bearer ",
      "",
    );
    if (token) {
      localStorage.setItem("access_token", token);
      return token;
    }
    return null;
  } catch {
    return null;
  }
}

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original: InternalAxiosRequestConfig & { _retry?: boolean } =
      error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshToken().finally(() => {
          refreshPromise = null;
        });
      }

      const token = await refreshPromise;
      if (token) {
        original.headers.set("Authorization", `Bearer ${token}`);
        return axios.request({
          ...original,
          baseURL: API_BASE_URL,
          withCredentials: true,
        });
      }

      localStorage.removeItem("access_token");
    }

    return Promise.reject(error);
  },
);

export default client;
