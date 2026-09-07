import { MessageSquareText, Send, Sprout } from "lucide-react";

const steps = [
  { Icon: MessageSquareText, title: "Расскажи", text: "Опиши идею, проблему или предложение." },
  { Icon: Send, title: "Мы прочитаем", text: "Сообщение попадёт команде проекта." },
  { Icon: Sprout, title: "Сделаем лучше", text: "Хорошие идеи можно передать администрации школы." },
];

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="brand-grid scroll-mt-6 bg-[#f7f5ef] px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--green-800)]">Понятно с первого шага</p>
            <h2 id="how-title" className="mt-3 max-w-xl text-3xl font-black tracking-[-0.045em] text-[var(--green-950)] sm:text-5xl">Идея проходит короткий путь</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">Без сложных формальностей: ты пишешь — команда проекта получает сообщение и передаёт сильные предложения дальше.</p>
        </div>
        <div className="mt-9 grid gap-3 sm:mt-12 md:grid-cols-3 md:gap-4">
          {steps.map(({ Icon, title, text }, index) => (
            <article key={title} className={`group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[22px] border p-6 transition duration-300 hover:-translate-y-1 md:min-h-[270px] md:p-7 ${index === 0 ? "border-[#e3d4b0] bg-[#f7ecd4] text-[var(--green-950)] shadow-[0_18px_45px_rgba(135,103,36,.07)]" : index === 1 ? "border-[var(--green-900)] bg-[var(--green-900)] text-white shadow-[0_24px_60px_rgba(8,47,35,.18)]" : "border-[#cedbd4] bg-[#e8efeb] text-[var(--green-950)] shadow-[0_18px_45px_rgba(8,47,35,.06)]"}`}>
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 0 ? "bg-[var(--gold)] text-[var(--green-950)]" : index === 1 ? "bg-[#f4ead3] text-[var(--green-950)]" : "bg-white text-[var(--green-900)] shadow-sm"}`}>
                  <Icon aria-hidden="true" size={21} />
                </div>
                <span className={`text-4xl font-black tracking-[-0.08em] ${index === 1 ? "text-white/16" : "text-[var(--green-900)]/10"}`}>0{index + 1}</span>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3>
                <p className={`mt-2 text-sm leading-6 ${index === 1 ? "text-white/65" : "text-[var(--muted)]"}`}>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
