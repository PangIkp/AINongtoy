"use client";

import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import "../../i18n";

export default function Copyright() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const hiddenPaths = [
    "/dashboard",
    "/user-management",
    "/order-management",
    "/keyword-management",
  ];

  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <div className="border-t border-white/10 bg-[#040814] px-4 py-5 text-sm text-[#8fa3c2] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">{t("footer.copyright")}</div>
    </div>
  );
}
