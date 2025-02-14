import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
    return (
        <div>
            <Navbar />
            <div className='w-full place-content-center place-items-center h-[235px] mt-[75px] bg-black'>
                <h1 className='text-4xl font-semibold mb-3'>My Profile</h1>
            </div>
            <div className='w-full place-items-center'>
                <div className='w-full  max-w-[1024px] min-h-[1500px] px-4 py-20 flex flex-col gap-12'>

                    <section className='flex justify-between'>
                        <div className='flex gap-5'>
                            <img className='w-[20%] object-contain' src='/Images/AINongtoy/Profile.png' alt="profile" />
                            <div className='w-[80%] place-content-center'>
                                <h1 className='text-xl font-semibold'>Cameron Williamson</h1>
                                <p className='text-xs text-[#BBBBBB]'>You have 200 models to follow</p>
                            </div>
                        </div>

                        <div className='place-aitems-end place-content-center'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3'>Edit Profile</button>
                        </div>
                    </section>

                    <section className='flex gap-10 font-semibold'>
                        <a className='text-[#0AACF0] underline' href="#">Favorite</a>
                        <a className='hover:text-[#0AACF0] transition-all' href="#">Art Toy Config</a>
                        <a className='hover:text-[#0AACF0] transition-all' href="#">Order</a>
                    </section>

                    <section className='favorite_img gap-4'>
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                        <img className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                    </section>

                    <section className='place-content-center place-items-center'>

                        <div className='flex gap-3'>
                            <button className='border border-background bg-background hover:bg-background hover:border hover:border-white place-content-center place-items-center p-2'>
                                <img className='w-[11px] h-[11px] object-contain' src="/Images/AINongtoy/ArrowLeft.png" alt="" />
                                <p className='hidden'>a</p>
                            </button>
                            <button className='border border-background bg-background hover:bg-background hover:border hover:border-white'>1</button>
                            <button className='border border-background bg-background hover:bg-background hover:border hover:border-white'>2</button>
                            <button className='border border-background bg-background hover:bg-background hover:border hover:border-white'>3</button>
                            <button className='border border-background bg-background hover:bg-background hover:border hover:border-white'>4</button>
                            <button className='border border-background bg-background hover:bg-background hover:border hover:border-white'>5</button>
                            <button className='border border-background bg-background hover:bg-background hover:border hover:border-white place-content-center place-items-center p-2'>
                                <img className='w-[11px] h-[11px] object-contain' src="/Images/AINongtoy/ArrowRight.png" alt="" />
                                <p className='hidden'>a</p>
                            </button>


                        </div>

                    </section>


                </div>

            </div>
            <Footer />
        </div>
    )
}