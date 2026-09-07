import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, LockKeyhole, ScanLine } from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "QR-код — Твой голос — Alpamys",
  description: "QR-код для плакатов школьной инициативы.",
};

export default function QrPage() {
  const siteUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:3000";
  const shortUrl = siteUrl.replace(/^https?:\/\//, "");

  return (
    <main className="qr-safe-shell modern-hero relative isolate flex min-h-svh items-center overflow-x-clip px-2.5 py-3 text-white sm:px-8 sm:py-10">
      <div aria-hidden="true" className="hero-orbit hero-orbit-one" />
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[20px] border border-white/12 bg-white/[0.07] shadow-[0_35px_100px_rgba(0,0,0,.28)] backdrop-blur-xl sm:rounded-[28px] md:grid-cols-[.9fr_1.1fr]">
        <div className="flex flex-col justify-between p-5 sm:p-10 md:p-12">
          <Logo inverse />
          <div className="pb-3 pt-9 sm:pb-5 sm:pt-14 md:py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gold)] text-[var(--green-950)]">
              <ScanLine aria-hidden="true" size={23} />
            </div>
            <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--gold)]">Быстрый вход</p>
            <h1 className="mt-3 text-[2rem] font-black leading-[1.04] tracking-[-0.05em] min-[390px]:text-4xl sm:text-5xl">Наведи камеру. Поделись идеей.</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/65 sm:mt-5">QR-код сразу откроет форму. Никакой регистрации — сообщение можно отправить анонимно.</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-white/70">
              <LockKeyhole aria-hidden="true" size={16} className="text-[var(--gold)]" /> Безопасно и конфиденциально
            </div>
          </div>
          <Link href="/" className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-xl text-xs font-bold text-white/65 transition hover:text-white">
            <ArrowLeft aria-hidden="true" size={16} /> Вернуться на сайт
          </Link>
        </div>

        <div className="m-2 flex flex-col items-center justify-center rounded-[16px] bg-[#f5f1e8] p-4 text-center text-[var(--green-950)] sm:m-3 sm:rounded-[22px] sm:p-9 md:min-h-[650px]">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--green-800)]">Твой голос · Alpamys</p>
          <div className="relative mt-5 rounded-[20px] border border-[#ddd6c8] bg-white p-3 shadow-[0_20px_55px_rgba(8,47,35,.13)] sm:mt-6 sm:rounded-[24px] sm:p-5">
            <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-black">01</div>
            <Image src="/qr.png" alt="QR-код сайта «Твой голос — Alpamys»" width={320} height={320} priority className="h-auto w-full max-w-[230px] min-[390px]:max-w-[260px] sm:max-w-[300px]" />
          </div>
          <p className="mt-6 text-xl font-black tracking-[-0.035em]">Отсканируй и говори</p>
          <a href={siteUrl} className="focus-ring mt-2 max-w-full truncate rounded-lg px-2 py-1 text-sm font-bold text-[var(--green-800)] underline decoration-[var(--gold)] decoration-2 underline-offset-4">{shortUrl}</a>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted)]">Подходит для плаката, стенда или школьного экрана.</p>
          <a href="/qr.png" download="alpamys-voice-qr.png" className="focus-ring mt-5 inline-flex min-h-12 w-full max-w-[260px] items-center justify-center gap-2 rounded-xl bg-[var(--green-900)] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[var(--green-950)] sm:mt-6">
            <Download aria-hidden="true" size={18} /> Скачать QR-код
          </a>
        </div>
      </section>
    </main>
  );
}
