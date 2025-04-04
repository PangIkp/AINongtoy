"use client";
import { useState } from "react";
import Link from "next/link";
import { Users, Inbox, ChartBarBig, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation"; // ใช้ usePathname แทน useRouter

export default function Sidebar({
  setIsCollapsed,
  isCollapsed,
}: {
  setIsCollapsed: any;
  isCollapsed: any;
}) {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`fixed top-0 z-50 left-0 h-full bg-[#2F2F2F] text-white p-4 pt-6 flex flex-col items-center transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-[140px]"
        }`}
    >
      <img
        src="/Images/AINongtoy/BotLogo.png"
        alt="AI Design"
        className="w-10 mb-6"
      />

      {/* Toggle button to collapse or expand sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 left-full transform -translate-x-1/2 -translate-y-1/2 bg-[#2F2F2F] p-2 rounded-full text-white hover:bg-[#2F2F2F]"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <nav className="space-y-4 mt-8 text-[14px]">
        <SidebarItem
          icon={<Users size={20} />}
          label="Users"
          to="/user-management"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Inbox size={20} />}
          label="Orders"
          to="/order-management"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<ChartBarBig size={20} />}
          label="Dashboard"
          to="/dashboard"
          isCollapsed={isCollapsed}
        />
      </nav>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  to,
  isCollapsed,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed: boolean;
}) {
  const pathname = usePathname(); // ดึง path ปัจจุบัน
  const isActive = pathname.startsWith(to); // ใช้ startsWith เพื่อรองรับ path ที่มี / ต่อท้าย

  return (
    <Link href={to}>
      <div
        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-[#525152] ${isActive ? "bg-[#525152]" : ""
          }`} // เพิ่ม class สำหรับ active item
      >
        {icon}
        {!isCollapsed && <span>{label}</span>} {/* ซ่อน label เมื่อ collapsed */}
      </div>
    </Link>
  );
}