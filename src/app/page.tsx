"use client"
import { useState } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ImageSlider from "./components/ImageSlider";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="relative w-full h-[600px] flex justify-center items-center">
        {/* ภาพพื้นหลัง */}
        <Image
          src="/Images/AINongtoy/mainbg.png"
          alt="mainbg"
          fill
          className="object-cover"
          priority
        />

        {/* ข้อความอยู่บนภาพ */}
        <div className="absolute top-[350px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold text-center w-[1050px] max-w-[90%]">
          <h1 className="text-[clamp(30px,5vw,45px)]">Create Unique Art Toys</h1>
          <p className="text-[16px] mb-4 text-[#9F9F9F] font-medium">
            Design, customize, and create Art Toys easily with AI.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 w-[550px] mx-auto max-w-[90%]">

            {/* Input */}
            <input
              type="text"
              id="keyword-input"
              name="keywordInput"
              placeholder="animal, blue and unique"
              className="px-4 py-2 border border-gray-300 text-[14px] text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AACF0] w-full h-[50px]"
            />

            {/* ปุ่ม */}
            <button className="bg-[#0AACF0] text-[15px] h-[50px] hover:bg-[#0578AB] text-white font-bold px-2 rounded-md transition-all w-full md:w-[220px]">
              Create Art Toys
            </button>
          </div>

          <ImageSlider/>
        </div>
      </div>
      <Footer />
    </div>
  );
}
