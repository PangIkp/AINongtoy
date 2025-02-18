import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import useScreen from 'use-screen';
const images = [
  "/Images/AINongtoy/Princess.jpg",
  "/Images/AINongtoy/Rabbit.jpg",
  "/Images/AINongtoy/WhiteMiku.png",
  "/Images/AINongtoy/Cutegirl.jpg",
  "/Images/AINongtoy/Anime.jpg",
];

export default function ImageSlider() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
  // const { isMobile:ism, isWideScreen, screenWidth } = useScreen();

  // useEffect(() => {
  //   console.log(screenWidth)
  // }, [screenWidth]);

  // ตรวจจับการเปลี่ยนขนาดหน้าจอ
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1280);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => {
      if (isMobile) return prev === 0 ? 1 : 0; // Mobile: วนกลับระหว่าง 0 ↔ 1
      return prev > 0 ? prev - 1 : images.length - 1; // Desktop: วนกลับตามปกติ
    });
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => {
      if (isMobile) return prev === 1 ? 0 : 1; // Mobile: วนกลับระหว่าง 0 ↔ 1
      return prev < images.length - 1 ? prev + 1 : 0; // Desktop: วนกลับตามปกติ
    });
  };
  

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      {/* ปุ่มซ้าย */}
      <button
        className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all"
        onClick={handlePrev}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Container ของภาพ */}
      <div
        className={`${
          isMobile
            ? "flex items-center justify-center overflow-x-auto whitespace-nowrap gap-4 w-[360px]" // แสดง 2 ภาพและเลื่อนได้
            : "flex items-center justify-center grid grid-cols-5 gap-4 w-[914px] h-[200px]" // แสดง 5 ภาพเต็ม ไม่ต้องเลื่อน
        }`}
      >
        {images
          .slice(0, isMobile ? 2 : images.length) // จำกัด 2 ภาพเมื่อเป็น mobile
          .map((src, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={index}
                className={`relative rounded-lg overflow-hidden transition-all duration-500 ${
                  isActive ? "w-[170px] h-[200px] opacity-100" : "w-[160px] h-[190px] opacity-70"
                }`}
              >
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  className="object-cover rounded-lg w-full h-full cursor-pointer"
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                />
              </motion.div>
            );
          })}
      </div>

      {/* ปุ่มขวา */}
      <button
        className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all"
        onClick={handleNext}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
