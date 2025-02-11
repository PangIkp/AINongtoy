import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="relative w-full h-[600px]">
        {/* ภาพพื้นหลัง */}
        <Image
          src="/Images/AINongtoy/mainbg.png"
          alt="mainbg"
          fill
          className="object-cover"
          priority
        />

        {/* ข้อความอยู่บนภาพ */}
        <div className="absolute top-[150px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-semibold text-center">
          <h1>Create Unique Art Toys</h1>
        </div>
      </div>
    </div>
  );
}
