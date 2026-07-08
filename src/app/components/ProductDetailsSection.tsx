"use client";

import React from "react";
import { Boxes, Palette, ReceiptText, Ruler, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface ProductDetailsProps {
  imageUrl: string;
  size: string;
  material: string;
  painting: string;
  assembly: string;
  quantity: number;
  price: number;
  shippingFee: number;
  totalPrice: number;
}

const ProductDetailsSection: React.FC<ProductDetailsProps> = ({
  imageUrl,
  size,
  material,
  painting,
  assembly,
  quantity,
  price,
  shippingFee,
}) => {
  const { t } = useTranslation();
  const totalPrice = price + shippingFee;

  const specs = [
    {
      label: t("product.size"),
      value: t(`product.sizeOptions.${size}`, size),
      icon: Ruler,
    },
    {
      label: t("product.material"),
      value: t(`product.materialOptions.${material}`, material),
      icon: Boxes,
    },
    {
      label: t("product.painting"),
      value: t(`product.paintingOptions.${painting}`, painting),
      icon: Palette,
    },
    {
      label: t("product.assembly"),
      value: t(`product.assemblyOptions.${assembly}`, assembly),
      icon: Wrench,
    },
  ];

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
      <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#091224]">
            <img
              className="aspect-square w-full object-cover"
              src={imageUrl}
              alt={t("product.imageAlt")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 lg:p-8">
          <div className="border-b border-white/10 pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
              Product Details
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{t("product.details")}</h2>
            <p className="mt-3 text-sm leading-7 text-[#aebddb]">
              Review the selected build setup before confirming shipping and payment proof.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {specs.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                    <Icon size={16} className="text-[#76e3ff]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</p>
                    <p className="mt-2 text-base font-semibold text-white">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("product.quantity")}</p>
              <p className="mt-2 text-lg font-semibold text-white">{quantity}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("product.price")}</p>
              <p className="mt-2 text-lg font-semibold text-white">{price.toLocaleString()} ฿</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("product.shippingFee")}</p>
              <p className="mt-2 text-lg font-semibold text-white">{shippingFee.toLocaleString()} ฿</p>
            </div>
            <div className="rounded-2xl border border-[#0AACF0]/30 bg-[linear-gradient(180deg,rgba(12,172,243,0.16),rgba(11,23,52,0.95))] p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-[#0AACF0]/20 bg-[#0b1d3d] p-2.5">
                  <ReceiptText size={16} className="text-[#9defff]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#9defff]">{t("product.totalPrice")}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{totalPrice.toLocaleString()} ฿</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsSection;
