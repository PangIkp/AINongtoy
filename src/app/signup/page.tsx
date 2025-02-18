"use client";
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';
import PasswordInput from '../components/PasswordInput';

const Signup = () => {
    return (
        <div>
            <Navbar />
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
                    <div className="absolute max-w-[600px] w-full p-5 sm:p-20 ">
                        <div>
                            <h1 className='text-4xl font-semibold mb-3'>Create an account</h1>
                            <p className='font-extralight'>Already have an account ? <a href="/login" className='hover:text-[#0AACF0] underline'>Log in</a></p>
                        </div>
                        <div>
                            <form action="" className='flex flex-col justify-between gap-5 w-full h-[70%] pt-5'>
                                <div className='grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5'>
                                    <label htmlFor="fname"><p>First name</p>
                                        <input type="text" id='fname' />
                                    </label>
                                    <label htmlFor="lname"><p>Last name</p>
                                        <input type="text" id='lname' />
                                    </label>
                                </div>

                                <div className='grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5'>
                                    <label htmlFor="username"><p>Username</p>
                                        <input type="text" id='username' />
                                    </label>
                                    <label htmlFor="phone"><p>Phone number</p>
                                        <input type="text" id='phone' />
                                    </label>
                                </div>

                                <label htmlFor="email"><p>Email address</p>
                                    <input type="email" id='email' />
                                </label>

                                <div className='grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5'>
                                    <PasswordInput id="password" label="Password" />
                                    <PasswordInput id="cpassword" label="Confirm password" />
                                </div>
                                <button className='h-[40px]'>Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;