import {
  BookOpen,
  Heart,
  Lightbulb,
  Medal,
  MessageCircle,
  PartyPopper,
  Salad,
  Trees,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const categoryNames = [
  "Идея",
  "Что-то нужно исправить",
  "Школьная среда",
  "Учёба",
  "Мероприятия",
  "Столовая",
  "Спорт",
  "Благополучие",
  "Другое",
] as const;

export type CategoryName = (typeof categoryNames)[number];

export const categories: Array<{ name: CategoryName; Icon: LucideIcon }> = [
  { name: "Идея", Icon: Lightbulb },
  { name: "Что-то нужно исправить", Icon: Wrench },
  { name: "Школьная среда", Icon: Trees },
  { name: "Учёба", Icon: BookOpen },
  { name: "Мероприятия", Icon: PartyPopper },
  { name: "Столовая", Icon: Salad },
  { name: "Спорт", Icon: Medal },
  { name: "Благополучие", Icon: Heart },
  { name: "Другое", Icon: MessageCircle },
];
