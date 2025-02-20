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
  const [searchInput, setSearchInput] = useState("");
  const [finalPrompt, setFinalPrompt] = useState("");
  const [loadedImages, setLoadedImages] = useState(0);
  const totalImages = 10;

  // ✅ Update prompt when Search or Filter changes
  useEffect(() => {
    setFinalPrompt(`art toy${searchInput} ${selectedFilters.join(", ")}`.trim());
    setLoadedImages(0); // Reset loading state when new images are fetched
  }, [searchInput, selectedFilters]);

  const imageUrls = Array.from({ length: totalImages }, (_, i) =>
    usePollinationsImage(finalPrompt, {
      width: 300,
      height: 300,
      seed: 2 + i * 2,
      model: "flux",
      nologo: true,
    })
  );

  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  return (
    <div>
      <Navbar
        scrollToSection={(ref) => ref.current?.scrollIntoView({ behavior: "smooth" })}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

      <div className="relative mt-20 w-full h-[256px] flex justify-center items-center">
        {/* Background Image */}
        <Image
          src="/Images/AINongtoy/mainbg.png"
          alt="mainbg"
          fill
          className="object-cover"
          priority
        />

        {/* Center Text */}
        <div className="absolute text-white text-[clamp(30px,5vw,45px)] font-semibold flex flex-col items-center text-center">
          <p>Create Unique Art Toys – Turn your ideas</p>
          <p>ideas into 3D reality with AI</p>
        </div>
      </div>

      <div className="flex justify-between pl-10">
        {/* Filter updates selectedFilters */}
        <Filter onFilterChange={setSelectedFilters} />

        <div className="bg-[#202133] w-full">
          {/* Search updates searchInput */}
          <Search setPrompt={setSearchInput} />

          <div className="p-10">
            {/* Show loading indicator until all images are loaded */}
            {loadedImages < totalImages &&   (
              <p className="text-white text-center">Loading images... ({loadedImages}/{totalImages})</p>
            )}

            {/* Render images with onLoad handler */}
            <ArttoyCard imageUrls={imageUrls} onImageLoad={handleImageLoad} isLoading={loadedImages < totalImages}/>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
