"use client";
import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MyProfile from "../components/MyProfile";

export default function Configuration() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

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
            <a className="hover:text-[#0AACF0] transition-all" href="/profile">
              Favorite
            </a>
            <a className="text-[#0AACF0] underline" href="/configuration">
              Art Toy Config
            </a>
            <a className="hover:text-[#0AACF0] transition-all" href="/order">
              Order
            </a>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
