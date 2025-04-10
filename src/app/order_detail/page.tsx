/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderDetail() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [phoneNumber, setPhone] = useState<string | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const storedOrder = localStorage.getItem("selectedOrder");
    const storedUser = localStorage.getItem("user");
    if (storedOrder) {
      setOrderDetail(JSON.parse(storedOrder));
    }

    if (storedUser) {
      try {
        const userObject = JSON.parse(storedUser); // แปลงเป็น Object
        setPhone(userObject.phoneNumber || null); // ดึงเฉพาะ phoneNumber
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  if (!orderDetail) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-2xl">Loading order details...</p>
      </div>
    );
  }

  const statusColors: { [key: string]: string } = {
    Pending: "text-yellow-400",
    Processing: "text-blue-400",
    Shipped: "text-purple-400",
    Delivered: "text-green-400",
  };

  return (
    <div>
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />
      <div className="w-full my-[5rem] place-items-center">
        <div className="max-w-[1024px] w-full h-full pt-24 flex flex-col gap-12">
          <h1 className="text-4xl font-semibold">Order Details</h1>
          {/* <OrderSummary /> */}
          <section className="bg-[#202133] border border-[#202133] rounded-xl">
            <div className="flex justify-between border-b border-white p-10 ">
              <div className="flex gap-7 ">
                <img
                  className="w-[30%] object-contain rounded-lg"
                  src={orderDetail.imageUrl}
                />
                <div className="flex flex-col justify-center gap-2">
                  <p className="font-semibold">{orderDetail.name}</p>
                  <p className="text-sm text-[#B3B0B0]">
                    Size : {orderDetail.size}
                  </p>
                  <p className="text-sm text-[#B3B0B0]">
                    Quantity : {orderDetail.quantity}
                  </p>
                  {/* <p className="text-xl font-semibold">{orderDetail.total} </p> */}
                </div>
              </div>
              <div
                className={`${
                  statusColors[orderDetail.status] || "text-white"
                }`}
              >
                <p className="text-sm">{orderDetail.status}</p>
              </div>
            </div>

            <div className="flex h-1/2 justify-between p-10 ">
              <div className="leading-[2rem]">
                <p>Subtotal</p>
                <p>Shipping</p>
                <p>Total price</p>
              </div>

              <div className="leading-[2rem] text-right">
                <p>{orderDetail.price.toLocaleString()} ฿</p>
                <p>{orderDetail.shipping} ฿</p>
                <p>{orderDetail.total.toLocaleString()} ฿</p>
              </div>
            </div>
          </section>
          <section className="bg-[#202133] border border-[#202133] rounded-xl">
            <div>
              <h1 className="text-lg font-semibold px-10 py-5 border-b border-white">
                Order Number : OR90123456
              </h1>
            </div>
            <div className="flex justify-between p-10 ">
              <div className="leading-[2rem]">
                <p>Payment Method</p>
                <p>Order Placed Time</p>
                <p>Shipping Time</p>
                <p>Delivered Time</p>
              </div>
              <div className="leading-[2rem] text-right">
                <p>Mobile Banking</p>
                <div className="flex gap-3 ">
                  <div className="text-right">
                    <p>
                      {new Date(orderDetail.createdAt)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(/\//g, "-")
                        .replace(",", "")}
                    </p>
                    <p>-</p>
                    <p>-</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-[#202133] border border-[#202133] rounded-xl">
            <div>
              <h1 className="text-lg font-semibold px-10 py-5 border-b border-white">
                Tracking Number : TH123456789XYZ
              </h1>
            </div>

            <div className="p-10">
              <p className="mb-2">Address</p>
              <p className="text-sm text-[#B3B0B0]">
                {orderDetail.address
                  ? (() => {
                      try {
                        const addressObject = JSON.parse(orderDetail.address);
                        return `${addressObject.subdistrict}, ${addressObject.district}, ${addressObject.province}, ${addressObject.postalCode},${addressObject.detail}`;
                      } catch (error) {
                        return "Invalid address format";
                      }
                    })()
                  : "No address provided"}
              </p>

              <div className="mt-4">
                <p>Phone number</p>
                <p className="text-sm text-[#B3B0B0]">
                  {phoneNumber || "No phone number provided"}
                </p>{" "}
                {/* ใช้ phone จาก localStorage */}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
