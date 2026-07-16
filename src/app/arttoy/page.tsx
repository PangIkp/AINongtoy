"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Filter from "../components/Filter";
import ArttoyCard from "../components/ArttoyCard";
import Search from "../components/Search";
import { useMainStore } from "@/mainstore";
import { useTranslation } from "react-i18next";
import "../../i18n"; 

export default function Arttoy() {
  const { t } = useTranslation();
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState<"square" | "portrait" | "landscape">("square");
  const [modelType, setModelType] = useState<"flux" | "turbo">("flux");
  const [enhanceDetails, setEnhanceDetails] = useState(false);
  const [seedMode, setSeedMode] = useState<"random" | "locked">("random");
  const [lockedSeed, setLockedSeed] = useState("777");
  const [finalPrompt, setFinalPrompt] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [generationSeed, setGenerationSeed] = useState(0);
  const [showImageReadyToast, setShowImageReadyToast] = useState(false);
  const { setArtToyData } = useMainStore();

  const handleGenerate = ({ name, keywords }: { name: string; keywords: string }) => {
    const promptParts = [keywords.trim(), selectedFilters.join(", ").trim()].filter(Boolean);
    const prompt = promptParts.length > 0 ? `${promptParts.join(", ")} art toy` : "";

    if (!prompt) {
      return;
    }

    setFinalPrompt(prompt);
    setArtToyData({
      name: name || "Unnamed Art Toy",
      prompt,
    });
    setIsImageLoaded(false);
    setHasImageError(false);
    setShowImageReadyToast(false);
    setGenerationSeed((prev) => prev + 1);
  };

  const handleRetry = () => {
    if (!finalPrompt) return;
    setIsImageLoaded(false);
    setHasImageError(false);
    setShowImageReadyToast(false);
    setGenerationSeed((prev) => prev + 1);
  };

  const imageUrl = useMemo(() => {
    if (!finalPrompt) return "";

    const ratioDimensions = {
      square: { width: "720", height: "720" },
      portrait: { width: "768", height: "1024" },
      landscape: { width: "1024", height: "768" },
    } as const;

    const selectedDimensions = ratioDimensions[aspectRatio];
    const parsedLockedSeed = Number.parseInt(lockedSeed || "0", 10);
    const safeLockedSeed = Number.isNaN(parsedLockedSeed) ? 0 : parsedLockedSeed;
    const computedSeed =
      seedMode === "locked" ? safeLockedSeed : Math.max(1, generationSeed + 97);

    const params = new URLSearchParams({
      width: selectedDimensions.width,
      height: selectedDimensions.height,
      seed: String(computedSeed),
      model: modelType,
      nologo: "true",
      enhance: String(enhanceDetails),
    });

    return `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?${params.toString()}`;
  }, [aspectRatio, enhanceDetails, finalPrompt, generationSeed, lockedSeed, modelType, seedMode]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setShowImageReadyToast(true);
  };

  const handleImageError = () => {
    setIsImageLoaded(false);
    setHasImageError(true);
  };

  const isGenerating = Boolean(finalPrompt) && !isImageLoaded && !hasImageError;

  useEffect(() => {
    if (!showImageReadyToast) return;

    const hideTimer = window.setTimeout(() => {
      setShowImageReadyToast(false);
    }, 2800);

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("NongToy AI", {
          body: t("arttoy.imageReadyHint"),
        });
      }
    }

    return () => window.clearTimeout(hideTimer);
  }, [showImageReadyToast, t]);

  return (
    <div className="min-h-screen bg-[#070D1F] text-white">
      <Navbar
        scrollToSection={(ref) => ref.current?.scrollIntoView({ behavior: "smooth" })}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

      <div className="relative mt-20 flex h-[118px] w-full items-center justify-center overflow-hidden border-b border-white/10 sm:h-[126px]">
        <Image
          src="/Images/AINongtoy/mainbg.png"
          alt="mainbg"
          fill
          className="object-cover object-center brightness-[0.56] saturate-[0.82]"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,11,27,0.78),rgba(6,11,27,0.62),rgba(6,11,27,0.78))]" />

        <div className="absolute flex w-[min(92%,980px)] flex-col rounded-2xl border border-white/10 bg-[#0a1228]/52 px-4 py-3 text-white backdrop-blur-[2px] sm:px-5 sm:py-3.5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#85e8ff] sm:text-[11px]">AI Studio</p>
          <h1 className="mt-1 text-[15px] font-semibold leading-snug sm:text-[20px]">
            {t("arttoy.headerLine1")}
            <span className="ml-1 text-[#9cf3ff]">{t("arttoy.headerLine2")}</span>
          </h1>
          <p className="mt-1 hidden text-[11px] text-white/72 sm:block sm:text-xs">
            {t("arttoy.singleModeHint")}
          </p>
        </div>
      </div>

      <div className="relative mx-auto grid h-[calc(100vh-12.5rem)] w-full max-w-[1360px] gap-6 overflow-hidden px-4 py-4 sm:h-[calc(100vh-13rem)] sm:px-6 sm:py-5 lg:grid-cols-[310px_minmax(0,1fr)] lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(15,34,70,0.3),rgba(9,20,44,0.15),rgba(15,34,70,0.3))]" />

        {showImageReadyToast && (
          <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-xl border border-[#0AACF0]/40 bg-[#09162f]/95 px-4 py-2 text-sm text-[#b8ecff] shadow-[0_10px_30px_rgba(4,11,30,0.45)]">
            {t("arttoy.imageReadyHint")}
          </div>
        )}

        <aside className="min-h-0 overflow-hidden rounded-3xl border border-white/10 bg-[#101A37]/85 p-5 shadow-[0_24px_60px_rgba(2,8,24,0.5)] backdrop-blur">
          <div className="h-full overflow-y-auto pr-1">
            <Filter onFilterChange={setSelectedFilters} />
          </div>
        </aside>

        <section className="min-h-0 overflow-hidden rounded-3xl border border-white/10 bg-[#141f40]/85 p-4 shadow-[0_28px_80px_rgba(3,9,26,0.55)] sm:p-6">
          <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
            <div className="order-2 min-h-0 space-y-4 overflow-y-auto pr-1 xl:order-1">
              <Search onSearch={handleGenerate} isGenerating={isGenerating} />

              <div className="grid gap-4 rounded-2xl border border-white/10 bg-[#0D1736] p-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-white/70">{t("arttoy.behavior.model", "Model")}</span>
                  <div className="relative">
                    <select
                      value={modelType}
                      onChange={(e) => setModelType(e.target.value as "flux" | "turbo")}
                      className="w-full appearance-none rounded-xl border border-white/15 bg-[#0A1129] px-3 py-2 pr-10 text-white outline-none transition focus:border-[#0AACF0]"
                    >
                      <option value="flux">Flux</option>
                      <option value="turbo">Turbo</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-white/70">{t("arttoy.behavior.ratio", "Ratio")}</span>
                  <div className="relative">
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as "square" | "portrait" | "landscape")}
                      className="w-full appearance-none rounded-xl border border-white/15 bg-[#0A1129] px-3 py-2 pr-10 text-white outline-none transition focus:border-[#0AACF0]"
                    >
                      <option value="square">1:1</option>
                      <option value="portrait">3:4</option>
                      <option value="landscape">4:3</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-white/70">{t("arttoy.behavior.seed", "Seed")}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSeedMode("random")}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        seedMode === "random" ? "bg-[#0AACF0] text-[#071023]" : "bg-[#0A1129] text-white/80"
                      }`}
                    >
                      Random
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeedMode("locked")}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        seedMode === "locked" ? "bg-[#0AACF0] text-[#071023]" : "bg-[#0A1129] text-white/80"
                      }`}
                    >
                      Locked
                    </button>
                  </div>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-white/70">{t("arttoy.behavior.enhance", "Enhance")}</span>
                  <div className="flex items-center justify-between rounded-xl border border-white/15 bg-[#0A1129] px-3 py-2">
                    <span className="text-xs text-white/80">{enhanceDetails ? "On" : "Off"}</span>
                    <button
                      type="button"
                      onClick={() => setEnhanceDetails((prev) => !prev)}
                      className={`h-6 w-11 rounded-full p-1 transition ${enhanceDetails ? "bg-[#0AACF0]" : "bg-white/20"}`}
                    >
                      <span
                        className={`block h-4 w-4 rounded-full bg-white transition ${enhanceDetails ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                </label>

                {seedMode === "locked" && (
                  <label className="col-span-full flex flex-col gap-2 text-sm">
                    <span className="text-white/70">Seed Value</span>
                    <input
                      type="number"
                      value={lockedSeed}
                      onChange={(e) => setLockedSeed(e.target.value)}
                      className="rounded-xl border border-white/15 bg-[#0A1129] px-3 py-2 text-white outline-none transition focus:border-[#0AACF0]"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* RIGHT PANEL — IMAGE STAGE */}
            <div className="order-1 flex min-h-0 flex-col xl:order-2">
              <div className="flex h-full flex-1 flex-col rounded-2xl bg-transparent p-0">

            {hasImageError && (
              <div className="mb-6 rounded-2xl border border-[#3A3D64] bg-[#17192D] p-4 text-center text-white">
                <p className="text-sm text-white/80">{t("arttoy.rateLimitMessage")}</p>
                <button
                  onClick={handleRetry}
                  className="mt-3 rounded-md bg-[#0AACF0] px-4 py-2 text-sm font-medium text-[#08111F] transition hover:bg-[#33c5ff]"
                >
                  {t("arttoy.retry")}
                </button>
              </div>
            )}

            {/* Empty / Loading state — dashed border frame */}
            {(!finalPrompt || isGenerating) && (
              <div className={`flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/25 px-6 text-center ${isGenerating ? "progress-border-frame" : ""}`}>
                <div className={isGenerating ? "progress-border-inner flex w-full items-center justify-center py-8" : ""}>
                  <p className="text-sm text-white/70 sm:text-base">
                    {isGenerating ? t("arttoy.loadingImages") : t("arttoy.emptyState")}
                  </p>
                </div>
              </div>
            )}

            {/* Generated image — always in DOM when prompt set so <img> triggers fetch; hidden while loading */}
            {finalPrompt && (
              <div className={`flex h-full min-h-0 flex-1 ${isGenerating ? "hidden" : ""}`}>
                <div className="h-full w-full [&>div]:h-full [&_img]:!h-full [&_img]:w-full [&_img]:object-contain">
                  <ArttoyCard
                    imageUrls={imageUrl ? [imageUrl] : []}
                    onImageLoad={handleImageLoad}
                    onImageError={handleImageError}
                    variant="single"
                  />
                </div>
              </div>
            )}
              </div>
            </div>
            {/* ==================== END RIGHT PANEL ==================== */}
          </div>
        </section>
      </div>
    </div>
  );
}
