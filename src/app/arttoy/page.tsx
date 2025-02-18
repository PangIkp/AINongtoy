"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Filter from "../components/Filter";
import ArttoyCard from "../components/ArttoyCard";
import Search from "../components/Search";
import { usePollinationsImage } from "@pollinations/react";

export default function Arttoy() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("art toy");
  const [finalPrompt, setFinalPrompt] = useState("");

  // ✅ อัปเดต prompt เมื่อ Search หรือ Filter เปลี่ยน
  useEffect(() => {
    setFinalPrompt(`${searchInput} ${selectedFilters.join(", ")}`.trim());
  }, [searchInput, selectedFilters]);

  const imageUrls = Array.from({ length: 10 }, (_, i) =>
    usePollinationsImage(finalPrompt, {
      width: 300,
      height: 300,
      seed: 2 + i * 2,
      model: "flux",
      nologo: true,
    })
  );

  return (
    <div>
      <Navbar
        scrollToSection={(ref) => ref.current?.scrollIntoView({ behavior: "smooth" })}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

<div className="relative mt-20 w-full h-[256px] flex justify-center items-center">
  {/* ภาพพื้นหลัง */}
  <Image
    src="/Images/AINongtoy/mainbg.png"
    alt="mainbg"
    fill
    className="object-cover"
    priority
  />

  {/* ข้อความตรงกลาง */}
  <div className="absolute text-white text-[clamp(30px,5vw,45px)] font-bold flex flex-col items-center text-center">
    <p>Create Unique Art Toys – Turn your ideas</p>
    <p>ideas into 3D reality with AI</p>
  </div>
</div>

      <div className="flex justify-between pl-10">
        {/* Filter อัปเดต selectedFilters */}
        <Filter onFilterChange={setSelectedFilters} />  

        <div className="bg-[#202133] w-full">
          {/* Search อัปเดต searchInput */}
          <Search setPrompt={setSearchInput} />
          
          <div className="p-10">
            {/* แสดงผลภาพที่สร้างจาก finalPrompt */}
            <ArttoyCard imageUrls={imageUrls} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
