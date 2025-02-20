import { useState } from "react";
import { useMainStore } from "@/mainstore";

type SearchProps = {
  setPrompt: (value: string) => void; // ระบุว่า setPrompt รับ string
};

export default function Search({ setPrompt }: SearchProps) {
  const [inputValue, setInputValue] = useState("");
  const { setArtToyData } = useMainStore();
  const [arttoyName, setArttoyName] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setPrompt(inputValue); // ส่งค่า input ไปที่ Arttoy
    }
    if (arttoyName.trim() !== "") {
      setArtToyData(arttoyName); // บันทึกค่า arttoyName ลงใน Zustand
    }
  };

  return (
    <div className="w-full bg-[#202133] text-white px-10 py-6 shadow-md grid lg:grid-cols-[auto_auto_10%] sm:grid-cols-1 gap-4">
      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2">
        <span className="font-semibold">Art toy Name</span>
        <input
          type="text"
          placeholder="Enter art toy name"
          className="p-2 bg-transparent text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          value={arttoyName}
          onChange={(e) => setArttoyName(e.target.value)}
        />
      </div>
      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2">
        <span className="font-semibold">Keywords</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="animal, blue and unique"
          className="p-2 bg-transparent text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
      </div>
      <button
        onClick={handleSearch}
        className="flex justify-center p-2 h-10 text-[15px] transition bg-[#0AACF0] rounded-md"
      >
        Search
      </button>
    </div>
  );
}
