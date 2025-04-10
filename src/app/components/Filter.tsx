import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";

const characterStyles = ["Sci-Fi", "Fantasy", "Cute", "Horror", "Cyberpunk", "Steampunk", "Animal"];
const colors = ["Pastel", "Monochrome", "Dark & Gothic", "Vintage", "Earth tones", "Rainbow color"];

export default function Filter({ onFilterChange }: { onFilterChange: (filters: string[]) => void }) {
  const { t } = useTranslation(); // ใช้ useTranslation เพื่อเรียก t
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  return (
    <div className="w-64 text-white pr-6 pt-6 rounded-lg">
      <h2 className="text-[25px] font-semibold">{t("filters.title")}</h2>
      <hr className="border-gray-600 my-3" />

      {/* Character Style */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t("filters.characterStyle")}</h3>
        <div className="mt-2 space-y-1">
          {characterStyles.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.includes(option)}
                onChange={() => toggleFilter(option)}
                className="w-4 h-5 border border-gray-500 bg-transparent rounded-sm"
              />
              <span>{t(`filters.characterStyles.${option}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t("filters.color")}</h3>
        <div className="mt-2 space-y-1">
          {colors.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.includes(option)}
                onChange={() => toggleFilter(option)}
                className="w-4 h-5 border border-gray-500 bg-transparent rounded-sm"
              />
              <span>{t(`filters.colors.${option}`)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}