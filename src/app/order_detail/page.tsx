"use client";
import React from 'react';
import { useRef } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrderSummary from '../components/OrderSummary';
import OrderInfo from '../components/OrderInfo';
import TrackingInfo from '../components/TrackingInfo';

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
                    <OrderSummary />
                    <OrderInfo />
                    <TrackingInfo />
                </div>
            </div>
            <Footer />
        </div>
    );
}