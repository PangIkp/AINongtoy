"use client";
import React, { useState, useRef, useEffect } from 'react';
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

        if (id === 'phone') {
            const formattedValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, [id]: formattedValue });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        let valid = true;
        let newErrors = { ...errors };

        const namePattern = /^[A-Za-z][A-Za-z0-9._]*$/;
        const usernamePattern = /^[A-Za-z][A-Za-z0-9._]*$/;
        const passwordPattern = /^[A-Za-z][A-Za-z0-9._]*$/;
        const phonePattern = /^\d{10}$/;
        const emailPattern = /^[a-zA-Z][a-zA-Z0-9._]*@(gmail\.com|hotmail\.com|hotmail\.co\.th|yahoo\.com|outlook\.com|domain\.co\.th)$/;

        if (formData.fname && (!namePattern.test(formData.fname) || formData.fname.length < 4)) {
            newErrors.fname = 'First name: 4-20 chars, letters, ., _ only';
            valid = false;
        } else {
            newErrors.fname = '';
        }

        if (formData.lname && (!namePattern.test(formData.lname) || formData.lname.length < 4)) {
            newErrors.lname = 'Last name: 4-20 chars, letters, ., _ only';
            valid = false;
        } else {
            newErrors.lname = '';
        }

        if (formData.username && (!usernamePattern.test(formData.username) || formData.username.length < 4)) {
            newErrors.username = 'Username: 4-20 chars, letters, ., _ only';
            valid = false;
        } else {
            newErrors.username = '';
        }

        if (formData.phone && !phonePattern.test(formData.phone)) {
            newErrors.phone = 'Phone number: must be 10 digits';
            valid = false;
        } else {
            newErrors.phone = '';
        }

        if (formData.email && !emailPattern.test(formData.email)) {
            newErrors.email = 'Email address must be ( .com , .co.th )';
            valid = false;
        } else {
            newErrors.email = '';
        }

        if (formData.password && (!passwordPattern.test(formData.password) || formData.password.length < 8)) {
            newErrors.password = 'Password: More than 8 characters, letters, numbers, ., _ only';
            valid = false;
        } else {
            newErrors.password = '';
        }

        if (formData.cpassword && formData.password !== formData.cpassword) {
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
        } else {
            console.log('Form contains errors:', errors);
        }
    };

    const isFormValid = () => {
        return Object.values(errors).every(error => error === "") &&
            Object.values(formData).every(value => value.trim() !== "");
    };

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className="w-full sm:h-[90vh] h-[925px] mt-[5rem]">
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
                                        <input type="text" id='fname' minLength={4} maxLength={40} value={formData.fname} onChange={handleChange} />
                                    </label>
                                    <label htmlFor="lname">
                                        <p>Last name</p>
                                        <input type="text" id='lname' minLength={4} maxLength={40} value={formData.lname} onChange={handleChange} />
                                    </label>
                                </div>

                                <div className='grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5'>
                                    <label htmlFor="username">
                                        <p>Username</p>
                                        <input type="text" id='username' minLength={4} maxLength={40} value={formData.username} onChange={handleChange} />
                                    </label>
                                    <label htmlFor="phone">
                                        <p>Phone number</p>
                                        <input type="text" id='phone' minLength={10} maxLength={10} value={formData.phone} onChange={handleChange} />
                                    </label>
                                </div>

                                <label htmlFor="email">
                                    <p>Email address</p>
                                    <input type="email" id='email' value={formData.email} onChange={handleChange} />
                                </label>

                                <div className='grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-x-5 gap-5'>
                                    <PasswordInput id="password" label="Password" value={formData.password} onChange={handleChange} />
                                    <PasswordInput id="cpassword" label="Confirm password" value={formData.cpassword} onChange={handleChange} />
                                </div>
                                <button className='h-[40px]' type="submit" disabled={!isFormValid()}>Sign Up</button>
                            </form>

                            <div className='mt-4 h-[7.375rem] text-[11px] font-thin text-yellow-400'>
                                {errors.fname && <p>{errors.fname}</p>}
                                {errors.lname && <p>{errors.lname}</p>}
                                {errors.username && <p>{errors.username}</p>}
                                {errors.phone && <p>{errors.phone}</p>}
                                {errors.email && <p>{errors.email}</p>}
                                {errors.password && <p>{errors.password}</p>}
                                {errors.cpassword && <p>{errors.cpassword}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;