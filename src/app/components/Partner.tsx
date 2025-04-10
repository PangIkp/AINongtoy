/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Partner() {
  const { t } = useTranslation(); // ใช้ useTranslation

  return (
    <div className="bg-[#1B1D36] h-auto  py-20 sm:px-28 px-4">
      <p className="text-[#0AACF0] font-semibold mb-4">{t("partner.title")}</p>
      <p className="text-[30px] sm:text-[40px] md:text-[45px] font-semibold">
        {t("partner.companyName")}
      </p>

      <div className="flex flex-col lg:flex-row justify-between mt-6 gap-10">
        <div className="w-full lg:w-2/3 space-y-2">
          <p>{t("partner.description1")}</p>
          <p>{t("partner.description2")}</p>
          <p className="pb-10">{t("partner.description3")}</p>

          <a
            href="https://www.ktpthailand.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[#0AACF0] text-[14px] font-medium"
          >
            {t("partner.readMore")} {"->"}
          </a>
        </div>

        <div className="flex justify-center lg:justify-end w-full lg:w-1/3">
          <img src="/Images/AINongtoy/KTP.png" alt={t("partner.imageAlt")} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}