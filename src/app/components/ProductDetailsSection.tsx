"use client";

import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n"; // Import i18n

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
  const { t } = useTranslation(); // ใช้ useTranslation
  const totalPrice = (price + shippingFee);

  return (
    <div className="w-full h-full bg-[#202133] border border-[#202133] rounded-xl p-8">
      <div className="w-full h-full grid sm:grid-rows-1 sm:grid-cols-2 gap-5 grid-rows-2 grid-cols-1">
        <img
          className="w-full h-full rounded-2xl object-cover"
          src={imageUrl}
          alt={t("product.imageAlt")} // ใช้การแปล
        />
        
        <div className="flex flex-col w-full justify-between">
          <div className="flex flex-col gap-7">
            <h2 className="text-2xl font-semibold">{t("product.details")}</h2> {/* ใช้การแปล */}
            <p className="text-[14px] font-medium">{t("product.size")} : {t(`product.sizeOptions.${size}`, size)}</p>
            <p className="text-[14px] font-medium">{t("product.material")} : {t(`product.materialOptions.${material}`, material)}</p>
            <p className="text-[14px] font-medium">{t("product.painting")} : {t(`product.paintingOptions.${painting}`, painting)}</p>
            <p className="text-[14px] font-medium">{t("product.assembly")} : {t(`product.assemblyOptions.${assembly}`, assembly)}</p>
            <p className="text-[14px] font-medium">{t("product.quantity")} : {quantity}</p>
          </div>
          <hr className="border-t border-[#828399] my-4" />

          <div className="space-y-5">
            <div className="flex justify-between">
              <h2 className="text-[14px] font-medium">{t("product.price")}</h2>
              <p className="text-[14px] font-medium">{price.toLocaleString()} ฿</p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-[14px] font-medium">{t("product.shippingFee")}</h2>
              <p className="text-[14px] font-medium">{shippingFee} ฿</p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-[16px] font-semibold">{t("product.totalPrice")}</h2>
              <p className="text-[16px] font-semibold">{totalPrice.toLocaleString()} ฿</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;
