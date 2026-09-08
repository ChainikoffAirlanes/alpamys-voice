import { NextRequest, NextResponse } from "next/server";
import { approveRecipient, isApprovedRecipient } from "@/lib/telegram-recipients";
import { callTelegram, getTelegramConfig, sendTelegramMessage } from "@/lib/telegram-api";
import { escapeTelegramHtml } from "@/lib/telegram";

export const runtime = "nodejs";

type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type TelegramUpdate = {
  message?: { text?: string; chat: { id: number }; from?: TelegramUser };
  callback_query?: {
    id: string;
    data?: string;
    from: TelegramUser;
    message?: { message_id: number; chat: { id: number } };
  };
};

function isValidWebhook(request: NextRequest) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  return Boolean(expected && request.headers.get("x-telegram-bot-api-secret-token") === expected);
}

function displayName(user: TelegramUser) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || "Не указано";
}

async function handleStart(update: TelegramUpdate) {
  const message = update.message;
  if (!message?.from || !/^\/start(?:@\w+)?(?:\s|$)/i.test(message.text ?? "")) return;

  const { ownerChatId } = getTelegramConfig();
  const requesterChatId = String(message.chat.id);
  if (requesterChatId === ownerChatId) {
    await sendTelegramMessage(requesterChatId, "✅ Вы владелец бота и уже получаете все обращения.");
    return;
  }

  if (await isApprovedRecipient(requesterChatId)) {
    await sendTelegramMessage(requesterChatId, "✅ Доступ уже разрешён. Тебе будут приходить новые обращения.");
    return;
  }

  const name = escapeTelegramHtml(displayName(message.from));
  const username = message.from.username ? `@${escapeTelegramHtml(message.from.username)}` : "не указан";
  await sendTelegramMessage(
    ownerChatId,
    `👤 <b>Новый запрос на доступ</b>\n\nИмя: ${name}\nUsername: ${username}\n\nРазрешить этому человеку получать обращения?`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: "✅ Разрешить", callback_data: `access:approve:${requesterChatId}` },
          { text: "❌ Отклонить", callback_data: `access:reject:${requesterChatId}` },
        ]],
      },
    },
  );
}

async function handleCallback(update: TelegramUpdate) {
  const callback = update.callback_query;
  if (!callback) return;

  const { ownerChatId } = getTelegramConfig();
  const ownerPressedButton = String(callback.from.id) === ownerChatId && String(callback.message?.chat.id) === ownerChatId;
  const match = callback.data?.match(/^access:(approve|reject):(-?\d+)$/);
  if (!ownerPressedButton || !match) {
    await callTelegram("answerCallbackQuery", { callback_query_id: callback.id, text: "Недостаточно прав.", show_alert: true });
    return;
  }

  const [, action, requesterChatId] = match;
  if (action === "approve") {
    await approveRecipient(requesterChatId);
    await sendTelegramMessage(requesterChatId, "✅ Доступ разрешён. Теперь тебе будут приходить новые обращения.");
    await callTelegram("answerCallbackQuery", { callback_query_id: callback.id, text: "Доступ разрешён" });
  } else {
    await sendTelegramMessage(requesterChatId, "❌ Доступ отклонён.");
    await callTelegram("answerCallbackQuery", { callback_query_id: callback.id, text: "Запрос отклонён" });
  }

  if (callback.message) {
    await callTelegram("editMessageReplyMarkup", {
      chat_id: ownerChatId,
      message_id: callback.message.message_id,
      reply_markup: { inline_keyboard: [] },
    });
  }
}

export async function POST(request: NextRequest) {
  if (!isValidWebhook(request)) return new NextResponse("Forbidden", { status: 403 });

  try {
    const update = (await request.json()) as TelegramUpdate;
    await handleStart(update);
    await handleCallback(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
