import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const lines = envText.split(/\r?\n/).filter((l) => l.includes("ADMIN_PASSWORD"));
const pwd = "maatridev2026";

const out = [];
out.push("env file exists: " + fs.existsSync(envPath));
out.push("env ADMIN lines: " + JSON.stringify(lines));
out.push("typed password chars: " + pwd.length);

for (const base of ["http://localhost:3001", "http://localhost:5173"]) {
  try {
    const status = await fetch(`${base}/api/auth/status`);
    out.push(`${base} status: ${status.status} ${await status.text()}`);
  } catch (e) {
    out.push(`${base} status err: ${e.message}`);
  }
  try {
    const login = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    out.push(`${base} login: ${login.status} ${await login.text()}`);
  } catch (e) {
    out.push(`${base} login err: ${e.message}`);
  }
}

fs.writeFileSync(path.join(root, "scripts", "diag-auth-result.txt"), out.join("\n"));
console.log(out.join("\n"));
