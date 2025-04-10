/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="h-auto px-4 sm:px-28 py-20">
      <p className="text-[#0AACF0] font-semibold mb-4">{t("aboutUs.title")}</p>
      <div className="flex flex-col lg:flex-row justify-between mt-6 gap-10">
        <div className="w-full lg:w-2/3 space-y-2">
          <p className="text-[30px] sm:text-[40px] md:text-[45px] font-semibold">
            {t("aboutUs.whatIsNongToy")}
          </p>

          <p>{t("aboutUs.description")}</p>
        </div>

        <div className="flex justify-center lg:justify-end w-full lg:w-2/3">
          <img src="/Images/AINongtoy/Aboutus.png" alt="contact" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}