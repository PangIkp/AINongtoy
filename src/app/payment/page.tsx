"use client";
import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductDetailsSection from '../components/ProductDetailsSection';
import AddressSection from '../components/AddressSection';
import ShippingOptionSection from '../components/ShippingOptionSection';
import QRCodeSection from '../components/QRCodeSection';

export default function Payment() {
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const productDetails = {
        imageUrl: "/Images/AINongtoy/Roxy.png",
        size: "Medium",
        material: "Resin",
        painting: "Airbrush",
        assembly: "Articulated Joints",
        quantity: 3,
        price: 1500,
        shippingFee: 50
    };

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <main className="w-full my-[5rem] place-items-center">
                <div className="max-w-[1024px] w-full h-full pt-24 flex flex-col gap-7 p-3">
                    <header>
                        <h1 className='text-4xl font-semibold mb-4'>Payment</h1>
                        <p className='font-thin'>Review your order</p>
                    </header>
                    <ProductDetailsSection {...productDetails} />
                    <form action="">
                        <section className='w-full h-full flex flex-col md:flex-row gap-4'>
                            <section className='w-full md:w-1/2 flex flex-col gap-3'>
                                <AddressSection />
                                <ShippingOptionSection />
                            </section>

                            <QRCodeSection />

                        </section>
                    </form>
                    <div className='flex flex-col sm:flex-row justify-between gap-4'>
                        <button className='w-full sm:w-1/2 bg-[#51536D] h-[40px]'>Cancel</button>
                        <button className='w-full sm:w-1/2 h-[40px]'>Confirm</button>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}