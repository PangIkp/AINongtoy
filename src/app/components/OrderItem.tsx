import React from 'react';

interface OrderItemProps {
    imageUrl: string;
    title: string;
    description: string;
    quantity: number;
    price: string;
    status: string;
}

const OrderItem: React.FC<OrderItemProps> = ({ imageUrl, title, description, quantity, price, status }) => {
    return (
        <div className='flex justify-between p-7 bg-[#202133] border border-[#202133] rounded-xl'>
            <div className='flex gap-7'>
                <img className='w-[20%] h-full object-contain rounded-lg' src={imageUrl} alt={title} />
                <div className='flex flex-col justify-center gap-2'>
                    <p className='font-semibold'>{title}</p>
                    <p className='text-sm text-[#B3B0B0]'>{description}</p>
                    <p className='text-sm text-[#B3B0B0]'>Quantity: {quantity}</p>
                    <p className='text-xl font-semibold'>{price}</p>
                </div>
            </div>
            <div className='text-[#B3FFB2]'>
                <p>{status}</p>
            </div>
        </div>
    );
};

export default OrderItem;