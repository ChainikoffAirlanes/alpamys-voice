import { ExternalLink } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[linear-gradient(110deg,#06291f,#0b4937_62%,#082f25)] px-5 py-10 sm:px-8 sm:py-14">
      <div aria-hidden="true" className="absolute -right-20 -top-32 h-72 w-72 rounded-full border border-white/5" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo inverse />
        <div className="text-sm leading-6 text-white/65 sm:text-right">
          <p>Сделано для сообщества Alpamys School</p>
          <p className="text-xs">Проект школьной инициативы</p>
          <a className="focus-ring mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-xs font-bold text-[var(--gold)] hover:text-white" href="https://www.alpamys.edu.kz" target="_blank" rel="noreferrer">
            Официальный сайт школы <ExternalLink aria-hidden="true" size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
