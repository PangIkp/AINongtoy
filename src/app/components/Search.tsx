"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";

type SearchProps = {
  onSearch: (values: { name: string; keywords: string }) => void;
  isGenerating?: boolean;
};

export default function Search({ onSearch, isGenerating = false }: SearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [arttoyName, setArttoyName] = useState("");

  const { t } = useTranslation();

  const handleSearch = () => {
    const trimmedName = arttoyName.trim();
    const trimmedKeywords = inputValue.trim();

    if (!trimmedKeywords) {
      return;
    }

    onSearch({
      name: trimmedName,
      keywords: trimmedKeywords,
    });
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[linear-gradient(160deg,#101938_0%,#0a1228_100%)] p-4 text-white sm:p-5">
      <div className="mb-3 flex justify-start">
        <span className="rounded-full border border-[#0AACF0]/30 bg-[#0a1d3d] px-2.5 py-1 text-[10px] text-[#9de9ff] sm:text-xs">
          Single Image Mode
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-white/85">{t("Search.arttoyNameLabel")}</label>
          <input
            type="text"
            placeholder={t("Search.arttoyNamePlaceholder")}
            className="w-full rounded-xl border border-white/20 bg-[#0A1028] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#0AACF0] focus:outline-none"
            value={arttoyName}
            onChange={(e) => setArttoyName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-white/85">{t("Search.promptLabel")}</label>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSearch();
              }
            }}
            placeholder={t("Search.keywordsPlaceholder")}
            rows={3}
            className="w-full rounded-xl border border-white/20 bg-[#0A1028] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#0AACF0] focus:outline-none"
          />
          <p className="text-xs text-white/45">Press Ctrl/Cmd + Enter to generate quickly.</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-white/55">{inputValue.trim().length} characters</p>
        <button
          onClick={handleSearch}
          disabled={!inputValue.trim() || isGenerating}
          className="h-11 rounded-xl bg-[#0AACF0] px-5 text-sm font-semibold text-[#08111F] transition hover:bg-[#33c5ff] disabled:cursor-not-allowed disabled:bg-[#327b95] disabled:text-[#d4edf6]"
        >
          {isGenerating ? t("arttoy.loadingImages") : t("Search.searchButton")}
        </button>
      </div>
    </div>
  );
}
