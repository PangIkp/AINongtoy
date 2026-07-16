"use client";

import React, { useRef, useState } from "react";
import { CreditCard, ScanLine, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import promptpay from "promptpay-qr";
import ReactQRCode from "react-qr-code";

interface QRCodeSectionProps {
  setPaymentImage: React.Dispatch<React.SetStateAction<string | null>>;
  totalPrice: number;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ setPaymentImage, totalPrice }) => {
  const { t } = useTranslation();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);
        setPaymentImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setPaymentImage(null);
  };

  const payload = promptpay("0909528383", { amount: totalPrice });

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
      <div className="border-b border-white/10 px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
            <CreditCard size={18} className="text-[#76e3ff]" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
              Payment Proof
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{t("qrCode.scan")}</h2>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="flex h-full min-w-0 flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/5 p-6 text-center">
            <div className="mb-5 w-full max-w-[248px] rounded-2xl border border-white/10 bg-white p-4">
              <ReactQRCode value={payload} size={200} style={{ width: "100%", height: "auto" }} />
            </div>
            <div className="flex items-center gap-2 text-[#9defff]">
              <ScanLine size={16} />
              <p className="text-sm font-medium">{t("qrCode.scan")}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/70">
              {t("qrCode.account")} : {t("qrCode.accname")}
            </p>
            <p className="mt-2 text-xl font-semibold text-white">{totalPrice.toLocaleString()} ฿</p>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2 text-[#9defff]">
                <Upload size={16} />
                <p className="text-sm font-medium">{t("qrCode.upload")}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Upload your transfer slip to complete order confirmation.
              </p>
            </div>

            {!uploadedImage ? (
              <button
                type="button"
                className="flex min-h-[280px] w-full flex-1 items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-[#0b1328] text-sm font-medium text-white/70 transition hover:border-[#0AACF0]/35 hover:bg-[#0e1831] hover:text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("qrCode.uploadFile")}
              </button>
            ) : (
              <div className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1328]">
                <img
                  className="h-full w-full object-contain"
                  src={uploadedImage}
                  alt={t("qrCode.uploaded")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-full border border-red-400/20 bg-red-500/85 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-500"
                  onClick={handleDeleteImage}
                >
                  Remove
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              name="qrCode"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRCodeSection;
