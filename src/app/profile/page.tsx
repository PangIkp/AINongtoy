"use client";

// นำเข้า React และ useState จาก React
import React, { useState } from 'react';
// นำเข้าคอมโพเนนต์ Navbar, Footer, ImageGrid, และ Pagination
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageGrid from '../components/ImageGrid';
import Pagination from '../components/Pagination';

// ฟังก์ชันหลักสำหรับหน้าโปรไฟล์
export default function Profile() {
    // สร้าง state สำหรับจัดการหน้าปัจจุบันและจำนวนรูปภาพทั้งหมด
    const [currentPage, setCurrentPage] = useState(1);
    const [totalImages, setTotalImages] = useState(0); // จำนวนรูปภาพทั้งหมด 
    const itemsPerPage = 20; // จำนวนรูปภาพต่อหน้า
    const totalPages = Math.ceil(totalImages / itemsPerPage); // คำนวณจำนวนหน้าทั้งหมด
    const minHeight = '4*15rem+3*1rem'; // ความสูงขั้นต่ำของ ImageGrid

    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Navbar /> {/* แถบเมนูด้านบน */}
            <div className='w-full place-content-center place-items-center h-[235px] mt-[75px] bg-black'>
                <h1 className='text-4xl font-semibold mb-3'>My Profile</h1>
            </div>
            <div className='w-full place-items-center'>
                <div className='w-full max-w-[1024px] px-4 py-20 flex flex-col gap-12'>

                    <section className='flex justify-between'>
                        <div className='flex gap-5'>
                            <img className='w-[20%] object-contain' src='/Images/AINongtoy/Profile.png' alt="profile" />
                            <div className='w-[80%] place-content-center'>
                                <h1 className='text-xl font-semibold'>Cameron Williamson</h1>
                                <p className='text-xs text-[#BBBBBB]'>You have 200 models to follow</p>
                            </div>
                        </div>

                        <div className='place-aitems-end place-content-center'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3'>Edit Profile</button>
                        </div>
                    </section>

                    <section className='flex gap-10 font-semibold'>
                        <a className='text-[#0AACF0] underline' href="#">Favorite</a>
                        <a className='hover:text-[#0AACF0] transition-all' href="#">Art Toy Config</a>
                        <a className='hover:text-[#0AACF0] transition-all' href="#">Order</a>
                    </section>

                    <ImageGrid
                        maxRows="grid-cols-[repeat(auto-fill,minmax(180px,1fr))] "
                        minHeight={minHeight}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        setTotalImages={setTotalImages}
                    />
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <Footer /> {/* แถบเมนูด้านล่าง */}
        </div>
    )
}