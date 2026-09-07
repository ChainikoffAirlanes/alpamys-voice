import fs from "node:fs";
import { networkInterfaces } from "node:os";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import QRCode from "qrcode";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const qrPath = path.join(root, "public", "qr.png");
const port = 3000;

function findLanAddress() {
  const candidates = Object.values(networkInterfaces())
    .flatMap((addresses) => addresses ?? [])
    .filter((address) => address.family === "IPv4" && !address.internal);
  return candidates.find((address) => /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(address.address))?.address
    ?? candidates[0]?.address
    ?? "127.0.0.1";
}

function parseEnv(source) {
  const values = new Map();
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator > 0) values.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }
  return values;
}

function prepareEnvironment(siteUrl) {
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const values = parseEnv(existing);
  const configuredUrl = values.get("PUBLIC_SITE_URL") ?? "";
  const usesLocalAddress = !configuredUrl || /localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\./.test(configuredUrl);

  if (!values.has("DEMO_MODE")) values.set("DEMO_MODE", "true");
  if (!values.has("TELEGRAM_BOT_TOKEN")) values.set("TELEGRAM_BOT_TOKEN", "");
  if (!values.has("TELEGRAM_CHAT_ID")) values.set("TELEGRAM_CHAT_ID", "");
  if (usesLocalAddress) values.set("PUBLIC_SITE_URL", siteUrl);

  const output = [
    "# Локальные настройки. Файл не попадает в Git.",
    `DEMO_MODE=${values.get("DEMO_MODE")}`,
    `TELEGRAM_BOT_TOKEN=${values.get("TELEGRAM_BOT_TOKEN")}`,
    `TELEGRAM_CHAT_ID=${values.get("TELEGRAM_CHAT_ID")}`,
    `PUBLIC_SITE_URL=${values.get("PUBLIC_SITE_URL")}`,
    "",
  ].join("\n");
  fs.writeFileSync(envPath, output, "utf8");
  return Object.fromEntries(values);
}

async function isSiteRunning(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(700) });
    return response.ok;
  } catch {
    return false;
  }
}

function openBrowser(url) {
  const command = process.platform === "win32" ? "explorer.exe" : "open";
  const child = spawn(command, [url], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();
}

const lanAddress = findLanAddress();
const localUrl = `http://localhost:${port}`;
const phoneUrl = `http://${lanAddress}:${port}`;
const values = prepareEnvironment(phoneUrl);

fs.mkdirSync(path.dirname(qrPath), { recursive: true });
try {
  const qrBuffer = await QRCode.toBuffer(phoneUrl, {
    type: "png",
    errorCorrectionLevel: "H",
    width: 1200,
    margin: 6,
    color: { dark: "#0F5132", light: "#FFFFFF" },
  });
  fs.writeFileSync(qrPath, qrBuffer);
} catch (error) {
  if (!fs.existsSync(qrPath)) throw error;
  console.warn("QR image is currently in use. Keeping the existing QR file.");
}

console.log("\n===============================================");
console.log("  ALPAMYS VOICE - LOCAL MODE");
console.log("===============================================");
console.log(`Computer: ${localUrl}`);
console.log(`Phone:    ${phoneUrl}`);
console.log(`QR page:  ${localUrl}/qr`);
console.log(`Telegram: ${values.DEMO_MODE === "true" ? "DEMO (messages are not sent)" : "ENABLED"}`);
console.log("===============================================");
console.log("Keep this window open. Press Ctrl+C to stop.");
console.log("If the phone cannot connect, run ALLOW_PHONE_ACCESS.bat once.\n");

if (await isSiteRunning(localUrl)) {
  console.log("The site is already running. Opening it in the browser.");
  console.log("This window will remain open and monitor the site.");
  console.log("Press Ctrl+C to close this monitor.\n");
  openBrowser(localUrl);

  const monitor = setInterval(async () => {
    if (!await isSiteRunning(localUrl)) {
      clearInterval(monitor);
      console.error("\nThe running site is no longer responding.");
      process.exitCode = 1;
    }
  }, 2000);

  const stopMonitor = () => {
    clearInterval(monitor);
    process.exit(0);
  };
  process.on("SIGINT", stopMonitor);
  process.on("SIGTERM", stopMonitor);
} else {
  const serverCommand = process.platform === "win32" ? (process.env.ComSpec || "cmd.exe") : "npm";
  const serverArguments = process.platform === "win32"
    ? ["/d", "/s", "/c", `npm run dev -- --hostname 0.0.0.0 --port ${port}`]
    : ["run", "dev", "--", "--hostname", "0.0.0.0", "--port", String(port)];
  const server = spawn(serverCommand, serverArguments, {
    cwd: root,
    env: { ...process.env, ...values, PUBLIC_SITE_URL: phoneUrl },
    stdio: "inherit",
  });

  let browserOpened = false;
  const readyCheck = setInterval(async () => {
    if (!browserOpened && await isSiteRunning(localUrl)) {
      browserOpened = true;
      clearInterval(readyCheck);
      openBrowser(localUrl);
    }
  }, 400);

  server.on("error", (error) => {
    clearInterval(readyCheck);
    console.error(`Could not start the site: ${error.message}`);
    process.exitCode = 1;
  });

  server.on("exit", (code) => {
    clearInterval(readyCheck);
    process.exitCode = code ?? 0;
  });

  process.on("SIGINT", () => server.kill("SIGINT"));
  process.on("SIGTERM", () => server.kill("SIGTERM"));
}
