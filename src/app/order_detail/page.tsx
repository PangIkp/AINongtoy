"use client";
import React from 'react';
import { useRef } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderDetail() {
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className="w-full my-[5rem] place-items-center">
                <div className="max-w-[1024px] w-full h-full pt-24 flex flex-col gap-12">
                    <h1 className='text-4xl font-semibold'>Order Details</h1>
                    {/* <OrderSummary /> */}
                    <section className="bg-[#202133] border border-[#202133] rounded-xl">
                        <div className='flex justify-between border-b border-white p-10 '>
                            <div className='flex gap-7 '>
                                <img className='w-[20%] object-contain rounded-lg' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                                <div className='flex flex-col justify-center gap-2'>
                                    <p className='font-semibold'>White Miku</p>
                                    <p className='text-sm text-[#B3B0B0]'>Box Set</p>
                                    <p className='text-sm text-[#B3B0B0]'>Quantity: 2</p>
                                    <p className='text-xl font-semibold'>3,800 ฿</p>
                                </div>
                            </div>
                            <div className=' text-[#B3FFB2]'>
                                <p>Delivered</p>
                            </div>
                        </div>

                        <div className='flex h-1/2 justify-between p-10 '>
                            <div className='leading-[2rem]'>
                                <p>Subtotal</p>
                                <p>Shipping</p>
                                <p>Total price</p>
                            </div>

                            <div className='leading-[2rem] text-right'>
                                <p>7,600 ฿</p>
                                <p>50 ฿</p>
                                <p>7,650 ฿</p>
                            </div>
                        </div>
                    </section>
                    <section className='bg-[#202133] border border-[#202133] rounded-xl'>
                        <div>
                            <h1 className='text-lg font-semibold px-10 py-5 border-b border-white'>Order Number : OR90123456</h1>
                        </div>
                        <div className='flex justify-between p-10 '>
                            <div className='leading-[2rem]'>
                                <p>Payment Method</p>
                                <p>Order Placed Time</p>
                                <p>Shipping Time</p>
                                <p>Delivered Time</p>
                            </div>
                            <div className='leading-[2rem] text-right'>
                                <p>Mobile Banking</p>
                                <div className='flex gap-3 '>
                                    <div className='text-right'>
                                        <p>2025-01-29</p>
                                        <p>2025-01-30</p>
                                        <p>2025-02-02</p>
                                    </div>
                                    <div className='text-left'>
                                        <p>10:30</p>
                                        <p>2:00</p>
                                        <p>3:15</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='bg-[#202133] border border-[#202133] rounded-xl'>
                        <div>
                            <h1 className='text-lg font-semibold px-10 py-5 border-b border-white'>Tracking Number : TH123456789XYZ</h1>
                        </div>

                        <div className='p-10'>
                            <p className='h-24 mb-4'>Address</p>

                            <div className='leading-[3rem]'>
                                <p>Phone number</p>
                                <p>(+66) 080 786 8975</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}