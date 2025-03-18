import React from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl: string;
  status: string;
}

interface OrderItemListProps {
  orders: OrderItem[];
}

const statusColors: { [key: string]: string } = {
  Pending: "text-yellow-400",
  Processing: "text-blue-400",
  Shipped: "text-purple-400",
  Delivered: "text-green-400",
};

const OrderItemList: React.FC<OrderItemListProps> = ({ orders }) => {
  const router = useRouter();

  const handleClick = (order: OrderItem) => {
    localStorage.setItem("selectedOrder", JSON.stringify(order)); // ✅ เก็บข้อมูลใน Local Storage
    router.push("/order_detail"); // ✅ ไปที่หน้า order_detail โดยไม่ต้องมี id
  };

  return (
    <div className="flex flex-col gap-4">
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div
            key={index}
            className="w-full h-full flex justify-between p-7 bg-[#202133] border border-[#202133] rounded-xl cursor-pointer hover:bg-[#292a40] transition-all"
            onClick={() => handleClick(order)}
          >
            <div className="w-full h-full flex gap-7">
              <img className="min-w-32 w-[15%] object-contain rounded-lg" src={order.imageUrl} alt={order.name} />
              <div className="flex flex-col justify-center gap-2">
                <p className="font-semibold text-white">{order.name}</p>
                <p className="text-sm text-[#B3B0B0]">Size: {order.size}</p>
                <p className="text-sm text-[#B3B0B0]">Quantity: {order.quantity}</p>
                <p className="text-sm font-semibold text-white">{order.price.toLocaleString()} ฿</p>
              </div>
            </div>
            <div className={`${statusColors[order.status] || "text-white"}`}>
              <p className="text-[13px] font-medium mt-3">{order.status}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white text-center">No orders found.</p>
      )}
    </div>
  );
};

export default OrderItemList;
