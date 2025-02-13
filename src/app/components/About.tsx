import React from "react";
import Image from "next/image";

export default function About() {
  return (
    <div className="h-auto px-28 py-20">
      <p className="text-[#0AACF0] font-semibold mb-4">ABOUT US</p>
      <div className="flex flex-col lg:flex-row justify-between mt-6 gap-10">
        <div className="w-full lg:w-2/3 space-y-2">
          <p className="text-[30px] sm:text-[40px] md:text-[45px] font-semibold">
            What is Nong Toy ?
          </p>

          <p>
            Nong Toy is a platform that brings AI to revolutionize the Art Toy
            industry, making designing 3D models easy. Limitless creativity Just
            enter your idea or choose a template, AI can help you design it
            right away.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end w-full lg:w-2/3">
          <Image
            className="w-full h-full"
            src="/Images/AINongtoy/Aboutus.png"
            alt="contact"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
