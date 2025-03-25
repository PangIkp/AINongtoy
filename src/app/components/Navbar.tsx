"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getUserData } from '../../utils/localStorageUtils';
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
      setIsLoggedIn(true); // ถ้ามี token แสดงว่าผู้ใช้ล็อกอินแล้ว
      setFirstName(parsedUser.firstName); // ตั้งค่า firstName
    }
  }, []);

  useEffect(() => {
    if (pendingRef && pathname === "/") {
      setTimeout(() => {
        scrollToSection(pendingRef);
        setPendingRef(null);
      }, 100); // ดีเลย์ให้ DOM โหลดเสร็จ
    }
  }, [pathname, pendingRef, scrollToSection]);

  const handleNavigation = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (pathname === "/") {
      scrollToSection(ref); // ถ้าอยู่หน้า Home -> Scroll ทันที
    } else {
      setPendingRef(ref); // เก็บค่าของ Ref ที่ต้องการ Scroll
      router.push("/", { scroll: false }); // กลับไปหน้า Home โดยไม่ Scroll เอง
    }
  };

  useTokenValidation();

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 lg:px-20 py-6 bg-[#010312] text-white drop-shadow-lg z-50">
      {/* Logo */}
      <a href="/">
        <p className="hidden">a</p>
        <img
          src="/Images/AINongtoy/Logo.png"
          alt="Logo"
          width={200}
          height={100}
          className="object-contain"
        />
      </a>

      {/* Menu ปกติ */}
      <ul className="hidden lg:flex space-x-[50px] text-[16px] font-semibold">
        <li>
          <Link
            href="/arttoy"
            className="font-bold bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
          >
            Create Art Toys
          </Link>
        </li>
        <li>
          <button
            onClick={() => handleNavigation(aboutRef)}
            className="bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
          >
            About Us
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation(partnerRef)}
            className="bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
          >
            Partners
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation(contactRef)}
            className="bg-transparent hover:bg-transparent hover:text-[#0AACF0] transition-colors duration-300"
          >
            Contact
          </button>
        </li>
      </ul>

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
              Create Art Toys
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
              About Us
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
              Partners
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
              Contact
            </button>
          </li>
          <li>
            {!isLoggedIn ? (
              <Link href="/login">
                <button className="bg-transparent hover:bg-transparent hover:text-[#0AACF0]">
                  Login
                </button>
              </Link>
            ) : (
              // ถ้าล็อกอินแล้วจะแสดงรูปภาพแทนปุ่ม Login
              <Link href="/profile" className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    handleNavigation(contactRef);
                    setMenuOpen(false);
                  }}
                  className="bg-transparent hover:bg-transparent hover:text-[#0AACF0]"
                >
                  My Profile
                </button>
              </Link>
            )}
          </li>
        </ul>
      )}

      {/* Login Button */}
      {!isLoggedIn ? (
        <Link href="/login" className="hidden lg:block">
          <button className="bg-[#0AACF0] hover:bg-[#0578AB] text-white font-extrabold px-6 py-1 rounded-[5px] text-[15px] transition-all">
            Login
          </button>
        </Link>
      ) : (
        // ถ้าล็อกอินแล้วจะแสดงรูปภาพแทนปุ่ม Login
        <Link
          href="/profile"
          className="items-center space-x-2 hidden lg:flex border border-[#51536D] rounded-[10px] p-1 px-2"
        >
          <img
            src="/Images/AINongtoy/User.png"
            alt="Profile"
            className="w-7 rounded-full"
          />
          <span className="text-[13px] font-medium">{firstName}</span>
        </Link>
      )}
    </nav>
  );
}
