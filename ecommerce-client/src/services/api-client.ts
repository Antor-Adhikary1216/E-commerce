import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/lib/token";
import { getFirebaseAuth } from "@/lib/firebase";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const apiClient = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401 && !error.config.__retried) {
      error.config.__retried = true;

      // Step 1: try the refresh token cookie
      try {
        const { data } = await axios.post(`${BASE}/auth/refresh`, {}, { withCredentials: true });
        setAccessToken(data.accessToken);
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(error.config);
      } catch {
        // Step 2: refresh failed — try exchanging the Firebase ID token
        try {
          const auth = getFirebaseAuth();
          const fbUser = auth?.currentUser;
          if (fbUser) {
            const idToken = await fbUser.getIdToken(true);
            const { data } = await axios.post(`${BASE}/auth/exchange`, { idToken }, { withCredentials: true });
            setAccessToken(data.accessToken);
            error.config.headers.Authorization = `Bearer ${data.accessToken}`;
            return apiClient(error.config);
          }
        } catch {
          // both paths failed
        }
        clearAccessToken();
      }
    }
    return Promise.reject(error);
  },
);
