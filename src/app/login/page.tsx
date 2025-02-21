"use client";
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';

const Login = () => {
    const [isClient, setIsClient] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const usernamePattern = /^[A-Za-z][A-Za-z0-9._]{3,}$/;
        if (username && !usernamePattern.test(username)) {
            setUsernameError('Username: 4-20 chars, letters, numbers, ., _ only');
        } else {
            setUsernameError('');
        }
    }, [username]);

    useEffect(() => {
        const passwordPattern = /^[A-Za-z][A-Za-z0-9._]{7,}$/;
        if (password && !passwordPattern.test(password)) {
            setPasswordError('Password: More than 8 characters, letters, numbers, ., _ only.');
        } else {
            setPasswordError('');
        }
    }, [password]);

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
                <div className="relative w-full h-full flex items-center justify-center">
                    {isClient && (
                        <Image
                            src="/Images/AINongtoy/mainbg.png"
                            alt="mainbg"
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute max-w-[375px] w-full p-4">
                        <div>
                            <h1 className='text-4xl font-semibold mb-3'>Welcome back</h1>
                            <p className='font-extralight'>Please enter your details</p>
                        </div>
                        <div>
                            <form action="" className='flex flex-col justify-between gap-4 w-full h-[70%] pt-5'>
                                <label className='hidden' htmlFor="username"><p>Username</p></label>
                                <input
                                    className='block'
                                    type="text"
                                    id='username'
                                    placeholder='Username'
                                    maxLength={20}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <label className='hidden' htmlFor="password"><p>Password</p></label>
                                <input
                                    className='block'
                                    type="password"
                                    id='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

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
                            <div className='mt-4 h-[40px] text-[11px] font-thin'>
                                <p>{usernameError}</p>
                                <p>{passwordError}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;