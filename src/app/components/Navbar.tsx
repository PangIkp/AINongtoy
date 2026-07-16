"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { getUserData } from "../../utils/localStorageUtils";
import { useTokenValidation } from "../../utils/useTokenValidation";

interface NavbarProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  partnerRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
}

export default function Navbar({
  scrollToSection,
  aboutRef,
  partnerRef,
  contactRef,
}: NavbarProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingRef, setPendingRef] =
    useState<React.RefObject<HTMLDivElement | null> | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const parsedUser = getUserData();

    if (storedToken && parsedUser) {
      setIsLoggedIn(true);
      setFirstName(parsedUser.firstName);
    }
  }, []);

  useEffect(() => {
    if (pendingRef && pathname === "/") {
      const timeout = window.setTimeout(() => {
        scrollToSection(pendingRef);
        setPendingRef(null);
      }, 100);

      return () => window.clearTimeout(timeout);
    }
  }, [pathname, pendingRef, scrollToSection]);

  const handleNavigation = (ref: React.RefObject<HTMLDivElement | null>) => {
    setMenuOpen(false);

    if (pathname === "/") {
      scrollToSection(ref);
      return;
    }

    setPendingRef(ref);
    router.push("/", { scroll: false });
  };

  useTokenValidation();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/12 bg-[#07101f]/78 px-4 py-3 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-6">
        <Link href="/" className="flex items-center">
          <img
            src="/Images/AINongtoy/Logo.png"
            alt="NongToy logo"
            className="h-7 w-auto sm:h-8"
          />
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-[#d8e6ff] lg:flex">
          <li>
            <Link href="/arttoy" className="transition hover:text-[#78dbff]">
              {t("navbar.createArtToys")}
            </Link>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(aboutRef)}
              className="bg-transparent p-0 transition hover:bg-transparent hover:text-[#78dbff]"
            >
              {t("navbar.aboutUs")}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(partnerRef)}
              className="bg-transparent p-0 transition hover:bg-transparent hover:text-[#78dbff]"
            >
              {t("navbar.partners")}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(contactRef)}
              className="bg-transparent p-0 transition hover:bg-transparent hover:text-[#78dbff]"
            >
              {t("navbar.contact")}
            </button>
          </li>
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <select
              id="language-select"
              aria-label="Select language"
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="m-0 h-10 min-w-[92px] appearance-none rounded-full border border-white/12 bg-white/5 pl-4 pr-10 text-sm text-white outline-none"
              defaultValue={i18n.language}
            >
              <option className="bg-[#07101f]" value="en">
                EN
              </option>
              <option className="bg-[#07101f]" value="th">
                TH
              </option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
            />
          </div>

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-full bg-[#5ad7ff] px-5 text-sm font-semibold text-[#05111f] transition hover:bg-[#82e2ff]"
            >
              {t("navbar.login")}
            </Link>
          ) : (
            <Link
              href="/profile"
              className="inline-flex h-10 max-w-[190px] items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 text-sm text-white"
            >
              <img
                src="/Images/AINongtoy/User.png"
                alt="Profile"
                className="h-7 w-7 rounded-full"
              />
              <span className="min-w-0 truncate">{firstName}</span>
            </Link>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-3 max-w-7xl rounded-[28px] border border-white/12 bg-[#07101f]/92 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/arttoy" className="rounded-2xl px-3 py-3 transition hover:bg-white/8">
              {t("navbar.createArtToys")}
            </Link>
            <button
              onClick={() => handleNavigation(aboutRef)}
              className="rounded-2xl bg-transparent px-3 py-3 text-left transition hover:bg-white/8"
            >
              {t("navbar.aboutUs")}
            </button>
            <button
              onClick={() => handleNavigation(partnerRef)}
              className="rounded-2xl bg-transparent px-3 py-3 text-left transition hover:bg-white/8"
            >
              {t("navbar.partners")}
            </button>
            <button
              onClick={() => handleNavigation(contactRef)}
              className="rounded-2xl bg-transparent px-3 py-3 text-left transition hover:bg-white/8"
            >
              {t("navbar.contact")}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="relative">
              <select
                aria-label="Select language"
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="m-0 h-10 min-w-[92px] appearance-none rounded-full border border-white/12 bg-white/5 pl-4 pr-10 text-sm text-white outline-none"
                defaultValue={i18n.language}
              >
                <option className="bg-[#07101f]" value="en">
                  EN
                </option>
                <option className="bg-[#07101f]" value="th">
                  TH
                </option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
              />
            </div>

            {!isLoggedIn ? (
              <Link
                href="/login"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#5ad7ff] px-5 text-sm font-semibold text-[#05111f]"
              >
                {t("navbar.login")}
              </Link>
            ) : (
              <Link
                href="/profile"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 text-sm"
              >
                {t("navbar.myProfile")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
