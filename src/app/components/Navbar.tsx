"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next"; // เพิ่ม
import "../../i18n"; // เพิ่ม
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
  const { t, i18n } = useTranslation(); // ใช้ useTranslation
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingRef, setPendingRef] =
    useState<React.RefObject<HTMLDivElement | null> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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
      setTimeout(() => {
        scrollToSection(pendingRef);
        setPendingRef(null);
      }, 100);
    }
  }, [pathname, pendingRef, scrollToSection]);

  const handleNavigation = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (pathname === "/") {
      scrollToSection(ref);
    } else {
      setPendingRef(ref);
      router.push("/", { scroll: false });
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useTokenValidation();

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 lg:px-20 py-6 bg-[#010312] text-white drop-shadow-lg z-50">
      {/* Logo */}
      <Link href="/">
        <p className="hidden">a</p>
        <img
          src="/Images/AINongtoy/Logo.png"
          alt="Logo"
          width={200}
          height={100}
          className="object-contain"
        />
      </Link>

      {/* Menu */}
      <ul className="hidden lg:flex space-x-[50px] text-[16px] font-semibold">
        <li>
          <Link
            href="/arttoy"
            className="font-bold bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
          >
            {t("navbar.createArtToys")}
          </Link>
        </li>
        <li>
          <button
            onClick={() => handleNavigation(aboutRef)}
            className="bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
          >
            {t("navbar.aboutUs")}
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation(partnerRef)}
            className="bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
          >
            {t("navbar.partners")}
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation(contactRef)}
            className="bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
          >
            {t("navbar.contact")}
          </button>
        </li>
      </ul>

      <div className="flex items-center space-x-4">
        {/* Hamburger Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* เมนูสำหรับมือถือ */}
        {menuOpen && (
          <ul className="absolute top-[80px] left-0 w-full bg-[#010312] flex flex-col items-center space-y-6 py-6 lg:hidden">
            <li>
              <Link
                href="/arttoy"
                className="font-bold bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
              >
                {t("navbar.createArtToys")}
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleNavigation(aboutRef);
                  setMenuOpen(false);
                }}
                className="bg-transparent hover:bg-transparent hover:text-[#0AACF0]"
              >
                {t("navbar.aboutUs")}
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleNavigation(partnerRef);
                  setMenuOpen(false);
                }}
                className="bg-transparent hover:bg-transparent hover:text-[#0AACF0]"
              >
                {t("navbar.partners")}
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleNavigation(contactRef);
                  setMenuOpen(false);
                }}
                className="bg-transparent hover:bg-transparent hover:text-[#0AACF0]"
              >
                {t("navbar.contact")}
              </button>
            </li>
            <li>
              {!isLoggedIn ? (
                <Link href="/login">
                  <button className="bg-transparent hover:bg-transparent hover:text-[#0AACF0]">
                    {t("navbar.login")}
                  </button>
                </Link>
              ) : (
                <Link href="/profile" className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      handleNavigation(contactRef);
                      setMenuOpen(false);
                    }}
                    className="bg-transparent hover:bg-transparent hover:text-[#0AACF0]"
                  >
                    {t("navbar.myProfile")}
                  </button>
                </Link>
              )}
            </li>
          </ul>
        )}

        {/* Login Button */}
        {!isLoggedIn ? (
          <Link href="/login" className="hidden lg:block">
            <button className="bg-[#0AACF0] hover:bg-[#0578AB] text-white font-extrabold px-6 py-1 rounded-[5px] text-[15px] transition-all flex items-center justify-center h-[40px]">
              {t("navbar.login")}
            </button>
          </Link>
        ) : (
          <Link
            href="/profile"
            className="items-center space-x-2 hidden lg:flex border border-[#51536D] rounded-[10px] p-1 px-2 h-[40px]"
          >
            <img
              src="/Images/AINongtoy/User.png"
              alt="Profile"
              className="w-7 h-7 rounded-full"
            />
            <span className="text-[13px] font-medium">{firstName}</span>
          </Link>
        )}
        {/* Language Switcher */}
        <div className="flex space-x-2">
          <button
            onClick={() => changeLanguage("en")}
            className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-700 transition"
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("th")}
            className="px-2 py-1 bg-green-500 rounded hover:bg-green-700 transition"
          >
            TH
          </button>
        </div>
      </div>
    </nav>
  );
}