import Image from "next/image";

export function Logo({ centered = false, inverse = false }: { centered?: boolean; inverse?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
      <div className={inverse ? "rounded-xl bg-[#f8f5ee] px-2.5 py-2" : ""}>
        <Image src="/alpamys-logo.webp" alt="Alpamys School" width={200} height={51} priority className="h-auto w-[112px] min-[390px]:w-[126px] sm:w-[150px]" />
      </div>
      <div className={`hidden border-l pl-3 leading-none min-[390px]:block ${inverse ? "border-white/18" : "border-[var(--line)]"}`}>
        <div className={`text-[9px] font-bold uppercase tracking-[0.18em] ${inverse ? "text-white/48" : "text-[var(--green-800)]"}`}>Инициатива</div>
        <div className={`mt-1.5 text-sm font-extrabold tracking-[-0.02em] ${inverse ? "text-white" : "text-[var(--green-950)]"}`}>Твой голос</div>
      </div>
    </div>
  );
}
