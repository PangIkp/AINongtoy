"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Bookmark, Heart, Package2, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import MyProfile from "../components/MyProfile";
import ConfigCard from "../components/ConfigCard";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n"; // Import i18n

export default function Configuration() {
  const { t } = useTranslation(); // Initialize useTranslation
  const aboutRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [configCount, setConfigCount] = useState<number>(0); // เก็บจำนวนข้อมูลจาก ConfigCard
  const configurationStats = [
    {
      label: t("profile.favorite"),
      value: "Saved",
      icon: Heart,
    },
    {
      label: t("profile.artToyConfig"),
      value: configCount,
      icon: Bookmark,
    },
    {
      label: t("profile.order"),
      value: "Ready",
      icon: Package2,
    },
  ];

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            Saved Production Setup
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {t("profile.artToyConfig")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                Organize your saved configurations, reopen strong directions quickly, and keep production-ready options in one place.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {configurationStats.map(({ label, value, icon: Icon }) => (
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

      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <MyProfile
            followMessage={
              configCount > 0
                ? t("profile.configMessage", { count: configCount })
                : t("profile.noConfigMessage")
            }
          />

          <section className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              href="/profile"
            >
              {t("profile.favorite")}
            </Link>
            <Link
              className="rounded-full border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 py-2.5 text-sm font-semibold text-[#89ebff]"
              href="/configuration"
            >
              {t("profile.artToyConfig")}
            </Link>
            <Link
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              href="/order"
            >
              {t("profile.order")}
            </Link>
          </section>

          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
            <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                  Configuration Library
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  {t("profile.artToyConfig")}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#aebddb]">
                  Open saved setups, adjust production parameters, or remove directions that are no longer useful.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                {configCount} saved config{configCount === 1 ? "" : "s"}
              </div>
            </div>

            <div className="px-4 py-6 sm:px-6 sm:py-8">
            <ConfigCard onConfigCountChange={setConfigCount} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
