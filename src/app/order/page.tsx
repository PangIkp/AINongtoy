"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import OrderItemList from "../components/OrderItem";
import MyProfile from "../components/MyProfile";
import { getOrdersByUserId } from "@/api/orderAPI";
import { Loader } from "lucide-react"; // เพิ่มการ import Loader

export default function Order() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const [orders, setOrders] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม state สำหรับสถานะการโหลด

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // คำนวณช่วง index ของคำสั่งซื้อที่จะแสดงในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

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
        <div className="w-full max-w-[1024px] px-4 py-20 flex flex-col gap-12">
          <MyProfile
            followMessage={
              orders.length > 0
                ? `You have ${orders.length} models to follow`
                : "You have no models to follow"
            }
          />
          <section className="flex gap-10 font-semibold">
            <a className="hover:text-[#0AACF0] transition-all" href="/profile">
              Favorite
            </a>
            <a
              className="hover:text-[#0AACF0] transition-all"
              href="/configuration"
            >
              Art Toy Config
            </a>
            <a className="text-[#0AACF0] underline" href="/order">
              Order
            </a>
          </section>

          {isLoading ? ( // แสดง Loader ระหว่างโหลด
            <div className="flex justify-center items-center h-[623px]">
              <Loader className="animate-spin text-[#0CACF3]" size={50} />
            </div>
          ) : (
            <>
              <div className="min-h-[623px]">
                <OrderItemList orders={paginatedOrders} />
                {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>

            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}