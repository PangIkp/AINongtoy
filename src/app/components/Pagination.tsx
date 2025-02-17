import React from 'react';

const Pagination = () => {
    return (
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
    );
};

export default Pagination;