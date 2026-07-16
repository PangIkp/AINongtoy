"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";
import {
  CalendarClock,
  CreditCard,
  MapPin,
  Package,
  Phone,
  User2,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface OrderModalProps {
  isVisible: boolean;
  order: any | null;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isVisible,
  order,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!order) return null;

  const parsedAddress = (() => {
    if (!order.address) return null;
    try {
      return typeof order.address === "string"
        ? JSON.parse(order.address)
        : order.address;
    } catch {
      return null;
    }
  })();

  const infoItems = [
    {
      label: t("orderModal.createdAt"),
      value: order.createdAt
        ? dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")
        : "-",
      icon: CalendarClock,
    },
    {
      label: t("orderModal.customer"),
      value: order.user ? `${order.user.firstName} ${order.user.lastName}` : "-",
      icon: User2,
    },
    {
      label: t("orderModal.phoneNumber"),
      value: order.user?.phoneNumber || "-",
      icon: Phone,
    },
    {
      label: t("orderModal.confirmation"),
      value: t(`orderModal.paymentStatus.${order.paymentStatus}`),
      icon: CreditCard,
    },
  ];

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={980}
      centered
      destroyOnClose
      closeIcon={
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
          <X size={18} />
        </span>
      }
      className="order-detail-modal"
      styles={{
        content: {
          padding: 0,
          overflow: "hidden",
          background:
            "linear-gradient(155deg, rgba(10,21,46,0.98), rgba(5,10,22,0.96))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 120px rgba(0,0,0,0.45)",
        },
        body: { padding: 0 },
        header: { display: "none" },
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,223,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_28%)]" />

        <div className="relative border-b border-white/10 px-6 pb-6 pt-7 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
            <Package size={14} />
            {t("orderModal.title")}
          </div>

          <div className="mt-5">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                {order.name === "Unnamed Art Toy"
                  ? t("orderModal.unnamedArtToy")
                  : order.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#aebddb]">
                {t("orderModal.description")}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                  {t("orderModal.orderId")}: {order._id}
                </span>
                <span className="inline-flex items-center rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-3 py-1.5 text-xs font-medium text-[#88ebff]">
                  {t(`orderModal.statuss.${order.status}`)}
                </span>
                <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                  {t(`orderModal.paymentStatus.${order.paymentStatus}`)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {infoItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[22px] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1733] p-3 text-[#88ebff]">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      {label}
                    </p>
                    <p className="mt-2 break-words text-sm font-medium text-white">
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
            <section className="rounded-[24px] border border-white/10 bg-[#091224]/88 p-5">
              <h3 className="text-base font-semibold text-white">
                {t("orderModal.product_section")}
              </h3>
              <p className="mt-1 text-sm text-white/55">
                {t("orderModal.product_section_description")}
              </p>

              <div className="mt-5 grid gap-4">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={order.imageUrl}
                    alt="Art Toy"
                    className="h-auto w-full object-cover"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {t("orderModal.size")}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {t(`orderModal.sizeOptions.${order.size}`)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {t("orderModal.material")}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {t(`orderModal.materialOptions.${order.material}`)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {t("orderModal.painting")}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {t(`orderModal.paintingOptions.${order.painting}`)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {t("orderModal.assembly")}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {t(`orderModal.assemblyOptions.${order.assembly}`)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[#091224]/88 p-5">
              <h3 className="text-base font-semibold text-white">
                {t("orderModal.payment_shipping_section")}
              </h3>
              <p className="mt-1 text-sm text-white/55">
                {t("orderModal.payment_shipping_description")}
              </p>

              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {t("orderModal.price")}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {Number(order.price ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {t("orderModal.shipping")}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {order.shipping}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {t("orderModal.quantity")}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {order.quantity}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {t("orderModal.total")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {Number(order.total ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-white/10 bg-[#0d1733] p-3 text-[#88ebff]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                        {t("orderModal.address")}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/80">
                        {parsedAddress
                          ? `${parsedAddress.subdistrict}, ${parsedAddress.district}, ${parsedAddress.province}, ${parsedAddress.postalCode}, ${parsedAddress.detail}`
                          : t("orderModal.noAddress")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {t("orderModal.paymentImage")}
                  </p>
                  {order.payment ? (
                    <img
                      src={order.payment}
                      alt="Payment"
                      className="mt-3 h-44 w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <p className="mt-3 text-sm text-white/50">
                      {t("orderModal.noPaymentImage")}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
