"use client";
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';
import OrderItemSection from '../components/OrderItemSection';
import MyProfile from '../components/MyProfile';

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
            <div className='w-full place-content-center place-items-center h-[100px] mt-[5rem] bg-black'>
                <h1 className='text-4xl font-semibold mb-3'>My Profile</h1>
            </div>
            <div className='w-full place-items-center'>
                <div className='w-full max-w-[1024px] px-4 py-20 flex flex-col gap-12'>
                    <MyProfile
                        followMessage={
                            totalItems > 0
                                ? `You have ${totalItems} orders in your list.`
                                : "You have no orders yet."
                        }
                    />
                    <section className='flex gap-10 font-semibold'>
                        <a className='hover:text-[#0AACF0] transition-all' href="/profile">Favorite</a>
                        <a className='hover:text-[#0AACF0] transition-all' href="/configuration">Art Toy Config</a>
                        <a className='text-[#0AACF0] underline' href="/order">Order</a>
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