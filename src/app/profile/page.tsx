"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArtToyCard from "../components/ArttoyCard";
import Pagination from "../components/Pagination";
import { useMainStore } from "@/mainstore";
import MyProfile from "../components/MyProfile";
import { getAllFavorites } from "@/api/favoriteAPI";

export default function Profile() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const [favorites, setFavorites] = useState<any>([]);
  const [token, setToken] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalImages = favorites.length; 
  const totalPages = Math.ceil(totalImages / itemsPerPage);

  // คำนวณ index ของภาพที่จะแสดงในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const imageUrls = favorites.map((favorite:any) => favorite.imageUrl);
  const currentImages = imageUrls.slice(startIndex, endIndex);

  // โหลด token เมื่อ component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); // ตั้งค่า token ใน state
  }, []);

  // โหลดข้อมูล Favorite จาก API เมื่อ token พร้อม
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) {
          console.warn("No token found, skipping API call.");
          return;
        }
        const favoriteData = await getAllFavorites(token); // ส่ง token ไปให้ API
        setFavorites(favoriteData || []); // อัปเดต state ด้วยข้อมูลที่ได้จาก API
      } catch (error) {
        console.error("Failed to fetch favorites:", error);

      }
    };

    if (token) {
      fetchFavorites();
    }
  }, [token]); // รอ token ถูกอัปเดตก่อน fetch ข้อมูล

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      <div className="w-full place-content-center place-items-center h-[100px] mt-[5rem] bg-black">
        <h1 className="text-4xl font-semibold mb-3">My Profile</h1>
      </div>
      <div className="w-full place-items-center">
        <div className="w-full max-w-[1024px] py-20 flex flex-col gap-12">
          <MyProfile />

          <section className="flex gap-10 px-4 font-semibold">
            <a className="text-[#0AACF0] underline" href="/profile">
              Favorite
            </a>
            <a
              className="hover:text-[#0AACF0] transition-all"
              href="/configuration"
            >
              Art Toy Config
            </a>
            <a className="hover:text-[#0AACF0] transition-all" href="/order">
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
