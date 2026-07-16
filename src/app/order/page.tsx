/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import OrderItemList from "../components/OrderItem";
import MyProfile from "../components/MyProfile";
import { getOrdersByUserId } from "@/api/orderAPI";
import { Heart, Loader, Package2, ReceiptText, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n"; // Import i18n

export default function Order() {
  const { t } = useTranslation(); // Initialize useTranslation
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const [orders, setOrders] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม state สำหรับสถานะการโหลด

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // คำนวณช่วง index ของคำสั่งซื้อที่จะแสดงในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);
  const orderStats = [
    {
      label: t("profile.favorite"),
      value: "Saved",
      icon: Heart,
    },
    {
      label: t("profile.artToyConfig"),
      value: "Prepared",
      icon: Package2,
    },
    {
      label: t("profile.order"),
      value: totalItems,
      icon: ReceiptText,
    },
  ];

  // โหลด token เมื่อ component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn("No token found, skipping API call.");
    }
  }, []);

  // โหลดข้อมูลออเดอร์จาก API เมื่อ token พร้อม
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const data = await getOrdersByUserId(token);
        setOrders(data.data || []); // ตรวจสอบให้แน่ใจว่า orders เป็น array
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false); // โหลดเสร็จ
      }
    };

    if (token) {
      fetchOrders();
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
            Production Tracker
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {t("profile.order")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                Track every saved order, reopen production details quickly, and monitor progress from checkout to delivery.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {orderStats.map(({ label, value, icon: Icon }) => (
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
              orders.length > 0
                ? t("profile.orderMessage", { count: orders.length })
                : t("profile.noOrderMessage")
            }
          />

          <section className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
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
              className="rounded-full border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 py-2.5 text-sm font-semibold text-[#89ebff]"
              href="/order"
            >
              {t("profile.order")}
            </Link>
          </section>

          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
            <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                  Order Timeline
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  {t("profile.order")}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#aebddb]">
                  Review current and past orders, then open each one for shipping, payment, and production details.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                {totalItems} order{totalItems === 1 ? "" : "s"}
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-[420px] items-center justify-center px-6 py-10">
                <Loader className="animate-spin text-[#0CACF3]" size={50} />
              </div>
            ) : (
              <div className="min-h-[420px] px-4 py-6 sm:px-6 sm:py-8">
                <OrderItemList orders={paginatedOrders} />
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
