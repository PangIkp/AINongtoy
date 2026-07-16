/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Loader,
  MapPinned,
  Package2,
  Phone,
  ReceiptText,
  Sparkles,
  Truck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getOrderById } from "@/api/orderAPI";
import { useTranslation } from "react-i18next";
import "../../i18n";

function OrderDetailContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [phoneNumber, setPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadOrderDetail = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userObject = JSON.parse(storedUser);
          setPhone(userObject.phoneNumber || null);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      const orderId = searchParams.get("id");
      const token = localStorage.getItem("token");

      try {
        if (orderId && token) {
          const detail = await getOrderById(orderId, token);
          setOrderDetail(detail?.data ?? detail);
          return;
        }

        const storedOrder = localStorage.getItem("selectedOrder");
        if (storedOrder) {
          setOrderDetail(JSON.parse(storedOrder));
        }
      } catch (error) {
        console.error("Error loading order detail:", error);

        const storedOrder = localStorage.getItem("selectedOrder");
        if (storedOrder) {
          setOrderDetail(JSON.parse(storedOrder));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetail();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(28,44,92,0.82),rgba(7,13,31,1)_42%,rgba(5,8,22,1)_100%)]">
        <Loader className="animate-spin text-[#0CACF3]" size={50} />
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(28,44,92,0.82),rgba(7,13,31,1)_42%,rgba(5,8,22,1)_100%)] px-4 text-center text-white">
        <div className="rounded-[28px] border border-white/10 bg-white/5 px-8 py-10">
          <p className="text-2xl font-semibold">{t("order.noOrders")}</p>
        </div>
      </div>
    );
  }

  const subtotal = Number(orderDetail?.price ?? 0);
  const shipping = Number(orderDetail?.shipping ?? 0);
  const total = Number(orderDetail?.total ?? subtotal + shipping);
  const createdAt = orderDetail?.createdAt ? new Date(orderDetail.createdAt) : null;
  const fallbackOrderId = orderDetail?._id ? String(orderDetail._id).slice(-8).toUpperCase() : "OR90123456";
  const orderNumber = `OR${fallbackOrderId}`;
  const trackingNumber = orderDetail?.trackingNumber || "TH123456789XYZ";

  const parsedAddress = (() => {
    if (!orderDetail?.address) {
      return null;
    }

    try {
      return JSON.parse(orderDetail.address);
    } catch (error) {
      return null;
    }
  })();

  const formatDate = (date: Date | null) => {
    if (!date || Number.isNaN(date.getTime())) {
      return "-";
    }

    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/\//g, "-")
      .replace(",", "");
  };

  const statusStyles: { [key: string]: string } = {
    Pending: "border-yellow-400/25 bg-yellow-400/12 text-yellow-300",
    Processing: "border-sky-400/25 bg-sky-400/12 text-sky-300",
    Shipped: "border-violet-400/25 bg-violet-400/12 text-violet-300",
    Delivered: "border-emerald-400/25 bg-emerald-400/12 text-emerald-300",
  };

  const detailStats = [
    {
      label: t("order.quantity"),
      value: orderDetail?.quantity ?? 1,
      icon: Package2,
    },
    {
      label: t("order.totalPrice"),
      value: `${total.toLocaleString()} ฿`,
      icon: ReceiptText,
    },
    {
      label: t("order.status.title", "Status"),
      value: String(t(`order.status.${orderDetail.status}`, orderDetail.status)),
      icon: BadgeCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(28,44,92,0.82),rgba(7,13,31,1)_42%,rgba(5,8,22,1)_100%)] text-white">
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

      <section className="border-b border-white/10 pt-24">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
            <Sparkles size={14} />
            Order Overview
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {t("orderDetail.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                Review product details, payment summary, shipping destination, and fulfillment progress for this order in one place.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {detailStats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                      <Icon size={18} className="text-[#76e3ff]" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{value}</p>
                      <p className="text-xs text-white/60">{label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <section className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              href="/order"
            >
              Back To Orders
            </Link>
          </section>

          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
            <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r lg:p-8">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#091224]">
                  <img
                    className="aspect-square w-full object-cover"
                    alt={t("orderDetail.artToyImageAlt")}
                    src={orderDetail.imageUrl}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6 p-6 lg:p-8">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                      {orderNumber}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">
                      {orderDetail.name === "Unnamed Art Toy"
                        ? t(`artToy.names.${orderDetail.name}`, "Unnamed Art Toy")
                        : orderDetail.name}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#aebddb]">
                      Configure, confirm, and follow each collectible through checkout, shipping, and final delivery.
                    </p>
                  </div>
                  <div
                    className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${
                      statusStyles[orderDetail.status] || "border-white/10 bg-white/5 text-white"
                    }`}
                  >
                    {String(t(`order.status.${orderDetail.status}`, orderDetail.status))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("order.size")}</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {String(t(`artToy.sizeOptions.${orderDetail.size}`, orderDetail.size))}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("order.quantity")}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{orderDetail.quantity}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("order.paymentMethod.title")}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{t("order.paymentMethod.mobileBanking")}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("orderDetail.trackingNumber")}</p>
                    <p className="mt-2 break-all text-lg font-semibold text-white">{trackingNumber}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0b1734] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7ee7ff]">{t("order.subtotal")}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{subtotal.toLocaleString()} ฿</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0b1734] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7ee7ff]">{t("order.shipping")}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{shipping.toLocaleString()} ฿</p>
                  </div>
                  <div className="rounded-2xl border border-[#0AACF0]/30 bg-[linear-gradient(180deg,rgba(12,172,243,0.16),rgba(11,23,52,0.95))] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#9defff]">{t("order.totalPrice")}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{total.toLocaleString()} ฿</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
            <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
              <div className="border-b border-white/10 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                    <CalendarDays size={18} className="text-[#76e3ff]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                      Fulfillment Timeline
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{t("orderDetail.orderNumber")}</h2>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">{t("order.orderPlacedTime")}</p>
                  <p className="mt-2 text-base font-semibold text-white">{formatDate(createdAt)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">{t("order.shippingTime")}</p>
                  <p className="mt-2 text-base font-semibold text-white">-</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">{t("order.deliveredTime")}</p>
                  <p className="mt-2 text-base font-semibold text-white">-</p>
                </div>
              </div>
            </section>

            <section className="grid gap-8">
              <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                <div className="border-b border-white/10 px-6 py-6 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                      <CreditCard size={18} className="text-[#76e3ff]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                        Payment Summary
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{t("order.paymentMethod.title")}</h2>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/60">{t("order.paymentMethod.title")}</p>
                    <p className="mt-2 text-base font-semibold text-white">{t("order.paymentMethod.mobileBanking")}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/60">{t("orderDetail.orderNumber")}</p>
                    <p className="mt-2 text-base font-semibold text-white">{orderNumber}</p>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                <div className="border-b border-white/10 px-6 py-6 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                      <Truck size={18} className="text-[#76e3ff]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                        Shipping Details
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{t("order.address")}</h2>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-6 py-6 sm:px-8 sm:py-8">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                        <MapPinned size={16} className="text-[#76e3ff]" />
                      </div>
                      <div>
                        <p className="text-sm text-white/60">{t("order.address")}</p>
                        <p className="mt-2 text-sm leading-7 text-white/85">
                          {parsedAddress
                            ? `${parsedAddress.detail}, ${parsedAddress.subdistrict}, ${parsedAddress.district}, ${parsedAddress.province}, ${parsedAddress.postalCode}`
                            : orderDetail.address || t("orderDetail.noAddressProvided")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                        <Phone size={16} className="text-[#76e3ff]" />
                      </div>
                      <div>
                        <p className="text-sm text-white/60">{t("order.phoneNumber")}</p>
                        <p className="mt-2 text-sm leading-7 text-white/85">
                          {phoneNumber || t("orderDetail.noPhoneNumberProvided")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(28,44,92,0.82),rgba(7,13,31,1)_42%,rgba(5,8,22,1)_100%)]">
          <Loader className="animate-spin text-[#0CACF3]" size={50} />
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
