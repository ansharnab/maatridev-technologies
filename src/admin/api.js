import axios from "axios";

const devApiBase = import.meta.env.VITE_DEV_API_URL || "http://localhost:3001";
const directApi = axios.create({ baseURL: devApiBase });

export async function loginAdmin(password) {
  const body = { password: password.trim() };

  try {
    const res = await axios.post("/api/auth/login", body);
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const viaProxyFailed = !err.response || status === 502 || status === 504 || status === 500;

    if (viaProxyFailed) {
      try {
        const health = await directApi.get("/api/health", { timeout: 3000 });
        if (health.data?.ok) {
          const res = await directApi.post("/api/auth/login", body);
          return res.data;
        }
      } catch {
        // fall through to original error
      }
    }

    throw err;
  }
}

export async function checkApiHealth() {
  try {
    const res = await axios.get("/api/health", { timeout: 3000 });
    return res.data?.ok === true;
  } catch {
    try {
      const res = await directApi.get("/api/health", { timeout: 3000 });
      return res.data?.ok === true;
    } catch {
      return false;
    }
  }
}

export function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}
