"use client";
import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Payment() {
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
                    <div>
                        <h1 className='text-4xl font-semibold mb-4'>Payment</h1>
                        <p className='font-thin'>Review your order</p>
                    </div>
                    <section className='bg-[#202133] border border-[#202133] rounded-xl h-[700px]'>

                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}