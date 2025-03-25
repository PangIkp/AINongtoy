"use client";
import React from 'react'
import Image from 'next/image';

export default function Footer() {
    const social_size = 35;
    return (
        <div className='inset-x-0 bottom-0  w-screen bg-[#1B1D36]' >
            <section className='w-full flex flex-col sm:flex-row sm:justify-around gap-5 py-5 min-w-sm'>
                <div className='w-full sm:w-1/2 px-5 xl:w-1/3 leading-[70px] '>
                    <a href="#" className='flex items-center gap-4'>
                        <img src="/Images/AINongtoy/Map.png" alt="" className='w-10 h-10' />
                        <p className='underline'>21 Ladprao Street Bangkok, Thailand</p>
                    </a>
                    <a href="tel:090-846-6758" className='flex items-center gap-4'>
                        <img src="Images/AINongtoy/Phone.png" alt="" className='w-10 h-10' />
                        <p>090-846-6758</p>
                    </a>
                    <a href="mailto:NongToy@gmail.com" className='flex items-center gap-4'>
                        <img src="/Images/AINongtoy/Email.png" alt="" className='w-10 h-10' />
                        <p>NongToy@gmail.com</p>
                    </a>

                </div>
                <div className='w-full sm:w-1/2 px-5 xl:w-1/3 leading-10'>
                    <p className='font-bold'>About the company</p>
                    <p>We use AI to revolutionize Art Toy design, making 3D modeling easier and faster. Our system supports real-world production, turning your ideas into tangible creations. Transform your imagination into reality with cutting-edge technology!</p>
                    <div className='flex gap-4 mt-4'>
                        <a href="#">
                            <img src="/Images/AINongtoy/Facebook.png" alt="Facebook logo" className='w-9 h-9' />
                            <p className='hidden'>Facebook</p>
                        </a>
                        <a href="#">
                            <img src="/Images/AINongtoy/Instagram.png" alt="Facebook logo" className='w-9 h-9' />
                            <p className='hidden'>Instagram</p>
                        </a>
                        <a href="#">
                            <img src="/Images/AINongtoy/Twitter.png" alt="Facebook logo" className='w-9 h-9' />
                            <p className='hidden'>Twitter</p>
                        </a>
                    </div>
                </div>
            </section>

            <div className='bg-[#20255E] text-white  w-full h-9 flex justify-center items-center'>
                <p>© 2025 NongToy. All rights reserved.</p>
            </div>
        </div>
    )
}