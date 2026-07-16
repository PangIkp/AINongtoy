"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Service() {
  const { t } = useTranslation();

  return (
    <div className="h-auto sm:px-28 px-4 py-20">
      <p className="text-[#0AACF0] font-semibold mb-4">{t("services.title")}</p>
      <div className="flex flex-col mt-6 gap-10">
        <div className="w-full space-y-2">
          <p className="text-[30px] sm:text-[40px] md:text-[45px] font-semibold">
            {t("services.weOffer")}
          </p>

          <p>{t("services.description")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 transform lg:scale-100 lg:grid-cols-2 xl:grid-cols-4">
        <div className="text-[14px] space-y-2 border border-[#0CACF3] rounded-[10px] p-10">
          <img
            src="/Images/AINongtoy/Design.png"
            alt={t("services.aiDesignAlt")}
            className="w-10"
          />
          <p className="font-semibold">{t("services.aiDesignTitle")}</p>
          <p>{t("services.aiDesignDescription")}</p>
        </div>

        <div className="text-[14px] space-y-2 border border-[#0CACF3] rounded-[10px] p-10">
          <img
            src="/Images/AINongtoy/3D.png"
            alt={t("services.modelPreviewAlt")}
            className="w-10"
          />
          <p className="font-semibold">{t("services.modelPreviewTitle")}</p>
          <p>{t("services.modelPreviewDescription")}</p>
        </div>

        <div className="text-[14px] space-y-2 border border-[#0CACF3] rounded-[10px] p-10">
          <img
            src="/Images/AINongtoy/Calculate.png"
            alt={t("services.realTimeCalcAlt")}
            className="w-10"
          />
          <p className="font-semibold">{t("services.realTimeCalcTitle")}</p>
          <p>{t("services.realTimeCalcDescription")}</p>
        </div>

        <div className="text-[14px] space-y-2 border border-[#0CACF3] rounded-[10px] p-10">
          <img
            src="/Images/AINongtoy/Download.png"
            alt={t("services.downloadAlt")}
            className="w-10"
          />
          <p className="font-semibold">{t("services.downloadTitle")}</p>
          <p>{t("services.downloadDescription")}</p>
        </div>
      </div>
    </div>
  );
}
