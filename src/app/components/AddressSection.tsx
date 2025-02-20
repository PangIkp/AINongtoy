import React from 'react';

const AddressSection: React.FC = () => {
    return (
        <div className='bg-[#202133] border border-[#202133] rounded-xl p-2'>
            <h2 className='mb-1'>Address</h2>
            <button className='w-full py-2 bg-[#202133] border border-[#828399] rounded-lg place-items-start font-thin text-xs leading-5'>
                <p><strong>Mr.Aekkaphop Sreesunthorn</strong></p>
                <p className='text-left'>11/1 Sansuk Village, Soi Phatthana, Sawasdee Road, Sukjai, Jamsai, Bangkok 12345 Thailand</p>
                <p>0655759995</p>
            </button>
        </div>
    );
};

export default AddressSection;