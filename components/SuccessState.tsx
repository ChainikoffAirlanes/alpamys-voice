import { Check, RotateCcw } from "lucide-react";

export function SuccessState({ requestId, onReset }: { requestId?: string; onReset: () => void }) {
  return (
    <div role="status" className="animate-float-in px-4 py-12 text-center sm:px-8 sm:py-16">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--green-900)] text-[var(--gold)] ring-8 ring-[var(--green-100)]">
        <Check aria-hidden="true" size={40} strokeWidth={2.5} />
      </div>
      <h2 className="mt-7 text-3xl font-black tracking-[-0.04em] text-[var(--green-950)]">Спасибо. Твой голос услышан.</h2>
      <p className="mx-auto mt-3 max-w-md leading-6 text-[var(--muted)]">Сообщение отправлено. Спасибо, что помогаешь делать Alpamys лучше.</p>
      {requestId && <p className="mt-4 text-xs font-semibold tracking-wide text-[#839088]">Номер сообщения: #{requestId}</p>}
      <button type="button" onClick={onReset} className="focus-ring mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--green-900)] bg-white px-5 py-3 font-bold text-[var(--green-900)] transition hover:bg-[var(--green-100)] active:scale-[.98]">
        <RotateCcw aria-hidden="true" size={18} /> Отправить ещё одну идею
      </button>
    </div>
  );
}
