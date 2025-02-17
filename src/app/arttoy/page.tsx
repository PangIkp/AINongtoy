"use client";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Filter from "../components/Filter";
import ArttoyCard from "../components/ArttoyCard";
import Search from "../components/Search";

export default function Arttoy() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

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
        {/* รูปภาพพื้นหลัง */}
        <Image
          src="/Images/AINongtoy/mainbg.png"
          alt="mainbg"
          fill
          className="object-cover"
          priority
        />

        {/* ข้อความที่อยู่กลางภาพ */}
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
        <div className="w-full">
            <Search/>
        <ArttoyCard/>
        </div>
      </div>

      <Footer />
    </div>
  );
}
