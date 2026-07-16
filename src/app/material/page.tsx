/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { Lightbulb, Package2, Settings2, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Config from "../components/Config";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Material() {
  const { t } = useTranslation();
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const materialStats = [
    {
      label: t("artToy.material"),
      value: "4",
      icon: Package2,
    },
    {
      label: t("artToy.assembly"),
      value: "3",
      icon: Settings2,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(28,44,92,0.82),rgba(7,13,31,1)_42%,rgba(5,8,22,1)_100%)] text-white">
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

      <section className="border-b border-white/10 pt-24">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
            <Sparkles size={14} />
            Build Configuration
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {t("material.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                {t("material.subtitle")}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {materialStats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                      <Icon size={18} className="text-[#76e3ff]" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{value}</p>
                      <p className="text-xs text-white/60">{label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <section className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              href="/arttoy"
            >
              Back To Art Toy
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 py-2.5 text-sm font-semibold text-[#89ebff] transition hover:bg-[#11305a]"
              onClick={() => setIsOpen(true)}
            >
              <Lightbulb size={16} />
              {t("material.tipsButton")}
            </button>
          </section>

          <Suspense
            fallback={
              <div className="flex min-h-[420px] items-center justify-center rounded-[32px] border border-white/10 bg-white/5">
                {t("material.loading")}
              </div>
            }
          >
            <Config />
          </Suspense>
        </div>
      </main>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040814]/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.98),rgba(11,18,40,0.98))] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                  Production Tips
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">{t("material.tipsTitle")}</h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="space-y-3 px-6 py-6 sm:px-8 sm:py-8">
              {[t("material.tip1"), t("material.tip2"), t("material.tip3")].map((tip) => (
                <div
                  key={tip}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/80"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
