"use client";
import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArtToyCard from "../components/ArttoyCard";
import Pagination from "../components/Pagination";
import { useMainStore } from "@/mainstore";

export default function Profile() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const { favorites } = useMainStore();
  const favoriteImageUrls = Object.keys(favorites).filter(
    (key) => favorites[key]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalImages = favoriteImageUrls.length;
  const totalPages = Math.ceil(totalImages / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // คำนวณ index ของภาพที่จะแสดงในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = favoriteImageUrls.slice(startIndex, endIndex);

  return (
    <div>
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />
      <div className="w-full place-content-center place-items-center h-[100px] mt-[5rem] bg-black">
        <h1 className="text-4xl font-semibold mb-3">My Profile</h1>
      </div>
      <div className="w-full place-items-center">
        <div className="w-full max-w-[1024px] py-20 flex flex-col gap-12">
          <section className="flex justify-between">
            <div className="flex px-4 gap-5">
              <img
                className="w-[20%] object-contain"
                src="/Images/AINongtoy/Profile.png"
                alt="profile"
              />
              <div className="w-[80%] place-content-center">
                <h1 className="text-xl font-semibold">Cameron Williamson</h1>
                <p className="text-xs text-[#BBBBBB]">
                  You have 200 models to follow
                </p>
              </div>
            </div>

            <div className="px-4 place-aitems-end place-content-center">
              <button className="bg-background border border-white font-normal text-xs py-1 px-3">
                Edit Profile
              </button>
            </div>
          </section>

          <section className="flex gap-10 px-4 font-semibold">
            <a className="text-[#0AACF0] underline" href="#">
              Favorite
            </a>
            {/* <a className="hover:text-[#0AACF0] transition-all" href="#">
              Art Toy Config
            </a> */}
            <a className="hover:text-[#0AACF0] transition-all" href="#">
              Order
            </a>
          </section>

          <ArtToyCard imageUrls={currentImages} isLoading={false} />

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
