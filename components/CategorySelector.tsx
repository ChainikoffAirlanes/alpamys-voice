import { categories, type CategoryName } from "@/lib/categories";

export function CategorySelector({ value, onChange, error }: { value: CategoryName | ""; onChange: (value: CategoryName) => void; error?: string }) {
  return (
    <fieldset aria-describedby={error ? "category-error" : undefined}>
      <legend className="text-lg font-black tracking-[-0.025em] text-[var(--green-950)] sm:text-xl">Выбери тему</legend>
      <div className="mt-4 grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:grid-cols-3 sm:gap-3">
        {categories.map(({ name, Icon }) => {
          const selected = value === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(name)}
              className={`focus-ring group flex min-h-[104px] min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border px-2.5 py-3 text-center text-sm font-bold leading-5 transition duration-200 sm:min-h-[82px] sm:flex-row sm:justify-start sm:gap-2.5 sm:px-4 sm:text-left ${selected ? "-translate-y-0.5 border-[var(--green-900)] bg-[var(--green-900)] text-white shadow-[0_12px_28px_rgba(8,47,35,.18)]" : "border-[var(--line)] bg-[#faf8f3] text-[#304139] hover:-translate-y-0.5 hover:border-[#9db3a8] hover:bg-white active:translate-y-0"}`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-white/10 text-[var(--gold)]" : "bg-[var(--green-100)] text-[var(--green-800)]"}`}>
                <Icon aria-hidden="true" size={19} />
              </span>
              <span className="min-w-0 max-w-full break-words">{name}</span>
            </button>
          );
        })}
      </div>
      {error && <p id="category-error" role="alert" className="mt-2 text-sm font-semibold text-[#a1382f]">{error}</p>}
    </fieldset>
  );
}
