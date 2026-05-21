/**
 * Free a TCP port before starting dev (Windows + Unix).
 * Usage: node scripts/free-port.mjs 3001
 */
import { execSync } from "node:child_process";

const port = String(process.argv[2] || "3001").trim();

function freeWindows() {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!/LISTENING/i.test(line)) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
    }
    if (pids.size === 0) {
      console.log(`Port ${port} is free.`);
      return;
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Freed port ${port} (stopped PID ${pid}).`);
      } catch {
        console.warn(`Could not stop PID ${pid} on port ${port}.`);
      }
    }
  } catch {
    console.log(`Port ${port} is free.`);
  }
}

function freeUnix() {
  try {
    execSync(`lsof -ti tcp:${port} | xargs -r kill -9`, { stdio: "ignore", shell: true });
    console.log(`Freed port ${port}.`);
  } catch {
    console.log(`Port ${port} is free.`);
  }
}

if (process.platform === "win32") freeWindows();
else freeUnix();
