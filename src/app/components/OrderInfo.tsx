import React from 'react';

const OrderInfo = () => {
    return (
        <section className='bg-[#202133] border border-[#202133] rounded-xl'>
            <div>
                <h1 className='text-lg font-semibold px-10 py-5 border-b border-white'>Order Number : OR90123456</h1>
            </div>
            <div className='flex justify-between p-10 '>
                <div className='leading-[2rem]'>
                    <p>Payment Method</p>
                    <p>Order Placed Time</p>
                    <p>Shipping Time</p>
                    <p>Delivered Time</p>
                </div>
                <div className='leading-[2rem] text-right'>
                    <p>Mobile Banking</p>
                    <div className='flex gap-3 '>
                        <div className='text-right'>
                            <p>2025-01-29</p>
                            <p>2025-01-30</p>
                            <p>2025-02-02</p>
                        </div>
                        <div className='text-left'>
                            <p>10:30</p>
                            <p>2:00</p>
                            <p>3:15</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderInfo;