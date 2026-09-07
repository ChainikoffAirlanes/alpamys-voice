export type ModerationResult = { allowed: true } | { allowed: false; reason: string };

export function moderateMessage(message: string): ModerationResult {
  const compact = message.replace(/\s/g, "");
  if (!compact) return { allowed: false, reason: "Сообщение не может быть пустым." };

  const uniqueCharacters = new Set(compact.toLocaleLowerCase("ru-RU"));
  if (compact.length >= 10 && uniqueCharacters.size <= 2) {
    return { allowed: false, reason: "Похоже, в сообщении повторяется один и тот же символ. Расскажи чуть подробнее." };
  }

  return { allowed: true };
}
