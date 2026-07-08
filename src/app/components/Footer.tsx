"use client";

import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-[#040814] px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <img
            src="/Images/AINongtoy/Logo.png"
            alt="NongToy logo"
            className="h-12 w-auto"
          />
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#b6c2da]">
            {t("footer.aboutDescription")}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#5ad7ff]">
              Contact
            </p>
            <div className="mt-4 space-y-3 text-sm text-[#dbe7ff]">
              <p>{t("footer.address")}</p>
              <a href="tel:090-846-6758" className="block transition hover:text-[#8be4ff]">
                {t("footer.phone")}
              </a>
              <a
                href="mailto:NongToy@gmail.com"
                className="block transition hover:text-[#8be4ff]"
              >
                {t("footer.email")}
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#5ad7ff]">
              Social
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { href: "#", src: "/Images/AINongtoy/Facebook.png", alt: "Facebook" },
                { href: "#", src: "/Images/AINongtoy/Instagram.png", alt: "Instagram" },
                { href: "#", src: "/Images/AINongtoy/Twitter.png", alt: "Twitter" },
              ].map((item) => (
                <a
                  key={item.alt}
                  href={item.href}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:border-[#5ad7ff]/40 hover:bg-white/10"
                >
                  <img src={item.src} alt={item.alt} className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
