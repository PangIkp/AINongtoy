/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Heart, Loader, Package2, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import ArtToyCard from "../components/ArttoyCard";
import Pagination from "../components/Pagination";
import MyProfile from "../components/MyProfile";
import { getAllFavorites } from "@/api/favoriteAPI";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n";

export default function Profile() {
  const { t } = useTranslation(); // Initialize useTranslation
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const [favorites, setFavorites] = useState<any>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false); // ตัวกระตุ้นการอัปเดต

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalImages = favorites.length;
  const totalPages = Math.ceil(totalImages / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const imageUrls = favorites.map((favorite: any) => favorite.imageUrl);
  const currentImages = imageUrls.slice(startIndex, endIndex);
  const favoriteStats = [
    {
      label: t("profile.favorite"),
      value: totalImages,
      icon: Heart,
    },
    {
      label: t("profile.artToyConfig"),
      value: `${totalPages || 1}`,
      icon: Bookmark,
    },
    {
      label: t("profile.order"),
      value: "Ready",
      icon: Package2,
    },
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) {
          console.warn("No token found, skipping API call.");
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        const favoriteData = await getAllFavorites(token);
        setFavorites(favoriteData || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchFavorites();
    }
  }, [token, updateTrigger]); // อัปเดตเมื่อ token หรือ updateTrigger เปลี่ยนแปลง

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFavoriteDeleted = () => {
    setUpdateTrigger((prev) => !prev); // เปลี่ยนค่า trigger เพื่อกระตุ้น useEffect
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(28,44,92,0.82),rgba(7,13,31,1)_42%,rgba(5,8,22,1)_100%)] text-white">
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

      <section className="border-b border-white/10 pt-24">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
            <Sparkles size={14} />
            Personal Space
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {t("myProfile")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                Curate your favorite concepts, revisit saved directions, and move the strongest ideas into production.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {favoriteStats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                      <Icon size={18} className="text-[#76e3ff]" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{value}</p>
                      <p className="text-xs text-white/60">{label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <MyProfile
            followMessage={
              favorites.length > 0
                ? t("profile.followMessage", { count: favorites.length })
                : t("profile.noFollowMessage")
            }
          />

          <section className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 py-2.5 text-sm font-semibold text-[#89ebff]"
              href="/profile"
            >
              {t("profile.favorite")}
            </Link>
            <Link
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              href="/configuration"
            >
              {t("profile.artToyConfig")}
            </Link>
            <Link
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              href="/order"
            >
              {t("profile.order")}
            </Link>
          </section>

          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
            <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                  Favorite Library
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  {t("profile.favorite")}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#aebddb]">
                  Review the art toys you saved and continue into material and production setup from here.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                {totalImages} saved item{totalImages === 1 ? "" : "s"}
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-[420px] items-center justify-center px-6 py-10">
                <Loader className="animate-spin text-[#0CACF3]" size={50} />
              </div>
            ) : totalImages === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-10 text-center">
                <div className="rounded-[28px] border border-white/10 bg-[#0c1530] p-5">
                  <Heart size={28} className="text-[#72e4ff]" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">No favorites yet</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-[#aebddb]">
                  Generate a few stronger concepts in the studio and tap the heart button to build your collection here.
                </p>
                <Link
                  href="/arttoy"
                  className="mt-6 inline-flex rounded-full bg-[#0AACF0] px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-[#39c7ff]"
                >
                  Explore Art Toy Studio
                </Link>
              </div>
            ) : (
              <div className="px-4 py-6 sm:px-6 sm:py-8">
                <ArtToyCard
                  imageUrls={currentImages}
                  isLoading={isLoading}
                  onFavoriteDeleted={handleFavoriteDeleted}
                />

                <div className="mt-8">
                  {totalPages > 1 && (
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
