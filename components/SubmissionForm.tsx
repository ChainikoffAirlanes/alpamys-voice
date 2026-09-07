"use client";

import { useRef, useState } from "react";
import { AlertCircle, ChevronDown, LoaderCircle, LockKeyhole, Send } from "lucide-react";
import { CategorySelector } from "./CategorySelector";
import { SuccessState } from "./SuccessState";
import type { CategoryName } from "@/lib/categories";

const MAX_LENGTH = 1200;
type SendMode = "anonymous" | "named";

type FormErrors = {
  category?: string;
  message?: string;
  name?: string;
  classGrade?: string;
};

export function SubmissionForm() {
  const [category, setCategory] = useState<CategoryName | "">("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<SendMode>("anonymous");
  const [name, setName] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [classLetter, setClassLetter] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const reset = () => {
    setCategory("");
    setMessage("");
    setMode("anonymous");
    setName("");
    setClassGrade("");
    setClassLetter("");
    setErrors({});
    setServerError("");
    setSuccessId(null);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const validateClient = () => {
    const next: FormErrors = {};
    const cleanMessage = message.trim();
    if (!category) next.category = "Выбери тему сообщения.";
    if (cleanMessage.length < 10) next.message = "Расскажи чуть подробнее — хотя бы 10 символов.";
    if (mode === "named" && name.trim().length < 2) next.name = "Напиши имя — хотя бы 2 символа.";
    if (mode === "named" && !classGrade) next.classGrade = "Выбери класс.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !validateClient()) return;
    setSubmitting(true);
    setServerError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      category,
      message,
      anonymous: mode === "anonymous",
      name: mode === "named" ? name : "",
      classGrade: mode === "named" ? classGrade : "",
      classLetter: mode === "named" ? classLetter : "",
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { success?: boolean; requestId?: string; error?: string; fields?: FormErrors };
      if (!response.ok || !data.success) {
        if (data.fields) setErrors(data.fields);
        setServerError(data.error ?? "Не получилось отправить. Попробуй ещё раз чуть позже.");
        return;
      }
      setSuccessId(data.requestId ?? "");
    } catch {
      setServerError("Похоже, пропало соединение. Проверь интернет и попробуй ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="idea-form" aria-labelledby="form-title" className="relative z-10 -mt-8 scroll-mt-4 px-2.5 pb-16 sm:-mt-20 sm:px-8 sm:pb-24">
      <div className="soft-shadow mx-auto max-w-5xl overflow-hidden rounded-[18px] border border-white/80 bg-white sm:rounded-[30px]">
        <div className="flex min-h-16 items-center justify-between gap-4 border-b border-[var(--line)] bg-[#f7f4ed] px-5 py-3 sm:px-9">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--green-800)] sm:text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold)] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
            </span>
            Канал открыт
          </div>
          <div className="flex items-center gap-2 text-right text-[10px] font-bold text-[var(--muted)] sm:text-xs">
            <LockKeyhole aria-hidden="true" size={14} className="text-[var(--green-800)]" />
            <span className="hidden min-[390px]:inline">Без входа и контактов</span>
            <span className="min-[390px]:hidden">Приватно</span>
          </div>
        </div>
        {successId !== null ? (
          <SuccessState requestId={successId} onReset={reset} />
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="p-5 min-[390px]:p-6 sm:p-9 lg:p-12">
            <div className="mb-9 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--green-800)]">Твой голос важен</p>
                <h2 id="form-title" className="mt-2 text-[2rem] font-black tracking-[-0.05em] text-[var(--green-950)] sm:text-[2.65rem]">Что хочешь изменить?</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Выбери тему и расскажи своими словами. Коротко или подробно — как тебе удобно.</p>
              </div>
              <div className="hidden rounded-2xl border border-[var(--line)] bg-[#f1eee7] px-4 py-3 text-right sm:block">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--green-800)]">Время заполнения</p>
                <p className="mt-1 text-sm font-black text-[var(--green-950)]">≈ 1 минута</p>
              </div>
            </div>

            <CategorySelector value={category} onChange={(value) => { setCategory(value); setErrors((old) => ({ ...old, category: undefined })); }} error={errors.category} />

            <div className="mt-8">
              <label htmlFor="message" className="text-lg font-black tracking-[-0.025em] text-[var(--green-950)] sm:text-xl">Расскажи подробнее</label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => { setMessage(event.target.value); setErrors((old) => ({ ...old, message: undefined })); }}
                maxLength={MAX_LENGTH}
                rows={6}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error message-counter" : "message-counter"}
                placeholder="Например: было бы здорово поставить ещё одну лавочку возле..."
                className="focus-ring mt-3 min-h-[170px] w-full resize-y rounded-2xl border border-[var(--line)] bg-[#faf9f5] px-4 py-4 leading-6 text-[var(--ink)] placeholder:text-[#8b9791] transition hover:border-[#9db3a8] focus:bg-white"
              />
              <div className="mt-1.5 flex items-start justify-between gap-4">
                {errors.message ? <p id="message-error" role="alert" className="text-sm font-semibold text-[#a1382f]">{errors.message}</p> : <span />}
                <span id="message-counter" className={`shrink-0 text-xs tabular-nums ${message.length > MAX_LENGTH * 0.9 ? "font-bold text-[#9c6720]" : "text-[#7b8780]"}`}>{message.length} / {MAX_LENGTH}</span>
              </div>
            </div>

            <fieldset className="mt-8">
              <legend className="text-lg font-black tracking-[-0.025em] text-[var(--green-950)] sm:text-xl">Как отправить?</legend>
              <div className="mt-3 grid grid-cols-2 rounded-2xl bg-[#efede7] p-1.5" role="radiogroup">
                {([['anonymous', 'Анонимно'], ['named', 'С именем']] as const).map(([value, label]) => (
                  <button key={value} type="button" role="radio" aria-checked={mode === value} onClick={() => setMode(value)} className={`focus-ring min-h-11 rounded-lg px-3 py-2 text-xs font-bold transition min-[370px]:text-sm ${mode === value ? "bg-[var(--green-900)] text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            {mode === "named" && (
              <div className="animate-float-in mt-5 grid gap-4 sm:grid-cols-[1.4fr_.75fr_.75fr]">
                <div>
                  <label htmlFor="name" className="text-sm font-bold">Имя</label>
                  <input id="name" value={name} onChange={(event) => { setName(event.target.value); setErrors((old) => ({ ...old, name: undefined })); }} maxLength={60} autoComplete="name" aria-invalid={Boolean(errors.name)} className="focus-ring mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] bg-[#fbfcfb] px-3.5" placeholder="Как тебя зовут?" />
                  {errors.name && <p role="alert" className="mt-1.5 text-xs font-semibold text-[#a1382f]">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="classGrade" className="text-sm font-bold">Класс</label>
                  <select id="classGrade" value={classGrade} onChange={(event) => { setClassGrade(event.target.value); setErrors((old) => ({ ...old, classGrade: undefined })); }} aria-invalid={Boolean(errors.classGrade)} className="focus-ring mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] bg-[#fbfcfb] px-3.5">
                    <option value="">—</option>
                    {Array.from({ length: 11 }, (_, index) => <option key={index + 1} value={String(index + 1)}>{index + 1}</option>)}
                  </select>
                  {errors.classGrade && <p role="alert" className="mt-1.5 text-xs font-semibold text-[#a1382f]">{errors.classGrade}</p>}
                </div>
                <div>
                  <label htmlFor="classLetter" className="text-sm font-bold">Буква</label>
                  <select id="classLetter" value={classLetter} onChange={(event) => setClassLetter(event.target.value)} className="focus-ring mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] bg-[#fbfcfb] px-3.5">
                    <option value="">—</option>
                    {["A", "B", "C", "D", "E", "F", "G", "Другая"].map((letter) => <option key={letter} value={letter}>{letter}</option>)}
                  </select>
                </div>
              </div>
            )}

            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-px w-px opacity-0" />

            <div className="mt-8 rounded-2xl border border-[#e5d2a5] bg-[#f8efd9] p-4">
              <div className="flex gap-3">
                <LockKeyhole aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-[#9a7620]" />
                <p className="text-sm leading-5 text-[#66572f]">Пожалуйста, не указывай чужие личные данные и относись к другим с уважением.</p>
              </div>
              <details className="group mt-2 pl-8 text-sm text-[#66572f]">
                <summary className="focus-ring flex w-fit cursor-pointer list-none items-center gap-1 rounded font-bold text-[#755b1c] hover:text-[#4d3a0e]">
                  Что нельзя отправлять? <ChevronDown aria-hidden="true" size={15} className="transition group-open:rotate-180" />
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5">
                  <li>оскорбления и угрозы;</li><li>чужие персональные данные;</li><li>спам и заведомо ложные сообщения.</li>
                </ul>
              </details>
            </div>

            {serverError && (
              <div role="alert" className="mt-5 flex gap-2.5 rounded-2xl border border-[#ebc8c3] bg-[#fff5f3] p-4 text-sm font-semibold leading-5 text-[#91342c]">
                <AlertCircle aria-hidden="true" size={19} className="shrink-0" /> {serverError}
              </div>
            )}

            <button type="submit" disabled={submitting} className="focus-ring group mt-6 flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--green-900)] px-5 py-4 font-black text-white shadow-[0_15px_35px_rgba(0,80,41,.18)] transition hover:-translate-y-0.5 hover:bg-[var(--green-950)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65">
              {submitting ? <><LoaderCircle aria-hidden="true" size={20} className="animate-spin" /> Отправляем…</> : <><Send aria-hidden="true" size={19} /> Отправить</>}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-[#7b8780]">При анонимной отправке мы не просим имя или контактные данные.</p>
          </form>
        )}
      </div>
    </section>
  );
}
