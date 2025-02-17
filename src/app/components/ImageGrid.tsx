import React from 'react';

interface ImageGridProps {
    maxRows?: string;
}

const ImageGrid: React.FC<ImageGridProps> = ({ maxRows }) => {
    return (
        <section className={`grid gap-4 ${maxRows} overflow-hidden`}>
            {Array.from({ length: 30 }).map((_, index) => (
                <img key={index} className='w-full h-60 object-scale-down' src="/Images/AINongtoy/WhiteMiku.png" alt="" />
            ))}
        </section>
    );
};

export default ImageGrid;