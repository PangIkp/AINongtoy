import React from 'react'

export default function Footer() {
    return (
        <div className='absolute inset-x-0 bottom-0 border border-gray-200 w-screen' >
            <section className='flex justify-around my-16'>
                <div className='w-1/3 leading-[60px] '>
                    <a href="">
                        <img src="/public/Map.png" alt="logo" />
                    </a>
                    <p>21 Ladprao Street Bangkok, Thailand</p>
                    <p>090-846-6758</p>
                    <p>NongToy@gmail.com</p>
                </div>

                <div className='w-1/3 leading-10'>
                    <p className='font-bold'>About the company</p>
                    <p>We use AI to revolutionize Art Toy design, making 3D modeling easier and faster. Our system supports real-world production, turning your ideas into tangible creations. Transform your imagination into reality with cutting-edge technology!</p>

                </div>
            </section>

            <div className='bg-[#20255E] text-white  w-full h-[52px] flex justify-center items-center'>
                <p>© 2025 NongToy. All rights reserved.</p>
            </div>
        </div>
    )
}