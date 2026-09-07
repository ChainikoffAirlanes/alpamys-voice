import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import QRCode from "qrcode";

function loadEnvFile(filename) {
  if (!fs.existsSync(filename)) return;
  for (const rawLine of fs.readFileSync(filename, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(".env"));
loadEnvFile(path.resolve(".env.local"));

const siteUrl = process.env.PUBLIC_SITE_URL?.trim();
if (!siteUrl) {
  console.error("Не задан PUBLIC_SITE_URL. Добавьте его в .env.local, например PUBLIC_SITE_URL=https://voice.alpamys.edu.kz");
  process.exit(1);
}

try {
  new URL(siteUrl);
} catch {
  console.error("PUBLIC_SITE_URL должен быть полным URL, например https://voice.alpamys.edu.kz");
  process.exit(1);
}

const outputPath = path.resolve("public", "qr.png");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
await QRCode.toFile(outputPath, siteUrl, {
  type: "png",
  errorCorrectionLevel: "H",
  width: 1200,
  margin: 6,
  color: { dark: "#0F5132", light: "#FFFFFF" },
});
console.log(`QR-код для ${siteUrl} создан: ${outputPath}`);
