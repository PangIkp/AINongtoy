"use client";
import { useRef, useState } from "react";
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

  const [prompt, setPrompt] = useState("cat anime");

  // Generate 20 images dynamically
  const imageUrls = Array.from({ length: 20 }, (_, i) =>
    usePollinationsImage(prompt, {
      width: 300,
      height: 300,
      seed: 2 + i * 2, // ใช้ seed ที่แตกต่างกัน
      model: "flux",
      nologo: true,
    })
  );

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

      <div className="relative mt-20 w-full h-[256px] flex justify-center items-center">
        <Image
          src="/Images/AINongtoy/mainbg.png"
          alt="mainbg"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white font-semibold text-center h-full">
          <h1 className="text-[clamp(30px,5vw,45px)] drop-shadow-lg">
            Create Unique Art Toys - Turn your
          </h1>
          <h1 className="text-[clamp(30px,5vw,45px)] drop-shadow-lg">
            ideas into 3D reality with AI
          </h1>
        </div>
      </div>

      <div className="flex justify-between pl-10">
        <Filter />
        <div className="bg-[#51536D] w-full">
          <Search />
          <div className="p-10">
            {/* ส่ง imageUrls ไปที่ ArttoyCard */}
            <ArttoyCard imageUrls={imageUrls} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
