"use client";
import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';
import PasswordInput from '../components/PasswordInput';

const Signup = () => {
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        cpassword: ''
    });

    const [errors, setErrors] = useState({
        fname: '',
        lname: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        cpassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { ...errors };

        if (!formData.fname) {
            newErrors.fname = 'First name is required';
            valid = false;
        } else if (formData.fname.length < 2 || formData.fname.length > 50) {
            newErrors.fname = 'First name must be between 2 and 50 characters';
            valid = false;
        } else {
            newErrors.fname = '';
        }

        if (!formData.lname) {
            newErrors.lname = 'Last name is required';
            valid = false;
        } else if (formData.lname.length < 2 || formData.lname.length > 50) {
            newErrors.lname = 'Last name must be between 2 and 50 characters';
            valid = false;
        } else {
            newErrors.lname = '';
        }

        if (!formData.username) {
            newErrors.username = 'Username is required';
            valid = false;
        } else if (formData.username.length < 3 || formData.username.length > 30) {
            newErrors.username = 'Username must be between 3 and 30 characters';
            valid = false;
        } else {
            newErrors.username = '';
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
            valid = false;
        } else if (!phonePattern.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
            valid = false;
        } else {
            newErrors.phone = '';
        }

        const emailPattern = /^[^\s@]+@gmail\.com$/;
        if (!formData.email) {
            newErrors.email = 'Email address is required';
            valid = false;
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Email address must be a valid @gmail.com address';
            valid = false;
        } else {
            newErrors.email = '';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (formData.password.length < 6 || formData.password.length > 20) {
            newErrors.password = 'Password must be between 6 and 20 characters';
            valid = false;
        } else {
            newErrors.password = '';
        }

        if (formData.password !== formData.cpassword) {
            newErrors.cpassword = 'Passwords do not match';
            valid = false;
        } else {
            newErrors.cpassword = '';
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            // Submit form data
            console.log('Form submitted:', formData);
        }
    };

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className="w-full h-[90vh] mt-[5rem]">
                <div className="relative w-full h-full flex items-center justify-center">
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
                            <form onSubmit={handleSubmit} className='flex flex-col justify-between gap-5 w-full h-[70%] pt-5'>
                                <div className='grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5'>
                                    <label htmlFor="fname">
                                        <p>First name</p>
                                        <input type="text" id='fname' value={formData.fname} onChange={handleChange} />
                                        <p className="text-red-500 text-sm">{errors.fname || ''}</p>
                                    </label>
                                    <label htmlFor="lname">
                                        <p>Last name</p>
                                        <input type="text" id='lname' value={formData.lname} onChange={handleChange} />
                                        <p className="text-red-500 text-sm">{errors.lname || ''}</p>
                                    </label>
                                </div>

                                <div className='grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5'>
                                    <label htmlFor="username">
                                        <p>Username</p>
                                        <input type="text" id='username' value={formData.username} onChange={handleChange} />
                                        <p className="text-red-500 text-sm">{errors.username || ''}</p>
                                    </label>
                                    <label htmlFor="phone">
                                        <p>Phone number</p>
                                        <input type="text" id='phone' value={formData.phone} onChange={handleChange} />
                                        <p className="text-red-500 text-sm">{errors.phone || ''}</p>
                                    </label>
                                </div>

                                <label htmlFor="email">
                                    <p>Email address</p>
                                    <input type="email" id='email' value={formData.email} onChange={handleChange} />
                                    <p className="text-red-500 text-sm">{errors.email || ''}</p>
                                </label>

                                <div className='grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-x-5'>
                                    <PasswordInput id="password" label="Password" value={formData.password} onChange={handleChange} />
                                    <PasswordInput id="cpassword" label="Confirm password" value={formData.cpassword} onChange={handleChange} />
                                    <p className="text-red-500 text-sm">{errors.cpassword || ''}</p>
                                </div>
                                <button className='h-[40px]'>Sign Up</button>
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