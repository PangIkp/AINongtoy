import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <Footer />
      <div className="">
        <Navbar />
        <div className="relative w-full h-auto">
          <Image
            src="/Images/AINongtoy/mainbg.png"
            alt="mainbg"
            width={1920} // กำหนดอัตราส่วน
            height={600}
            className="object-cover w-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}