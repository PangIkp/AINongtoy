import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Image from 'next/image'

const Login = () => {
    return (
        <div>
            <Navbar />
            <div className="w-full h-[90vh]">
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
                    <div className="absolute max-w-[500px] w-full p-5 ">
                        <div>
                            <h1 className='text-4xl font-semibold mb-3'>Welcome back</h1>
                            <p className='font-extralight'>Please enter your details</p>
                        </div>
                        <div>
                            <form action="" className='flex flex-col justify-between gap-4 w-full h-[70%]  pt-5'>
                                <label className='hidden' htmlFor="username">Username</label>
                                <input className='block' type="text" id='username' placeholder='Username' />

                                <label className='hidden' htmlFor="password">Password</label>
                                <input className='block' type="password" id='password' placeholder='Password' />

                                <div className='flex justify-between'>
                                    <label htmlFor="remember" className='flex items-center gap-2 cursor-pointer'>
                                        <input className='scale-125 accent-black ' type="checkbox" id='remember' />
                                        Remember&nbsp;me
                                    </label>
                                    <a href="#" className='text-[#0AACF0]'>Forgot password ?</a>
                                </div>
                                <button className='h-[50px]'>Login</button>
                                <div className='flex justify-center'>
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