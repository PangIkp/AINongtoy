import React from 'react';

const OrderSummary = () => {
    return (
        <section className="bg-[#202133] border border-[#202133] rounded-xl">
            <div className='flex justify-between border-b border-white p-10 '>
                <div className='flex gap-7 '>
                    <img className='w-[20%] object-contain rounded-lg' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
                    <div className='flex flex-col justify-center gap-2'>
                        <p className='font-semibold'>White Miku</p>
                        <p className='text-sm text-[#B3B0B0]'>Box Set</p>
                        <p className='text-sm text-[#B3B0B0]'>Quantity: 2</p>
                        <p className='text-xl font-semibold'>3,800 ฿</p>
                    </div>
                </div>
                <div className=' text-[#B3FFB2]'>
                    <p>Delivered</p>
                </div>
            </div>

            <div className='flex h-1/2 justify-between p-10 '>
                <div className='leading-[2rem]'>
                    <p>Subtotal</p>
                    <p>Shipping</p>
                    <p>Total price</p>
                </div>

                <div className='leading-[2rem] text-right'>
                    <p>7,600 ฿</p>
                    <p>50 ฿</p>
                    <p>7,650 ฿</p>
                </div>
            </div>
        </section>
    );
};

export default OrderSummary;