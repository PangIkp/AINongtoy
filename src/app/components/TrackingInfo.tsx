import React from 'react';

const TrackingInfo = () => {
    return (
        <section className='bg-[#202133] border border-[#202133] rounded-xl'>
            <div>
                <h1 className='text-lg font-semibold px-10 py-5 border-b border-white'>Tracking Number : TH123456789XYZ</h1>
            </div>

            <div className='p-10'>
                <p className='h-24 mb-4'>Address</p>

                <div className='leading-[3rem]'>
                    <p>Phone number</p>
                    <p>(+66) 080 786 8975</p>
                </div>
            </div>
        </section>
    );
};

export default TrackingInfo;