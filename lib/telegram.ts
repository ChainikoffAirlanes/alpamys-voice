import type { Submission } from "./validation";
import { getTelegramConfig, sendTelegramMessage } from "./telegram-api";
import { getApprovedRecipientIds } from "./telegram-recipients";

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
  const { ownerChatId } = getTelegramConfig();
  const message = formatTelegramMessage(submission, requestId);
  let recipientIds: string[] = [];

  try {
    recipientIds = (await getApprovedRecipientIds()).filter((chatId) => chatId !== ownerChatId);
  } catch (error) {
    console.error("Telegram recipient list unavailable", { error: error instanceof Error ? error.message : "unknown" });
  }

  // Владелец остаётся главным получателем: его ошибка должна быть видна форме,
  // а недоступность одного дополнительного получателя не ломает отправку остальным.
  await sendTelegramMessage(ownerChatId, message);

  const results = await Promise.allSettled(recipientIds.map((chatId) => sendTelegramMessage(chatId, message)));
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error("Telegram recipient delivery failed", { chatId: recipientIds[index], error: String(result.reason) });
    }
  });
}
