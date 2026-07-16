/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ArtToy } from "@/mainstore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import ProductDetailsSection from "../components/ProductDetailsSection";
import QRCodeSection from "../components/QRCodeSection";
import { getUserData } from "@/utils/localStorageUtils";
import { createOrder } from "@/api/orderAPI";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  CreditCard,
  Loader,
  MapPinned,
  Package2,
  ReceiptText,
  Sparkles,
  Truck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Payment() {
  const { t } = useTranslation();
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const [artToyData, setArtToyData] = useState<ArtToy | null>(null);
  const [shippingFee, setShippingCost] = useState(50);
  const [paymentImage, setPaymentImage] = useState<string | null>(null);
  const userData = getUserData();
  const fname = userData?.firstName;
  const lname = userData?.lastName;
  const phone = userData?.phoneNumber;
  const address = userData?.address || [];
  const totalPrice = (artToyData?.price || 0) + shippingFee;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddressSelect = (addr: any) => {
    setSelectedAddress(addr);
    setIsModalOpen(false);
  };

  const handleShippingChange = (cost: number) => {
    setShippingCost(cost);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelCheckout = () => {
    router.back();
  };

  const activeAddress = selectedAddress || address[0] || null;

  const shippingOptions = [
    {
      id: "standard",
      fee: 50,
      title: t("payment.standard"),
      detail: t("payment.standardDeliveryTime"),
    },
    {
      id: "ems",
      fee: 70,
      title: t("payment.ems"),
      detail: t("payment.emsDeliveryTime"),
    },
  ];

  const checkoutStats = useMemo(
    () => [
      {
        label: t("payment.address"),
        value: address.length,
        icon: MapPinned,
      },
      {
        label: t("payment.shippingOption"),
        value: `${shippingFee} ฿`,
        icon: Truck,
      },
      {
        label: t("order.totalPrice"),
        value: `${totalPrice.toLocaleString()} ฿`,
        icon: ReceiptText,
      },
    ],
    [address.length, shippingFee, t, totalPrice]
  );

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: t("payment.addressRequired"),
        text: t("payment.addressRequiredText"),
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const orderData = {
      name: artToyData?.name || t("order.unknownItem"),
      size: artToyData?.size || t("order.standard"),
      material: artToyData?.material || t("order.plastic"),
      painting: artToyData?.painting || t("order.noPainting"),
      assembly: artToyData?.assembly || t("order.preAssembled"),
      quantity: artToyData?.quantity || 1,
      price: artToyData?.price || 0,
      shipping: shippingFee || 50,
      total: (artToyData?.price || 0) * (artToyData?.quantity || 1) + shippingFee,
      address: activeAddress
        ? JSON.stringify({
            detail: activeAddress.detail,
            province: activeAddress.province,
            district: activeAddress.district,
            subdistrict: activeAddress.subdistrict,
            postalCode: activeAddress.postalCode,
          })
        : t("order.notProvided"),
      payment: paymentImage || t("order.noPaymentProof"),
      imageUrl: artToyData?.imageUrl || "default-image.jpg",
    };

    try {
      setLoading(true);
      await createOrder(token, orderData);

      Swal.fire({
        title: t("payment.orderConfirmed"),
        text: t("payment.orderSuccess"),
        icon: "success",
        confirmButtonText: t("payment.ok"),
      }).then(() => {
        setArtToyData(null);
        localStorage.removeItem("artToyData");
        router.push("/order");
      });
    } catch (error: any) {
      Swal.fire({
        title: t("payment.errorTitle"),
        text: error.response?.data?.message || t("payment.errorText"),
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("artToyData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (typeof parsedData === "object" && parsedData !== null) {
          setArtToyData(parsedData);
        } else {
          router.push("/profile");
        }
      } catch (error) {
        console.error("Error parsing artToyData from localStorage:", error);
        router.push("/profile");
      }
    } else {
      router.push("/profile");
    }
  }, [router]);

  useEffect(() => {
    if (artToyData) {
      localStorage.setItem("artToyData", JSON.stringify(artToyData));
    }
  }, [artToyData]);

  if (!artToyData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(28,44,92,0.82),rgba(7,13,31,1)_42%,rgba(5,8,22,1)_100%)]">
        <Loader className="animate-spin text-[#0CACF3]" size={50} />
      </div>
    );
  }

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
            Checkout Review
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {t("payment.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                {t("payment.reviewOrder")}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {checkoutStats.map(({ label, value, icon: Icon }) => (
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

      <main className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <section className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              href="/material"
            >
              Back To Configuration
            </Link>
          </section>

          <ProductDetailsSection
            {...artToyData}
            shippingFee={shippingFee}
            totalPrice={totalPrice}
          />

          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
            <section className="grid gap-8">
              <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                <div className="border-b border-white/10 px-6 py-6 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                      <MapPinned size={18} className="text-[#76e3ff]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                        Shipping Address
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{t("payment.address")}</h2>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  {activeAddress ? (
                    <button
                      type="button"
                      className="w-full rounded-[26px] border border-white/10 bg-white/5 p-5 text-left transition hover:border-[#0AACF0]/35 hover:bg-white/10"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <p className="text-lg font-semibold text-white">
                        {fname} {lname}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/75">
                        {activeAddress.detail} {activeAddress.subdistrict} {activeAddress.district} {activeAddress.province} {activeAddress.postalCode}
                      </p>
                      <p className="mt-3 text-sm text-white/70">{phone}</p>
                    </button>
                  ) : (
                    <Link
                      className="flex min-h-[128px] w-full items-center justify-center rounded-[26px] border border-dashed border-white/15 bg-white/5 px-6 text-center text-sm font-medium text-white/72 transition hover:border-[#0AACF0]/35 hover:bg-white/10 hover:text-white"
                      href="/editProfile"
                    >
                      {t("payment.addAddress")}
                    </Link>
                  )}
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
                        Delivery Method
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{t("payment.shippingOption")}</h2>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-6 py-6 sm:px-8 sm:py-8">
                  {shippingOptions.map((option) => {
                    const isActive = shippingFee === option.fee;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleShippingChange(option.fee)}
                        className={`flex items-center justify-between rounded-[24px] border p-5 text-left transition ${
                          isActive
                            ? "border-[#0AACF0]/40 bg-[rgba(12,172,243,0.14)]"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              isActive ? "border-[#72e4ff] bg-[#0CACF3]" : "border-white/25"
                            }`}
                          >
                            <div className="h-2.5 w-2.5 rounded-full bg-[#07111f]" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-white">{option.title}</p>
                            <p className="mt-1 text-sm text-white/65">{option.detail}</p>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-white">{option.fee} ฿</p>
                      </button>
                    );
                  })}
                </div>
              </section>
            </section>

            <section className="grid gap-8">
              <QRCodeSection
                setPaymentImage={setPaymentImage}
                totalPrice={totalPrice}
              />

              <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                <div className="border-b border-white/10 px-6 py-6 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                      <CreditCard size={18} className="text-[#76e3ff]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                        Final Confirmation
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{t("payment.confirm")}</h2>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 px-6 py-6 sm:px-8 sm:py-8">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("product.price")}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{(artToyData.price || 0).toLocaleString()} ฿</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("product.shippingFee")}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{shippingFee.toLocaleString()} ฿</p>
                    </div>
                    <div className="rounded-2xl border border-[#0AACF0]/30 bg-[linear-gradient(180deg,rgba(12,172,243,0.16),rgba(11,23,52,0.95))] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-[#9defff]">{t("product.totalPrice")}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{totalPrice.toLocaleString()} ฿</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                      type="button"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80 transition hover:bg-white/10 sm:w-1/2"
                      onClick={cancelCheckout}
                    >
                      {t("payment.cancel")}
                    </button>
                    <button
                      type="button"
                      className="h-12 w-full rounded-xl border border-[#0AACF0]/35 bg-[#0b1d3d] text-sm font-semibold text-[#89ebff] transition hover:bg-[#11305a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/2"
                      onClick={() => {
                        if (!activeAddress) {
                          Swal.fire({
                            title: t("payment.addressRequired"),
                            text: t("payment.addressRequiredText"),
                            icon: "warning",
                            confirmButtonText: t("payment.ok"),
                          });
                          return;
                        }

                        if (!paymentImage) {
                          Swal.fire({
                            title: t("payment.uploadRequired"),
                            text: t("payment.uploadRequiredText"),
                            icon: "warning",
                            confirmButtonText: t("payment.ok"),
                          });
                          return;
                        }

                        handleConfirmOrder();
                      }}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : t("payment.confirm")}
                    </button>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040814]/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.98),rgba(11,18,40,0.98))] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
                  Saved Addresses
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">{t("payment.selectAddress")}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 px-6 py-6 sm:px-8 sm:py-8">
              {address.map((addr: any, index: number) => (
                <button
                  key={index}
                  type="button"
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition hover:border-[#0AACF0]/35 hover:bg-white/10"
                  onClick={() => handleAddressSelect(addr)}
                >
                  <p className="text-lg font-semibold text-white">
                    {fname} {lname}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    {addr.detail} {addr.subdistrict} {addr.district} {addr.province} {addr.postalCode}
                  </p>
                  <p className="mt-3 text-sm text-white/70">{phone}</p>
                </button>
              ))}

              <Link
                className="flex h-12 items-center justify-center rounded-xl border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 text-sm font-semibold text-[#89ebff] transition hover:bg-[#11305a]"
                href="/editProfile"
              >
                {t("payment.editAddress")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
