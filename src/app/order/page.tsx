"use client";
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';
import OrderItemSection from '../components/OrderItemSection';

export default function Order() {
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className='w-full place-content-center place-items-center h-[235px] mt-[5rem] bg-black'>
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
                        <a className='hover:text-[#0AACF0] transition-all' href="#">Favorite</a>
                        <a className='hover:text-[#0AACF0] transition-all' href="#">Art Toy Config</a>
                        <a className='text-[#0AACF0] underline' href="#">Order</a>
                    </section>
                    <OrderItemSection setTotalItems={setTotalItems} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}