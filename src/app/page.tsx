import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="relative w-full h-[600px]">
        {/* ภาพพื้นหลัง */}
        <div className="relative w-full h-[600px]">
          {" "}
          {/* กำหนดขนาดสูง */}
          <Image
            src="/Images/AINongtoy/mainbg.png"
            alt="mainbg"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ข้อความอยู่บนภาพ */}
        <div className="absolute top-[220px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[45px] font-semibold text-center max-w-[90%]">
          <h1>Create Unique Art Toys</h1>
          <p className="text-[16px] mb-4 text-[#9F9F9F] font-medium">
            Design, customize, and create Art Toys easily with AI.
          </p>

          <div className="flex items-center justify-center space-x-4">
            {/* Input */}
            <input
              type="text"
              id="keyword-input"
              name="keywordInput"
              placeholder="animal, blue and unique"
              className="w-[420px] h-[50px]"
            />

            {/* ปุ่ม */}
            <button className="text-[16px] h-[50px] w-[150px] ">
              Create Art Toys
            </button>
          </div>
        </div>
      </div>

      <Contact />
      <Footer />
    </div>
  );
}
