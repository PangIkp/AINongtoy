import React from 'react'
import Image from 'next/image';

export default function Contact() {
    return (
        <div className='place-items-center h-[600px] my-20'>
            <div className='max-w-7xl w-full h-full flex gap-x-12'>
                <div className='w-1/2 h-full '>
                    <div className='w-full  h-full'>
                        <div className='w-full h-[30%] '>
                            <p className='text-[#0AACF0] mb-4'>CONTACT US</p>
                            <h1 className='text-6xl font-semibold'>We will get back to you asap!</h1>
                        </div>

                        <form action="" className='flex flex-col justify-between gap-4 w-full h-[70%]  pt-5'>
                            <div className='grid grid-cols-2 gap-4'>
                                <label htmlFor="">First Name
                                    <input className='block' type="text" />
                                </label>
                                <label htmlFor="">Last Name
                                    <input className='block' type="text" />
                                </label>
                            </div>

                            <label htmlFor="">Email
                                <input className='block' type="email" />
                            </label>
                            <label htmlFor="">Phone Number
                                <input className='block' type="tel" />
                            </label>

                            <button className='bg-[#0CACF3] text-white h-[50px] hover:bg-[#0578AB] font-bold px-2 rounded-md transition-all'>Submit</button>
                        </form>
                    </div>
                </div>

                <div className='w-1/2 h-full place-content-end place-items-center'>
                    <Image className='w-3/4 h-4/5' src="/Images/AINongtoy/Contact.png" alt="contact" width={500} height={500} />
                </div>
            </div>
        </div>
    )
}
