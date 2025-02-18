import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function OrderDetail() {
    return (
        <div>
            <Navbar />
            <div className="w-full h-[90vh] mt-[5rem] place-items-center border border-white">
                <div className="max-w-[1024px] w-full h-full border border-white pt-24">
                    <div className="border border-white">
                        <h1 className='text-4xl font-semibold '>Order Details</h1>
                    </div>
                    <div className="border border-white mt-12">
                        <div className='flex justify-between border-b border-white p-10 '>
                            <div className='flex gap-5 border border-white'>
                                <img className='w-[20%] object-contain rounded-' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                                <div className='flex flex-col justify-center gap-2'>
                                    <p className='font-semibold'>White Miku</p>
                                    <p className='text-sm text-[#B3B0B0]'>Box Set</p>
                                    <p className='text-sm text-[#B3B0B0]'>Quantity: 2</p>
                                    <p className='text-xl font-semibold'>3,800 ฿</p>
                                </div>
                            </div>
                            <div className='border border-white text-[#B3FFB2]'>
                                <p>Delivered</p>
                            </div>
                        </div>

                        <div className='flex h-1/2 justify-between border border-red-600 p-10 '>
                            <div className='leading-[2rem]'>
                                <p>Subtotal</p>
                                <p>Shipping</p>
                                <p>Total price</p>
                            </div>

                            <div className='leading-[2rem]'>
                                <p>7,600 ฿</p>
                                <p>50 ฿</p>
                                <p>7,650 ฿</p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}