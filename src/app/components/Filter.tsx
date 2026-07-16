"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { getAllKeywords } from "@/api/keywordAPI";

interface Keyword {
  name: string;
  type: "Character" | "Color"; // ตั้งค่า type ให้ตรงตามที่ต้องการ
}

export default function Filter({ onFilterChange }: { onFilterChange: (filters: string[]) => void }) {
  const { t } = useTranslation(); // ใช้ useTranslation เพื่อเรียก t
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [characterStyles, setCharacterStyles] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const data: Keyword[] = await getAllKeywords(); // ระบุประเภทข้อมูลให้ตรง
        const characterList = data.filter((item) => item.type === "Character").map((item) => item.name);
        const colorList = data.filter((item) => item.type === "Color").map((item) => item.name);
        setCharacterStyles(characterList);
        setColors(colorList);
      } catch (error) {
        console.error("Failed to load keywords:", error);
      }
    };

    fetchKeywords();
  }, []);

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  return (
    <div className="w-full text-white">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold">{t("filters.title")}</h2>
        <button
          type="button"
          onClick={() => setSelectedFilters([])}
          className="rounded-lg border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-white/80 transition hover:bg-white/10"
        >
          Clear
        </button>
      </div>
      <p className="mb-4 rounded-xl border border-[#0AACF0]/25 bg-[#0B1736] px-3 py-2 text-xs text-[#97e6ff]">
        {selectedFilters.length} selected
      </p>

      {/* Character Style */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold">{t("filters.characterStyle")}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {characterStyles.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleFilter(option)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                selectedFilters.includes(option)
                  ? "border-[#0AACF0] bg-[#0a2b55] text-[#9cecff]"
                  : "border-white/20 bg-[#0b1228] text-white/80 hover:bg-[#132042]"
              }`}
            >
              {t(`filters.characterStyles.${option}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="mb-1">
        <h3 className="text-lg font-semibold">{t("filters.color")}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleFilter(option)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                selectedFilters.includes(option)
                  ? "border-[#0AACF0] bg-[#0a2b55] text-[#9cecff]"
                  : "border-white/20 bg-[#0b1228] text-white/80 hover:bg-[#132042]"
              }`}
            >
              {t(`filters.colors.${option}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
