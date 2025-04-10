"use client";
import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MyProfile from "../components/MyProfile";
import ConfigCard from "../components/ConfigCard";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n"; // Import i18n

export default function Configuration() {
  const { t } = useTranslation(); // Initialize useTranslation
  const aboutRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const [configCount, setConfigCount] = useState<number>(0); // เก็บจำนวนข้อมูลจาก ConfigCard

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
        <h1 className="text-4xl font-semibold mb-3 text-white">
          {t("myProfile")} {/* ใช้การแปล */}
        </h1>
      </div>
      <div className="w-full place-items-center">
        <div className="w-full max-w-[1024px] py-20 flex flex-col gap-12">
          {/* ส่งจำนวน configCount ไปยัง MyProfile */}
          <MyProfile
            followMessage={
              configCount > 0
                ? t("profile.configMessage", { count: configCount }) // ใช้การแปลพร้อมตัวแปร
                : t("profile.noConfigMessage") // ใช้การแปล
            }
          />

          <section className="flex gap-10 px-4 font-semibold">
            <a className="hover:text-[#0AACF0] transition-all" href="/profile">
              {t("profile.favorite")} {/* ใช้การแปล */}
            </a>
            <a className="text-[#0AACF0] underline" href="/configuration">
              {t("profile.artToyConfig")} {/* ใช้การแปล */}
            </a>
            <a className="hover:text-[#0AACF0] transition-all" href="/order">
              {t("profile.order")} {/* ใช้การแปล */}
            </a>
          </section>

          {/* อัปเดตจำนวน configCount จาก ConfigCard */}
          <div className="px-3">
            <ConfigCard onConfigCountChange={setConfigCount} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}