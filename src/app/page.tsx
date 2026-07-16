"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Bot,
  Boxes,
  Loader,
  Palette,
  Sparkles,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "../i18n";

const heroGallery = [
  "/Images/AINongtoy/Princess.jpg",
  "/Images/AINongtoy/Rabbit.jpg",
  "/Images/AINongtoy/WhiteMiku.png",
  "/Images/AINongtoy/Cutegirl.jpg",
];

export default function Home() {
  const { t } = useTranslation();
  const aboutRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: Sparkles,
      image: "/Images/AINongtoy/Design.png",
      title: t("services.aiDesignTitle"),
      description: t("services.aiDesignDescription"),
    },
    {
      icon: Boxes,
      image: "/Images/AINongtoy/3D.png",
      title: t("services.modelPreviewTitle"),
      description: t("services.modelPreviewDescription"),
    },
    {
      icon: Palette,
      image: "/Images/AINongtoy/Calculate.png",
      title: t("services.realTimeCalcTitle"),
      description: t("services.realTimeCalcDescription"),
    },
    {
      icon: Bot,
      image: "/Images/AINongtoy/Download.png",
      title: t("services.downloadTitle"),
      description: t("services.downloadDescription"),
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#223164_0%,#090d1f_42%,#050816_100%)] text-white">
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loader className="animate-spin text-[#5ad7ff]" size={52} />
        </div>
      ) : (
        <>
          <main className="overflow-hidden">
            <section className="relative px-4 pb-20 pt-32 sm:px-6 lg:px-10">
              <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-[#b9dbff] backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[#5ad7ff]" />
                    AI-crafted collectibles for creators and brands
                  </div>
                  <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
                    {t("home.welcome")}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-[#b6c2da] sm:text-lg">
                    {t("home.description")}
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="/arttoy"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5ad7ff] px-7 py-4 text-sm font-semibold text-[#06111f] transition hover:bg-[#82e2ff]"
                    >
                      {t("navbar.createArtToys")}
                      <ArrowRight size={18} />
                    </Link>
                    <button
                      onClick={() => scrollToSection(aboutRef)}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {t("navbar.aboutUs")}
                    </button>
                  </div>

                  <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                      <p className="text-3xl font-semibold text-[#8be4ff]">AI</p>
                      <p className="mt-2 text-sm text-[#b6c2da]">Idea-to-design workflow for fast concept exploration.</p>
                    </div>
                    <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                      <p className="text-3xl font-semibold text-[#8be4ff]">3D</p>
                      <p className="mt-2 text-sm text-[#b6c2da]">Preview forms, proportions, and production direction early.</p>
                    </div>
                    <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
                      <p className="text-3xl font-semibold text-[#8be4ff]">360°</p>
                      <p className="mt-2 text-sm text-[#b6c2da]">From prompt to manufacturer-ready collaboration.</p>
                    </div>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-2xl">
                  <div className="absolute left-8 top-10 h-40 w-40 rounded-full bg-[#53d7ff]/20 blur-3xl" />
                  <div className="absolute bottom-10 right-4 h-44 w-44 rounded-full bg-[#7f8dff]/20 blur-3xl" />
                  <div className="relative grid grid-cols-2 gap-4 rounded-[34px] border border-white/10 bg-white/6 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:grid-cols-4">
                    <div className="col-span-2 flex min-h-[180px] flex-col justify-between rounded-[28px] border border-white/10 bg-[#0b1227] p-6 sm:col-span-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-[#78dbff]">NongToy Studio</p>
                          <p className="mt-3 max-w-md text-lg font-medium leading-8 text-[#d7e5ff]">
                            AI-assisted design flow for toy concepts that need to move from idea to production faster.
                          </p>
                        </div>
                        <img
                          src="/Images/AINongtoy/BotLogo.png"
                          alt="NongToy bot"
                          className="h-14 w-14 rounded-2xl border border-white/10 bg-white/10 p-2"
                        />
                      </div>
                    </div>

                    {heroGallery.map((src, index) => (
                      <div
                        key={src}
                        className="overflow-hidden rounded-[24px] border border-white/10 bg-[#08101f] sm:col-span-2"
                      >
                        <img
                          src={src}
                          alt={`Art toy showcase ${index + 1}`}
                          className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section ref={aboutRef} className="px-4 py-20 sm:px-6 lg:px-10">
              <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[32px] border border-white/10 bg-[#08101f]/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#5ad7ff]">
                    {t("aboutUs.title")}
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">
                    {t("aboutUs.whatIsNongToy")}
                  </h2>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-[#b6c2da]">
                    {t("aboutUs.description")}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="text-sm font-semibold text-[#8be4ff]">Prompt to concept</p>
                      <p className="mt-2 text-sm leading-7 text-[#b6c2da]">
                        Generate collectible directions quickly without slowing creative iteration.
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="text-sm font-semibold text-[#8be4ff]">Ready for production</p>
                      <p className="mt-2 text-sm leading-7 text-[#b6c2da]">
                        Align design intent with fabrication constraints from the start.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4">
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#5ad7ff]/18 to-transparent" />
                  <img
                    src="/Images/AINongtoy/Aboutus.png"
                    alt="About NongToy"
                    className="h-full min-h-[340px] w-full rounded-[26px] object-cover"
                  />
                </div>
              </div>
            </section>

            <section className="px-4 py-20 sm:px-6 lg:px-10">
              <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#5ad7ff]">
                    {t("services.title")}
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">
                    {t("services.weOffer")}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-[#b6c2da]">
                    {t("services.description")}
                  </p>
                </div>

                <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
                  {services.map(({ icon: Icon, image, title, description }) => (
                    <div
                      key={title}
                      className="group rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#5ad7ff]/40 hover:bg-white/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-2xl border border-white/10 bg-[#091121] p-3">
                          <Icon className="text-[#5ad7ff]" size={22} />
                        </div>
                        <img src={image} alt={title} className="h-12 w-12 object-contain" />
                      </div>
                      <h3 className="mt-8 text-xl font-semibold text-white">{title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#b6c2da]">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section ref={partnerRef} className="px-4 py-20 sm:px-6 lg:px-10">
              <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(13,52,87,0.92))] p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#5ad7ff]">
                    {t("partner.title")}
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">
                    {t("partner.companyName")}
                  </h2>
                  <div className="mt-6 space-y-4 text-base leading-8 text-[#d7e5ff]">
                    <p>{t("partner.description1")}</p>
                    <p>{t("partner.description2")}</p>
                    <p>{t("partner.description3")}</p>
                  </div>
                  <a
                    href="https://www.ktpthailand.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#8be4ff] transition hover:text-white"
                  >
                    {t("partner.readMore")}
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute h-56 w-56 rounded-full bg-[#5ad7ff]/15 blur-3xl" />
                  <img
                    src="/Images/AINongtoy/KTP.png"
                    alt={t("partner.imageAlt")}
                    className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)]"
                  />
                </div>
              </div>
            </section>

          </main>

          <div ref={contactRef}>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}
