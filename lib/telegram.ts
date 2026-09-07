import type { Submission } from "./validation";

export function escapeTelegramHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function formatTelegramMessage(submission: Submission, requestId: string, date = new Date()) {
  const author = submission.anonymous ? "Анонимно" : escapeTelegramHtml(submission.name);
  const schoolClass = submission.anonymous ? "—" : `${submission.classGrade}${submission.classLetter ? escapeTelegramHtml(submission.classLetter) : ""}`;
  const time = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Almaty",
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);

  return [
    "🏫 <b>НОВОЕ ОБРАЩЕНИЕ — ALPAMYS</b>",
    "",
    `💡 <b>Категория:</b>\n${escapeTelegramHtml(submission.category)}`,
    "",
    `📝 <b>Сообщение:</b>\n${escapeTelegramHtml(submission.message)}`,
    "",
    `👤 <b>Автор:</b>\n${author}`,
    "",
    `🎓 <b>Класс:</b>\n${schoolClass}`,
    "",
    `🕐 <b>Время:</b>\n${time}`,
    "",
    `<b>ID:</b> #${requestId}`,
  ].join("\n");
}

export async function sendToTelegram(submission: Submission, requestId: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) throw new Error("TELEGRAM_NOT_CONFIGURED");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: formatTelegramMessage(submission, requestId), parse_mode: "HTML", disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`TELEGRAM_REQUEST_FAILED_${response.status}`);
}
