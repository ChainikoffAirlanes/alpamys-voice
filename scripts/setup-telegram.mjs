import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { spawn } from "node:child_process";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });

function readEnv() {
  const values = new Map();
  if (!fs.existsSync(envPath)) return values;
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator > 0) values.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }
  return values;
}

function saveEnv(values) {
  const output = [
    "# Локальные настройки. Файл не попадает в Git.",
    `DEMO_MODE=${values.get("DEMO_MODE") ?? "false"}`,
    `TELEGRAM_BOT_TOKEN=${values.get("TELEGRAM_BOT_TOKEN") ?? ""}`,
    `TELEGRAM_CHAT_ID=${values.get("TELEGRAM_CHAT_ID") ?? ""}`,
    `PUBLIC_SITE_URL=${values.get("PUBLIC_SITE_URL") ?? "http://localhost:3000"}`,
    "",
  ].join("\n");
  fs.writeFileSync(envPath, output, "utf8");
}

async function telegramRequest(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(12_000),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.description || `Telegram API error ${response.status}`);
  return data.result;
}

function openUrl(url) {
  const command = process.platform === "win32" ? "explorer.exe" : "open";
  const child = spawn(command, [url], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();
}

console.log("\nALPAMYS VOICE — НАСТРОЙКА TELEGRAM\n");
console.log("1. Откройте @BotFather и отправьте /newbot.");
console.log("2. Укажите имя и уникальный username, заканчивающийся на bot.");
console.log("3. Скопируйте токен, который выдаст BotFather.\n");

const values = readEnv();
const savedToken = values.get("TELEGRAM_BOT_TOKEN") ?? "";
let token = savedToken;
if (!token) token = (await terminal.question("Вставьте токен бота: ")).trim();
if (!/^\d+:[A-Za-z0-9_-]{20,}$/.test(token)) {
  console.error("\nThe token format does not look correct. Nothing was saved.");
  terminal.close();
  process.exit(1);
}

let bot;
try {
  bot = await telegramRequest(token, "getMe");
} catch (error) {
  console.error(`\nTelegram rejected the token: ${error instanceof Error ? error.message : "unknown error"}`);
  terminal.close();
  process.exit(1);
}

console.log(`\nПодключено к @${bot.username}.`);
openUrl(`https://t.me/${bot.username}`);
console.log("В открывшемся чате нажмите «Запустить» и отправьте любое сообщение.");
await terminal.question("Затем вернитесь сюда и нажмите Enter...");

let updates;
try {
  updates = await telegramRequest(token, "getUpdates");
} catch (error) {
  console.error(`\nCould not read bot messages: ${error instanceof Error ? error.message : "unknown error"}`);
  terminal.close();
  process.exit(1);
}

const chats = new Map();
for (const update of updates) {
  const message = update.message ?? update.channel_post ?? update.edited_message;
  const chat = message?.chat;
  if (!chat) continue;
  const label = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(" ") || chat.username || String(chat.id);
  chats.set(String(chat.id), { id: String(chat.id), label, type: chat.type });
}

if (!chats.size) {
  console.error("\nNo messages found. Send a message to the bot and run SETUP_TELEGRAM.bat again.");
  terminal.close();
  process.exit(1);
}

const options = [...chats.values()];
let selected = options[options.length - 1];
if (options.length > 1) {
  console.log("\nAvailable chats:");
  options.forEach((chat, index) => console.log(`${index + 1}. ${chat.label} (${chat.type}, ID ${chat.id})`));
  const answer = Number(await terminal.question(`Choose 1-${options.length}: `));
  if (!Number.isInteger(answer) || !options[answer - 1]) {
    console.error("Invalid selection. Nothing was saved.");
    terminal.close();
    process.exit(1);
  }
  selected = options[answer - 1];
}

values.set("DEMO_MODE", "false");
values.set("TELEGRAM_BOT_TOKEN", token);
values.set("TELEGRAM_CHAT_ID", selected.id);
saveEnv(values);

try {
  await telegramRequest(token, "sendMessage", {
    chat_id: selected.id,
    text: "✅ Бот подключён к сервису «Твой голос — Alpamys».",
  });
  console.log(`\nSuccess. Test message sent to: ${selected.label}.`);
} catch (error) {
  console.warn(`\nSettings were saved, but the test message failed: ${error instanceof Error ? error.message : "unknown error"}`);
}

console.log("Telegram is enabled in .env.local.");
console.log("Close the running site with Ctrl+C, then open START.bat again.");
terminal.close();
