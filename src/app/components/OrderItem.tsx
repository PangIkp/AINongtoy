"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n"; // Import i18n

interface OrderItem {
  _id: string; // ✅ เพิ่ม id
  name: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl: string;
  status: string;
  shipping?: number;
  total?: number;
  address?: string;
  createdAt?: string;
  paymentStatus?: string;
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
  const { t } = useTranslation(); // ใช้ useTranslation

  const handleClick = (order: OrderItem) => {
    router.push(`/order_detail?id=${encodeURIComponent(order._id)}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {orders.length > 0 ? (
        orders.map((order, index) => {

          return (
            <div
              key={order._id ?? `order-${index}`} // ใช้ index เป็น fallback ถ้า id ไม่มี
              className="w-full h-full flex justify-between p-7 bg-[#202133] border border-[#202133] rounded-xl cursor-pointer hover:bg-[#292a40] transition-all"
              onClick={() => handleClick(order)}
            >
              <div className="w-full h-full flex gap-7">
                <img
                  className="min-w-32 w-[15%] object-contain rounded-lg"
                  src={order.imageUrl}
                  alt={order.name}
                />
                <div className="flex flex-col justify-between w-full ">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="font-semibold text-white">
                      {order.name === "Unnamed Art Toy" ? t(`artToy.names.${order.name}`, "Unnamed Art Toy") : order.name}
                    </p>
                    <div className={`${statusColors[order.status] || "text-white"}`}>
                      <p className="text-[13px] font-medium">{t(`order.status.${order.status}`, order.status)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#B3B0B0]">
                    {t("order.size")}: {t(`artToy.sizeOptions.${order.size}`, order.size)}
                  </p>
                  <p className="text-sm text-[#B3B0B0]">
                    {t("order.quantity")}: {order.quantity}
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
        <p className="text-gray-500 text-center">{t("order.noOrders")}</p>
      )}
    </div>
  );
};

export default OrderItemList;
