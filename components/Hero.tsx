import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, LockKeyhole, MessageCircleHeart, Sparkles } from "lucide-react";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <header className="modern-hero relative isolate overflow-hidden bg-[var(--green-950)] text-white">
      <div aria-hidden="true" className="hero-orbit hero-orbit-one" />
      <div aria-hidden="true" className="hero-orbit hero-orbit-two" />

      <div className="hero-safe-top relative mx-auto max-w-[1240px] px-3 pb-20 sm:px-8 sm:pb-32 sm:pt-6 lg:pb-40">
        <nav aria-label="Главная навигация" className="flex min-h-[72px] items-center justify-between rounded-[18px] border border-white/60 bg-[#f8f5ee]/95 px-4 py-3 shadow-[0_14px_45px_rgba(0,0,0,.14)] backdrop-blur-xl sm:px-5">
          <Logo />
          <div className="hidden items-center gap-7 text-xs font-bold text-[var(--green-800)] lg:flex">
            <a className="focus-ring rounded-lg transition hover:text-[var(--green-950)]" href="#idea-form">Оставить идею</a>
            <a className="focus-ring rounded-lg transition hover:text-[var(--green-950)]" href="#how">Как это работает</a>
          </div>
          <a href="#idea-form" className="focus-ring hidden min-h-11 items-center gap-2 rounded-xl bg-[var(--green-900)] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[var(--green-950)] sm:inline-flex">
            Написать нам <ArrowUpRight aria-hidden="true" size={16} />
          </a>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--green-100)] text-[var(--green-900)] sm:hidden">
            <MessageCircleHeart aria-hidden="true" size={21} />
          </div>
        </nav>

        <div className="grid items-center gap-12 pb-4 pt-10 sm:pt-16 lg:grid-cols-[1.04fr_.96fr] lg:gap-16 lg:pt-20">
          <div className="relative z-10">
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm sm:text-xs">
              <Sparkles aria-hidden="true" size={15} className="text-[var(--gold)]" /> Пространство школьных идей
            </div>
            <h1 className="max-w-3xl text-balance text-[2.35rem] font-black leading-[1.01] tracking-[-0.052em] min-[390px]:text-[2.65rem] sm:text-[4.2rem] sm:leading-[.98] sm:tracking-[-0.065em] lg:text-[4.75rem] xl:text-[5.35rem]">
              Идеи, которые <span className="text-[var(--gold)]">двигают</span> школу вперёд
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/68 sm:text-lg sm:leading-8">
              Расскажи, что можно улучшить в Alpamys. Анонимно, быстро и напрямую команде проекта.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <a href="#idea-form" className="focus-ring group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[var(--gold)] px-6 py-4 text-sm font-black text-[var(--green-950)] shadow-[0_18px_45px_rgba(248,175,42,.2)] transition hover:-translate-y-1 hover:bg-[#ffc34f] sm:text-base">
                Поделиться идеей <ArrowDownRight aria-hidden="true" size={20} className="transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              <div className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] px-5 text-xs font-bold text-white/70 backdrop-blur-sm sm:text-sm">
                <LockKeyhole aria-hidden="true" size={17} className="text-[var(--gold)]" /> Можно без имени
              </div>
            </div>

            <div className="mt-9 flex max-w-xl items-start gap-3 border-t border-white/12 pt-6 sm:mt-10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-[var(--gold)]">
                <Sparkles aria-hidden="true" size={18} />
              </span>
              <p className="text-sm font-medium leading-6 text-white/65 sm:text-base sm:leading-7">
                <strong className="font-extrabold text-white">Здесь нет неважных идей.</strong> Даже небольшое предложение может сделать школьный день лучше для всех.
              </p>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[560px] sm:block lg:mx-0">
            <div className="relative aspect-[4/4.35] overflow-hidden rounded-[30px] border border-[rgba(220,167,47,.38)] bg-[var(--gold-soft)] shadow-[0_35px_90px_rgba(0,0,0,.28),0_0_0_8px_rgba(255,255,255,.025)] sm:aspect-[5/4] lg:aspect-[4/4.45] xl:aspect-[5/4.6]">
              <Image
                src="/og.png"
                alt="Ученики Alpamys обсуждают идеи для школы"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="scale-[1.08] object-cover object-[72%_center]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(0,53,28,.86)_100%)]" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--gold)]">Твой голос</p>
                  <p className="mt-1 max-w-[260px] text-lg font-black leading-tight text-white sm:text-xl">Здесь любая хорошая идея начинается с сообщения</p>
                </div>
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--green-950)] sm:flex">
                  <ArrowUpRight aria-hidden="true" size={21} />
                </div>
              </div>
            </div>

            <div className="absolute -left-3 top-7 max-w-[190px] rounded-2xl border border-white/55 bg-[#faf7ef]/95 p-3 text-[var(--green-950)] shadow-xl backdrop-blur-md sm:-left-8 sm:top-12 sm:max-w-[220px] sm:p-4">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--green-800)]">
                <span className="h-2 w-2 rounded-full bg-[var(--gold)]" /> Новая идея
              </div>
              <p className="mt-2 text-xs font-bold leading-5 sm:text-sm">«Сделать больше мест для тихой работы»</p>
            </div>

            <div className="absolute -bottom-4 right-3 flex items-center gap-3 rounded-2xl border border-white/15 bg-[var(--green-900)] p-3.5 shadow-2xl sm:-bottom-5 sm:right-8 sm:p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)] text-[var(--green-950)]">
                <LockKeyhole aria-hidden="true" size={18} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-white">Анонимно</p>
                <p className="mt-0.5 text-[10px] text-white/55">Без регистрации</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
