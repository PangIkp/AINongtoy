import React from "react";
import Image from "next/image";

export default function Service() {
  return (
    <div className="h-auto px-28 py-20">
      <p className="text-[#0AACF0] font-semibold mb-4">SERVICES</p>
      <div className="flex flex-col mt-6 gap-10">
        <div className="w-full space-y-2">
          <p className="text-[30px] sm:text-[40px] md:text-[45px] font-semibold">
            Services We Offer
          </p>

          <p>
            Turn your ideas into tangible Art Toys. with comprehensive services
            From design to actual production.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 transform lg:scale-100 lg:grid-cols-2 xl:grid-cols-4">
        <div className="text-[14px] space-y-2 border border-[#0CACF3] rounded-[10px] p-10">
          <img
            src="/Images/AINongtoy/Design.png"
            alt="AI Design"
            className="w-10"
          />
          <p className="font-semibold">AI-Powered Design</p>
          <p>AI helps create unique art toys.</p>
        </div>

        <div className="text-[14px] space-y-2 border border-[#0CACF3] rounded-[10px] p-10">
          <img
            src="/Images/AINongtoy/3D.png"
            alt="AI Design"
            className="w-10"
          />
          <p className="font-semibold">3D Model Preview</p>
          <p>Rotate, zoom, scale in real time.</p>
        </div>

        <div className="text-[14px] space-y-2 border border-[#0CACF3] rounded-[10px] p-10">
          <img
            src="/Images/AINongtoy/Calculate.png"
            alt="AI Design"
            className="w-10"
          />
          <p className="font-semibold">Real-Time Calculation</p>
          <p>Price depends on size and materials.</p>
        </div>

        <div className="text-[14px] space-y-2 border border-[#0CACF3] rounded-[10px] p-10">
          <img
            src="/Images/AINongtoy/Download.png"
            alt="AI Design"
            className="w-10"
          />
          <p className="font-semibold">Download images</p>
          <p>Export or download image files</p>
        </div>
      </div>
    </div>
  );
}
