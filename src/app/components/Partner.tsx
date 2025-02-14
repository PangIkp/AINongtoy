import React from "react";
import Image from "next/image";

export default function Partner() {
  return (
    <div className="bg-[#1B1D36] h-auto px-28 py-20">
      <p className="text-[#0AACF0] font-semibold mb-4">PARTNER</p>
      <p className="text-[30px] sm:text-[40px] md:text-[45px] font-semibold">
        KTP Corporation (Thailand) Co.,Ltd.
      </p>

      <div className="flex flex-col lg:flex-row justify-between mt-6 gap-10">
        <div className="w-full lg:w-2/3 space-y-2">
          <p>
            We work with leading 3D design and manufacturing partners to bring
            you high quality Art Toys.
          </p>
          <p>
            KTP Corporation is Thailand’s leading Art Toy, Figure, and Character
            manufacturer with over 35 years of experience and 30 million
            products produced.
          </p>
          <p className="pb-10">
            With a monthly capacity of 120,000 pieces, we collaborate with top
            brands worldwide to bring Character creations to life. Backed by
            expert craftsmanship and industry expertise, we are committed to
            turning your ideas into reality.
          </p>

          <a
            href="https://www.ktpthailand.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[#0AACF0] text-[14px] font-medium"
          >
            Read More {"->"}
          </a>
        </div>

        <div className="flex justify-center lg:justify-end w-full lg:w-1/3">
          <Image
            className="w-full h-full"
            src="/Images/AINongtoy/KTP.png"
            alt="contact"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
