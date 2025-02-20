import React from 'react';

// กำหนดโครงสร้างของข้อมูลที่ใช้ในคอมโพเนนต์ OrderItem
interface OrderItemProps {
    imageUrl: string;
    title: string;
    description: string;
    quantity: number;
    price: string;
    status: string;
}

// กำหนดโครงสร้างของข้อมูลที่ใช้ในคอมโพเนนต์ OrderItemGrid
interface OrderItemGridProps {
    items: OrderItemProps[];
}

// คอมโพเนนต์ OrderItem สำหรับแสดงข้อมูลของสินค้าแต่ละรายการ
const OrderItem: React.FC<OrderItemProps> = ({ imageUrl, title, description, quantity, price, status }) => {
    return (
        <div className='w-full h-full flex justify-between p-7 bg-[#202133] border border-[#202133] rounded-xl'>
            <div className='w-full h-full flex gap-7'>
                {/* แสดงรูปภาพของสินค้า */}
                <img className='min-w-32 w-[15%] object-contain rounded-lg' src={imageUrl} alt={title} />
                <div className='flex flex-col justify-center gap-2'>
                    {/* แสดงชื่อสินค้า */}
                    <p className='font-semibold'>{title}</p>
                    {/* แสดงคำอธิบายสินค้า */}
                    <p className='text-sm text-[#B3B0B0]'>{description}</p>
                    {/* แสดงจำนวนสินค้า */}
                    <p className='text-sm text-[#B3B0B0]'>Quantity: {quantity}</p>
                    {/* แสดงราคาสินค้า */}
                    <p className='text-xl font-semibold'>{price}</p>
                </div>
            </div>
            {/* แสดงสถานะของสินค้า */}
            <div className='text-[#B3FFB2]'>
                <p>{status}</p>
            </div>
        </div>
    );
};

// คอมโพเนนต์ OrderItemGrid สำหรับแสดงรายการสินค้าทั้งหมด
const OrderItemGrid: React.FC<OrderItemGridProps> = ({ items }) => {
    return (
        <section className='flex flex-col gap-5 min-h-[calc(5*14rem+4*1.1rem)]'>
            {/* วนลูปแสดง OrderItem สำหรับแต่ละรายการในอาร์เรย์ items */}
            {items.map((item, index) => (
                <OrderItem key={index} {...item} />
            ))}
        </section>
    );
};

// ส่งออกคอมโพเนนต์ OrderItemGrid เพื่อให้สามารถนำไปใช้ในส่วนอื่นของแอปพลิเคชันได้
export default OrderItemGrid;