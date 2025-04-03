import React from "react";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/api/orderAPI";

interface OrderItem {
  _id: string; // ✅ เพิ่ม id
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

  const handleClick = async (id: string) => {
    console.log("Fetching Order ID:", id);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const orderDetail = await getOrderById(id, token);
      console.log("Order Detail:", orderDetail);

      localStorage.setItem("selectedOrder", JSON.stringify(orderDetail));
      router.push("/order_detail");
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {orders.length > 0 ? (
        orders.map((order, index) => {
          console.log("Order ID:", order._id); // Debugging

          return (
            <div
              key={order._id ?? `order-${index}`} // ใช้ index เป็น fallback ถ้า id ไม่มี
              className="w-full h-full flex justify-between p-7 bg-[#202133] border border-[#202133] rounded-xl cursor-pointer hover:bg-[#292a40] transition-all"
              onClick={() => handleClick(order._id)}
            >
              <div className="w-full h-full flex gap-7">
                <img
                  className="min-w-32 w-[15%] object-contain rounded-lg"
                  src={order.imageUrl}
                  alt={order.name}
                />
                <div className="flex flex-col justify-between w-full ">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="font-semibold text-white">{order.name}</p>
                    <div className={`${statusColors[order.status] || "text-white"}`}>
                      <p className="text-[13px] font-medium">{order.status}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#B3B0B0]">Size: {order.size}</p>
                  <p className="text-sm text-[#B3B0B0]">
                    Quantity: {order.quantity}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {order.price.toLocaleString()} ฿
                  </p>
                </div>
              </div>

            </div>
          );
        })
      ) : (
        <p className="text-white text-center">No orders found.</p>
      )}
    </div>
  );
};

export default OrderItemList;
