"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CalendarDays, CreditCard, PackageCheck, Ruler } from "lucide-react";
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
  Pending: "text-yellow-200 bg-yellow-400/15 border-yellow-400/25",
  Processing: "text-sky-200 bg-sky-400/15 border-sky-400/25",
  Shipped: "text-violet-200 bg-violet-400/15 border-violet-400/25",
  Delivered: "text-emerald-200 bg-emerald-400/15 border-emerald-400/25",
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
          const totalPrice = Number(order.total ?? order.price ?? 0);
          const createdAt = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Recent";

          return (
            <div
              key={order._id ?? `order-${index}`} // ใช้ index เป็น fallback ถ้า id ไม่มี
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.94),rgba(11,18,40,0.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#5ed8ff]/30"
              onClick={() => handleClick(order)}
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#65ddff]/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="relative z-[1] flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex w-full gap-5">
                <img
                  className="h-[132px] w-[132px] min-w-[132px] rounded-[22px] object-cover"
                  src={order.imageUrl}
                  alt={order.name}
                />
                <div className="flex w-full flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#79e4ff]">
                        Order #{String(order._id).slice(-6).toUpperCase()}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                      {order.name === "Unnamed Art Toy" ? t(`artToy.names.${order.name}`, "Unnamed Art Toy") : order.name}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        statusColors[order.status] || "border-white/15 bg-white/5 text-white"
                      }`}
                    >
                      {t(`order.status.${order.status}`, order.status)}
                    </div>
                  </div>

                  <div className="grid gap-3 text-[13px] text-[#cad6ef] sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                      <div className="mb-2 flex items-center gap-2 text-white/60">
                        <Ruler size={14} />
                        <span>{t("order.size")}</span>
                      </div>
                      <p className="font-medium text-white">{t(`artToy.sizeOptions.${order.size}`, order.size)}</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                      <div className="mb-2 flex items-center gap-2 text-white/60">
                        <PackageCheck size={14} />
                        <span>{t("order.quantity")}</span>
                      </div>
                      <p className="font-medium text-white">{order.quantity}</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                      <div className="mb-2 flex items-center gap-2 text-white/60">
                        <CalendarDays size={14} />
                        <span>Placed</span>
                      </div>
                      <p className="font-medium text-white">{createdAt}</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                      <div className="mb-2 flex items-center gap-2 text-white/60">
                        <CreditCard size={14} />
                        <span>{t("order.totalPrice")}</span>
                      </div>
                      <p className="font-medium text-[#7ee7ff]">{totalPrice.toLocaleString()} ฿</p>
                    </div>
                  </div>
                </div>
              </div>

                <div className="flex items-center justify-end">
                  <div className="rounded-full border border-white/10 bg-white/5 p-3 text-white/70 transition group-hover:border-[#5ed8ff]/30 group-hover:text-[#7ee7ff]">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#0b1227]/55 px-6 text-center">
          <div className="rounded-[24px] border border-white/10 bg-[#0f1835] p-5">
            <PackageCheck size={28} className="text-[#78e4ff]" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-white">{t("order.noOrders")}</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#aebddb]">
            Once you complete a checkout, your production orders will appear here with status updates and quick access to details.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderItemList;
