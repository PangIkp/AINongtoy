"use client";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Config from "../components/Config";

export default function Material() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const [isOpen, setIsOpen] = useState(false);

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

      <div className="md:p-40 w-full pl-10 pr-10 pt-40">
        <div className="sm:flex justify-between items-center space-y-">
          <div>
            <p className="font-semibold text-4xl">Material Selection</p>
            <p>Choose Your Material</p>
          </div>
          <div className="flex items-center md:justify-start">
            <img src="/Images/AINongtoy/Tips.png" alt="Tips" className="w-5" />
            <button
              className="bg-transparent hover:bg-transparent font-light text-[#FCFF68] p-0"
              onClick={() => setIsOpen(true)}
            >
              Tips
            </button>
          </div>
        </div>

        <div className="mt-10 mb-10">
          <Config />
        </div>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-lg relative w-1/2">
            {/* ปุ่มปิด Popup (กากบาท X) */}
            <button
              className="absolute top-2 bg-transparent right-2 text-gray-600 hover:bg-transparent "
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* เนื้อหา Popup */}
            <p className="text-gray-800 font-semibold">Tips</p>
            <ul className="list-disc pl-5 text-gray-800">
              <li>
                For custom or limited edition art toys, choose hand-painting.
              </li>
              <li>For mass production, use Pad Printing.</li>
              <li>
                For complex designs, consider magnetic joints or interchangeable
                parts for added functionality.
              </li>
            </ul>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
