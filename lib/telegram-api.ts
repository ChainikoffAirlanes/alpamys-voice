type TelegramMethod = "sendMessage" | "answerCallbackQuery" | "editMessageReplyMarkup";

export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const ownerChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !ownerChatId) throw new Error("TELEGRAM_NOT_CONFIGURED");
  return { token, ownerChatId };
}

export async function callTelegram(method: TelegramMethod, body: Record<string, unknown>) {
  const { token } = getTelegramConfig();
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`TELEGRAM_${method.toUpperCase()}_FAILED_${response.status}`);
}

export async function sendTelegramMessage(chatId: string, text: string, extra: Record<string, unknown> = {}) {
  await callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...extra,
  });
}
