import { NextRequest, NextResponse } from "next/server";
import { createRequestId } from "@/lib/id";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendToTelegram } from "@/lib/telegram";
import { validateSubmission } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Не получилось прочитать сообщение. Обнови страницу и попробуй снова." }, { status: 400 });
  }

  const validation = validateSubmission(body);
  if (!validation.ok) {
    if (validation.honeypot) return NextResponse.json({ success: true, requestId: createRequestId() });
    return NextResponse.json({ success: false, error: validation.error, fields: validation.fields }, { status: 400 });
  }

  const rateLimit = checkRateLimit(getClientIp(request.headers));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Слишком много сообщений подряд. Попробуй немного позже." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const requestId = createRequestId();
  try {
    if (process.env.DEMO_MODE === "true") {
      console.info("[DEMO] Alpamys submission", { requestId, ...validation.data });
    } else {
      await sendToTelegram(validation.data, requestId);
    }
    return NextResponse.json({ success: true, requestId });
  } catch (error) {
    const notConfigured = error instanceof Error && error.message === "TELEGRAM_NOT_CONFIGURED";
    if (notConfigured) {
      const error = process.env.NODE_ENV === "production"
        ? "Сервис отправки пока не настроен. Попробуй ещё раз позже."
        : "Telegram пока не настроен. Добавь TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env.local или включи DEMO_MODE=true.";
      return NextResponse.json({ success: false, error }, { status: 503 });
    }
    console.error("Submission delivery failed", { requestId, error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ success: false, error: "Сейчас не получилось отправить сообщение. Попробуй ещё раз чуть позже." }, { status: 502 });
  }
}
