import React from 'react';

const ShippingOptionSection: React.FC = () => {
    return (
        <div className='bg-[#202133] border border-[#202133] rounded-xl p-2'>
            <h2 className='mb-1'>Shipping Option</h2>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center border border-[#828399] rounded-lg gap-2 px-2 py-4 hover:bg-[#0578AB]'>
                    <div>
                        <input type="radio" name='shipping' value='standard' id='standard' />
                    </div>
                    <label className='w-full text-xs flex justify-between' htmlFor="standard">
                        <p>Standard Delivery (Delivery time 3 - 7 days)</p>
                        <p>50 ฿</p>
                    </label>
                </div>
                <div className='flex items-center border border-[#828399] rounded-lg gap-2 px-2 py-4 hover:bg-[#0578AB]'>
                    <div>
                        <input type="radio" name='shipping' value='ems' id='ems' />
                    </div>
                    <label className='w-full text-xs flex justify-between' htmlFor="ems">
                        <p>EMS Delivery ( Delivery time 1 - 2 days )</p>
                        <p>70 ฿</p>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ShippingOptionSection;