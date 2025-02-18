"use client";
import React from 'react';
import { useRef } from "react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Order() {
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
            <div className='mt-20'>Order</div>
            <Footer />
        </div>
    )
}