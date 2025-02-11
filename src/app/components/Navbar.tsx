"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // ตรวจสอบขนาดหน้าจอเมื่อโหลดหน้าเว็บ
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };

        handleResize(); // ตรวจสอบตอนโหลดครั้งแรก
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 md:px-20 py-6 bg-[#010312] text-white drop-shadow-lg z-50">
            {/* Logo */}
            <div className="text-2xl font-bold">
                <Link href="/">
                    <span className="flex items-center space-x-2">
                        <Image
                            src="/Images/AINongtoy/Logo.png"
                            alt="Logo"
                            width={200}
                            height={100}
                            priority
                        />
                    </span>
                </Link>
            </div>

            {/* Menu ปกติ */}
            <ul className={`hidden md:flex space-x-[80px] text-[16px] font-semibold`}>
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
            {isMobile && (
                <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            )}

            {/* เมนูสำหรับมือถือ */}
            {menuOpen && (
                <ul className="absolute top-[80px] left-0 w-full bg-[#010312] flex flex-col items-center space-y-6 py-6 md:hidden">
                    {["Create Art Toys", "About Us", "Partners", "Contact"].map((item) => (
                        <li key={item}>
                            <Link
                                href={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                                className="text-white text-[18px] hover:text-[#0AACF0]"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {/* Login Button */}
            <Link href="/login" className="hidden md:block">
                <button className="bg-[#0AACF0] hover:bg-[#0578AB] text-white font-extrabold px-6 py-1 rounded-[5px] text-[15px] transition-all">
                    Login
                </button>
            </Link>
        </nav>
    );
}
