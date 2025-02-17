"use client";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ImageSlider from "./components/ImageSlider";
import Contact from "./components/Contact";
import Partner from "./components/Partner";
import About from "./components/About";
import Service from "./components/Service";
import Filter from "./components/Filter";

export default function Home() {
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
     <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />

      <div className="relative w-full h-[600px] flex justify-center items-center">
        <Image src="/Images/AINongtoy/mainbg.png" alt="mainbg" fill className="object-cover" priority />
        <div className="absolute top-[350px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-center w-[1050px] max-w-[90%]">
          <h1 className="text-[clamp(30px,5vw,45px)]">Create Unique Art Toys</h1>
          <p className="text-[16px] mb-4 text-[#9F9F9F] font-medium">Design, customize, and create Art Toys easily with AI.</p>
          <ImageSlider />
        </div>
      </div>

      <div className="container mx-auto space-y-10">
        <div ref={aboutRef}><About /></div>
        <div ref={partnerRef}><Partner /></div>
      </div>

      <div ref={contactRef}><Contact /></div>
      <Footer />
    </div>
  );
}
