import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
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
  );
}
