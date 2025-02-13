import React from "react";
import Image from "next/image";

export default function Contact() {
  return (
    <div className="place-items-center h-[550px] my-20 mx-[13vw]">
      <div className="max-w-7xl w-full h-full flex gap-x-12">
        {/* ฝั่งซ้าย (Form) */}
        <div className="w-full h-full">
          <div className="w-full h-full">
            <div className="w-full h-[30%]">
              <p className="text-[#0AACF0] font-semibold mb-4">CONTACT US</p>
              <h1 className="text-[30px] sm:text-[40px] md:text-[45px] font-semibold">
                We will get back to you asap!
              </h1>
            </div>

            <form action="" className="flex flex-col w-full h-[60%] mt-[45px]">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col gap-y-1">
                  <label htmlFor="" className="text-[16px]">
                    First Name
                  </label>
                  <input
                    className="block px-2 py-2 mb-6 border border-gray-300 rounded-md"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-y-1">
                  <label htmlFor="" className="text-[16px]">
                    Last Name
                  </label>
                  <input
                    className="block px-2 py-2 border border-gray-300 rounded-md"
                    type="text"
                  />
                </div>
              </div>

              <label htmlFor="" className="text-[16px]">
                Email
                <input
                  className="block px-2 py-2 mb-6 border border-gray-300 rounded-md"
                  type="email"
                />
              </label>
              <label htmlFor="" className="text-[16px]">
                Phone Number
                <input
                  className="block px-2 py-2 mb-10 border border-gray-300 rounded-md"
                  type="phone"
                />
              </label>

              <button className="h-[45px]">Submit</button>
            </form>
          </div>
        </div>

        {/* ฝั่งขวา (Image) */}
        <div className="w-full max-xl:hidden flex items-end">
          <Image
            className="h-auto object-cover mb-[1vw]"
            src="/Images/AINongtoy/Contact.png"
            alt="contact"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
