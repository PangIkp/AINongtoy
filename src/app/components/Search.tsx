/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useMainStore } from "@/mainstore";
import { useTranslation } from "react-i18next";
import "../../i18n";

type SearchProps = {
  setPrompt: (value: string) => void; // ระบุว่า setPrompt รับ string
};

export default function Search({ setPrompt }: SearchProps) {
  const [inputValue, setInputValue] = useState("");
  const { setArtToyData } = useMainStore();
  const [arttoyName, setArttoyName] = useState("");

  const { t } = useTranslation(); // ใช้ useTranslation

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setPrompt(inputValue); // ส่งค่า input ไปที่ Arttoy
      setArtToyData({ prompt: inputValue });
    }
    if (arttoyName.trim() !== "") {
      setArtToyData({ name: arttoyName }); // บันทึกค่า arttoyName ลงใน Zustand
    }
  };

  return (
    <div className="w-full bg-[#202133] text-white px-10 py-6 shadow-md grid lg:grid-cols-[auto_auto_10%] sm:grid-cols-1 gap-4">
      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2">
        <span className="font-semibold">{t("Search.arttoyNameLabel")}</span>
        <input
          type="text"
          placeholder={t("Search.arttoyNamePlaceholder")}
          className="p-2 bg-transparent text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          value={arttoyName}
          onChange={(e) => setArttoyName(e.target.value)}
        />
      </div>
      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2">
        <span className="font-semibold">{t("Search.keywordsLabel")}</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t("Search.keywordsPlaceholder")}
          className="p-2 bg-transparent text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
      </div>
      <button
        onClick={handleSearch}
        className="flex justify-center p-2 h-10 text-[15px] transition bg-[#0AACF0] rounded-md"
      >
        {t("Search.searchButton")}
      </button>
    </div>
  );
}