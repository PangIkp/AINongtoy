import React, { useEffect } from 'react';
import OrderItemGrid from './OrderItem';

interface OrderItemSectionProps {
    setTotalItems: (total: number) => void;
    currentPage: number;
    itemsPerPage: number;
}

const TOTAL_ITEMS = 6; // กำหนดค่าคงที่สำหรับจำนวนรายการทั้งหมด

const OrderItemSection: React.FC<OrderItemSectionProps> = ({ setTotalItems, currentPage, itemsPerPage }) => {
    const orderItems = Array.from({ length: TOTAL_ITEMS }).map((_, index) => ({
        imageUrl: "/Images/AINongtoy/WhiteMiku.png",
        title: `White Miku ${index + 1}`,
        description: "Box Set",
        quantity: 2,
        price: "3,800 ฿",
        status: "Delivered"
    }));

    useEffect(() => {
        setTotalItems(orderItems.length); // อัพเดทจำนวนรายการทั้งหมดเมื่อ component ถูก mount
    }, [orderItems.length, setTotalItems]);

    const startIndex = (currentPage - 1) * itemsPerPage; // คำนวณ index เริ่มต้นของรายการในหน้าปัจจุบัน
    const currentItems = orderItems.slice(startIndex, startIndex + itemsPerPage); // ตัดรายการตามหน้าปัจจุบัน

    return <OrderItemGrid items={currentItems} />; // แสดงรายการใน grid
};

export default OrderItemSection;