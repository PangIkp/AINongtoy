"use client";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n"; // Import i18n
import promptpay from 'promptpay-qr';
import ReactQRCode from 'react-qr-code';

interface QRCodeSectionProps {
  setPaymentImage: React.Dispatch<React.SetStateAction<string | null>>;
  totalPrice: number;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ setPaymentImage, totalPrice }) => {
  const { t } = useTranslation(); // ใช้ useTranslation
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

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteImage = () => {
    setUploadedImage(null); // Clear the uploaded image state
    setPaymentImage(null); // Clear the payment image state
  };

  const payload = promptpay("0909528383", { amount: totalPrice });

  return (
    <section className="bg-[#202133] border border-[#202133] rounded-xl w-full flex flex-col gap-4 h-full sm:flex-row justify-center">
      <div className="flex flex-col gap-2 items-center p-4 w-full justify-center h-full">
        <p className="text-sm">{t("qrCode.scan")}</p>
        {/* <img className='w-[200px] h-[200px] object-fill rounded-xl' src="/Images/AINongtoy/Qr_code.png" alt={t("qrCode.alt")} /> */}

         <ReactQRCode
          value={payload}
          size={200}
        />

        <div className="flex gap-2 text-sm">
          <p>{t("qrCode.account")} :</p>
          <p>{t("qrCode.accname")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center p-4 w-full justify-center">
        <p className="text-sm">{t("qrCode.upload")}</p>
        {!uploadedImage && (
          <div className="flex justify-center items-center w-[200px] h-[200px] outline-2 outline-dashed rounded-xl">
            <label className="upload-btn text-sm">
              {t("qrCode.uploadFile")}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                name="qrCode"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
        {uploadedImage && (
          <div className="relative w-[200px] h-[200px] place-content-center place-items-center">
            <img
              className="w-full h-full object-fill rounded-xl cursor-pointer"
              src={uploadedImage}
              alt={t("qrCode.uploaded")}
              onClick={handleImageClick}
            />
            <button
              className="absolute py-1 top-2 right-2 text-white bg-red-500 text-sm font-medium"
              onClick={handleDeleteImage}
            >
              ✕
            </button>
            <label htmlFor="upload" className="hidden">
              a
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="upload"
              accept="image/*"
              name="qrCode"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
        <div className="flex gap-2 text-[#202133] text-sm">
          <p>{t("qrCode.account")} :</p>
          <p>{t("qrCode.accname")}</p>
        </div>
      </div>
    </section>
  );
};

export default QRCodeSection;
