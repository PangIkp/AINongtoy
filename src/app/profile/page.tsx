"use client";
import React, { useState, useRef, useEffect } from "react";
import { Loader } from "lucide-react"; // เพิ่มการ import Loader
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
  const [isLoading, setIsLoading] = useState<boolean>(true); // เพิ่ม state สำหรับ loader

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalImages = favorites.length;
  const totalPages = Math.ceil(totalImages / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const imageUrls = favorites.map((favorite: any) => favorite.imageUrl);
  const currentImages = imageUrls.slice(startIndex, endIndex);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) {
          console.warn("No token found, skipping API call.");
          setIsLoading(false); // ปิด loader หากไม่มี token
          return;
        }
        setIsLoading(true); // เปิด loader ก่อนเริ่มโหลดข้อมูล
        const favoriteData = await getAllFavorites(token);
        setFavorites(favoriteData || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setIsLoading(false); // ปิด loader หลังโหลดข้อมูลเสร็จ
      }
    };

    if (token) {
      fetchFavorites();
    }
  }, [token]);

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
      <div className="w-full place-items-center min-h-[700px]">
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

          {isLoading ? ( // แสดง loader ระหว่างโหลดข้อมูล
            <div className="flex justify-center items-center h-[360px]">
              <Loader className="animate-spin text-[#0CACF3]" size={50} />
            </div>
          ) : (
            <ArtToyCard imageUrls={currentImages} isLoading={isLoading} />
          )}

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