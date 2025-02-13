"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 lg:px-20 py-6 bg-[#010312] text-white drop-shadow-lg z-50">
      {/* Logo */}
      <Image
        src="/Images/AINongtoy/Logo.png"
        alt="Logo"
        width={200} // หรือเปลี่ยนเป็น fill ถ้าต้องการปรับอัตโนมัติ
        height={100}
        className="object-contain"
      />

      {/* Menu ปกติ */}
      <ul className={`hidden lg:flex space-x-[80px] text-[16px] font-semibold`}>
        {["Create Art Toys", "About Us", "Partners", "Contact"].map((item) => (
          <li key={item}>
            <Link href={`/${item.toLowerCase().replace(/\s/g, "-")}`}>
              <span className="transition-colors duration-300 hover:text-[#0AACF0]">
                {item}
              </span>
            </Link>
          </li>
        ))}
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
          {["Create Art Toys", "About Us", "Partners", "Contact", "Login"].map(
            (item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-white text-[18px] hover:text-[#0AACF0]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>
      )}

      {/* Login Button */}
      <Link href="/login" className="hidden lg:block">
        <button className="bg-[#0AACF0] hover:bg-[#0578AB] text-white font-extrabold px-6 py-1 rounded-[5px] text-[15px] transition-all">
          Login
        </button>
      </Link>
    </nav>
  );
}