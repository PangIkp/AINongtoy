import React, { useEffect } from 'react';

// ประกาศอินเตอร์เฟส ImageGridProps เพื่อกำหนดประเภทของ props ที่คอมโพเนนต์ ImageGrid จะรับ
interface ImageGridProps {
    maxRows?: string;
    currentPage: number;
    itemsPerPage: number;
    setTotalImages: (total: number) => void;
    minHeight?: string;
}

// ประกาศคอมโพเนนต์ ImageGrid โดยใช้ React.FC และรับ props ตามที่กำหนดใน ImageGridProps
const ImageGrid: React.FC<ImageGridProps> = ({ maxRows, currentPage, itemsPerPage, setTotalImages, minHeight }) => {
    // สร้างอาร์เรย์ images ที่มีความยาว 87 โดยแต่ละรายการในอาร์เรย์จะเป็น URL ของภาพ
    const images = Array.from({ length: 87 }).map((_, index) => `/Images/AINongtoy/WhiteMiku.png`);

    // ใช้ useEffect เพื่อเรียกฟังก์ชัน setTotalImages และส่งจำนวนภาพทั้งหมด (187) ไปยังคอมโพเนนต์พาเรนต์เมื่อคอมโพเนนต์นี้ถูกเรนเดอร์
    useEffect(() => {
        setTotalImages(images.length);
    }, [images.length, setTotalImages]);

    // คำนวณ startIndex เพื่อหาจุดเริ่มต้นของภาพในหน้าปัจจุบัน
    const startIndex = (currentPage - 1) * itemsPerPage;
    // สร้างอาร์เรย์ currentImages ที่ประกอบด้วยภาพที่จะแสดงในหน้าปัจจุบัน
    const currentImages = images.slice(startIndex, startIndex + itemsPerPage);

    return (
        // เรนเดอร์ภาพในรูปแบบกริด โดยใช้ map เพื่อสร้าง <img> สำหรับแต่ละภาพใน currentImages
        <section className={`min-h-[calc(${minHeight})] max-h-[calc(${minHeight})]`}>
            <div className={`grid gap-4 ${maxRows} overflow-hidden`}>
                {currentImages.map((src, index) => (
                    <img key={index} className='w-full h-60 object-scale-down' src={src} alt="" />
                ))}
            </div>
        </section>
    );
};

export default ImageGrid;