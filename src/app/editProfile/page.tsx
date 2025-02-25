"use client";
import React, { useState } from 'react';
import { useRef } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Province from '../components/Province';
import District from '../components/District';
import Subdistrict from '../components/Subdistrict';
import PostalCode from '../components/PostalCode';
import { IoIosAddCircle } from "react-icons/io";

export default function EditProfile() {
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const [charCount, setCharCount] = useState(0);

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (value.length <= 500) {
            setCharCount(value.length);
        }
    };

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className='w-full place-content-center place-items-center h-[235px] mt-[5rem] bg-black'>
                <h1 className='text-4xl font-semibold mb-3'>My Profile</h1>
            </div>
            <div className='w-full place-items-center'>
                <div className='w-full max-w-[980px] px-4 py-20 flex flex-col gap-12'>
                    <div className='flex justify-between border-b border-white pb-6'>
                        <p className='text-xl font-semibold'>Information</p>
                        <div className='place-aitems-end place-content-center'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={() => alert('Button clicked!')}>Edit</button>
                        </div>
                    </div>

                    <div>
                        <form action="#information" method="post" className='grid grid-cols-2 gap-y-10 gap-x-8'>
                            <label htmlFor="username">
                                <p>Username</p>
                                <input type="text" id="username" />
                            </label>
                            <label htmlFor="email">
                                <p>Email address</p>
                                <input type="email" id="email" />
                            </label>
                            <label htmlFor="fname">
                                <p>First Name</p>
                                <input type="text" id="fname" />
                            </label>
                            <label htmlFor="lname">
                                <p>Last Name</p>
                                <input type="text" id="lname" />
                            </label>
                            <label htmlFor="phone">
                                <p>Phone Number</p>
                                <input type="tel" id="phone" />
                            </label>
                        </form>
                    </div>

                    <div className='flex justify-between border-b border-white pb-6'>
                        <div className='flex justify-center items-center'>
                            <p className='text-xl font-semibold'>Address</p>

                            <button className='bg-[#07081C] hover:bg-[#07081C] hover:text-white rounded-full' onClick={() => alert('Button clicked!')}>
                                <IoIosAddCircle className='w-[20px] h-[20px] hover:text-[#0AACF0]' /><p className='hidden'>+</p>
                            </button>
                        </div>

                        <div className='flex justify-center items-center gap-2'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={() => alert('Button clicked!')}>Edit</button>
                            <button className='bg-[#51536D] border border-white font-normal text-xs py-1 px-3' onClick={() => alert('Button clicked!')}>Delete</button>
                        </div>
                    </div>

                    <div>
                        <form action="#address" method="post" className='grid grid-cols-2 gap-y-10 gap-x-8'>
                            <Province />
                            <District />
                            <Subdistrict />
                            <PostalCode />
                            <label htmlFor="address" className='col-span-2 relative'>
                                <p className='hidden'>Address</p>
                                <textarea
                                    className='resize-none'
                                    placeholder='Address Detail such as House number, Apartment name, Condo, Village name '
                                    rows={4}
                                    maxLength={500}
                                    onChange={handleTextareaChange}
                                ></textarea>
                                <span className='absolute bottom-3 right-2 text-xs text-gray-500'>{charCount}/500</span>
                            </label>
                        </form>
                    </div>

                    <button className='h-[50px]'>Save</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}