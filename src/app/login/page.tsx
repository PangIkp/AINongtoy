"use client";
import React from 'react';
import { useRef } from "react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Image from 'next/image'

const Login = () => {
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
            <div className="w-full h-[90vh] mt-[5rem]">
                {/* ภาพพื้นหลัง */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {" "}
                    {/* กำหนดขนาดสูง */}
                    <Image
                        src="/Images/AINongtoy/mainbg.png"
                        alt="mainbg"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute max-w-[375px] w-full p-4">
                        <div>
                            <h1 className='text-4xl font-semibold mb-3'>Welcome back</h1>
                            <p className='font-extralight'>Please enter your details</p>
                        </div>
                        <div>
                            <form action="" className='flex flex-col justify-between gap-4 w-full h-[70%]  pt-5'>
                                <label className='hidden' htmlFor="username"><p>Username</p></label>
                                <input className='block' type="text" id='username' placeholder='Username' />

                                <label className='hidden' htmlFor="password"><p>Password</p></label>
                                <input className='block' type="password" id='password' placeholder='Password' />

                                <div className='flex justify-between text-[13px]'>
                                    <label htmlFor="remember" className='flex items-center gap-2 cursor-pointer'>
                                        <input className='scale-125 accent-black focus:ring-black' type="checkbox" id='remember' />
                                        Remember&nbsp;me
                                    </label>
                                    <a href="#" className='text-[#0AACF0]'>Forgot password ?</a>
                                </div>
                                <button className='h-[40px]'>Login</button>
                                <div className='flex justify-center text-[13px]'>
                                    <p>Not registered yet ? <a href="/signup" className='text-[#0AACF0]'>Sign up</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Login