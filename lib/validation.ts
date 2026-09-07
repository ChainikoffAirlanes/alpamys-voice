import { categoryNames, type CategoryName } from "./categories";
import { moderateMessage } from "./moderation";

export type Submission = {
  category: CategoryName;
  message: string;
  anonymous: boolean;
  name: string;
  classGrade: string;
  classLetter: string;
};

export type ValidationResult =
  | { ok: true; data: Submission }
  | { ok: false; error: string; fields?: Record<string, string>; honeypot?: boolean };

function asTrimmedString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength + 1) : "";
}

export function validateSubmission(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Проверь данные и попробуй ещё раз." };
  }
  const body = input as Record<string, unknown>;
  if (asTrimmedString(body.website, 200)) return { ok: false, error: "", honeypot: true };

  const category = asTrimmedString(body.category, 80);
  const message = asTrimmedString(body.message, 1200);
  const anonymous = body.anonymous !== false;
  const name = anonymous ? "" : asTrimmedString(body.name, 60);
  const classGrade = anonymous ? "" : asTrimmedString(body.classGrade, 2);
  const classLetter = anonymous ? "" : asTrimmedString(body.classLetter, 12);
  const fields: Record<string, string> = {};

  if (!categoryNames.includes(category as CategoryName)) fields.category = "Выбери тему сообщения.";
  if (message.length < 10) fields.message = "Расскажи чуть подробнее — хотя бы 10 символов.";
  else if (message.length > 1200) fields.message = "Сообщение должно быть короче 1200 символов.";
  if (!anonymous && name.length < 2) fields.name = "Напиши имя — хотя бы 2 символа.";
  if (!anonymous && !/^(?:[1-9]|10|11)$/.test(classGrade)) fields.classGrade = "Выбери класс от 1 до 11.";
  if (classLetter && !/^(?:[A-G]|Другая)$/.test(classLetter)) fields.classLetter = "Выбери букву из списка.";
  if (Object.keys(fields).length) return { ok: false, error: "Проверь отмеченные поля.", fields };

  const moderation = moderateMessage(message);
  if (!moderation.allowed) return { ok: false, error: moderation.reason };

  return {
    ok: true,
    data: { category: category as CategoryName, message, anonymous, name, classGrade, classLetter },
  };
}
