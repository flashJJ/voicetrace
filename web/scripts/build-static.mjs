import fs from "node:fs";
import { execSync } from "node:child_process";

const apiDir = "app/api";
const backupDir = ".api-backup";

if (!fs.existsSync(apiDir)) {
  throw new Error("找不到 app/api，无法生成静态演示包");
}

if (fs.existsSync(backupDir)) {
  fs.rmSync(backupDir, { recursive: true, force: true });
}

fs.renameSync(apiDir, backupDir);

try {
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "true" },
  });
} finally {
  fs.renameSync(backupDir, apiDir);
}
