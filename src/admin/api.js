import axios from "axios";

const devApiBase = import.meta.env.VITE_DEV_API_URL || "http://localhost:3001";
const directApi = axios.create({ baseURL: devApiBase });

async function postLogin(body, client = axios) {
  const res = await client.post("/api/auth/login", body);
  return res.data;
}

export async function loginAdmin(password) {
  const body = { password: String(password ?? "").replace(/\uFEFF/g, "").trim() };

  try {
    return await postLogin(body);
  } catch (err) {
    const status = err.response?.status;
    const shouldRetryDirect =
      !err.response || status === 401 || status === 502 || status === 504 || status === 500;

    if (shouldRetryDirect) {
      try {
        const health = await directApi.get("/api/health", { timeout: 3000 });
        if (health.data?.ok) {
          return await postLogin(body, directApi);
        }
      } catch {
        // fall through to original error
      }
    }

    throw err;
  }
}

export async function fetchAuthStatus() {
  try {
    const res = await axios.get("/api/auth/status", { timeout: 3000 });
    return res.data;
  } catch {
    try {
      const res = await directApi.get("/api/auth/status", { timeout: 3000 });
      return res.data;
    } catch {
      return null;
    }
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

function proxyUnreachable(err) {
  const status = err?.response?.status;
  return !err?.response || status === 502 || status === 504 || status === 500;
}

async function withDirectFallback(run) {
  try {
    return await run(axios);
  } catch (err) {
    if (!proxyUnreachable(err)) throw err;
    const health = await directApi.get("/api/health", { timeout: 4000 });
    if (!health.data?.ok) throw err;
    return await run(directApi);
  }
}

export async function fetchSiteContent() {
  const data = await withDirectFallback((client) => client.get("/api/content"));
  return data.data;
}

export async function saveSiteContent(content) {
  const data = await withDirectFallback((client) =>
    client.put("/api/content", content, { headers: authHeaders() }),
  );
  return data.data;
}

/** Upload with Vite proxy first, then direct http://localhost:3001 fallback */
export async function uploadMediaFile(file) {
  const token = localStorage.getItem("maatridev-admin-token");
  if (!token) {
    throw new Error("Not signed in — open /admin and log in first.");
  }
  const fd = new FormData();
  fd.append("files", file);
  const headers = { ...authHeaders(), "Content-Type": "multipart/form-data" };

  try {
    const res = await axios.post("/api/media/upload", fd, { headers });
    return res.data;
  } catch (err) {
    if (!proxyUnreachable(err)) throw err;
    try {
      const health = await directApi.get("/api/health", { timeout: 4000 });
      if (!health.data?.ok) throw err;
      const res = await directApi.post("/api/media/upload", fd, { headers });
      return res.data;
    } catch {
      throw err;
    }
  }
}
