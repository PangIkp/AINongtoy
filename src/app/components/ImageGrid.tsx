import React from 'react';

const ImageGrid = () => {
    return (
        <section className='grid_img max-h-[calc(4*15rem+3*1rem)]'>
            {Array.from({ length: 30 }).map((_, index) => (
                <img key={index} className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
            ))}
        </section>
    );
};

export default ImageGrid;